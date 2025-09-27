"use client";

import { useMemo, useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { parseEther } from "viem";

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

function NFTCard({ tokenId, onListFractional, isPending }: { tokenId: bigint; onListFractional: (tokenId: bigint) => void; isPending: boolean }) {
  const { data: streamNFTContract } = useScaffoldContract({ contractName: "StreamNFT" });
  const { data: marketplaceContract } = useScaffoldContract({ contractName: "Marketplace" });

  const { data: nftInfo } = useReadContract({
    address: streamNFTContract?.address,
    abi: streamNFTContract?.abi,
    functionName: "getNFTInfo",
    args: [tokenId],
  });

  const { data: fractionalView } = useReadContract({
    address: marketplaceContract?.address,
    abi: marketplaceContract?.abi,
    functionName: "getFractionalView",
    args: [tokenId],
  });

  const info = nftInfo as NFTInfo | undefined;
  const isListed = fractionalView ? (fractionalView as any)[0] === true : false;

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

  if (!info) return null;

  return (
    <div className="card bg-base-100 shadow-xl">
      <figure className="aspect-square">
        <img
          src={info.imageURI}
          alt={info.name}
          className="w-full h-full object-cover"
          onError={e => {
            (e.currentTarget as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ccircle cx='200' cy='160' r='32' fill='%23d1d5db'/%3E%3Cpath d='M120 280h160l-32-64-32 48-32-24z' fill='%23d1d5db'/%3E%3Ctext x='200' y='320' font-size='14' text-anchor='middle' fill='%23666'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />
        <div className="absolute top-3 right-3">
          {info.isExpired ? (
            <div className="badge badge-error">Expired</div>
          ) : (
            <div className="badge badge-success">Active</div>
          )}
        </div>
        {isListed && (
          <div className="absolute top-3 left-3">
            <div className="badge badge-primary">Listed</div>
          </div>
        )}
      </figure>

      <div className="card-body">
        <h2 className="card-title text-lg">
          {info.name}
        </h2>
        
        <p className="text-sm text-gray-600 line-clamp-2">{info.description}</p>
        
        <div className="text-xs text-gray-500 mt-2 space-y-1">
          <div className="flex justify-between">
            <span>Token ID:</span>
            <span className="font-mono">#{tokenId.toString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Time Left:</span>
            <span className="badge badge-outline badge-sm">
              {formatTimeRemaining(info.remainingHours)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Expires:</span>
            <span>
              {new Date(Number(info.expiration) * 1000).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="card-actions justify-end mt-4">
          {!isListed && !info.isExpired ? (
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => onListFractional(tokenId)}
              disabled={isPending}
            >
              {isPending ? "Listing..." : "List Fractional"}
            </button>
          ) : isListed ? (
            <div className="text-xs text-success">✓ Listed for fractional sale</div>
          ) : (
            <div className="text-xs text-gray-500">Expired</div>
          )}
        </div>
      </div>
    </div>
  );
}

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
      
      // Reset form on successful submission
      setFormData({
        name: "",
        description: "",
        imageURI: "",
        duration: "1",
      });
    } catch (error) {
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

  const onListFractional = async (tokenId: bigint) => {
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

  const isFormValid = formData.name && formData.imageURI && formData.duration;

  return (
    <div className="flex items-center flex-col grow pt-10">
      <div className="px-5 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Create Stream NFT</h1>
          <p className="text-lg text-gray-600">Mint your time-limited NFT and start streaming</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mint Form */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">NFT Details</h2>
              
              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text font-semibold">NFT Name</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="My Awesome Stream"
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
                  placeholder="Tell people what your stream is about..."
                  className="textarea textarea-bordered w-full h-24"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text font-semibold">Image URL</span>
                  <span className="label-text-alt text-error">*</span>
                </label>
                <input
                  type="url"
                  name="imageURI"
                  placeholder="https://example.com/image.jpg"
                  className="input input-bordered w-full"
                  value={formData.imageURI}
                  onChange={handleInputChange}
                />
                <label className="label">
                  <span className="label-text-alt">Supports HTTPS, IPFS, or data URLs</span>
                </label>
              </div>

              <div className="form-control w-full mb-6">
                <label className="label">
                  <span className="label-text font-semibold">Stream Duration</span>
                </label>
                <select
                  name="duration"
                  className="select select-bordered w-full"
                  value={formData.duration}
                  onChange={handleInputChange}
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="6">6 hours</option>
                  <option value="12">12 hours</option>
                  <option value="24">24 hours</option>
                </select>
                <label className="label">
                  <span className="label-text-alt">How long should your stream be available?</span>
                </label>
              </div>

              <button 
                className="btn btn-primary w-full" 
                onClick={handleMint} 
                disabled={isPending || isConfirming || !address || !isFormValid}
              >
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
                  "Mint Stream NFT"
                )}
              </button>

              {!address && (
                <div className="alert alert-warning mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>Please connect your wallet to mint NFTs</span>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Preview</h2>
              
              {formData.imageURI ? (
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={formData.imageURI}
                    alt="NFT Preview"
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23ef4444'/%3E%3Ctext x='200' y='200' font-size='16' text-anchor='middle' fill='white'%3EInvalid Image URL%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Image preview will appear here</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="font-bold text-lg">{formData.name || "NFT Name"}</h3>
                <p className="text-sm text-gray-600">{formData.description || "Description will appear here..."}</p>
                <div className="flex justify-between text-sm">
                  <span>Duration:</span>
                  <span className="badge badge-outline">{formData.duration}h</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your NFTs Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold">Your Stream NFTs</h2>
              <p className="text-gray-600">Manage your created NFTs and list them for fractional sales</p>
            </div>
            {tokenIds.length > 0 && (
              <div className="badge badge-primary badge-lg">{tokenIds.length} NFT{tokenIds.length !== 1 ? 's' : ''}</div>
            )}
          </div>
          
          {!address ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-gray-600">Connect your wallet to see and manage your NFTs</p>
              </div>
            </div>
          ) : tokenIds.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No NFTs Yet</h3>
                <p className="text-gray-600">Create your first Stream NFT using the form above</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tokenIds.map(tokenId => (
                <NFTCard 
                  key={tokenId.toString()} 
                  tokenId={tokenId} 
                  onListFractional={onListFractional}
                  isPending={isPending}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}