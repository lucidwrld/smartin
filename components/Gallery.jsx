import React, { useState } from "react";

const Gallery = ({ files = [] }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (file) => setSelectedImage(file);
  const closeModal = () => setSelectedImage(null);

  if (!files?.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="relative cursor-pointer"
            onClick={() => openModal(file)}
          >
            {file?.endsWith(".mp4") ? (
              <video
                src={file}
                className="w-full h-40 object-cover rounded-lg"
                controls
              />
            ) : (
              <img
                src={file}
                alt={`Gallery item ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg"
              />
            )}
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="max-w-4xl w-full max-h-[90vh] overflow-auto">
            {selectedImage?.endsWith(".mp4") ? (
              <video
                src={selectedImage}
                className="w-full"
                controls
                autoPlay
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="w-full"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
