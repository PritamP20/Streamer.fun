"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useReadContract } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { io, Socket } from "socket.io-client";

export default function StreamsPage() {
  const { data: streamNFT } = useScaffoldContract({ contractName: "StreamNFT" });
  const { data: marketplace } = useScaffoldContract({ contractName: "Marketplace" });

  // All active NFTs (by time)
  const { data: activeInfos } = useReadContract({
    address: streamNFT?.address,
    abi: streamNFT?.abi,
    functionName: "getActiveNFTsWithInfo",
  });

  const items = useMemo(() => ((activeInfos as any[]) || []), [activeInfos]);

  // Live status map: tokenId(string) -> { isLive, viewerCount, title }
  const [liveMap, setLiveMap] = useState<Record<string, { isLive: boolean; viewerCount: number; title?: string | null }>>({});

  useEffect(() => {
    if (!items.length) return;

    const url = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4001";
    const s: Socket = io(url, { transports: ["websocket", "polling"] });

    const tokenIds = items.map(info => (info.tokenId as bigint).toString());
    s.on("connect", () => {
      s.emit("get-stream-status", { roomIds: tokenIds }, (resp: any) => {
        if (resp?.ok && Array.isArray(resp.data)) {
          const map: Record<string, { isLive: boolean; viewerCount: number; title?: string | null }> = {};
          for (const row of resp.data) {
            map[String(row.roomId)] = { isLive: !!row.isLive, viewerCount: Number(row.viewerCount || 0), title: row.title };
          }
          setLiveMap(map);
        }
      });
    });

    return () => {
      s.disconnect();
    };
  }, [items]);

  return (
    <div className="flex items-center flex-col grow p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-extrabold uppercase mb-4">Streams</h1>
        {items.length === 0 ? (
          <div className="text-sm opacity-70">No active StreamNFTs right now.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(info => {
              const tid = (info.tokenId as bigint).toString();
              const status = liveMap[tid];
              return (
                <StreamCard key={tid} info={info} marketplace={marketplace} liveStatus={status} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StreamCard({ info, marketplace, liveStatus }: { info: any; marketplace: any; liveStatus?: { isLive: boolean; viewerCount: number; title?: string | null } }) {
  const tokenId = info.tokenId as bigint;
  const { data: fracView } = useReadContract({
    address: marketplace?.address,
    abi: marketplace?.abi,
    functionName: "getFractionalView",
    args: [tokenId],
  });

  const isActive = fracView ? (fracView as any)[0] === true : false;
  const remaining = fracView ? ((fracView as any)[4] as bigint) : 0n;
  const nextPrice = fracView ? ((fracView as any)[5] as bigint) : 0n;
  const joinHref = `/stream?tokenId=${tokenId.toString()}`;

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div className="relative">
        <img
          alt="thumb"
          src={info.imageURI as string}
          className="w-full h-40 object-cover border-4 border-black"
          onError={e => {
            (e.currentTarget as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='160'%3E%3Crect width='300' height='160' fill='%230B0B0B'/%3E%3Ctext x='150' y='80' font-size='14' text-anchor='middle' fill='%23666'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />
        {liveStatus?.isLive && (
          <div className="absolute top-2 left-2 badge badge-error gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            LIVE
            {typeof liveStatus.viewerCount === "number" && (
              <span className="ml-2 badge badge-neutral">{liveStatus.viewerCount}</span>
            )}
          </div>
        )}
      </div>
      <div className="card-body p-4">
        <h2 className="card-title text-lg">
          {info.name} #{tokenId.toString()}
          {info.isExpired && <div className="badge badge-error">Expired</div>}
        </h2>
        <div className="text-xs opacity-70 space-y-1">
          <div>By {truncateAddress(info.creator)}</div>
          <div>Expires {new Date(Number(info.expiration) * 1000).toLocaleDateString()}</div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex-1">
            {isActive ? (
              <div className="text-xs space-y-1">
                <div>Remaining: <span className="font-semibold">{remaining.toString()}h</span></div>
                <div>Next: <span className="font-semibold">{(Number(nextPrice)/1e18).toFixed(4)} KDA</span></div>
              </div>
            ) : (
              <div className="text-xs opacity-70">Not listed fractionally</div>
            )}
          </div>
          <Link href={joinHref} className={`btn btn-sm ml-2 ${liveStatus?.isLive ? "btn-primary" : "btn-outline"}`}>
            {liveStatus?.isLive ? "Watch" : "Join"}
          </Link>
        </div>
      </div>
    </div>
  );
}
