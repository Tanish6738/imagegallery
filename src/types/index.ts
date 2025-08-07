export interface FileItem {
  id: string;
  file: File;
  url: string;
  name: string;
  type: string;
  size: number;
  lastModified: number;
}

export interface DraggedItem {
  index: number;
  item: FileItem;
}

export interface ViewerState {
  isOpen: boolean;
  currentIndex: number;
  scale: number;
  position: { x: number; y: number };
  isDragging: boolean;
}
