"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Stream NFT Marketplace</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-center text-lg mb-8">
            Create, trade, and explore time-limited NFTs on Kadena's EVM network.
            Your NFTs expire after a set duration, making them unique and valuable!
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Link href="/mint" className="btn btn-primary btn-lg">
              🎨 Mint NFT
            </Link>
            <Link href="/marketplace" className="btn btn-secondary btn-lg">
              🏪 Marketplace
            </Link>
          </div>
        </div>

        <div className="grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-8 flex-col md:flex-row">
            <div className="flex flex-col bg-base-100 px-8 py-8 text-center items-center max-w-sm rounded-3xl">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">Create NFTs</h3>
              <p className="text-sm mb-4">
                Mint unique time-limited NFTs with custom metadata and expiration times.
              </p>
              <Link href="/mint" className="btn btn-primary btn-sm">
                Start Minting
              </Link>
            </div>
            
            <div className="flex flex-col bg-base-100 px-8 py-8 text-center items-center max-w-sm rounded-3xl">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-bold mb-2">Trade NFTs</h3>
              <p className="text-sm mb-4">
                Buy and sell NFTs in our decentralized marketplace on Kadena Chain 22.
              </p>
              <Link href="/marketplace" className="btn btn-secondary btn-sm">
                Explore Market
              </Link>
            </div>
            
            <div className="flex flex-col bg-base-100 px-8 py-8 text-center items-center max-w-sm rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2">Debug</h3>
              <p className="text-sm mb-4">
                Interact directly with smart contracts for testing and debugging.
              </p>
              <Link href="/debug" className="btn btn-outline btn-sm">
                Debug Contracts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
