import Asset from "@/components/Asset";

interface Props {
  params: {
    name: string;
  };
}

export default function SongPage({ params: { name } }: Props) {
  return <Asset name={decodeURIComponent(name)} assetType="song" />;
}
