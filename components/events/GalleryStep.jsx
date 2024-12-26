import React, { useState, useEffect } from "react";

export const GalleryStep = ({ formData, onFormDataChange }) => {
  // Add useEffect to monitor formData changes
  useEffect(() => {
    console.log("Current formData:", formData);
    console.log("Gallery items:", formData.gallery);
  }, [formData]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log("Files selected:", files);

    const newGallery = [...(formData.gallery || []), ...files];
    console.log("New gallery array:", newGallery);

    onFormDataChange("gallery", newGallery);
  };

  const removeFile = (indexToRemove) => {
    console.log("Removing file at index:", indexToRemove);

    const newGallery = (formData.gallery || []).filter(
      (_, index) => index !== indexToRemove
    );
    console.log("Gallery after removal:", newGallery);

    onFormDataChange("gallery", newGallery);
  };

  // Add console log to track rendering
  console.log("Rendering gallery with items:", formData.gallery);

  const renderPreview = (file, index) => {
    console.log("Rendering preview for item:", { file, index });

    if (file instanceof File) {
      // Handle File objects
      if (file.type?.startsWith("image/")) {
        return (
          <img
            src={URL.createObjectURL(file)}
            alt={`Gallery item ${index + 1}`}
            className="w-full h-40 object-cover rounded-lg"
            onLoad={() => console.log(`Image ${index} loaded successfully`)}
            onError={(e) => console.error(`Error loading image ${index}:`, e)}
          />
        );
      } else if (file.type?.startsWith("video/")) {
        return (
          <video
            src={URL.createObjectURL(file)}
            className="w-full h-40 object-cover rounded-lg"
            controls
            onLoadedData={() =>
              console.log(`Video ${index} loaded successfully`)
            }
            onError={(e) => console.error(`Error loading video ${index}:`, e)}
          />
        );
      }
    } else {
      // Handle URLs
      const isVideo = file?.match(/\.(mp4|webm|ogg)$/i);
      if (isVideo) {
        return (
          <video
            src={file}
            className="w-full h-40 object-cover rounded-lg"
            controls
            onLoadedData={() =>
              console.log(`Video URL ${index} loaded successfully`)
            }
            onError={(e) =>
              console.error(`Error loading video URL ${index}:`, e)
            }
          />
        );
      } else {
        return (
          <img
            src={file}
            alt={`Gallery item ${index + 1}`}
            className="w-full h-40 object-cover rounded-lg"
            onLoad={() => console.log(`Image URL ${index} loaded successfully`)}
            onError={(e) =>
              console.error(`Error loading image URL ${index}:`, e)
            }
          />
        );
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="space-y-2">
            <div className="flex justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <p className="text-gray-600">Click to upload images or videos</p>
          </div>
        </label>
      </div>

      {/* Preview Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(formData.gallery || []).map((file, index) => (
          <div key={index} className="relative group">
            {renderPreview(file, index)}
            <button
              onClick={() => removeFile(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
