"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Disc3, ListMusic, X } from "lucide-react";
import { ReactNode, useState } from "react";
import Link from "next/link";

import { Button } from "./ui/button";
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

import { deleteAsset } from "@/services/assets";
import { useToast } from "@/hooks/use-toast";
import { Asset } from "@/types";

type Props = {
  parent?: Asset;
  asset: Asset;
  rootAssetType: string;
  childrenType?: string;
};

export default function AssetChildren({
  parent,
  asset,
  rootAssetType,
  childrenType,
}: Props) {
  const [alertIsOpen, setAlertIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const iconMap: { [key: string]: ReactNode } = {
    song: <ListMusic />,
    album: <Disc3 />,
  };

  const type = asset["@assetType"];
  const canGoToChild = type !== "song";

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteAsset,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: [`${rootAssetType}-${childrenType}`],
      });
    },
  });

  async function handleDelete() {
    const customQuery = {};
    let toastTitle = "Sucess";
    let toastDescription = "Successfully removed resource";
    let toastVariant: "default" | "destructive" | "success" | null | undefined =
      "success";

    if (type === "song") {
      Object.assign(customQuery, {
        album: {
          "@key": parent?.["@key"],
        },
      });
    }

    if (type === "album") {
      Object.assign(customQuery, {
        artist: {
          "@key": parent?.["@key"],
        },
      });
    }

    const response = await mutateAsync({
      assetType: asset["@assetType"],
      name: asset.name,
      customQuery,
    });

    if (response.error) {
      toastTitle = "Error";
      toastDescription = "The delete action could not be done";
      toastVariant = "destructive";
    }

    toast({
      title: toastTitle,
      description: toastDescription,
      variant: toastVariant,
    });

    setAlertIsOpen(false);
  }

  return (
    <li className="list-none flex items-center gap-4 p-2 rounded-md hover:bg-accent/50 group">
      {iconMap[type]}
      <div className="flex-1 min-w-0">
        <Link
          href={canGoToChild ? `/${type}s/${asset.name}` : "#"}
          className="font-medium truncate hover:underline"
        >
          {asset.name}
        </Link>
      </div>
      <AlertDialog open={alertIsOpen} onOpenChange={setAlertIsOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="text-red-700" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this{" "}
              {type}
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
    </li>
  );
}
