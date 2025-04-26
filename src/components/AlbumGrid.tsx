import { useState } from "react";
import { Link } from "react-router-dom";
import { Album } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlusIcon, TrashIcon, EditIcon } from "lucide-react";
import { addAlbum, deleteAlbum, updateAlbumTitle } from "@/data/mockData";

interface AlbumGridProps {
  albums: Album[];
  onAlbumsChange: () => void;
}

const AlbumGrid = ({ albums, onAlbumsChange }: AlbumGridProps) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [editAlbumTitle, setEditAlbumTitle] = useState("");

  const handleCreateAlbum = () => {
    addAlbum();
    onAlbumsChange();
  };

  const handleDeleteAlbum = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm("Вы уверены, что хотите удалить этот альбом?")) {
      deleteAlbum(id);
      onAlbumsChange();
    }
  };

  const handleEditAlbum = (album: Album, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentAlbum(album);
    setEditAlbumTitle(album.title);
    setEditDialogOpen(true);
  };

  const saveAlbumTitle = () => {
    if (currentAlbum && editAlbumTitle.trim()) {
      updateAlbumTitle(currentAlbum.id, editAlbumTitle.trim());
      setEditDialogOpen(false);
      onAlbumsChange();
    }
  };

  return (
    <div className="my-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        <button 
          onClick={handleCreateAlbum}
          className="flex flex-col items-center justify-center bg-secondary/60 rounded-lg aspect-square hover:bg-secondary transition-colors duration-200"
        >
          <PlusIcon className="h-10 w-10 text-primary" />
          <span className="mt-2 font-medium text-sm">Создать альбом</span>
        </button>
        
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать название альбома</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Input
                placeholder="Название альбома"
                value={editAlbumTitle}
                onChange={(e) => setEditAlbumTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveAlbumTitle()}
              />
              <Button onClick={saveAlbumTitle} className="w-full">
                Сохранить
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
                <div className="flex">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:text-primary ml-1"
                    onClick={(e) => handleEditAlbum(album, e)}
                  >
                    <EditIcon className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:text-destructive ml-1"
                    onClick={(e) => handleDeleteAlbum(album.id, e)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
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