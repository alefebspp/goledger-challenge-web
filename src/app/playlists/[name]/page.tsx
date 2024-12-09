import Asset from "@/components/Asset";

interface Props {
  params: {
    name: string;
  };
}

export default function PlaylistPage({ params: { name } }: Props) {
  return (
    <Asset
      name={decodeURIComponent(name)}
      assetType="playlist"
      childrenAssetType="song"
    />
  );
}
