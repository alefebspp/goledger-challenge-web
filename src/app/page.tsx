import { Card, CardContent } from "@/components/ui/card";
import { PlaySquare, Mic2, Disc3, ListMusic } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Welcome</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/playlists">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-accent flex items-center justify-center rounded">
                <PlaySquare className="w-6 h-6" />
              </div>
              <span className="font-semibold">Playlists</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/artists">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-accent flex items-center justify-center rounded">
                <Mic2 className="w-6 h-6" />
              </div>
              <span className="font-semibold">Artists</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/albums">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-accent flex items-center justify-center rounded">
                <Disc3 className="w-6 h-6" />
              </div>
              <span className="font-semibold">Albums</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/songs">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-accent flex items-center justify-center rounded">
                <ListMusic className="w-6 h-6" />
              </div>
              <span className="font-semibold">Songs</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
