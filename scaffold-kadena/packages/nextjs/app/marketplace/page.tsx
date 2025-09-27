"use client";

import { useMemo, useState } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { formatEther, parseEther } from "viem";

// Types matching StreamNFT.NFTInfo
interface NFTInfo {
  tokenId: bigint;
  creator: string;
  currentOwner: string;
  expiration: bigint;
  name: string;
  description: string;
  imageURI: string;
  isExpired: boolean;
  remainingTime: bigint;
  remainingHours: bigint;
}

function FractionalCard({ tokenId }: { tokenId: bigint }) {
  const { address } = useAccount();
  const { data: marketplaceContract } = useScaffoldContract({ contractName: "Marketplace" });
  const { data: streamNFTContract } = useScaffoldContract({ contractName: "StreamNFT" });

  const [hoursToBuy, setHoursToBuy] = useState<string>("1");

  // Fractional view: isActive, base, multiplier, totalSold, remaining, nextPrice
  const { data: fractionalView } = useReadContract({
    address: marketplaceContract?.address,
    abi: marketplaceContract?.abi,
    functionName: "getFractionalView",
    args: [tokenId],
  });

  const { data: owner } = useReadContract({
    address: streamNFTContract?.address,
    abi: streamNFTContract?.abi,
    functionName: "ownerOf",
    args: [tokenId],
  });

  const isOwner = address && owner && address.toLowerCase() === (owner as string).toLowerCase();

  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash: txHash });

  // Precompute cost for buying 1 hour
  const { data: buyCost } = useReadContract({
    address: marketplaceContract?.address,
    abi: marketplaceContract?.abi,
    functionName: "getBuyCost",
    args: [tokenId, 1n],
  });

  const onListFractional = async () => {
    try {
      await writeContract({
        address: marketplaceContract?.address,
        abi: marketplaceContract?.abi,
        functionName: "listFractional",
        args: [tokenId],
      });
    } catch (e) {
      notification.error("Listing failed");
      console.error(e);
    }
  };

  const onBuyHours = async () => {
    if (!fractionalView) return;
    const isActive = (fractionalView as any)[0] === true;
    if (!isActive) {
      notification.error("This stream is not listed fractionally");
      return;
    }
    const hours = BigInt(Math.max(1, Number(hoursToBuy || "1")));
    try {
      if (hours !== 1n) {
        notification.info("Currently buy 1 hour at a time for accurate pricing.");
      }
      const value = (buyCost as any)?.[0] as bigint | undefined;
      if (!value) {
        notification.error("Could not fetch cost. Try again.");
        return;
      }
      await writeContract({
        address: marketplaceContract?.address,
        abi: marketplaceContract?.abi,
        functionName: "buyHours",
        args: [tokenId, 1n],
        value,
      });
    } catch (e) {
      notification.error("Purchase failed");
      console.error(e);
    }
  };

  if (!marketplaceContract) {
    return <div className="text-xs text-error">Marketplace contract not configured. Deploy and regenerate deployedContracts.ts.</div>;
  }

  const isActive = !!fractionalView && (fractionalView as any)[0] === true;
  const nextPriceWei = (!!fractionalView && (fractionalView as any)[5]) as bigint | undefined;
  const remainingHours = (!!fractionalView && (fractionalView as any)[4]) as bigint | undefined;

  return (
    <div className="mt-4 border-t pt-3">
      {isActive && nextPriceWei && (remainingHours ?? 0n) > 0n ? (
        <div className="flex flex-col gap-2">
          <div className="text-sm">Next hour price: {formatEther(nextPriceWei)} KDA</div>
          <div className="text-sm">Remaining: {remainingHours?.toString()} h</div>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              max={1}
              className="input input-bordered input-sm w-24"
              value={hoursToBuy}
              onChange={e => setHoursToBuy(e.target.value)}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={onBuyHours}
              disabled={isPending || isConfirming}
            >
              {isPending || isConfirming ? "Processing..." : "Buy 1 hour"}
            </button>
          </div>
        </div>
      ) : isOwner ? (
        <div className="flex flex-col gap-2">
          {isActive && (remainingHours ?? 0n) === 0n ? (
            <div className="text-xs">Sold out. You can list the NFT for full sale:</div>
          ) : (
            <div className="text-xs">Not fractionally listed. You can list now:</div>
          )}
          <button className="btn btn-outline btn-sm" onClick={onListFractional} disabled={isPending}>
            {isPending ? "Listing..." : "List Fractional"}
          </button>
        </div>
      ) : isActive && (remainingHours ?? 0n) === 0n ? (
        <div className="text-xs text-warning">Sold out</div>
      ) : (
        <div className="text-xs text-gray-500">Not fractionally listed</div>
      )}
    </div>
  );
}

export default function Marketplace() {
  const { data: streamNFTContract } = useScaffoldContract({ contractName: "StreamNFT" });

  // Load all active NFTs with info in a single call
  const { data: activeInfos } = useReadContract({
    address: streamNFTContract?.address,
    abi: streamNFTContract?.abi,
    functionName: "getActiveNFTsWithInfo",
  });

  const nfts: NFTInfo[] = useMemo(() => {
    if (!activeInfos) return [] as NFTInfo[];
    return (activeInfos as any[]).map((i: any) => ({
      tokenId: i.tokenId as bigint,
      creator: i.creator as string,
      currentOwner: i.currentOwner as string,
      expiration: i.expiration as bigint,
      name: i.name as string,
      description: i.description as string,
      imageURI: i.imageURI as string,
      isExpired: i.isExpired as boolean,
      remainingTime: i.remainingTime as bigint,
      remainingHours: i.remainingHours as bigint,
    }));
  }, [activeInfos]);

  const formatTimeRemaining = (hours: bigint) => {
    const h = Number(hours);
    if (h < 24) {
      return `${h}h`;
    } else {
      const days = Math.floor(h / 24);
      const remainingHours = h % 24;
      return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 max-w-6xl w-full">

        {nfts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No active stream NFTs right now.</p>
            <p className="text-sm text-gray-400 mt-2">
              <a href="/mint" className="link">Mint your first NFT</a> to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {nfts.map(nft => (
              <div key={nft.tokenId.toString()} className="card bg-base-100 shadow-xl">
                {/* Square Image Container */}
                <figure className="aspect-square">
                  <img
                    src={nft.imageURI}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ccircle cx='200' cy='160' r='32' fill='%23d1d5db'/%3E%3Cpath d='M120 280h160l-32-64-32 48-32-24z' fill='%23d1d5db'/%3E%3Ctext x='200' y='320' font-size='14' text-anchor='middle' fill='%23666'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {nft.isExpired ? (
                      <div className="badge badge-error">Expired</div>
                    ) : (
                      <div className="badge badge-success">Active</div>
                    )}
                  </div>
                </figure>

                <div className="card-body">
                  <h2 className="card-title text-lg">
                    {nft.name}
                  </h2>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">{nft.description}</p>
                  
                  {/* Details */}
                  <div className="text-xs text-gray-500 mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Token ID:</span>
                      <span className="font-mono">#{nft.tokenId.toString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Left:</span>
                      <span className="badge badge-outline badge-sm">
                        {formatTimeRemaining(nft.remainingHours)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Owner:</span>
                      <span className="font-mono">{truncateAddress(nft.currentOwner)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expires:</span>
                      <span>
                        {new Date(Number(nft.expiration) * 1000).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Fractional buy/list UI */}
                  <FractionalCard tokenId={nft.tokenId} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}