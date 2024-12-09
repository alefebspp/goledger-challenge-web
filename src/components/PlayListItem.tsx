"use client";
import Link from "next/link";
import { Asset } from "@/types";
import { Music2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

type Props = {
  asset: Asset;
};

export function PlayListItemSkeleton() {
  return (
    <div className="max-w-64 flex items-center gap-3 p-2 rounded-md">
      <Skeleton className="w-12 h-12" />
      <Skeleton className="w-32 h-6" />
    </div>
  );
}

export default function PlayListItem({ asset }: Props) {
  return (
    <Link
      key={asset["@key"]}
      href={`/playlists/${asset.name}`}
      className="max-w-64 flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 transition-colors group"
    >
      <div className="w-12 h-12 bg-accent/50 flex items-center justify-center rounded">
        <Music2 className="w-6 h-6 text-foreground" />
      </div>
      <div className="min-w-0">
        <div className="font-medium truncate">{asset.name}</div>
      </div>
    </Link>
  );
}
