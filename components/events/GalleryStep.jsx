// GalleryStep.js
export const GalleryStep = ({ formData, onFormDataChange }) => {
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newGallery = [...(formData.gallery || []), ...files];
    onFormDataChange("gallery", newGallery);
  };

  const removeFile = (indexToRemove) => {
    const newGallery = (formData.gallery || []).filter(
      (_, index) => index !== indexToRemove
    );
    onFormDataChange("gallery", newGallery);
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
            {file.type?.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(file)}
                alt={`Gallery item ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg"
              />
            ) : (
              <video
                src={URL.createObjectURL(file)}
                className="w-full h-40 object-cover rounded-lg"
                controls
              />
            )}
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
