"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, X } from "lucide-react";

import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";

import { searchAssets } from "@/services/assets";
import { Asset } from "@/types";
import PlayListItem, { PlayListItemSkeleton } from "./PlayListItem";
import CreateAssetForm from "./CreateAssetForm";
import { Button } from "./ui/button";

export default function SideBar() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["playlists", debouncedSearchQuery],
    queryFn: async () =>
      await searchAssets<Asset>({
        assetType: "playlist",
        customQuery: {
          name: {
            $regex: `.*${debouncedSearchQuery}.*`,
          },
        },
      }),
  });

  function handleClearInput() {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (searchQuery) {
      timeout = setTimeout(() => setDebouncedSearchQuery(searchQuery), 500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  return (
    <aside className="w-64 bg-background flex flex-col gap-2 p-2">
      <div className="flex-1 rounded-lg bg-card p-4">
        <CreateAssetForm assetType="playlist">
          <Button className="w-full mb-4 font-semibold flex items-center gap-2">
            <Plus />
            New playlist
          </Button>
        </CreateAssetForm>
        <div className="relative max-w-md mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            disabled={isLoading}
            placeholder={"Search playlists"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={handleClearInput}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <ScrollArea className="h-[calc(100vh-280px)] px-4">
          <div className="space-y-2">
            {isLoading
              ? Array.from({ length: 5 }, (_, index) => (
                  <PlayListItemSkeleton key={index} />
                ))
              : data?.map((playlist) => (
                  <PlayListItem key={playlist["@key"]} asset={playlist} />
                ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
