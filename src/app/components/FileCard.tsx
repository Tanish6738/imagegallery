"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { FileItem } from '@/types';
import { formatFileSize, isImageFile, isVideoFile, getFileIcon } from '@/utils/fileUtils';

interface FileCardProps {
  file: FileItem;
  index: number;
  onClick: () => void;
  onRemove: () => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropIndex: number) => void;
  isDragging?: boolean;
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  index,
  onClick,
  onRemove,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging = false
}) => {
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(e, index);
  };

  const renderFilePreview = () => {
    if (isImageFile(file.type) && !imageError) {
      return (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={file.url}
            alt={file.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            unoptimized
          />
        </div>
      );
    }

    if (isVideoFile(file.type)) {
      return (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          <video
            src={file.url}
            className="w-full h-full object-cover"
            controls={false}
            muted
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <span className="text-white text-4xl">▶️</span>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
        <span className="text-4xl mb-2">{getFileIcon(file.type)}</span>
        <span className="text-sm text-gray-600 text-center px-2">
          {file.type || 'Unknown'}
        </span>
      </div>
    );
  };

  return (
    <div
      ref={cardRef}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        relative group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer
        ${isDragging ? 'opacity-50 scale-95 rotate-2' : 'hover:scale-[1.02]'}
      `}
    >
      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
      >
        ×
      </button>

      {/* File preview */}
      <div onClick={onClick} className="p-4">
        {renderFilePreview()}
        
        {/* File info */}
        <div className="mt-3">
          <h3 className="font-medium text-gray-900 truncate" title={file.name}>
            {file.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>

      {/* Drag indicator */}
      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-gray-400 text-sm">⋮⋮</span>
      </div>
    </div>
  );
};

export default FileCard;
