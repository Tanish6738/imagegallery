import { useState, useCallback } from 'react';
import { FileItem } from '@/types';

export const useFileManager = () => {
  const [files, setFiles] = useState<FileItem[]>([]);

  const addFiles = useCallback((newFiles: File[]) => {
    const fileItems: FileItem[] = newFiles.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
    }));

    setFiles(prev => [...prev, ...fileItems]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.url);
      }
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const reorderFiles = useCallback((startIndex: number, endIndex: number) => {
    setFiles(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const clearAll = useCallback(() => {
    files.forEach(file => URL.revokeObjectURL(file.url));
    setFiles([]);
  }, [files]);

  return {
    files,
    addFiles,
    removeFile,
    reorderFiles,
    clearAll
  };
};
