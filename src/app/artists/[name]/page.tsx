import Asset from "@/components/Asset";

interface Props {
  params: {
    name: string;
  };
}

export default async function ArtistPage({ params: { name } }: Props) {
  return (
    <Asset
      name={decodeURIComponent(name)}
      assetType="artist"
      childrenAssetType="album"
    />
  );
}
