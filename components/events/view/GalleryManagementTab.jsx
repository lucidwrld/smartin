"use client";
import React, { useEffect, useState } from "react";
import { Plus, Trash2, Download, Eye, Upload, X } from "lucide-react";
import CustomButton from "@/components/Button";
import Gallery from "@/components/Gallery";
import { EditEventManager } from "@/app/events/controllers/editEventController";
import useFileUpload from "@/utils/fileUploadController";
import { toast } from "react-toastify";

const GalleryManagementTab = ({ event, refetch }) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState([]);

  const { updateEvent, isLoading: updating, isSuccess } = EditEventManager({
    eventId: event?.id,
  });
  const { handleFileUpload, isLoading: uploadingFile } = useFileUpload();

  useEffect(() => {
    if(isSuccess){
      refetch()

    }
  }, [isSuccess])
  const gallery = event?.gallery || [];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isImage && !isVideo) {
        toast.error(`${file.name} is not a valid image or video file`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    try {
      setUploadingFiles(selectedFiles.map(file => file.name));
      
      // Upload files
      const uploadPromises = selectedFiles.map(file => handleFileUpload(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Update event with new gallery items
      const updatedGallery = [...gallery, ...uploadedUrls];
      await updateEvent({ gallery: updatedGallery });
      
      // Reset state
      setSelectedFiles([]);
      setUploadingFiles([]);
      setShowUploadModal(false);
      
      toast.success(`${uploadedUrls.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error uploading files. Please try again.");
      setUploadingFiles([]);
    }
  };

  const handleDeleteItem = async (indexToDelete) => {
    try {
      const updatedGallery = gallery.filter((_, index) => index !== indexToDelete);
      await updateEvent({ gallery: updatedGallery });
      toast.success("Gallery item deleted successfully");
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      toast.error("Error deleting gallery item. Please try again.");
    }
  };

  const handleDownload = (url, index) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = `gallery-item-${index + 1}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Error downloading file");
    }
  };

  const isLoading = updating || uploadingFile;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
          <p className="text-gray-600 mt-1">
            Manage your event photos and videos
          </p>
        </div>
        <CustomButton
          buttonText="Add Media"
          prefixIcon={<Plus size={16} />}
          buttonColor="bg-purple-600"
          radius="rounded-full"
          onClick={() => setShowUploadModal(true)}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">
                {gallery.length}
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Images</p>
              <p className="text-2xl font-semibold text-green-600">
                {gallery.filter(item => 
                  typeof item === 'string' && 
                  (item.includes('.jpg') || item.includes('.jpeg') || 
                   item.includes('.png') || item.includes('.gif'))
                ).length}
              </p>
            </div>
            <Upload className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Videos</p>
              <p className="text-2xl font-semibold text-purple-600">
                {gallery.filter(item => 
                  typeof item === 'string' && item.includes('.mp4')
                ).length}
              </p>
            </div>
            <Upload className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Gallery Display */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Current Gallery</h3>
        
        {gallery.length === 0 ? (
          <div className="text-center py-12">
            <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No media files yet
            </h3>
            <p className="text-gray-500 mb-4">
              Upload photos and videos to create your event gallery.
            </p>
            <CustomButton
              buttonText="Upload First Media"
              prefixIcon={<Plus size={16} />}
              buttonColor="bg-purple-600"
              radius="rounded-full"
              onClick={() => setShowUploadModal(true)}
            />
          </div>
        ) : (
          <>
            <Gallery files={gallery} />
            
            {/* Management Grid */}
            <div className="mt-6">
              <h4 className="text-md font-medium mb-3">Manage Items</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {gallery.map((item, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {item?.endsWith?.('.mp4') ? (
                        <video
                          src={item}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={item}
                          alt={`Gallery item ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownload(item, index)}
                          className="p-2 bg-white rounded-full text-gray-600 hover:text-blue-600 transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(index)}
                          disabled={isLoading}
                          className="p-2 bg-white rounded-full text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Upload Media Files</h3>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                    setUploadingFiles([]);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* File Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Images and Videos
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum file size: 10MB per file. Supported formats: JPG, PNG, GIF, MP4
                </p>
              </div>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Selected Files ({selectedFiles.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          {file.type.startsWith('video/') ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-xs text-gray-500">Video</span>
                            </div>
                          ) : (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <button
                          onClick={() => removeSelectedFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                        <p className="text-xs text-gray-600 mt-1 truncate">
                          {file.name}
                        </p>
                        {uploadingFiles.includes(file.name) && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <CustomButton
                  buttonText="Upload Files"
                  buttonColor="bg-purple-600"
                  radius="rounded-md"
                  isLoading={isLoading}
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0}
                />
                <CustomButton
                  buttonText="Cancel"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                    setUploadingFiles([]);
                  }}
                  buttonColor="bg-gray-300"
                  textColor="text-gray-700"
                  radius="rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagementTab;