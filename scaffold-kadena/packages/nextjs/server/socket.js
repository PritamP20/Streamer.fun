/* Simple Socket.IO server for chat rooms keyed by roomId.
   Run with: `yarn workspace @se-2/nextjs socket` or from root `yarn start:all` */

const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 4001;
const ORIGIN = process.env.SOCKET_CORS_ORIGIN || "*"; // set to your site in prod

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Socket.IO chat server is running\n");
});

const io = new Server(server, {
  cors: {
    origin: ORIGIN,
    methods: ["GET", "POST"],
  },
});

io.on("connection", socket => {
  let currentRoom = null;

  socket.on("join", ({ roomId, author }) => {
    if (currentRoom) socket.leave(currentRoom);
    currentRoom = String(roomId || "lobby");
    socket.join(currentRoom);

    io.to(currentRoom).emit("message", {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      author: "system",
      text: `${author || "someone"} joined the room ${currentRoom}`,
      at: Date.now(),
    });
  });

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

  socket.on("disconnect", () => {
    // noop — could broadcast a leave message if desired
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`📡 Socket.IO server listening on :${PORT} (CORS origin: ${ORIGIN})`);
});
