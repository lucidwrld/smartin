"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Download, Share2, Heart } from "lucide-react";

const EnhancedGallery = ({ images = [], title = "Gallery" }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState("all");
  const [favorites, setFavorites] = useState([]);

  // Mock categories for demonstration
  const categories = ["all", "ceremony", "reception", "guests", "venue"];

  const filteredImages = images.filter(image => {
    if (filter === "all") return true;
    return image.category === filter;
  });

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction) => {
    const newIndex = direction === "next" 
      ? (currentIndex + 1) % filteredImages.length
      : (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const toggleFavorite = (imageId) => {
    setFavorites(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const downloadImage = (imageUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareImage = async (imageUrl) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Event Photo',
          url: imageUrl
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(imageUrl);
      alert('Image URL copied to clipboard!');
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-500">No photos available yet.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === category
                ? 'theme-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image, index) => (
          <div 
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-lg theme-card"
            onClick={() => openLightbox(image, index)}
          >
            <img
              src={typeof image === 'string' ? image : image.url}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(index);
                  }}
                  className={`p-2 rounded-full ${
                    favorites.includes(index) 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-600'
                  } transition-colors`}
                >
                  <Heart className="w-4 h-4" fill={favorites.includes(index) ? 'currentColor' : 'none'} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    shareImage(typeof image === 'string' ? image : image.url);
                  }}
                  className="p-2 rounded-full bg-white text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Image count overlay */}
            {typeof image === 'object' && image.count && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                +{image.count}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            {filteredImages.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage("prev")}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={() => navigateImage("next")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={typeof selectedImage === 'string' ? selectedImage : selectedImage.url}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain"
            />

            {/* Image actions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <button
                onClick={() => downloadImage(
                  typeof selectedImage === 'string' ? selectedImage : selectedImage.url,
                  `event-photo-${currentIndex + 1}.jpg`
                )}
                className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
              >
                <Download className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => shareImage(typeof selectedImage === 'string' ? selectedImage : selectedImage.url)}
                className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => toggleFavorite(currentIndex)}
                className={`p-2 rounded-full transition-colors ${
                  favorites.includes(currentIndex)
                    ? 'bg-red-500 text-white'
                    : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'
                }`}
              >
                <Heart className="w-5 h-5" fill={favorites.includes(currentIndex) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Image counter */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {filteredImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedGallery;