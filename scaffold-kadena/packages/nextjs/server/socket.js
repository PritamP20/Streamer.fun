/* Socket.IO server for chat rooms and WebRTC streaming
   Run with: `yarn workspace @se-2/nextjs socket` or from root `yarn start:all` */

const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 4001;
const ORIGIN = process.env.SOCKET_CORS_ORIGIN || "*"; // set to your site in prod

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Socket.IO chat & streaming server is running\n");
});

const io = new Server(server, {
  cors: {
    origin: ORIGIN,
    methods: ["GET", "POST"],
  },
});

// Store stream and user data
const activeStreams = new Map(); // roomId -> { streamerId, streamerAddress, isLive, title }
const roomViewers = new Map(); // roomId -> Set of socketIds
const socketToRoom = new Map(); // socketId -> roomId
const socketToUser = new Map(); // socketId -> { author, address }

io.on("connection", socket => {
  let currentRoom = null;
  let isStreamer = false;

  // Original chat join functionality
  socket.on("join", ({ roomId, author, userAddress }) => {
    if (currentRoom) {
      socket.leave(currentRoom);
      // Remove from previous room's viewers
      if (roomViewers.has(currentRoom)) {
        roomViewers.get(currentRoom).delete(socket.id);
        io.to(currentRoom).emit("viewer-count", roomViewers.get(currentRoom).size);
      }
    }

    currentRoom = String(roomId || "lobby");
    socket.join(currentRoom);
    
    // Store user info
    socketToRoom.set(socket.id, currentRoom);
    socketToUser.set(socket.id, { author: author || "anonymous", address: userAddress });

    // Initialize viewers set if it doesn't exist
    if (!roomViewers.has(currentRoom)) {
      roomViewers.set(currentRoom, new Set());
    }
    roomViewers.get(currentRoom).add(socket.id);

    // Send stream info if stream exists
    const streamInfo = activeStreams.get(currentRoom);
    if (streamInfo) {
      socket.emit("stream-info", streamInfo);
      // Check if this user is the streamer
      if (userAddress && streamInfo.streamerAddress === userAddress) {
        isStreamer = true;
      }
      // Notify streamer that a viewer joined (if the joiner is not the streamer)
      if (streamInfo.isLive && socket.id !== streamInfo.streamerId) {
        io.to(streamInfo.streamerId).emit("viewer-joined", { viewerId: socket.id });
      }
    }

    // Send viewer count to all in room
    io.to(currentRoom).emit("viewer-count", roomViewers.get(currentRoom).size);

    // Original join message
    io.to(currentRoom).emit("message", {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      author: "system",
      text: `${author || "someone"} joined the room ${currentRoom}`,
      at: Date.now(),
    });
  });

  // Original chat message functionality
  socket.on("message", payload => {
    const room = String(payload?.roomId || currentRoom || "lobby");
    const msg = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      author: payload?.author || "anonymous",
      text: String(payload?.text || ""),
      at: payload?.at || Date.now(),
    };
    io.to(room).emit("message", msg);
  });

  // WebRTC streaming functionality
  socket.on("start-stream", ({ roomId, title }) => {
    const room = String(roomId || currentRoom);
    const userInfo = socketToUser.get(socket.id);
    
    if (!userInfo) return;

    console.log(`Starting stream in room ${room} by ${userInfo.author}`);

    // Store stream info
    activeStreams.set(room, {
      streamerId: socket.id,
      streamerAddress: userInfo.address,
      streamerName: userInfo.author,
      isLive: true,
      title: title || `Stream by ${userInfo.author}`,
      startedAt: Date.now()
    });

    isStreamer = true;

    // Notify all viewers in the room
    socket.to(room).emit("stream-started", {
      streamerName: userInfo.author,
      title: title || `Stream by ${userInfo.author}`
    });

    // Send stream info to all in room
    io.to(room).emit("stream-info", activeStreams.get(room));

    // Tell the streamer about any currently connected viewers so offers can be sent
    const viewers = roomViewers.get(room);
    if (viewers) {
      viewers.forEach(vId => {
        if (vId !== socket.id) {
          io.to(socket.id).emit("viewer-joined", { viewerId: vId });
        }
      });
    }

    // Send system message
    io.to(room).emit("message", {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      author: "system",
      text: `🔴 ${userInfo.author} started streaming!`,
      at: Date.now(),
    });
  });

  socket.on("stop-stream", ({ roomId }) => {
    const room = String(roomId || currentRoom);
    const streamInfo = activeStreams.get(room);
    
    if (streamInfo && streamInfo.streamerId === socket.id) {
      streamInfo.isLive = false;
      isStreamer = false;

      // Notify all viewers
      socket.to(room).emit("stream-stopped");
      io.to(room).emit("stream-info", streamInfo);

      // Send system message
      const userInfo = socketToUser.get(socket.id);
      io.to(room).emit("message", {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        author: "system",
        text: `📺 ${userInfo?.author || 'Streamer'} stopped streaming`,
        at: Date.now(),
      });

      console.log(`Stream stopped in room ${room}`);
    }
  });

  // Start a YouTube-based stream
  socket.on("start-youtube", ({ roomId, youtubeId, title }) => {
    const room = String(roomId || currentRoom);
    const userInfo = socketToUser.get(socket.id);
    if (!userInfo || !youtubeId) return;

    activeStreams.set(room, {
      streamerId: socket.id,
      streamerAddress: userInfo.address,
      streamerName: userInfo.author,
      isLive: true,
      type: 'youtube',
      youtubeId,
      title: title || `YouTube by ${userInfo.author}`,
      startedAt: Date.now(),
    });

    isStreamer = true;

    io.to(room).emit("stream-started", {
      streamerName: userInfo.author,
      title: title || `YouTube by ${userInfo.author}`,
      type: 'youtube',
      youtubeId,
    });
    io.to(room).emit("stream-info", activeStreams.get(room));

    io.to(room).emit("message", {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      author: "system",
      text: `🔴 ${userInfo.author} started a YouTube stream`,
      at: Date.now(),
    });
  });

  // WebRTC signaling - Offer (streamer to viewers)
  socket.on("webrtc-offer", ({ roomId, offer, target }) => {
    const room = String(roomId || currentRoom);
    console.log(`WebRTC offer in room ${room}`);
    
    if (target) {
      // Send to specific viewer
      socket.to(target).emit("webrtc-offer", { offer, from: socket.id });
    } else {
      // Broadcast to all other users in room
      socket.to(room).emit("webrtc-offer", { offer, from: socket.id });
    }
  });

  // WebRTC signaling - Answer (viewer to streamer)
  socket.on("webrtc-answer", ({ roomId, answer, target }) => {
    const room = String(roomId || currentRoom);
    console.log(`WebRTC answer in room ${room}`);
    
    if (target) {
      socket.to(target).emit("webrtc-answer", { answer, from: socket.id });
    }
  });

  // WebRTC signaling - ICE Candidate
  socket.on("webrtc-ice-candidate", ({ roomId, candidate, target }) => {
    const room = String(roomId || currentRoom);
    
    if (target) {
      socket.to(target).emit("webrtc-ice-candidate", { candidate, from: socket.id });
    } else {
      socket.to(room).emit("webrtc-ice-candidate", { candidate, from: socket.id });
    }
  });

  // Relay market events (polymarket bot)
  socket.on("market-created", ({ roomId, marketId, question }) => {
    const room = String(roomId || currentRoom || "lobby");
    io.to(room).emit("market-created", { marketId, question });
    io.to(room).emit("message", {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      author: "polymarket-bot",
      text: `New market started: ${question}`,
      at: Date.now(),
    });
  });
  socket.on("market-resolved", ({ roomId, marketId, outcome }) => {
    const room = String(roomId || currentRoom || "lobby");
    io.to(room).emit("market-resolved", { marketId, outcome });
    io.to(room).emit("message", {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      author: "polymarket-bot",
      text: `Market #${marketId} resolved: ${outcome ? 'YES' : 'NO'}`,
      at: Date.now(),
    });
  });

  // Query multiple stream statuses without joining rooms
  socket.on("get-stream-status", (payload, cb) => {
    try {
      const roomIds = Array.isArray(payload?.roomIds) ? payload.roomIds : [];
      const result = roomIds.map(rid => {
        const key = String(rid);
        const info = activeStreams.get(key);
        const viewers = roomViewers.get(key);
        return {
          roomId: key,
          isLive: !!(info && info.isLive),
          viewerCount: viewers ? viewers.size : 0,
          title: info ? info.title : null,
          startedAt: info ? info.startedAt : null,
        };
      });
      if (typeof cb === "function") cb({ ok: true, data: result });
    } catch (e) {
      if (typeof cb === "function") cb({ ok: false, error: String(e?.message || e) });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    
    const room = socketToRoom.get(socket.id);
    const userInfo = socketToUser.get(socket.id);

    if (room) {
      // Remove from viewers
      if (roomViewers.has(room)) {
        roomViewers.get(room).delete(socket.id);
        io.to(room).emit("viewer-count", roomViewers.get(room).size);
      }

      // If this was the streamer, end the stream
      const streamInfo = activeStreams.get(room);
      if (streamInfo && streamInfo.streamerId === socket.id) {
        console.log(`Streamer disconnected, ending stream in room ${room}`);
        streamInfo.isLive = false;
        io.to(room).emit("stream-stopped");
        io.to(room).emit("stream-info", streamInfo);
        
        // Send system message
        io.to(room).emit("message", {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          author: "system",
          text: `📺 ${userInfo?.author || 'Streamer'} left the stream`,
          at: Date.now(),
        });
      }

      // If this was a viewer and the room has an active stream, notify the streamer
      if (streamInfo && socket.id !== streamInfo.streamerId) {
        io.to(streamInfo.streamerId).emit("viewer-left", { viewerId: socket.id });
      }

      // Send leave message if user was identified
      if (userInfo) {
        io.to(room).emit("message", {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          author: "system", 
          text: `${userInfo.author} left the room`,
          at: Date.now(),
        });
      }
    }

    // Clean up mappings
    socketToRoom.delete(socket.id);
    socketToUser.delete(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`📡 Socket.IO chat & streaming server listening on :${PORT} (CORS origin: ${ORIGIN})`);
});

// Clean up inactive streams every 5 minutes
setInterval(() => {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  
  activeStreams.forEach((streamInfo, roomId) => {
    if (!streamInfo.isLive && streamInfo.startedAt < fiveMinutesAgo) {
      console.log(`Cleaning up inactive stream in room ${roomId}`);
      activeStreams.delete(roomId);
    }
  });
}, 5 * 60 * 1000);