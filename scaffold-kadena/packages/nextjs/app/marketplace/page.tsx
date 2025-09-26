"use client";

import { useState, useEffect } from "react";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { formatEther, parseEther } from "viem";

interface NFTData {
  tokenId: bigint;
  name: string;
  description: string;
  imageURI: string;
  creator: string;
  expiration: bigint;
  isExpired: boolean;
  price?: bigint;
  seller?: string;
  isListed: boolean;
}

export default function Marketplace() {
  const { address } = useAccount();
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFTData | null>(null);
  const [listPrice, setListPrice] = useState("");

  const { data: streamNFTContract } = useScaffoldContract({
    contractName: "StreamNFT",
  });

  const { data: marketplaceContract } = useScaffoldContract({
    contractName: "Marketplace",
  });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  // Read next token ID to determine how many NFTs exist
  const { data: nextTokenId } = useReadContract({
    address: streamNFTContract?.address,
    abi: streamNFTContract?.abi,
    functionName: "nextTokenId",
  });

  // Load NFT data
  useEffect(() => {
    const loadNFTs = async () => {
      if (!nextTokenId || !streamNFTContract || !marketplaceContract) return;

      const nftData: NFTData[] = [];
      const totalTokens = Number(nextTokenId) - 1;

      setNfts(nftData);
    };

    loadNFTs();
  }, [nextTokenId, streamNFTContract, marketplaceContract]);

  const handleList = async (tokenId: bigint) => {
    if (!address || !listPrice) {
      notification.error("Please enter a price");
      return;
    }

    try {
      // First approve the marketplace
      writeContract({
        address: streamNFTContract?.address,
        abi: streamNFTContract?.abi,
        functionName: "approve",
        args: [marketplaceContract?.address, tokenId],
      });

      // Then list (this would need to be called after approval is confirmed)
      // For simplicity, we're showing both steps
      notification.info("Please approve the marketplace first, then list");
    } catch (error) {
      console.error("Error listing NFT:", error);
      notification.error("Failed to list NFT");
    }
  };

  const handleBuy = async (tokenId: bigint, price: bigint) => {
    if (!address) {
      notification.error("Please connect your wallet");
      return;
    }

    try {
      writeContract({
        address: marketplaceContract?.address,
        abi: marketplaceContract?.abi,
        functionName: "buy",
        args: [tokenId],
        value: price,
      });
    } catch (error) {
      console.error("Error buying NFT:", error);
      notification.error("Failed to buy NFT");
    }
  };

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 max-w-6xl w-full">
        <h1 className="text-center text-4xl font-bold mb-8">NFT Marketplace</h1>

        {nfts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">No NFTs available yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              <a href="/mint" className="link">Mint your first NFT</a> to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
              <div key={nft.tokenId.toString()} className="card bg-base-100 shadow-xl">
                <figure>
                  <img
                    src={nft.imageURI}
                    alt={nft.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='300' height='200' fill='%23ddd'/%3E%3Ctext x='150' y='100' font-size='18' text-anchor='middle' dy='.3em'%3EImage Not Available%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    {nft.name}
                    {nft.isExpired && <div className="badge badge-error">Expired</div>}
                  </h2>
                  <p className="text-sm text-gray-600">{nft.description}</p>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    <p>Token ID: {nft.tokenId.toString()}</p>
                    <p>Expires: {new Date(Number(nft.expiration) * 1000).toLocaleString()}</p>
                  </div>

                  <div className="card-actions justify-end mt-4">
                    {nft.isListed && nft.price ? (
                      <div className="w-full">
                        <p className="text-lg font-semibold text-primary mb-2">
                          {formatEther(nft.price)} KDA
                        </p>
                        <button
                          className="btn btn-primary w-full"
                          onClick={() => handleBuy(nft.tokenId, nft.price)}
                          disabled={isPending || isConfirming || nft.isExpired}
                        >
                          {isPending || isConfirming ? "Processing..." : "Buy Now"}
                        </button>
                      </div>
                    ) : (
                      <div className="w-full">
                        <div className="flex gap-2 mb-2">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Price in KDA"
                            className="input input-bordered input-sm flex-1"
                            value={listPrice}
                            onChange={(e) => setListPrice(e.target.value)}
                          />
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleList(nft.tokenId)}
                            disabled={isPending || isConfirming || !listPrice}
                          >
                            List
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">
                          List this NFT for sale
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}