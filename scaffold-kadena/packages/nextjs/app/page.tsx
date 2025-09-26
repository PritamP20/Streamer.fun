"use client";

import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import type { NextPage } from 'next';
import { useAccount } from 'wagmi';
import { BugAntIcon } from '@heroicons/react/24/outline';
import { Address } from '~~/components/scaffold-eth';

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <Head>
        <title>stream.fun - Punk Token Streaming</title>
        <meta name="description" content="Buy tokens, vibe with streamers, and join the punk revolution on stream.fun!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="relative border-b-8 border-neon-purple bg-[url('/noise.png')] bg-repeat flex items-center flex-col pt-10">
        <div className="container mx-auto px-5">
          <h1 className="text-center">
            <span className="block text-3xl md:text-4xl mb-2 uppercase tracking-tighter">Welcome to</span>
            <span className="block text-5xl md:text-7xl font-extrabold uppercase">
              stream<span className="text-neon-purple">.</span>fun
            </span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col mt-4">
            <p className="my-2 font-medium text-lg">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>
          <p className="text-center text-lg md:text-xl mt-6 max-w-2xl mx-auto">
            Buy tokens on Kadena's EVM network to interact with streamers. Send messages, unlock exclusive content, and join the punk revolution!
          </p>
          <div className="flex justify-center gap-4 mt-8 mb-8">
            <Link
              href="/buy-tokens"
              className="bg-neon-purple text-black font-bold py-3 px-6 border-4 border-white hover:bg-white hover:text-neon-purple transition-colors uppercase"
            >
              🤑 Buy Tokens
            </Link>
            <Link
              href="/streamers"
              className="bg-black text-neon-purple font-bold py-3 px-6 border-4 border-neon-purple hover:bg-neon-purple hover:text-black transition-colors uppercase"
            >
              🎥 Find Streamers
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-900 w-full mt-16 px-8 py-12">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase border-b-4 border-neon-purple inline-block mb-8">
            Why stream.fun?
          </h2>
          <div className="flex justify-center items-center gap-8 flex-col md:flex-row">
            <div className="flex flex-col bg-black px-8 py-8 text-center items-center max-w-sm border-4 border-white">
              <div className="text-6xl mb-4">🤑</div>
              <h3 className="text-xl font-bold mb-2 text-neon-purple">Buy Tokens</h3>
              <p className="text-sm mb-4">
                Grab tokens on Kadena Chain 22 to unlock exclusive streamer interactions.
              </p>
              <Link
                href="/buy-tokens"
                className="bg-neon-purple text-black font-bold py-2 px-4 border-2 border-white hover:bg-white hover:text-neon-purple transition-colors"
              >
                Get Tokens
              </Link>
            </div>
            <div className="flex flex-col bg-black px-8 py-8 text-center items-center max-w-sm border-4 border-white">
              <div className="text-6xl mb-4">🎥</div>
              <h3 className="text-xl font-bold mb-2 text-neon-purple">Interact with Streamers</h3>
              <p className="text-sm mb-4">
                Use tokens to send messages, get shoutouts, or unlock premium content.
              </p>
              <Link
                href="/streamers"
                className="bg-black text-neon-purple font-bold py-2 px-4 border-2 border-neon-purple hover:bg-neon-purple hover:text-black transition-colors"
              >
                Find Streamers
              </Link>
            </div>
            <div className="flex flex-col bg-black px-8 py-8 text-center items-center max-w-sm border-4 border-white">
              <BugAntIcon className="h-8 w-8 fill-neon-purple mb-4" />
              <h3 className="text-xl font-bold mb-2 text-neon-purple">Debug</h3>
              <p className="text-sm mb-4">
                Interact with smart contracts for testing and debugging on Kadena.
              </p>
              <Link
                href="/debug"
                className="bg-black text-white font-bold py-2 px-4 border-2 border-white hover:bg-neon-purple hover:text-black transition-colors"
              >
                Debug Contracts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Token Packages Section */}
      <section className="bg-neon-purple text-black py-16">
        <div className="container mx-auto px-5">
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase border-b-4 border-black inline-block mb-8">
            Grab Your Tokens
          </h2>
          <p className="text-lg md:text-xl mt-6 max-w-3xl">
            Power up your streaming experience with tokens. More tokens, more chaos!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="p-6 border-4 border-black bg-white">
              <h3 className="text-2xl font-bold">Starter Pack</h3>
              <p className="text-3xl font-extrabold mt-2">100 Tokens</p>
              <p className="mt-2">Jump into the punk scene with enough tokens to get noticed.</p>
              <Link
                href="/buy-tokens"
                className="inline-block mt-4 bg-black text-neon-purple font-bold py-2 px-4 border-2 border-black hover:bg-white hover:text-neon-purple transition-colors"
              >
                Buy Now
              </Link>
            </div>
            <div className="p-6 border-4 border-black bg-white">
              <h3 className="text-2xl font-bold">Pro Pack</h3>
              <p className="text-3xl font-extrabold mt-2">500 Tokens</p>
              <p className="mt-2">Dominate the stream with a massive token stash.</p>
              <Link
                href="/buy-tokens"
                className="inline-block mt-4 bg-black text-neon-purple font-bold py-2 px-4 border-2 border-black hover:bg-white hover:text-neon-purple transition-colors"
              >
                Buy Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t-4 border-neon-purple py-8">
        <div className="container mx-auto px-5 text-center">
          <p className="text-lg">
            &copy; 2025 stream.fun. Built with punk attitude on Kadena.
          </p>
          <div className="mt-4 space-x-4">
            <Link href="/terms" className="hover:text-neon-purple">Terms</Link>
            <Link href="/privacy" className="hover:text-neon-purple">Privacy</Link>
            <Link href="/contact" className="hover:text-neon-purple">Contact</Link>
          </div>
        </div>
      </footer>

      {/* Tailwind Custom Colors */}
      <style jsx global>{`
        :root {
          --neon-purple: #C71585;
        }
        [data-theme='dark'] {
          --neon-purple: #C71585;
        }
        [data-theme='light'] {
          --neon-purple: #C71585;
        }
      `}</style>
    </div>
  );
};

export default Home;