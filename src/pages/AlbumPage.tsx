import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ViewModeSelector from "@/components/ViewModeSelector";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Upload, ImageIcon } from "lucide-react";
import { Photo, ViewMode, Album } from "@/types";
import { getPhotosByAlbumId, getAlbums, addPhotoToAlbum } from "@/data/mockData";

const AlbumPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [album, setAlbum] = useState<Album | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (albumId) {
      loadAlbumData();
    }
  }, [albumId]);

  const loadAlbumData = () => {
    if (!albumId) return;
    
    const albumPhotos = getPhotosByAlbumId(albumId);
    setPhotos(albumPhotos);
    
    const albums = getAlbums();
    const currentAlbum = albums.find(a => a.id === albumId) || null;
    setAlbum(currentAlbum);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!albumId || !event.target.files?.length) return;
    
    setIsUploading(true);
    const files = Array.from(event.target.files);
    const promises = files.map(file => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result && typeof e.target.result === "string") {
            addPhotoToAlbum(albumId, {
              title: file.name.split('.')[0] || "Фото без названия",
              url: e.target.result
            });
            resolve();
          }
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then(() => {
      setIsUploading(false);
      loadAlbumData();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    });
  };

  const uploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const renderPhotoGrid = () => {
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {photos.map(photo => (
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
          {photos.map(photo => (
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
          {photos.map(photo => (
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
          <div className="flex gap-2">
            <Button onClick={uploadButtonClick} disabled={isUploading}>
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Загрузка..." : "Загрузить фото"}
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              multiple 
              onChange={handleFileUpload} 
            />
          </div>
          <ViewModeSelector currentMode={viewMode} onChange={setViewMode} />
        </div>
        
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">В этом альбоме пока нет фотографий</p>
            <Button onClick={uploadButtonClick}>
              <Upload className="h-4 w-4 mr-2" />
              Загрузить фото
            </Button>
          </div>
        ) : (
          renderPhotoGrid()
        )}
      </main>
    </div>
  );
};

export default AlbumPage;