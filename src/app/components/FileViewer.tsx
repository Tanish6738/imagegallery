import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { FileItem, ViewerState } from '@/types';
import { formatFileSize, formatDate, isImageFile, isVideoFile, getFileIcon } from '@/utils/fileUtils';

interface FileViewerProps {
  files: FileItem[];
  viewerState: ViewerState;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onUpdatePosition: (deltaX: number, deltaY: number) => void;
  onSetDragging: (isDragging: boolean) => void;
}

const FileViewer: React.FC<FileViewerProps> = ({
  files,
  viewerState,
  onClose,
  onNext,
  onPrev,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onUpdatePosition,
  onSetDragging
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [imageError, setImageError] = useState(false);

  const currentFile = files[viewerState.currentIndex];

  useEffect(() => {
    if (viewerState.isOpen) {
      document.body.style.overflow = 'hidden';
      setImageError(false);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [viewerState.isOpen]);

  useEffect(() => {
    setImageError(false);
  }, [viewerState.currentIndex]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (viewerState.scale > 1) {
      onSetDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (viewerState.isDragging && viewerState.scale > 1) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      onUpdatePosition(deltaX, deltaY);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    onSetDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      onZoomIn();
    } else {
      onZoomOut();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!viewerState.isOpen || !currentFile) return null;

  const renderFileContent = () => {
    if (isImageFile(currentFile.type) && !imageError) {
      return (
        <div
          ref={contentRef}
          className="relative max-w-full max-h-full"
          style={{
            transform: `scale(${viewerState.scale}) translate(${viewerState.position.x}px, ${viewerState.position.y}px)`,
            cursor: viewerState.scale > 1 ? (viewerState.isDragging ? 'grabbing' : 'grab') : 'default',
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <Image
            src={currentFile.url}
            alt={currentFile.name}
            width={800}
            height={600}
            className="max-w-full max-h-full object-contain"
            onError={() => setImageError(true)}
            unoptimized
            draggable={false}
          />
        </div>
      );
    }

    if (isVideoFile(currentFile.type)) {
      return (
        <div
          ref={contentRef}
          style={{
            transform: `scale(${viewerState.scale}) translate(${viewerState.position.x}px, ${viewerState.position.y}px)`,
          }}
        >
          <video
            src={currentFile.url}
            controls
            className="max-w-full max-h-full"
            autoPlay
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center text-white">
        <span className="text-8xl mb-4">{getFileIcon(currentFile.type)}</span>
        <p className="text-xl mb-2">{currentFile.name}</p>
        <p className="text-gray-300">Preview not available for this file type</p>
        <a
          href={currentFile.url}
          download={currentFile.name}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Download File
        </a>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
      onWheel={handleWheel}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white text-2xl w-10 h-10 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
      >
        ×
      </button>

      {/* Navigation buttons */}
      {files.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white text-2xl w-12 h-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
          >
            ←
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white text-2xl w-12 h-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-all"
          >
            →
          </button>
        </>
      )}

      {/* Zoom controls */}
      {(isImageFile(currentFile.type) || isVideoFile(currentFile.type)) && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
          <button
            onClick={onZoomOut}
            className="px-3 py-2 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-all"
          >
            −
          </button>
          <button
            onClick={onResetZoom}
            className="px-3 py-2 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-all"
          >
            {Math.round(viewerState.scale * 100)}%
          </button>
          <button
            onClick={onZoomIn}
            className="px-3 py-2 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-all"
          >
            +
          </button>
        </div>
      )}

      {/* File info */}
      <div className="absolute bottom-4 left-4 z-10 text-white bg-black bg-opacity-50 rounded p-3 max-w-md">
        <h3 className="font-medium text-lg mb-1">{currentFile.name}</h3>
        <div className="text-sm text-gray-300 space-y-1">
          <p>Type: {currentFile.type || 'Unknown'}</p>
          <p>Size: {formatFileSize(currentFile.size)}</p>
          <p>Modified: {formatDate(currentFile.lastModified)}</p>
        </div>
      </div>

      {/* File counter */}
      {files.length > 1 && (
        <div className="absolute bottom-4 right-4 z-10 text-white bg-black bg-opacity-50 rounded px-3 py-2">
          {viewerState.currentIndex + 1} of {files.length}
        </div>
      )}

      {/* Keyboard hints */}
      <div className="absolute top-4 left-4 z-10 text-white bg-black bg-opacity-50 rounded p-2 text-xs">
        <div>ESC: Close</div>
        {files.length > 1 && <div>← → : Navigate</div>}
        {(isImageFile(currentFile.type) || isVideoFile(currentFile.type)) && (
          <div>+ - 0: Zoom</div>
        )}
      </div>

      {/* Main content */}
      <div className="flex items-center justify-center max-w-full max-h-full p-8">
        {renderFileContent()}
      </div>
    </div>
  );
};

export default FileViewer;
