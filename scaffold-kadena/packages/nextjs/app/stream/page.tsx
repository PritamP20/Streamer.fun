"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { io, Socket } from "socket.io-client";
import { useSearchParams } from "next/navigation";

export default function GoLivePage() {
  const { address } = useAccount();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [usingWebcam, setUsingWebcam] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const [selectedTokenId, setSelectedTokenId] = useState<string>("");

  // mode: webcam | youtube | stream (NEW)
  const [streamMode, setStreamMode] = useState<"webcam" | "youtube" | "stream">("webcam");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // NEW: WebRTC streaming state
  const [isStreaming, setIsStreaming] = useState(false); // streamer broadcasting (webrtc)
  const [isLive, setIsLive] = useState(false); // stream live status for viewers
  const [liveType, setLiveType] = useState<"webrtc" | "youtube" | null>(null);
  const [liveYoutubeId, setLiveYoutubeId] = useState<string | null>(null);
  const [viewerCount, setViewerCount] = useState(0);
  const streamSocketRef = useRef<Socket | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const pendingIceRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());

  const { data: streamNFT } = useScaffoldContract({ contractName: "StreamNFT" });
  const { data: marketplace } = useScaffoldContract({ contractName: "Marketplace" });

  // Interaction overlay (existing)
  const [interactBanner, setInteractBanner] = useState<string | null>(null);
  const overlaySocketRef = useRef<Socket | null>(null);

  // NEW: WebRTC configuration (with optional TURN via env)
  const rtcConfig = (() => {
    const servers: RTCIceServer[] = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ];
    const turnUrl = process.env.NEXT_PUBLIC_TURN_URL;
    const turnUser = process.env.NEXT_PUBLIC_TURN_USERNAME;
    const turnPass = process.env.NEXT_PUBLIC_TURN_PASSWORD;
    if (turnUrl && turnUrl.length > 0) {
      servers.push({ urls: turnUrl, username: turnUser, credential: turnPass });
    }
    return { iceServers: servers } as RTCConfiguration;
  })();

  // Pick tokenId from query string, and default to stream mode (for viewers)
  const searchParams = useSearchParams();
  useEffect(() => {
    const qid = searchParams?.get("tokenId");
    if (qid) {
      setSelectedTokenId(qid);
      setStreamMode("stream");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Existing overlay socket (unchanged)
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4001";
    const s = io(url, { transports: ["websocket", "polling"] });
    overlaySocketRef.current = s;
    s.on("connect", () => {
      s.emit("join", { roomId: selectedTokenId || "lobby", author: address || "streamer" });
    });
    s.on("interact", (payload: any) => {
      const who = payload?.author || payload?.address || "viewer";
      setInteractBanner(String(who));
      setTimeout(() => setInteractBanner(null), 6000);
    });
    return () => {
      s.disconnect();
      overlaySocketRef.current = null;
    };
  }, [selectedTokenId, address]);

  // NEW: Streaming socket (both streamer and viewer, any mode)
  useEffect(() => {
    if (!selectedTokenId) return;

    const url = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4001";
    streamSocketRef.current = io(url, { transports: ["websocket", "polling"] });
    const socket = streamSocketRef.current;

    socket.on("connect", () => {
      console.log("Connected to streaming server");
      socket.emit("join", { 
        roomId: selectedTokenId, 
        author: address?.slice(0, 8) || "user",
        userAddress: address 
      });
    });

    // Live status updates
    socket.on("stream-info", (info: any) => {
      setIsLive(!!info?.isLive);
      setLiveType(info?.type || (info?.isLive ? "webrtc" : null));
      setLiveYoutubeId(info?.youtubeId || null);
      // For viewers, switch to youtube mode automatically if stream is youtube
      if (info?.type === "youtube" && !isCreator) {
        setStreamMode("youtube");
      }
    });
    socket.on("stream-started", (payload: any) => {
      setIsLive(true);
      if (payload?.type === "youtube") {
        setLiveType("youtube");
        setLiveYoutubeId(payload?.youtubeId || null);
        if (!isCreator) setStreamMode("youtube");
      } else {
        setLiveType("webrtc");
      }
    });
    socket.on("stream-stopped", () => {
      setIsLive(false);
      setLiveType(null);
      setLiveYoutubeId(null);
    });

    socket.on("viewer-count", (count: number) => {
      setViewerCount(count);
    });

    // WebRTC signaling
    // For streamer: accept answers from viewers
    socket.on("webrtc-answer", async (data: { answer: RTCSessionDescriptionInit; from: string }) => {
      const pc = peerConnectionsRef.current.get(data.from);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        // Drain any pending ICE candidates for this peer now that remoteDescription is set
        const pend = pendingIceRef.current.get(data.from);
        if (pend && pend.length) {
          for (const c of pend) {
            try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch {}
          }
          pendingIceRef.current.delete(data.from);
        }
      }
    });

    // For both: ICE candidates
    socket.on("webrtc-ice-candidate", async (data: { candidate: RTCIceCandidateInit; from: string }) => {
      const pc = peerConnectionsRef.current.get(data.from);
      if (pc) {
        if (pc.remoteDescription) {
          try { await pc.addIceCandidate(new RTCIceCandidate(data.candidate)); } catch {}
        } else {
          const arr = pendingIceRef.current.get(data.from) || [];
          arr.push(data.candidate);
          pendingIceRef.current.set(data.from, arr);
        }
      } else {
        // No PC yet — buffer by from id
        const arr = pendingIceRef.current.get(data.from) || [];
        arr.push(data.candidate);
        pendingIceRef.current.set(data.from, arr);
      }
    });

    // Streamer: create offer for new viewer
    socket.on('viewer-joined', async ({ viewerId }: { viewerId: string }) => {
      try {
        if (!isStreaming) return; // only streamer should act
        await offerToViewer(viewerId);
      } catch (e) {
        console.error('offerToViewer failed', e);
      }
    });

    // Streamer: clean up when viewer leaves
    socket.on('viewer-left', ({ viewerId }: { viewerId: string }) => {
      const pc = peerConnectionsRef.current.get(viewerId);
      if (pc) {
        try { pc.close(); } catch {}
      }
      peerConnectionsRef.current.delete(viewerId);
    });

    // For viewer: receive offer from streamer, create answer and attach remote stream
    socket.on("webrtc-offer", async (data: { offer: RTCSessionDescriptionInit; from: string }) => {
      try {
        // If we're the streamer, ignore incoming offers
        if (isStreaming) return;

        const fromId = data.from;
        const pc = new RTCPeerConnection(rtcConfig);
        peerConnectionsRef.current.set(fromId, pc);

        // Collect remote tracks
        const remoteStream = new MediaStream();
        remoteStreamRef.current = remoteStream;

        pc.ontrack = (event: RTCTrackEvent) => {
          event.streams[0]?.getTracks().forEach(t => remoteStream.addTrack(t));
          if (videoRef.current) {
            videoRef.current.srcObject = remoteStream as any;
            // Keep muted for autoplay; user can unmute via controls
            videoRef.current.muted = true;
            videoRef.current.autoplay = true;
            videoRef.current.controls = true;
            videoRef.current.play().catch(() => {});
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate && streamSocketRef.current) {
            streamSocketRef.current.emit('webrtc-ice-candidate', {
              roomId: selectedTokenId,
              candidate: event.candidate,
              target: fromId
            });
          }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));

        // Drain buffered ICE candidates (from streamer) now that remoteDescription is set
        const pend = pendingIceRef.current.get(fromId);
        if (pend && pend.length) {
          for (const c of pend) {
            try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch {}
          }
          pendingIceRef.current.delete(fromId);
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        // Send answer back to streamer
        socket.emit('webrtc-answer', {
          roomId: selectedTokenId,
          answer,
          target: fromId,
        });

        setIsLive(true);
      } catch (err) {
        console.error('Error handling offer as viewer:', err);
      }
    });

    return () => {
      try {
        peerConnectionsRef.current.forEach(pc => pc.close());
        peerConnectionsRef.current.clear();
        if (remoteStreamRef.current) {
          remoteStreamRef.current.getTracks().forEach(t => t.stop());
          remoteStreamRef.current = null;
        }
      } finally {
        socket.disconnect();
        streamSocketRef.current = null;
      }
    };
  }, [streamMode, selectedTokenId, address, isStreaming]);

  // Active tokens by this creator (existing)
  const { data: activeInfos } = useReadContract({
    address: streamNFT?.address,
    abi: streamNFT?.abi,
    functionName: "getActiveNFTsWithInfo",
  });

  const myActiveTokens = useMemo(() => {
    if (!activeInfos || !address) return [] as any[];
    return (activeInfos as any[]).filter(i => i.creator?.toLowerCase?.() === address.toLowerCase());
  }, [activeInfos, address]);

  // Mint inline if needed (existing)
  const { writeContract: writeMint, data: mintHash, isPending: isMinting } = useWriteContract();
  const { isLoading: isMintConfirming } = useWaitForTransactionReceipt({ hash: mintHash });

  // Fetch NFTs created by this address (existing)
  const { data: creatorTokenIds } = useReadContract({
    address: streamNFT?.address,
    abi: streamNFT?.abi,
    functionName: "getNFTsByCreator",
    args: address ? [address] : undefined,
  });

  const tokenIds = useMemo(() => (creatorTokenIds as bigint[] | undefined) || [], [creatorTokenIds]);

  // Fetch info of selected token (existing)
  const { data: selectedInfo } = useReadContract({
    address: streamNFT?.address,
    abi: streamNFT?.abi,
    functionName: "getNFTInfo",
    args: selectedTokenId ? [BigInt(selectedTokenId)] : undefined,
  });

  const isCreator = useMemo(() => {
    try {
      const creator = (selectedInfo as any)?.creator as string | undefined;
      if (!creator || !address) return false;
      return creator.toLowerCase() === address.toLowerCase();
    } catch {
      return false;
    }
  }, [selectedInfo, address]);

  // Cleanup webcam on unmount (existing)
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [mediaStream]);

  // NEW: Create peer connection for a viewer (streamer side)
  const createPeerConnectionForViewer = (viewerId: string) => {
    const pc = new RTCPeerConnection(rtcConfig);

    pc.onicecandidate = (event) => {
      if (event.candidate && streamSocketRef.current) {
        streamSocketRef.current.emit('webrtc-ice-candidate', {
          roomId: selectedTokenId,
          candidate: event.candidate,
          target: viewerId,
        });
      }
    };

    peerConnectionsRef.current.set(viewerId, pc);
    return pc;
  };

  const offerToViewer = async (viewerId: string) => {
    if (!mediaStream || !streamSocketRef.current) return;
    let pc = peerConnectionsRef.current.get(viewerId);
    if (!pc) pc = createPeerConnectionForViewer(viewerId);

    // Add local tracks (avoid duplicates by checking senders)
    const tracks = mediaStream.getTracks();
    const existing = pc.getSenders().map(s => s.track).filter(Boolean) as MediaStreamTrack[];
    tracks.forEach(track => {
      if (!existing.includes(track)) pc!.addTrack(track, mediaStream);
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Send targeted offer to viewer
    streamSocketRef.current.emit('webrtc-offer', {
      roomId: selectedTokenId,
      offer,
      target: viewerId,
    });
  };

  // NEW: Start WebRTC streaming
  const startWebRTCStream = async () => {
    try {
      if (!selectedTokenId) {
        notification.error("Select or create a StreamNFT before going live");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: true
      });

      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream as any;
        await videoRef.current.play();
      }

      // Notify server that stream started
      streamSocketRef.current?.emit('start-stream', { 
        roomId: selectedTokenId,
        title: `Stream #${selectedTokenId}`
      });

      setIsStreaming(true);
      setUsingWebcam(true);
      notification.success("Live stream started!");

    } catch (error) {
      console.error('Error starting WebRTC stream:', error);
      notification.error("Failed to start stream");
    }
  };

  // NEW: Stop WebRTC streaming
  const stopWebRTCStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }

    // Close all peer connections
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();

    setMediaStream(null);
    setIsStreaming(false);
    setUsingWebcam(false);
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    streamSocketRef.current?.emit('stop-stream', { roomId: selectedTokenId });
    notification.success("Stream stopped");
  };

  // Viewer offers are now sent per viewer on 'viewer-joined' event from server.

  // Existing webcam functions (unchanged)
  const startWebcam = async () => {
    try {
      if (!selectedTokenId) {
        notification.error("Select or create a StreamNFT before going live");
        return;
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
        setMediaStream(null);
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream as any;
        await videoRef.current.play();
      }
      setUsingWebcam(true);
      notification.success("Webcam started");
    } catch (e: any) {
      notification.error("Failed to access webcam");
      console.error(e);
    }
  };

  const stopWebcam = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(t => t.stop());
    }
    setMediaStream(null);
    setUsingWebcam(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Extract YouTube video ID from common URL shapes (extended)
  const getYouTubeId = (url: string): string | null => {
    try {
      const u = new URL(url);
      const host = u.hostname.replace(/^www\./, "");
      if (host === "youtu.be") {
        return u.pathname.slice(1) || null;
      }
      if (host.includes("youtube.com")) {
        // 1) watch?v=
        const v = u.searchParams.get("v");
        if (v) return v;
        const parts = u.pathname.split("/").filter(Boolean);
        // 2) /embed/{id}
        const embedIdx = parts.indexOf("embed");
        if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
        // 3) /live/{id}
        const liveIdx = parts.indexOf("live");
        if (liveIdx >= 0 && parts[liveIdx + 1]) return parts[liveIdx + 1];
      }
      return null;
    } catch {
      return null;
    }
  };

  const youtubeId = useMemo(() => getYouTubeId(youtubeUrl), [youtubeUrl]);

  // Switch mode safely (updated to handle streaming)
  const switchMode = (mode: "webcam" | "youtube" | "stream") => {
    if (mode !== "webcam" && usingWebcam && !isStreaming) {
      stopWebcam();
    }
    if (mode !== "stream" && isStreaming) {
      stopWebRTCStream();
    }
    setStreamMode(mode);
  };

  return (
    <div className="flex items-stretch grow w-full min-h-[calc(100vh-140px)] p-4">
      <div className="grid grid-cols-12 gap-4 w-full">
        {/* Left: Video area */}
        <div className="col-span-12 lg:col-span-8">
          <div className="card p-4">
            <div className="flex flex-col md:flex-row md:items-end gap-3 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-extrabold">Go Live</h1>
                <p className="text-xs opacity-70 uppercase tracking-wider">Start streaming with your StreamNFT</p>
              </div>
              {/* Hide controls for viewers (non-creators) */}
              {isCreator && (
                <div className="flex flex-col md:flex-row gap-2 items-stretch">
              
                <select
                  className="select select-bordered min-w-[200px]"
                  value={selectedTokenId}
                  onChange={e => setSelectedTokenId(e.target.value)}
                >
                  <option value="" disabled>
                    {address ? "Select your StreamNFT" : "Connect wallet"}
                  </option>
                  {tokenIds.map(id => (
                    <option key={id.toString()} value={id.toString()}>
                      Token #{id.toString()}
                    </option>
                  ))}
                </select>

                {/* Mode switch - UPDATED */}
                <div className="btn-group">
                  <button
                    className={`btn btn-sm ${streamMode === "webcam" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => switchMode("webcam")}
                  >
                    Webcam
                  </button>
                  <button
                    className={`btn btn-sm ${streamMode === "stream" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => switchMode("stream")}
                  >
                    Live Stream
                  </button>
                  <button
                    className={`btn btn-sm ${streamMode === "youtube" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => switchMode("youtube")}
                  >
                    YouTube
                  </button>
                </div>

                {/* Controls based on mode - UPDATED */}
                {streamMode === "youtube" ? (
                  <div className="flex gap-2 items-center">
                    {isCreator && (
                      <>
                        <input
                          className="input input-bordered md:w-80"
                          placeholder="Paste YouTube link (watch, youtu.be, or live)"
                          value={youtubeUrl}
                          onChange={e => setYoutubeUrl(e.target.value)}
                        />
                        {!isLive || liveType !== "youtube" ? (
                          <button className="btn btn-primary" disabled={!youtubeId || !selectedTokenId}
                            onClick={() => streamSocketRef.current?.emit('start-youtube', { roomId: selectedTokenId, youtubeId })}
                          >
                            🔴 Start YouTube
                          </button>
                        ) : (
                          <button className="btn btn-error" onClick={() => streamSocketRef.current?.emit('stop-stream', { roomId: selectedTokenId })}>
                            ⏹️ Stop YouTube
                          </button>
                        )}
                      </>
                    )}
                    {!isCreator && (
                      <div className="text-xs opacity-70">The streamer controls the YouTube source</div>
                    )}
                  </div>
                ) : streamMode === "stream" ? (
                  <div className="flex gap-2">
                    {!isStreaming ? (
                      <button className="btn btn-primary" onClick={startWebRTCStream}>
                        🔴 Go Live
                      </button>
                    ) : (
                      <>
                        <button className="btn btn-error" onClick={stopWebRTCStream}>
                          ⏹️ Stop Stream
                        </button>
                        <div className="badge badge-success">{viewerCount} viewers</div>
                      </>
                    )}
                  </div>
                ) : (
                  !usingWebcam ? (
                    <button className="btn btn-primary" onClick={startWebcam}>
                      Start Webcam
                    </button>
                  ) : (
                    <button className="btn" onClick={stopWebcam}>
                      Stop Webcam
                    </button>
                  )
                )}
                </div>
              )}
            </div>

            {/* If no active token, quick create form (existing) */}
            {myActiveTokens.length === 0 && (
              <QuickMintForm onMint={async (name, desc, image, durationHrs) => {
                try {
                  await writeMint({
                    address: streamNFT?.address,
                    abi: streamNFT?.abi,
                    functionName: "mint",
                    args: [name, desc, image, BigInt(durationHrs * 3600)],
                  });
                } catch (e) {
                  notification.error("Mint failed");
                }
              }} isMinting={isMinting || isMintConfirming} />
            )}

            {/* Video Player - UPDATED */}
            <div className="relative aspect-video w-full border-4 border-black">
              {(liveType === "youtube" && isLive && liveYoutubeId) ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${liveYoutubeId}?autoplay=1&mute=1&playsinline=1`}
                    title="YouTube player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (streamMode === "youtube" ? (
                  <div className="w-full h-full flex items-center justify-center text-center p-6">
                    <div>
                      <div className="text-lg font-bold">Paste a valid YouTube URL to start</div>
                      <div className="text-xs opacity-70 mt-2">Supports youtube.com/watch?v=…, youtu.be/…, and youtube.com/live/…</div>
                    </div>
                  </div>
                ) : (
                  <video
                  ref={videoRef}
                  className="w-full h-full bg-black"
                  controls={streamMode !== "stream" || (!isStreaming && isLive)}
                  playsInline
                  autoPlay={streamMode === "stream"}
                  muted={streamMode === "stream" ? true : (usingWebcam || isStreaming)}
                  style={{ transform: (streamMode === "stream" && isStreaming) ? 'scaleX(-1)' : 'none' }}
                />
              ))}

              {/* Stream overlay - NEW */}
              {(streamMode === "stream") && (isStreaming || isLive) && (
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="badge badge-error gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>
                  <div className="badge badge-neutral">{viewerCount} watching</div>
                </div>
              )}

              {/* No stream message */}
              {streamMode === "stream" && !isStreaming && !isLive && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                  <div className="text-center text-white">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg">Ready to stream</p>
                    <p className="text-sm opacity-75">Click "Go Live" to start broadcasting</p>
                  </div>
                </div>
              )}

              {/* Interaction banner (existing) */}
              {interactBanner && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-neon-purple text-black font-extrabold p-4 border-4 border-black text-center uppercase">
                    {interactBanner} wants to interact!
                  </div>
                </div>
              )}
            </div>

            {/* Token panel under the player (existing) */}
            <TokenPanel
              tokenId={selectedTokenId}
              streamNFT={{ address: streamNFT?.address as any, abi: streamNFT?.abi as any }}
              marketplace={{ address: marketplace?.address as any, abi: marketplace?.abi as any }}
              viewerAddress={address || undefined}
            />

            {/* Selected NFT Info (existing) */}
            {selectedInfo && (
              <div className="mt-4 p-3 border-4 border-black">
                <div className="flex items-center gap-3">
                  <img
                    alt="nft"
                    src={(selectedInfo as any).imageURI as string}
                    className="w-14 h-14 object-cover"
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect width='56' height='56' fill='%230B0B0B'/%3E%3C/svg%3E";
                    }}
                  />
                  <div>
                    <div className="font-bold">{(selectedInfo as any).name as string}</div>
                    <div className="text-xs opacity-70">
                      Expires: {new Date(Number((selectedInfo as any).expiration) * 1000).toLocaleString()} • Remaining {(selectedInfo as any).remainingHours?.toString?.() || "-"}h
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chat area (existing) */}
        <div className="col-span-12 lg:col-span-4">
          <LiveChatPanel roomId={selectedTokenId || "lobby"} tokenId={selectedTokenId} />
        </div>
      </div>
    </div>
  );
}

