import { env } from "@/env";

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

  const response = await fetch(env.API_URL + "/query/search", {
    method: "POST",
    body: JSON.stringify(querySelect),
    headers: {
      "Content-type": "application/json",
      Authorization: `Basic ${btoa(
        `${env.BASIC_AUTH_USERNAME}:${env.BASIC_AUTH_PASSWORD}`
      )}`,
    },
  });

  const json: { result: T[] } = await response.json();

  return json.result;
}

export async function updateAsset<T>({
  assetType,
  data,
}: {
  assetType: string;
  data: T;
}) {
  const body = JSON.stringify({
    update: {
      "@assetType": assetType,
      ...data,
    },
  });

  await fetch(env.API_URL + "/invoke/updateAsset", {
    method: "PUT",
    body,
    headers: {
      Authorization: `Basic ${btoa(
        `${env.BASIC_AUTH_USERNAME}:${env.BASIC_AUTH_PASSWORD}`
      )}`,
    },
  });
}
