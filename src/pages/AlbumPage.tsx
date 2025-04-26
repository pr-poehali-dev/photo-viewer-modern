import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ViewModeSelector from "@/components/ViewModeSelector";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Upload, ImageIcon, Trash2, Pencil } from "lucide-react";
import { Photo, ViewMode, Album } from "@/types";
import { 
  getPhotosByAlbumId, 
  getAlbums, 
  addPhotoToAlbum, 
  deletePhoto, 
  updatePhotoTitle 
} from "@/data/mockData";
import { Input } from "@/components/ui/input";

const AlbumPage = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [album, setAlbum] = useState<Album | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

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

  const handleDeletePhoto = (e: React.MouseEvent, photoId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (albumId && window.confirm("Вы уверены, что хотите удалить эту фотографию?")) {
      deletePhoto(albumId, photoId);
      loadAlbumData();
    }
  };

  const startEditPhotoTitle = (e: React.MouseEvent, photo: Photo) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingPhotoId(photo.id);
    setEditingTitle(photo.title);
  };

  const savePhotoTitle = (e: React.FormEvent) => {
    e.preventDefault();
    if (albumId && editingPhotoId && editingTitle.trim()) {
      updatePhotoTitle(albumId, editingPhotoId, editingTitle.trim());
      setEditingPhotoId(null);
      loadAlbumData();
    }
  };

  const renderPhotoGrid = () => {
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-1">
          {photos.map(photo => (
            <div key={photo.id} className="space-y-1">
              <Link to={`/album/${albumId}/photo/${photo.id}`} className="group">
                <div className="relative aspect-[10/15] rounded-sm overflow-hidden">
                  <img 
                    src={photo.url} 
                    alt={photo.title} 
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end justify-between p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => startEditPhotoTitle(e, photo)}
                      className="bg-white/20 backdrop-blur-sm p-1 rounded hover:bg-white/40 transition-colors"
                    >
                      <Pencil className="h-4 w-4 text-white" />
                    </button>
                    <button 
                      onClick={(e) => handleDeletePhoto(e, photo.id)}
                      className="bg-white/20 backdrop-blur-sm p-1 rounded hover:bg-white/40 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              </Link>
              {editingPhotoId === photo.id ? (
                <form onSubmit={savePhotoTitle} className="flex items-center gap-1">
                  <Input 
                    type="text" 
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="h-7 text-xs"
                    autoFocus
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="h-7 px-2 text-xs"
                  >
                    OK
                  </Button>
                </form>
              ) : (
                <p className="text-xs truncate px-1">{photo.title}</p>
              )}
            </div>
          ))}
        </div>
      );
    } else if (viewMode === "masonry") {
      return (
        <div className="columns-2 sm:columns-3 md:columns-3 lg:columns-5 gap-1 space-y-1">
          {photos.map(photo => (
            <div key={photo.id} className="mb-1 break-inside-avoid">
              <Link to={`/album/${albumId}/photo/${photo.id}`} className="group block">
                <div className="relative overflow-hidden rounded-sm">
                  <img 
                    src={photo.url} 
                    alt={photo.title} 
                    className="w-full h-auto transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end justify-between p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => startEditPhotoTitle(e, photo)}
                      className="bg-white/20 backdrop-blur-sm p-1 rounded hover:bg-white/40 transition-colors"
                    >
                      <Pencil className="h-4 w-4 text-white" />
                    </button>
                    <button 
                      onClick={(e) => handleDeletePhoto(e, photo.id)}
                      className="bg-white/20 backdrop-blur-sm p-1 rounded hover:bg-white/40 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              </Link>
              {editingPhotoId === photo.id ? (
                <form onSubmit={savePhotoTitle} className="flex items-center gap-1 mt-1">
                  <Input 
                    type="text" 
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="h-7 text-xs"
                    autoFocus
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="h-7 px-2 text-xs"
                  >
                    OK
                  </Button>
                </form>
              ) : (
                <p className="text-xs truncate px-1 mt-1">{photo.title}</p>
              )}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col space-y-1">
          {photos.map(photo => (
            <div key={photo.id}>
              <Link to={`/album/${albumId}/photo/${photo.id}`} className="group">
                <div className="flex items-center p-2 rounded-md hover:bg-secondary/60">
                  <div className="w-16 h-16 rounded overflow-hidden mr-3">
                    <img 
                      src={photo.url} 
                      alt={photo.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    {editingPhotoId === photo.id ? (
                      <form onSubmit={savePhotoTitle} className="flex items-center gap-1">
                        <Input 
                          type="text" 
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="h-7 text-xs"
                          autoFocus
                        />
                        <Button 
                          type="submit" 
                          size="sm" 
                          className="h-7 px-2 text-xs"
                        >
                          OK
                        </Button>
                      </form>
                    ) : (
                      <h3 className="font-medium">{photo.title}</h3>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {new Date(photo.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={(e) => startEditPhotoTitle(e, photo)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:text-destructive" 
                      onClick={(e) => handleDeletePhoto(e, photo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      );
    }
  };

  if (!album) return <div>Загрузка...</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container px-2 py-4">
        <div className="mb-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-2">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Назад к альбомам
          </Button>
          <h1 className="text-2xl font-bold">{album.title}</h1>
          <p className="text-muted-foreground">
            {photos.length} фото
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
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