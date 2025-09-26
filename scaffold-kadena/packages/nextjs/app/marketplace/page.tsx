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
  const [pricePerHour, setPricePerHour] = useState<string>("");

  // Fractional data: streamer, pricePerHour, isActive, totalHoursSold, remainingHours
  const { data: fractionalData } = useReadContract({
    address: marketplaceContract?.address,
    abi: marketplaceContract?.abi,
    functionName: "getFractionalData",
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

  const onListFractional = async () => {
    if (!pricePerHour) {
      notification.error("Enter price per hour");
      return;
    }
    try {
      const wei = parseEther(pricePerHour);
      await writeContract({
        address: marketplaceContract?.address,
        abi: marketplaceContract?.abi,
        functionName: "listFractional",
        args: [tokenId, wei],
      });
    } catch (e) {
      notification.error("Listing failed");
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const onBuyHours = async () => {
    if (!fractionalData) return;
    const [_streamer, pricePerHourWei, isActive] = fractionalData as unknown as [string, bigint, boolean, bigint, bigint];
    if (!isActive) {
      notification.error("This stream is not listed fractionally");
      return;
    }
    const hours = BigInt(Math.max(1, Number(hoursToBuy || "1")));
    const total = hours * (pricePerHourWei as bigint);
    try {
      await writeContract({
        address: marketplaceContract?.address,
        abi: marketplaceContract?.abi,
        functionName: "buyHours",
        args: [tokenId, hours],
        value: total,
      });
    } catch (e) {
      notification.error("Purchase failed");
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  if (!marketplaceContract) {
    return <div className="text-xs text-error">Marketplace contract not configured. Deploy and regenerate deployedContracts.ts.</div>;
  }

  // Render fractional section
  const isActive = !!fractionalData && (fractionalData as any)[2] === true;
  const priceWei = (!!fractionalData && (fractionalData as any)[1]) as bigint | undefined;
  const remainingHours = (!!fractionalData && (fractionalData as any)[4]) as bigint | undefined;

  return (
    <div className="mt-4 border-t pt-3">
      {isActive && priceWei ? (
        <div className="flex flex-col gap-2">
          <div className="text-sm">Price/hour: {formatEther(priceWei)} KDA</div>
          <div className="text-sm">Remaining: {remainingHours?.toString()} h</div>
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              className="input input-bordered input-sm w-24"
              value={hoursToBuy}
              onChange={e => setHoursToBuy(e.target.value)}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={onBuyHours}
              disabled={isPending || isConfirming}
            >
              {isPending || isConfirming ? "Processing..." : "Buy hours"}
            </button>
          </div>
        </div>
      ) : isOwner ? (
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            step={0.001}
            placeholder="Price/hour (KDA)"
            className="input input-bordered input-sm"
            value={pricePerHour}
            onChange={e => setPricePerHour(e.target.value)}
          />
          <button className="btn btn-outline btn-sm" onClick={onListFractional} disabled={!pricePerHour || isPending}>
            {isPending ? "Listing..." : "List Fractional"}
          </button>
        </div>
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

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 max-w-6xl w-full">
        <h1 className="text-center text-4xl font-bold mb-8">Marketplace</h1>

        {nfts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No active stream NFTs right now.</p>
            <p className="text-sm text-gray-400 mt-2">
              <a href="/mint" className="link">Mint your first NFT</a> to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map(nft => (
              <div key={nft.tokenId.toString()} className="card bg-base-100 shadow-xl">
                <figure>
                  <img
                    src={nft.imageURI}
                    alt={nft.name}
                    className="w-full h-48 object-cover"
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='300' height='200' fill='%23ddd'/%3E%3Ctext x='150' y='100' font-size='18' text-anchor='middle' dy='.3em'%3EImage Not Available%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    {nft.name}
                    {nft.isExpired && <div className="badge badge-error">Expired</div>}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3">{nft.description}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    <p>Token ID: {nft.tokenId.toString()}</p>
                    <p>Expires: {new Date(Number(nft.expiration) * 1000).toLocaleString()}</p>
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
