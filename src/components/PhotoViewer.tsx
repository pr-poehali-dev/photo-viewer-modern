import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Photo } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getPhotosByAlbumId } from "@/data/mockData";

const PhotoViewer = () => {
  const { albumId, photoId } = useParams<{ albumId: string; photoId: string }>();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (albumId) {
      const albumPhotos = getPhotosByAlbumId(albumId);
      setPhotos(albumPhotos);
      if (photoId) {
        const index = albumPhotos.findIndex(photo => photo.id === photoId);
        if (index !== -1) {
          setCurrentIndex(index);
        }
      }
    }
  }, [albumId, photoId]);

  const handleClose = () => {
    navigate(`/album/${albumId}`);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      navigate(`/album/${albumId}/photo/${photos[prevIndex].id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      navigate(`/album/${albumId}/photo/${photos[nextIndex].id}`);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, photos]);

  if (photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];
  if (!currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-border/40">
        <h2 className="text-lg font-medium">{currentPhoto.title}</h2>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <img 
          src={currentPhoto.url} 
          alt={currentPhoto.title} 
          className="max-h-[calc(100vh-116px)] max-w-full object-contain"
        />

        {currentIndex > 0 && (
          <Button 
            className="absolute left-4 bg-black/30 hover:bg-black/50"
            size="icon" 
            onClick={handlePrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}
        
        {currentIndex < photos.length - 1 && (
          <Button 
            className="absolute right-4 bg-black/30 hover:bg-black/50"
            size="icon" 
            onClick={handleNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}
      </div>
      
      <div className="p-4 border-t border-border/40">
        <div className="text-sm text-center">
          {currentIndex + 1} из {photos.length}
        </div>
      </div>
    </div>
  );
};

export default PhotoViewer;