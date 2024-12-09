"use client";
import { useEffect, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Asset } from "@/types";
import AssetCard, { AssetCardSkeleton } from "./AssetCard";
import { searchAssets } from "@/services/assets";
import CreateAssetForm from "./CreateAssetForm";
import { Button } from "./ui/button";

type Props = {
  assetType: string;
};

export default function AssetsList({ assetType }: Props) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");

  function handleClearInput() {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  }

  const { data, isLoading } = useQuery({
    queryKey: [assetType, debouncedSearchQuery],
    queryFn: async () =>
      searchAssets<Asset>({
        assetType,
        customQuery: {
          name: {
            $regex: `.*${debouncedSearchQuery}.*`,
          },
        },
      }),
  });

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
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Popular {assetType}s</h1>
        <div className="flex gap-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={"Search " + assetType}
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
          <CreateAssetForm assetType={assetType}>
            <Button className="font-semibold">New</Button>
          </CreateAssetForm>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-6">
        {isLoading
          ? Array.from({ length: 21 }, (_, index) => (
              <AssetCardSkeleton assetType={assetType} key={index} />
            ))
          : data?.map((asset) => (
              <AssetCard
                key={asset["@key"]}
                assetType={assetType}
                asset={asset}
              />
            ))}
      </div>
    </div>
  );
}
