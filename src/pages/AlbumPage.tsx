import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ViewModeSelector from "@/components/ViewModeSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, SearchIcon } from "lucide-react";
import { Photo, ViewMode, Album } from "@/types";
import { getPhotosByAlbumId, getAlbums } from "@/data/mockData";

const AlbumPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [album, setAlbum] = useState<Album | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (albumId) {
      const albumPhotos = getPhotosByAlbumId(albumId);
      setPhotos(albumPhotos);
      
      const albums = getAlbums();
      const currentAlbum = albums.find(a => a.id === albumId) || null;
      setAlbum(currentAlbum);
    }
  }, [albumId]);

  const filteredPhotos = photos.filter(photo => 
    photo.title.toLowerCase().includes(search.toLowerCase())
  );

  const renderPhotoGrid = () => {
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {filteredPhotos.map(photo => (
            <Link to={`/album/${albumId}/photo/${photo.id}`} key={photo.id} className="group">
              <div className="relative aspect-square rounded-sm overflow-hidden">
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="p-2 w-full">
                    <h3 className="text-white text-sm truncate">{photo.title}</h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
    } else if (viewMode === "masonry") {
      return (
        <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 space-y-2">
          {filteredPhotos.map(photo => (
            <Link to={`/album/${albumId}/photo/${photo.id}`} key={photo.id} className="block group">
              <div className="relative overflow-hidden rounded-sm break-inside-avoid">
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-auto transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="p-2 w-full">
                    <h3 className="text-white text-sm truncate">{photo.title}</h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col space-y-2">
          {filteredPhotos.map(photo => (
            <Link to={`/album/${albumId}/photo/${photo.id}`} key={photo.id} className="group">
              <div className="flex items-center p-2 rounded-md hover:bg-secondary/60">
                <div className="w-16 h-16 rounded overflow-hidden mr-3">
                  <img 
                    src={photo.url} 
                    alt={photo.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{photo.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(photo.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
    }
  };

  if (!album) return <div>Загрузка...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container px-4 py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Назад к альбомам
          </Button>
          <h1 className="text-2xl font-bold">{album.title}</h1>
          <p className="text-muted-foreground">
            {photos.length} фото
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск фотографий..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ViewModeSelector currentMode={viewMode} onChange={setViewMode} />
        </div>
        
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">В этом альбоме пока нет фотографий</p>
          </div>
        ) : (
          renderPhotoGrid()
        )}
      </main>
    </div>
  );
};

export default AlbumPage;