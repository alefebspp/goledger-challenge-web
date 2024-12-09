import { ReactNode } from "react";
import Link from "next/link";
import { Disc3, ListMusic, MicVocal, Play } from "lucide-react";

import { Asset } from "@/types";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

type Props = {
  asset: Asset;
  assetType: string;
};

export function AssetCardSkeleton({ assetType }: Pick<Props, "assetType">) {
  return (
    <div className="group space-y-4 p-4">
      <div className="relative aspect-square overflow-hidden">
        <Skeleton
          className={cn("rounded-md w-full h-4/5", {
            "rounded-full h-full": assetType === "artist",
          })}
        />
      </div>
      <div
        className={cn("w-full flex flex-col justify-start gap-4", {
          "justify-center items-center": assetType === "artist",
        })}
      >
        <Skeleton className="w-2/5 h-6" />
        <Skeleton className="w-1/5 h-4" />
      </div>
    </div>
  );
}

export default function AssetCard({ asset, assetType }: Props) {
  const iconClassName =
    "w-14 h-14 text-accent/50 group-hover:text-white transition-all duration-300";

  const assetIconMap: { [key: string]: ReactNode } = {
    artist: (
      <MicVocal className={cn(iconClassName, "group-hover:text-lime-500")} />
    ),
    album: <Disc3 className={cn(iconClassName, "group-hover:text-pink-500")} />,
    song: (
      <ListMusic className={cn(iconClassName, "group-hover:text-teal-500")} />
    ),
  };

  return (
    <div className="group space-y-4 hover:bg-accent/50 rounded-md p-4">
      <div className="relative aspect-square overflow-hidden">
        <div
          className={cn(
            "w-full h-4/5 rounded-md bg-accent/40 overflow-hidden flex items-center justify-center",
            {
              "w-full h-full rounded-full": assetType === "artist",
            }
          )}
        >
          {assetIconMap[assetType]}
        </div>
        {assetType !== "song" && (
          <div className="absolute bottom-2 right-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
            <Link
              href={`/${assetType}s/${asset.name}`}
              className={buttonVariants({
                variant: "default",
                size: "icon",
                className:
                  "!rounded-full shadow-xl h-12 w-12 bg-primary hover:bg-primary hover:scale-105 transition-transform",
              })}
            >
              <Play className="h-6 w-6 text-primary-foreground ml-1" />
            </Link>
          </div>
        )}
      </div>
      <div
        className={cn("text-center space-y-1", {
          "text-start": assetType !== "artist",
        })}
      >
        <h3 className="font-semibold truncate">{asset.name}</h3>
      </div>
    </div>
  );
}
