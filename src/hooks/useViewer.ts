import { useState, useCallback, useEffect } from 'react';
import { ViewerState, FileItem } from '@/types';

export const useViewer = (files: FileItem[]) => {
  const [viewerState, setViewerState] = useState<ViewerState>({
    isOpen: false,
    currentIndex: 0,
    scale: 1,
    position: { x: 0, y: 0 },
    isDragging: false,
  });

  const openViewer = useCallback((index: number) => {
    setViewerState(prev => ({
      ...prev,
      isOpen: true,
      currentIndex: index,
      scale: 1,
      position: { x: 0, y: 0 },
    }));
  }, []);

  const closeViewer = useCallback(() => {
    setViewerState(prev => ({
      ...prev,
      isOpen: false,
      scale: 1,
      position: { x: 0, y: 0 },
    }));
  }, []);

  const nextFile = useCallback(() => {
    if (files.length === 0) return;
    setViewerState(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % files.length,
      scale: 1,
      position: { x: 0, y: 0 },
    }));
  }, [files.length]);

  const prevFile = useCallback(() => {
    if (files.length === 0) return;
    setViewerState(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? files.length - 1 : prev.currentIndex - 1,
      scale: 1,
      position: { x: 0, y: 0 },
    }));
  }, [files.length]);

  const zoomIn = useCallback(() => {
    setViewerState(prev => ({
      ...prev,
      scale: Math.min(prev.scale * 1.5, 5),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setViewerState(prev => ({
      ...prev,
      scale: Math.max(prev.scale / 1.5, 0.5),
    }));
  }, []);

  const resetZoom = useCallback(() => {
    setViewerState(prev => ({
      ...prev,
      scale: 1,
      position: { x: 0, y: 0 },
    }));
  }, []);

  const updatePosition = useCallback((deltaX: number, deltaY: number) => {
    setViewerState(prev => ({
      ...prev,
      position: {
        x: prev.position.x + deltaX,
        y: prev.position.y + deltaY,
      },
    }));
  }, []);

  const setDragging = useCallback((isDragging: boolean) => {
    setViewerState(prev => ({
      ...prev,
      isDragging,
    }));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!viewerState.isOpen) return;

      switch (e.key) {
        case 'Escape':
          closeViewer();
          break;
        case 'ArrowLeft':
          prevFile();
          break;
        case 'ArrowRight':
          nextFile();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewerState.isOpen, closeViewer, prevFile, nextFile, zoomIn, zoomOut, resetZoom]);

  return {
    viewerState,
    openViewer,
    closeViewer,
    nextFile,
    prevFile,
    zoomIn,
    zoomOut,
    resetZoom,
    updatePosition,
    setDragging,
  };
};
