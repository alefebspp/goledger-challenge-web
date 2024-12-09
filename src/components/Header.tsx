"use client";
import { Disc3, Home, ListMusic, Mic2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SearchInput } from "./SearchInput";

import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 flex items-center justify-between px-4 py-2">
      <div className="flex gap-4">
        <Link
          href="/"
          className=" p-3 text-accent rounded-md hover:bg-accent hover:text-white transition-all duration-300"
        >
          <Home
            className={cn("w-6 h-6", {
              "text-white": pathname === "/",
            })}
          />
        </Link>
        <Link
          href="/songs"
          className=" p-3 text-accent rounded-md hover:bg-accent hover:text-teal-500 transition-all duration-300"
        >
          <ListMusic
            className={cn("w-6 h-6", {
              "text-teal-500": pathname.includes("songs"),
            })}
          />
        </Link>
        <Link
          href="/albums"
          className=" p-3 text-accent rounded-md hover:bg-accent hover:text-pink-500 transition-all duration-300"
        >
          <Disc3
            className={cn("w-6 h-6", {
              "text-pink-500": pathname.includes("albums"),
            })}
          />
        </Link>
        <Link
          href="/artists"
          className=" p-3 text-accent rounded-md hover:bg-accent hover:text-lime-500 transition-all duration-300"
        >
          <Mic2
            className={cn("w-6 h-6", {
              "text-lime-500": pathname.includes("/artists"),
            })}
          />
        </Link>
      </div>
      <SearchInput />
    </header>
  );
}
