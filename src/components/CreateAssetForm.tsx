"use client";
import { PropsWithChildren, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createAsset, searchAssets } from "@/services/assets";
import { Asset } from "@/types";

type Props = PropsWithChildren & {
  assetType: string;
};

const rootSchema = z.object({
  name: z.string().min(1),
  country: z.string().min(1),
  artist: z.string().min(1),
  album: z.string().min(1),
  year: z.string().min(1),
});

const defaultValues = {
  name: "",
  country: "",
  artist: "",
  album: "",
  year: "",
};

export default function CreateAssetForm({ assetType, children }: Props) {
  const [assetParentType, _] = useState(getAssetParentType());
  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof rootSchema>>({
    resolver: zodResolver(getFormSchema()),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${assetType}s`] });
      return queryClient.invalidateQueries({ queryKey: [assetType] });
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: [`${assetParentType}s`],
    queryFn: async () =>
      await searchAssets<Asset>({ assetType: assetParentType || "" }),
    enabled: !!assetParentType,
  });

  function getAssetParentType() {
    if (assetType === "song") {
      return "album";
    }
    if (assetType === "album") {
      return "artist";
    }
  }

  function getFormSchema() {
    if (assetType === "song") {
      return rootSchema.omit({ artist: true, country: true, year: true });
    }
    if (assetType === "album") {
      return rootSchema.omit({ album: true, country: true });
    }

    if (assetType === "artist") {
      return rootSchema.omit({ artist: true, album: true, year: true });
    }

    return rootSchema.omit({
      country: true,
      artist: true,
      album: true,
      year: true,
    });
  }

  async function onSubmit(values: z.infer<typeof rootSchema>) {
    let toSaveData = {
      name: values.name,
      ...(values.country ? { country: values.country } : {}),
    };

    if (assetType === "playlist") {
      Object.assign(toSaveData, {
        songs: [],
        private: false,
      });
    }

    if (assetType === "album") {
      Object.assign(toSaveData, {
        artist: {
          "@key": values.artist,
        },
        year: values.year,
      });
    }

    if (assetType === "song") {
      Object.assign(toSaveData, {
        album: {
          "@key": values.album,
        },
      });
    }

    const response = await mutateAsync({ assetType, data: toSaveData });

    if (Array.isArray(response)) {
      toast({
        title: "Success",
        description: `New ${assetType} successfully created`,
        variant: "success",
      });

      form.reset(defaultValues);
      setOpen(false);

      if (assetType !== "playlist") {
        router.push(`/${assetType}s`);
      }
    } else {
      toast({
        title: "Error",
        description: "Unable to create new asset",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New {assetType}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {assetType === "artist" && (
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {assetType === "album" && (
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input min={1} type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {assetParentType && (
              <FormField
                control={form.control}
                name={
                  assetParentType as "name" | "country" | "artist" | "album"
                }
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`${assetParentType
                      .charAt(0)
                      .toUpperCase()}${assetParentType.substring(
                      1
                    )}`}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger disabled={isLoading}>
                          <SelectValue
                            placeholder={`Select a ${assetParentType}`}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data?.map((asset) => (
                          <SelectItem key={asset["@key"]} value={asset["@key"]}>
                            {asset.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}
            <Button disabled={isPending} type="submit">
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
