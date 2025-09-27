"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hardhat } from "viem/chains";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Go Live",
    href: "/stream",
    icon: <span className="text-sm">📺</span>,
  },
  {
    label: "Buy Tokens",
    href: "/buy-tokens",
    icon: <span className="text-sm">🤑</span>,
  },
  {
    label: "Streamers",
    href: "/streamers",
    icon: <span className="text-sm">🎥</span>,
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-neon-purple text-black border-2 border-white" : "bg-black text-white border-2 border-neon-purple"
              } hover:bg-neon-purple hover:text-white focus:bg-neon-purple focus:text-white active:bg-neon-purple active:text-white py-2 px-4 text-sm uppercase font-bold rounded-none gap-2 grid grid-flow-col transition-colors`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <div className="sticky top-0 bg-black text-white font-mono border-b-4 border-neon-purple z-20 px-0 sm:px-2">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="flex items-center gap-2">
          <Link href="/" passHref className="flex items-center gap-2 ml-4 shrink-0">
            <div className="flex relative w-10 h-10">
              <Image alt="stream.fun logo" className="cursor-pointer" fill src="/logo.svg" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold leading-tight uppercase text-2xl">
                stream<span className="text-neon-purple">.</span>fun
              </span>
              <span className="text-xs uppercase">Punk Token Streaming</span>
            </div>
          </Link>
          <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
            <HeaderMenuLinks />
          </ul>
        </div>
        <div className="flex items-center gap-4 mr-4">
          <RainbowKitCustomConnectButton />
          {isLocalNetwork && <FaucetButton />}
          <details className="dropdown lg:hidden" ref={burgerMenuRef}>
            <summary className="btn btn-ghost hover:bg-neon-purple hover:text-white p-2">
              <Bars3Icon className="h-6 w-6" />
            </summary>
            <ul
              className="menu dropdown-content mt-3 p-2 bg-black border-2 border-neon-purple w-52 rounded-none"
              onClick={() => {
                burgerMenuRef?.current?.removeAttribute("open");
              }}
            >
              <HeaderMenuLinks />
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
};