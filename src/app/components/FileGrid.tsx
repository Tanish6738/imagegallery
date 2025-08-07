"use client";

import React, { useState } from 'react';
import { FileItem } from '@/types';
import FileCard from './FileCard';

interface FileGridProps {
  files: FileItem[];
  onFileClick: (index: number) => void;
  onFileRemove: (id: string) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

const FileGrid: React.FC<FileGridProps> = ({
  files,
  onFileClick,
  onFileRemove,
  onReorder
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorder(draggedIndex, dropIndex);
    }
    
    setDraggedIndex(null);
  };

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <div className="text-6xl mb-4">📸</div>
        <h3 className="text-xl font-medium mb-2">No files uploaded yet</h3>
        <p className="text-gray-400">Upload some files to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
      {files.map((file, index) => (
        <FileCard
          key={file.id}
          file={file}
          index={index}
          onClick={() => onFileClick(index)}
          onRemove={() => onFileRemove(file.id)}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedIndex === index}
        />
      ))}
    </div>
  );
};

export default FileGrid;
