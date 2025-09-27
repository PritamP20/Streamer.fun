"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export default function GoLivePage() {
  const { address } = useAccount();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [usingWebcam, setUsingWebcam] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [selectedTokenId, setSelectedTokenId] = useState<string>("");

  // mode: webcam | youtube
  const [streamMode, setStreamMode] = useState<"webcam" | "youtube">("webcam");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const { data: streamNFT } = useScaffoldContract({ contractName: "StreamNFT" });
  const { data: marketplace } = useScaffoldContract({ contractName: "Marketplace" });

  // Active tokens by this creator
  const { data: activeInfos } = useReadContract({
    address: streamNFT?.address,
    abi: streamNFT?.abi,
    functionName: "getActiveNFTsWithInfo",
  });

  const myActiveTokens = useMemo(() => {
    if (!activeInfos || !address) return [] as any[];
    return (activeInfos as any[]).filter(i => i.creator?.toLowerCase?.() === address.toLowerCase());
  }, [activeInfos, address]);

  // Mint inline if needed
  const { writeContract: writeMint, data: mintHash, isPending: isMinting } = useWriteContract();
  const { isLoading: isMintConfirming } = useWaitForTransactionReceipt({ hash: mintHash });

  // Fetch NFTs created by this address
  const { data: creatorTokenIds } = useReadContract({
    address: streamNFT?.address,
    abi: streamNFT?.abi,
    functionName: "getNFTsByCreator",
    args: address ? [address] : undefined,
  });

  const tokenIds = useMemo(() => (creatorTokenIds as bigint[] | undefined) || [], [creatorTokenIds]);

  // Fetch info of selected token
  const { data: selectedInfo } = useReadContract({
    address: streamNFT?.address,
    abi: streamNFT?.abi,
    functionName: "getNFTInfo",
    args: selectedTokenId ? [BigInt(selectedTokenId)] : undefined,
  });

  useEffect(() => {
    return () => {
      // Cleanup webcam on unmount
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [mediaStream]);

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
      // eslint-disable-next-line no-console
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

  // Extract YouTube video ID from common URL shapes
  const getYouTubeId = (url: string): string | null => {
    try {
      const u = new URL(url);
      if (u.hostname === "youtu.be") {
        return u.pathname.slice(1) || null;
      }
      if (u.hostname.includes("youtube.com")) {
        const v = u.searchParams.get("v");
        if (v) return v;
        // also support /embed/{id}
        const parts = u.pathname.split("/").filter(Boolean);
        const embedIdx = parts.indexOf("embed");
        if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
      }
      return null;
    } catch {
      return null;
    }
  };

  const youtubeId = useMemo(() => getYouTubeId(youtubeUrl), [youtubeUrl]);

  // Switch mode safely (stop webcam when leaving webcam mode)
  const switchMode = (mode: "webcam" | "youtube") => {
    if (mode === "youtube" && usingWebcam) {
      stopWebcam();
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

                {/* Mode switch */}
                <div className="btn-group">
                  <button
                    className={`btn ${streamMode === "webcam" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => switchMode("webcam")}
                  >
                    Go Live (Webcam)
                  </button>
                  <button
                    className={`btn ${streamMode === "youtube" ? "btn-primary" : "btn-outline"}`}
                    onClick={() => switchMode("youtube")}
                  >
                    YouTube URL
                  </button>
                </div>

                {streamMode === "youtube" ? (
                  <input
                    className="input input-bordered md:w-80"
                    placeholder="Paste YouTube link"
                    value={youtubeUrl}
                    onChange={e => setYoutubeUrl(e.target.value)}
                  />
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
            </div>

            {/* If no active token, quick create form */}
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

            {/* Video Player */}
            <div className="relative aspect-video w-full border-4 border-black">
              {streamMode === "youtube" ? (
                youtubeId ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&playsinline=1`}
                    title="YouTube player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-center p-6">
                    <div>
                      <div className="text-lg font-bold">Paste a valid YouTube URL to start</div>
                      <div className="text-xs opacity-70 mt-2">Supports youtube.com/watch?v=… and youtu.be/…</div>
                    </div>
                  </div>
                )
              ) : (
                <video
                  ref={videoRef}
                  className="w-full h-full bg-black"
                  controls
                  playsInline
                  muted={usingWebcam}
                />
              )}
            </div>

            {/* Token panel under the player */}
            <TokenPanel
              tokenId={selectedTokenId}
              streamNFT={{ address: streamNFT?.address as any, abi: streamNFT?.abi as any }}
              marketplace={{ address: marketplace?.address as any, abi: marketplace?.abi as any }}
              viewerAddress={address || undefined}
            />

            {/* Selected NFT Info */}
            {selectedInfo && (
              <div className="mt-4 p-3 border-4 border-black">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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

        {/* Right: Chat area */}
        <div className="col-span-12 lg:col-span-4">
          <LiveChatPanel roomId={selectedTokenId || "lobby"} tokenId={selectedTokenId} />
        </div>
      </div>
    </div>
  );
}

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

  // Track totalHoursSold over time for a simple sparkline
  const [history, setHistory] = useState<{ t: number; v: number }[]>([]);
  useEffect(() => {
    let mounted = true;
    const pushPoint = () => {
      const v = frac ? Number((frac as any)[3] as bigint) : 0; // totalHoursSold
      if (!mounted) return;
      setHistory(prev => [...prev.slice(-99), { t: Date.now(), v }]);
    };
    pushPoint();
    const id = setInterval(pushPoint, 10000);
    return () => { mounted = false; clearInterval(id); };
  }, [frac]);

  // Build sparkline path
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
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

import { io, Socket } from "socket.io-client";

function LiveChatPanel({ roomId, tokenId }: { roomId: string; tokenId?: string }) {
  type ChatMsg = { id: string; author: string; text: string; at: number };
  const { address } = useAccount();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // marketplace data for token
  const { data: marketplace } = useScaffoldContract({ contractName: "Marketplace" });
  const { data: fractional } = useReadContract({
    address: marketplace?.address,
    abi: marketplace?.abi,
    functionName: "getFractionalData",
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

  // Connect to socket.io
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-join when room changes
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
    if (!fractional || !tokenId) return;
    const pricePerHour: bigint = (fractional as any)[1] as bigint; // wei
    const hours = BigInt(Math.max(1, Number(buyHours || "1")));
    try {
      await writeBuy({
        address: marketplace?.address,
        abi: marketplace?.abi,
        functionName: "buyHours",
        args: [BigInt(tokenId), hours],
        value: hours * pricePerHour,
      });
    } catch (e) {
      notification.error("Buy hours failed");
      // eslint-disable-next-line no-console
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
              <button className="btn btn-primary btn-sm">Interact ({(userHours as bigint).toString()} h)</button>
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
