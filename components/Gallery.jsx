import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X, Play, Pause } from "lucide-react";

const Gallery = ({ files = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const openModal = (file, index) => {
    setSelectedImage(file);
    setCurrentIndex(index);
    setIsVideoPlaying(false);
  };
  
  const closeModal = () => {
    setSelectedImage(null);
    setIsVideoPlaying(false);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : files.length - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(files[newIndex]);
    setIsVideoPlaying(false);
  };

  const goToNext = () => {
    const newIndex = currentIndex < files.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedImage(files[newIndex]);
    setIsVideoPlaying(false);
  };

  const isVideo = (file) => file?.endsWith?.(".mp4") || file?.includes?.("video");
  
  const toggleVideoPlayback = (e) => {
    e.stopPropagation();
    const video = e.target.closest('.modal-content')?.querySelector('video');
    if (video) {
      if (video.paused) {
        video.play();
        setIsVideoPlaying(true);
      } else {
        video.pause();
        setIsVideoPlaying(false);
      }
    }
  };

  if (!files?.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="relative cursor-pointer group"
            onClick={() => openModal(file, index)}
          >
            {isVideo(file) ? (
              <div className="relative">
                <video
                  src={file}
                  className="w-full h-40 object-cover rounded-lg"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <Play className="w-6 h-6 text-white" fill="currentColor" />
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={file}
                alt={`Gallery item ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
            )}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-60 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Button */}
          {files.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-60 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Button */}
          {files.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-60 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Media Content */}
          <div className="modal-content max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            {isVideo(selectedImage) ? (
              <div className="relative w-full">
                <video
                  src={selectedImage}
                  className="w-full max-h-[80vh] object-contain"
                  controls
                  autoPlay
                  onClick={(e) => e.stopPropagation()}
                  onPlay={() => setIsVideoPlaying(true)}
                  onPause={() => setIsVideoPlaying(false)}
                />
              </div>
            ) : (
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="w-full max-h-[80vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>

          {/* Image Counter */}
          {files.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {currentIndex + 1} / {files.length}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Gallery;
