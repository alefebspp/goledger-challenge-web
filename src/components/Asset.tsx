"use client";
import Link from "next/link";
import { useState } from "react";
import { Music2, Search, X, ListMusic, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Asset as AssetType } from "@/types";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAsset, searchAssets } from "@/services/assets";
import { Skeleton } from "./ui/skeleton";
import AssetChildren from "./AssetChildren";
import { useToast } from "@/hooks/use-toast";

type Props = {
  name: string;
  assetType: string;
  childrenAssetType?: string;
  childAssetType?: string;
};

const searchResults = [
  {
    id: 1,
    title: "Deus, Fala Comigo",
    artist: "Marcelo Nascimento",
    album: "Deus, Fala Comigo",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    title: "Deus Fala Com Você",
    artist: "Prª. Camila Barros",
    album: "Pastores Pregando",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    title: "Conversando Com Deus",
    artist: "Maurizélia",
    album: "Conversando Com Deus",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    title:
      "UMA PALAVRA DE DEUS PARA VOCÊ HOJE! (DEUS VAI SUPERAR SUAS EXPECTATIVAS)",
    artist: "Pastor Antonio Junior",
    album: "Mensagens",
    image: "/placeholder.svg?height=40&width=40",
  },
];

export default function Asset({
  name,
  assetType,
  childAssetType,
  childrenAssetType,
}: Props) {
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const [childrenType, setChildrenType] = useState(childrenAssetType);
  const [customQuery, setCustomQuery] = useState<
    Record<string, any> | undefined
  >();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: [`${assetType}s`],
      });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: [assetType],
    queryFn: async () => {
      const response = await searchAssets<AssetType>({
        assetType,
        customQuery: {
          name,
        },
      });

      const data = response[0];

      if (assetType === "album") {
        setCustomQuery({
          album: {
            "@key": data["@key"],
          },
        });
        setChildrenType("song");
      }
      if (assetType === "artist") {
        setCustomQuery({
          artist: {
            "@key": data["@key"],
          },
        });
        setChildrenType("album");
      }

      return data;
    },
  });

  const { data: child, isLoading: loadingChild } = useQuery({
    queryKey: [`${assetType}-${childAssetType}`],
    queryFn: async () => {
      if (childAssetType && !!data) {
        let $in: string[] | undefined = [];

        if (childAssetType === "artist") {
          $in = [data.artist?.["@key"] || ""];
        }

        const response = await searchAssets<AssetType>({
          assetType: childAssetType,
          customQuery: {
            "@key": {
              $in,
            },
          },
        });

        return response[0];
      }
    },
    enabled: !!childAssetType && !!data,
  });

  const { data: children, isLoading: loadingChildren } = useQuery({
    queryKey: [`${assetType}-${childrenType}`, childrenType, customQuery],
    queryFn: async () => {
      if (childrenType && !!data) {
        let $in: string[] | undefined = [];

        if (childrenType === "song") {
          $in = data.songs?.map((key) => key["@key"]);
        }

        const response = await searchAssets<AssetType>({
          assetType: childrenType,
          customQuery: customQuery ?? {
            "@key": {
              $in,
            },
          },
        });
        return response;
      }
    },
    enabled: (!!childrenType || !!customQuery) && !!data,
  });

  const canShowChildren = children && children.length > 0;

  function onDelete(error?: boolean) {
    const customQuery = {};

    let toastTitle = "Sucess";
    let toastDescription = "Successfully removed resource";
    let toastVariant: "default" | "destructive" | "success" | null | undefined =
      "success";

    if (error) {
      toastTitle = "Error";
      toastDescription = "The delete action could not be done";
      toastVariant = "destructive";
    }

    toast({
      title: toastTitle,
      description: toastDescription,
      variant: toastVariant,
    });
  }

  function handleDelete() {}

  function transformToUppercase(text: string) {
    return `${text.charAt(0).toUpperCase()}${text.substring(1)}`;
  }

  return (
    <div className="-mx-6 -mt-6">
      <div className="bg-gradient-to-b from-accent/20 to-background p-6">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-48 h-48 bg-accent/50 flex items-center justify-center rounded-md shadow-lg">
            <Music2 className="w-24 h-24 text-foreground/60" />
          </div>
          <div className="flex flex-col justify-end h-48 w-full">
            <div className="text-sm mb-2">
              {transformToUppercase(assetType)}
            </div>
            {isLoading ? (
              <Skeleton className="w-2/5 h-14 mb-6" />
            ) : (
              <h1 className="text-6xl font-bold mb-6">{data?.name}</h1>
            )}
            {loadingChild && <Skeleton className="w-1/5 h-8" />}
            {child && (
              <h2 className="font-semibold text-lg">
                {transformToUppercase(childAssetType || "")}:{" "}
                <Link
                  href={`/${childAssetType}s/${child.name}`}
                  className="font-normal hover:underline"
                >
                  {child.name}
                </Link>
              </h2>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <AlertDialog open={alertIsOpen} onOpenChange={setAlertIsOpen}>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                className="rounded-full h-14 w-14  [&_svg]:size-6"
              >
                <Trash2 className="text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this {assetType}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button disabled={isPending} onClick={handleDelete}>
                  Continue
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="p-6">
        {loadingChildren &&
          Array.from({ length: 5 }, (_, index) => (
            <Skeleton className="w-full h-12 mb-2" key={index} />
          ))}
        {canShowChildren && (
          <ul className="space-y-2 mb-4 list-none">
            {children?.map((asset) => (
              <AssetChildren
                parent={data}
                key={asset["@key"]}
                asset={asset}
                rootAssetType={assetType}
                childrenType={childrenType}
              />
            ))}
          </ul>
        )}

        {assetType === "playlist" && (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Let's find something for your {assetType}
            </h2>
            <div className="relative max-w-md mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for songs"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearching(e.target.value.length > 0);
                }}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearching(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </>
        )}

        {isSearching && (
          <div className="space-y-2">
            {searchResults.map((song) => (
              <div
                key={song.id}
                className="flex items-center gap-4 p-2 rounded-md hover:bg-accent/50 group"
              >
                <ListMusic />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{song.title}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {song.artist} • {song.album}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Add
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
