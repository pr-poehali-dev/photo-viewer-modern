import { Album, Photo } from "@/types";

// Генерация уникального ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Создание базовых альбомов для демонстрации
export const createInitialAlbums = (): Album[] => {
  return [
    {
      id: generateId(),
      title: "Природа",
      coverUrl: "https://source.unsplash.com/random/300x300/?nature",
      timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
      photoCount: 12
    },
    {
      id: generateId(),
      title: "Путешествия",
      coverUrl: "https://source.unsplash.com/random/300x300/?travel",
      timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
      photoCount: 24
    },
    {
      id: generateId(),
      title: "Архитектура",
      coverUrl: "https://source.unsplash.com/random/300x300/?architecture",
      timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
      photoCount: 9
    }
  ];
};

// Создание фотографий для демонстрации
export const createSamplePhotos = (albumId: string, count: number): Photo[] => {
  const categories = ["nature", "travel", "architecture", "people", "food"];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  return Array.from({ length: count }).map((_, index) => ({
    id: generateId(),
    title: `Фото ${index + 1}`,
    url: `https://source.unsplash.com/random/800x600/?${category}&sig=${index}`,
    albumId,
    timestamp: Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
  }));
};

// Хранение данных в localStorage
export const saveAlbums = (albums: Album[]) => {
  localStorage.setItem("albums", JSON.stringify(albums));
};

export const getAlbums = (): Album[] => {
  const albums = localStorage.getItem("albums");
  if (!albums) {
    const initialAlbums = createInitialAlbums();
    saveAlbums(initialAlbums);
    return initialAlbums;
  }
  return JSON.parse(albums);
};

export const savePhotos = (photos: Photo[]) => {
  localStorage.setItem("photos", JSON.stringify(photos));
};

export const getPhotos = (): Photo[] => {
  const photos = localStorage.getItem("photos");
  if (!photos) {
    const albums = getAlbums();
    const initialPhotos = albums.flatMap(album => 
      createSamplePhotos(album.id, album.photoCount)
    );
    savePhotos(initialPhotos);
    return initialPhotos;
  }
  return JSON.parse(photos);
};

export const getPhotosByAlbumId = (albumId: string): Photo[] => {
  const allPhotos = getPhotos();
  return allPhotos.filter(photo => photo.albumId === albumId);
};

export const addAlbum = (title: string): Album => {
  const albums = getAlbums();
  const newAlbum: Album = {
    id: generateId(),
    title,
    timestamp: Date.now(),
    photoCount: 0
  };
  
  saveAlbums([...albums, newAlbum]);
  return newAlbum;
};

export const deleteAlbum = (albumId: string) => {
  const albums = getAlbums();
  const updatedAlbums = albums.filter(album => album.id !== albumId);
  saveAlbums(updatedAlbums);
  
  // Удаляем все фото в альбоме
  const photos = getPhotos();
  const updatedPhotos = photos.filter(photo => photo.albumId !== albumId);
  savePhotos(updatedPhotos);
};