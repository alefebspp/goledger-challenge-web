import "./globals.css";
import Providers from "@/providers";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Spotify-like",
  description: "CRUD operations for artists, albums, songs, and playlists",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-foreground">
        <Providers>
          <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden">
              <SideBar />
              <main className="flex-1 overflow-auto bg-gradient-to-b from-accent/10 via-background to-background p-6">
                {children}
              </main>
            </div>
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