// Existing components (unchanged)
function QuickMintForm({ onMint, isMinting }: { onMint: (name: string, desc: string, imageURI: string, durationHours: number) => Promise<void> | void; isMinting: boolean }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");
  const [duration, setDuration] = useState("1");
  return (
    <div className="border-4 border-black p-4 my-4">
      <div className="font-bold mb-2">No active token found — Create one to go live</div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <input className="input input-bordered" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="input input-bordered" placeholder="Image URI" value={image} onChange={e => setImage(e.target.value)} />
        <input className="input input-bordered" placeholder="Description (opt)" value={desc} onChange={e => setDesc(e.target.value)} />
        <input className="input input-bordered" type="number" min={1} max={24} placeholder="Duration (hrs)" value={duration} onChange={e => setDuration(e.target.value)} />
      </div>
      <button
        className="btn btn-primary mt-3"
        disabled={isMinting || !name || !image}
        onClick={() => onMint(name, desc, image, Math.max(1, Math.min(24, Number(duration || 1))))}
      >
        {isMinting ? "Minting..." : "Create StreamNFT"}
      </button>
    </div>
  );
}

function TokenPanel({ tokenId, streamNFT, marketplace, viewerAddress }: { tokenId?: string; streamNFT: { address?: `0x${string}`; abi?: any }; marketplace: { address?: `0x${string}`; abi?: any }; viewerAddress?: string; }) {
  const tid = tokenId ? BigInt(tokenId) : undefined;
  const { data: info } = useReadContract({ address: streamNFT.address, abi: streamNFT.abi, functionName: "getNFTInfo", args: tid ? [tid] : undefined });
  const { data: frac } = useReadContract({ address: marketplace.address, abi: marketplace.abi, functionName: "getFractionalData", args: tid ? [tid] : undefined });
  const { data: userHours } = useReadContract({ address: marketplace.address, abi: marketplace.abi, functionName: "getUserHoursForToken", args: tid && viewerAddress ? [tid, viewerAddress] : undefined });

  const [history, setHistory] = useState<{ t: number; v: number }[]>([]);
  useEffect(() => {
    let mounted = true;
    const pushPoint = () => {
      const v = frac ? Number((frac as any)[3] as bigint) : 0;
      if (!mounted) return;
      setHistory(prev => [...prev.slice(-99), { t: Date.now(), v }]);
    };
    pushPoint();
    const id = setInterval(pushPoint, 10000);
    return () => { mounted = false; clearInterval(id); };
  }, [frac]);

  const Spark = () => {
    const W = 240, H = 60, P = 6;
    const data = history.length ? history : [{ t: 0, v: 0 }];
    const minV = Math.min(...data.map(d => d.v));
    const maxV = Math.max(...data.map(d => d.v));
    const range = Math.max(1, maxV - minV);
    const step = (W - P * 2) / Math.max(1, data.length - 1);
    const pts = data.map((d, i) => {
      const x = P + i * step;
      const y = H - P - ((d.v - minV) / range) * (H - P * 2);
      return `${x},${y}`;
    }).join(" ");
    return (
      <svg width={W} height={H} className="block">
        <polyline fill="none" stroke="#C71585" strokeWidth="2" points={pts} />
      </svg>
    );
  };

  if (!tokenId) return null;

  return (
    <div className="mt-4 border-4 border-black p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <img
            alt="nft"
            src={(info as any)?.imageURI || ""}
            className="w-14 h-14 object-cover"
            onError={e => { (e.currentTarget as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect width='56' height='56' fill='%230B0B0B'/%3E%3C/svg%3E"; }}
          />
          <div>
            <div className="font-bold">{(info as any)?.name || "Token"} #{tokenId}</div>
            <div className="text-xs opacity-70">Remaining: {(info as any)?.remainingHours?.toString?.() || "-"}h • Expires {info ? new Date(Number((info as any).expiration) * 1000).toLocaleString() : "-"}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs opacity-70 uppercase">Price/hr</div>
          <div className="text-lg font-extrabold">{frac ? (Number((frac as any)[1]) / 1e18).toFixed(4) : "-"} KDA</div>
        </div>
      </div>
      <div className="mt-3">
        <div className="text-xs opacity-70 uppercase mb-1">Hours sold trend</div>
        <Spark />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm">Your hours: {(userHours as bigint | undefined)?.toString?.() || "0"}h</div>
        <div className="text-sm">Total hours sold: {frac ? ((frac as any)[3] as bigint).toString() : "0"}h</div>
      </div>
    </div>
  );
}

function LiveChatPanel({ roomId, tokenId }: { roomId: string; tokenId?: string }) {
  type ChatMsg = { id: string; author: string; text: string; at: number };
  const { address } = useAccount();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const { data: marketplace } = useScaffoldContract({ contractName: "Marketplace" });
  const { data: fractionalView } = useReadContract({
    address: marketplace?.address,
    abi: marketplace?.abi,
    functionName: "getFractionalView",
    args: tokenId ? [BigInt(tokenId)] : undefined,
  });
  const { data: userHours } = useReadContract({
    address: marketplace?.address,
    abi: marketplace?.abi,
    functionName: "getUserHoursForToken",
    args: tokenId && address ? [BigInt(tokenId), address] : undefined,
  });

  const [buyHours, setBuyHours] = useState<string>("1");
  const { writeContract: writeBuy, data: buyHash, isPending: isBuying } = useWriteContract();
  const { isLoading: isBuyConfirming } = useWaitForTransactionReceipt({ hash: buyHash });

  const { data: buyCost } = useReadContract({
    address: marketplace?.address,
    abi: marketplace?.abi,
    functionName: "getBuyCost",
    args: tokenId ? [BigInt(tokenId), 1n] : undefined,
  });

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4001";
    const s = io(url, { transports: ["websocket", "polling"] });
    socketRef.current = s;

    s.on("connect", () => {
      s.emit("join", { roomId, author: address || "streamer" });
    });

    s.on("message", (msg: ChatMsg) => {
      setMessages(prev => [...prev, msg].slice(-300));
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("join", { roomId, author: address || "streamer" });
    }
  }, [roomId, address]);

  useEffect(() => {
    // Auto-scroll
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length]);

  const send = () => {
    if (!text.trim()) return;
    const hasHours = (userHours as bigint | undefined) && (userHours as bigint) > 0n;
    const payload = {
      roomId,
      author: address || "you",
      text: hasHours ? `[INTERACT] ${text}` : text,
      at: Date.now(),
    };
    socketRef.current?.emit("message", payload);
    setText("");
  };

  const onBuyHours = async () => {
    if (!fractionalView || !tokenId) return;
    const isActive = (fractionalView as any)[0] === true;
    if (!isActive) {
      notification.error("Not listed fractionally");
      return;
    }
    const hours = BigInt(Math.max(1, Number(buyHours || "1")));
    try {
      if (hours !== 1n) {
        notification.info("Currently buy 1 hour at a time for accurate pricing.");
      }
      const value = (buyCost as any)?.[0] as bigint | undefined;
      if (!value) {
        notification.error("Could not fetch cost. Try again.");
        return;
      }
      await writeBuy({
        address: marketplace?.address,
        abi: marketplace?.abi,
        functionName: "buyHours",
        args: [BigInt(tokenId), 1n],
        value,
      });
    } catch (e) {
      notification.error("Buy hours failed");
      console.error(e);
    }
  };

  return (
    <div className="card p-0 overflow-hidden h-full min-h-[400px] flex flex-col">
      <div className="p-4 border-b-4 border-black flex items-center gap-3 justify-between">
        <div>
          <h2 className="text-xl font-extrabold">Live Chat</h2>
          <p className="text-xs uppercase opacity-70">Brutalist chat — purple and black</p>
        </div>
        {tokenId && (
          <div className="flex items-center gap-2">
            {(userHours as bigint | undefined) && (userHours as bigint) > 0n ? (
              <button className="btn btn-primary btn-sm" onClick={() => socketRef.current?.emit("interact", { roomId, author: address })}>
                Interact ({(userHours as bigint).toString()} h)
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  className="input input-bordered input-sm w-20"
                  value={buyHours}
                  onChange={e => setBuyHours(e.target.value)}
                />
                <button className="btn btn-outline btn-sm" onClick={onBuyHours} disabled={isBuying || isBuyConfirming}>
                  {isBuying || isBuyConfirming ? "Purchasing..." : "Buy Hours"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(m => (
          <div key={m.id} className="border-4 border-black p-2">
            <div className="text-[10px] uppercase opacity-60">{new Date(m.at).toLocaleTimeString()}</div>
            <div className="font-bold text-neon-purple break-all">{m.author}</div>
            <div className="text-sm leading-snug whitespace-pre-wrap break-words">{m.text}</div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-xs opacity-60">No messages yet — be the first to say hi!</div>
        )}
      </div>
      <div className="p-3 border-t-4 border-black flex gap-2">
        <input
          className="input input-bordered flex-1"
          placeholder="Say something..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") send();
          }}
        />
        <button className="btn btn-primary" onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
}