"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useReadContract } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

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

  return (
    <div className="flex items-center flex-col grow p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-extrabold uppercase mb-4">Live Streams</h1>
        {items.length === 0 ? (
          <div className="text-sm opacity-70">No active streams right now.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(info => (
              <StreamCard key={(info.tokenId as bigint).toString()} info={info} marketplace={marketplace} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StreamCard({ info, marketplace }: { info: any; marketplace: any }) {
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
      <img
        alt="thumb"
        src={info.imageURI as string}
        className="w-full h-40 object-cover border-4 border-black"
        onError={e => {
          (e.currentTarget as HTMLImageElement).src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='160'%3E%3Crect width='300' height='160' fill='%230B0B0B'/%3E%3Ctext x='150' y='80' font-size='14' text-anchor='middle' fill='%23666'%3ENo Image%3C/text%3E%3C/svg%3E";
        }}
      />
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
          <Link href={joinHref} className="btn btn-primary btn-sm ml-2">
            Join
          </Link>
        </div>
      </div>
    </div>
  );
}