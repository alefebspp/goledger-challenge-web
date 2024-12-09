import Asset from "@/components/Asset";

interface Props {
  params: {
    name: string;
  };
}

export default function AlbumPage({ params: { name } }: Props) {
  return (
    <Asset
      name={decodeURIComponent(name)}
      assetType="album"
      childAssetType="artist"
    />
  );
}
