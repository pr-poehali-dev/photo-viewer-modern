export interface Photo {
  id: string;
  title: string;
  url: string;
  albumId: string;
  timestamp: number;
}

export interface Album {
  id: string;
  title: string;
  coverUrl?: string;
  timestamp: number;
  photoCount: number;
}

export type ViewMode = "grid" | "masonry" | "list";
