"use client";

import { useMemo, useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { parseEther } from "viem";

export default function MintNFT() {
  const { address } = useAccount();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageURI: "",
    duration: "1", // hours
  });

  const { data: streamNFTContract } = useScaffoldContract({ contractName: "StreamNFT" });
  const { data: marketplaceContract } = useScaffoldContract({ contractName: "Marketplace" });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMint = async () => {
    if (!address) {
      notification.error("Please connect your wallet");
      return;
    }
    if (!formData.name || !formData.imageURI) {
      notification.error("Please fill in all required fields");
      return;
    }

    try {
      const durationInSeconds = parseInt(formData.duration) * 3600; // Convert hours to seconds
      await writeContract({
        address: streamNFTContract?.address,
        abi: streamNFTContract?.abi,
        functionName: "mint",
        args: [formData.name, formData.description, formData.imageURI, BigInt(durationInSeconds)],
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error minting NFT:", error);
      notification.error("Failed to mint NFT");
    }
  };

  // Your minted NFTs (as creator)
  const { data: creatorTokenIds } = useReadContract({
    address: streamNFTContract?.address,
    abi: streamNFTContract?.abi,
    functionName: "getNFTsByCreator",
    args: address ? [address] : undefined,
  });

  const tokenIds = useMemo(() => (creatorTokenIds as bigint[] | undefined) || [], [creatorTokenIds]);

  const [pricePerHourInputs, setPricePerHourInputs] = useState<Record<string, string>>({});

  const onListFractional = async (tokenId: bigint) => {
    const p = pricePerHourInputs[tokenId.toString()];
    if (!p) {
      notification.error("Enter price per hour");
      return;
    }
    try {
      const wei = parseEther(p);
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

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 max-w-2xl w-full">
        <h1 className="text-center text-4xl font-bold mb-8">Mint Stream NFT</h1>
        
        <div className="bg-base-100 rounded-3xl p-8 shadow-lg">
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text font-semibold">NFT Name *</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter NFT name"
              className="input input-bordered w-full"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text font-semibold">Description</span>
            </label>
            <textarea
              name="description"
              placeholder="Describe your NFT"
              className="textarea textarea-bordered w-full"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text font-semibold">Image URI *</span>
            </label>
            <input
              type="url"
              name="imageURI"
              placeholder="https://... or ipfs://..."
              className="input input-bordered w-full"
              value={formData.imageURI}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text font-semibold">Duration (hours)</span>
            </label>
            <input
              type="number"
              name="duration"
              min="1"
              max="24"
              placeholder="1-24 hours"
              className="input input-bordered w-full"
              value={formData.duration}
              onChange={handleInputChange}
            />
            <label className="label">
              <span className="label-text-alt text-warning">Max 24 hours</span>
            </label>
          </div>

          {formData.imageURI && (
            <div className="mb-4">
              <label className="label">
                <span className="label-text font-semibold">Preview</span>
              </label>
              <div className="flex justify-center">
                <img
                  src={formData.imageURI}
                  alt="NFT Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23ddd'/%3E%3Ctext x='50' y='50' font-size='14' text-anchor='middle' dy='.3em'%3EInvalid Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          )}

          <button className="btn btn-primary w-full" onClick={handleMint} disabled={isPending || isConfirming || !address}>
            {isPending ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Minting...
              </>
            ) : isConfirming ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Confirming...
              </>
            ) : (
              "Mint NFT"
            )}
          </button>

          {!address && <p className="text-center text-sm text-error mt-2">Please connect your wallet to mint</p>}
        </div>

        {/* Your NFTs & fractional listing */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Your Stream NFTs</h2>
          {!address ? (
            <p className="text-sm text-gray-500">Connect wallet to see your NFTs.</p>
          ) : tokenIds.length === 0 ? (
            <p className="text-sm text-gray-500">You haven't minted any NFTs yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {tokenIds.map(tid => (
                <div key={tid.toString()} className="p-4 border rounded-lg flex items-center gap-3">
                  <div className="text-sm">Token #{tid.toString()}</div>
                  <input
                    type="number"
                    min={0}
                    step={0.001}
                    placeholder="Price/hour (KDA)"
                    className="input input-bordered input-sm flex-1"
                    value={pricePerHourInputs[tid.toString()] || ""}
                    onChange={e =>
                      setPricePerHourInputs(prev => ({ ...prev, [tid.toString()]: e.target.value }))
                    }
                  />
                  <button className="btn btn-outline btn-sm" onClick={() => onListFractional(tid)}>
                    List Fractional
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
