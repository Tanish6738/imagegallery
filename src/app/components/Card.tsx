import React from 'react';
import { useFileManager } from '@/hooks/useFileManager';
import { useViewer } from '@/hooks/useViewer';
import FileUpload from './FileUpload';
import FileGrid from './FileGrid';
import FileViewer from './FileViewer';

const Gallery = () => {
  const { files, addFiles, removeFile, reorderFiles, clearAll } = useFileManager();
  const {
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
  } = useViewer(files);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Temporary File Gallery
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload and browse your files in a beautiful gallery. All files are stored temporarily in your browser's memory and will be cleared on page refresh.
          </p>
        </div>

        {/* Upload Area */}
        <FileUpload onFilesSelected={addFiles} />

        {/* Stats and Controls */}
        {files.length > 0 && (
          <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm">
            <div className="text-gray-600">
              <span className="font-medium">{files.length}</span> file{files.length !== 1 ? 's' : ''} uploaded
            </div>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

        {/* File Grid */}
        <FileGrid
          files={files}
          onFileClick={openViewer}
          onFileRemove={removeFile}
          onReorder={reorderFiles}
        />

        {/* File Viewer Modal */}
        <FileViewer
          files={files}
          viewerState={viewerState}
          onClose={closeViewer}
          onNext={nextFile}
          onPrev={prevFile}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
          onUpdatePosition={updatePosition}
          onSetDragging={setDragging}
        />
      </div>
    </div>
  );
};

export default Gallery;