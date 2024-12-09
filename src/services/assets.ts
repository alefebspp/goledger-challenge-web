"use client";
import { env } from "@/env/client";
import { Asset } from "@/types";

export async function searchAssets<T>({
  assetType,
  customQuery,
}: {
  assetType: string;
  customQuery?: Record<string, any>;
}) {
  const querySelect = {
    query: {
      selector: {
        "@assetType": assetType,
        ...(customQuery ? customQuery : {}),
      },
    },
  };

  const response = await fetch(env.NEXT_PUBLIC_API_URL + "/query/search", {
    method: "POST",
    body: JSON.stringify(querySelect),
    headers: {
      "Content-type": "application/json",
      Authorization: `Basic ${btoa(
        `${env.NEXT_PUBLIC_BASIC_AUTH_USERNAME}:${env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD}`
      )}`,
    },
  });

  const json: { result: T[] } = await response.json();

  return json.result;
}

export async function createAsset({
  data,
  assetType,
}: {
  data: Record<string, any>;
  assetType: string;
}) {
  const body = JSON.stringify({
    asset: [
      {
        "@assetType": assetType,
        ...data,
      },
    ],
  });

  const response = await fetch(
    env.NEXT_PUBLIC_API_URL + "/invoke/createAsset",
    {
      method: "POST",
      body,
      headers: {
        Authorization: `Basic ${btoa(
          `${env.NEXT_PUBLIC_BASIC_AUTH_USERNAME}:${env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD}`
        )}`,
      },
    }
  );

  const json: Asset[] | { error: string; status: number } =
    await response.json();

  return json;
}

export async function deleteAsset({
  assetType,
  name,
  customQuery,
}: {
  assetType: string;
  name: string;
  customQuery?: Record<string, any>;
}) {
  const body = JSON.stringify({
    key: {
      "@assetType": assetType,
      name,
      ...(customQuery ?? {}),
    },
  });

  const response = await fetch(
    env.NEXT_PUBLIC_API_URL + "/invoke/deleteAsset",
    {
      method: "DELETE",
      body,
      headers: {
        Authorization: `Basic ${btoa(
          `${env.NEXT_PUBLIC_BASIC_AUTH_USERNAME}:${env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD}`
        )}`,
      },
    }
  );

  const data: { error?: string; status?: number } & Asset =
    await response.json();

  return data;
}
