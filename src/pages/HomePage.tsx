import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import AlbumGrid from "@/components/AlbumGrid";
import { Album } from "@/types";
import { getAlbums } from "@/data/mockData";

const HomePage = () => {
  const [albums, setAlbums] = useState<Album[]>([]);

  const loadAlbums = () => {
    const fetchedAlbums = getAlbums();
    setAlbums(fetchedAlbums);
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Мои альбомы</h1>
        <AlbumGrid albums={albums} onAlbumsChange={loadAlbums} />
      </main>
    </div>
  );
};

export default HomePage;