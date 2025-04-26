import { useState } from "react";
import { Link } from "react-router-dom";
import { Album } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusIcon, TrashIcon } from "lucide-react";
import { addAlbum, deleteAlbum } from "@/data/mockData";

interface AlbumGridProps {
  albums: Album[];
  onAlbumsChange: () => void;
}

const AlbumGrid = ({ albums, onAlbumsChange }: AlbumGridProps) => {
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateAlbum = () => {
    if (newAlbumTitle.trim()) {
      addAlbum(newAlbumTitle.trim());
      setNewAlbumTitle("");
      setDialogOpen(false);
      onAlbumsChange();
    }
  };

  const handleDeleteAlbum = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm("Вы уверены, что хотите удалить этот альбом?")) {
      deleteAlbum(id);
      onAlbumsChange();
    }
  };

  return (
    <div className="my-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex flex-col items-center justify-center bg-secondary/60 rounded-lg aspect-square hover:bg-secondary transition-colors duration-200">
              <PlusIcon className="h-12 w-12 text-primary" />
              <span className="mt-2 font-medium">Создать альбом</span>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Новый альбом</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Input
                placeholder="Название альбома"
                value={newAlbumTitle}
                onChange={(e) => setNewAlbumTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateAlbum()}
              />
              <Button onClick={handleCreateAlbum} className="w-full">
                Создать
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {albums.map((album) => (
          <Link
            to={`/album/${album.id}`}
            key={album.id}
            className="group relative rounded-lg overflow-hidden bg-secondary/60 aspect-square"
          >
            {album.coverUrl ? (
              <img
                src={album.coverUrl}
                alt={album.title}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <span className="text-2xl">📷</span>
              </div>
            )}
            <div className="absolute inset-0 flex flex-col justify-end p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium truncate">
                  {album.title}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:text-destructive ml-2"
                  onClick={(e) => handleDeleteAlbum(album.id, e)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-white/80">
                {album.photoCount} фото
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AlbumGrid;