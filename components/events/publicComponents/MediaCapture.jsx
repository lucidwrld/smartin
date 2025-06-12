"use client";

import React, { useState, useRef, useCallback } from "react";
import { Camera, Video, Upload, X, Play, Pause } from "lucide-react";
import Webcam from "react-webcam";

const MediaCapture = ({ onMediaCapture, currentMedia = null }) => {
  const [captureMode, setCaptureMode] = useState(null); // 'photo', 'video', or null
  const [isRecording, setIsRecording] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(currentMedia);

  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startCamera = (mode) => {
    setCaptureMode(mode);
    setIsRecording(false);
  };

  const stopCamera = () => {
    setCaptureMode(null);
    setIsRecording(false);
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to blob then to file
      fetch(imageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `photo_${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          setMediaPreview(imageSrc);
          onMediaCapture(file);
          stopCamera();
        });
    }
  }, [onMediaCapture]);

  const startVideoRecording = useCallback(() => {
    if (webcamRef.current && webcamRef.current.stream) {
      chunksRef.current = [];
      const mediaRecorder = new MediaRecorder(webcamRef.current.stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const file = new File([blob], `video_${Date.now()}.webm`, {
          type: "video/webm",
        });
        const videoUrl = URL.createObjectURL(blob);
        setMediaPreview(videoUrl);
        onMediaCapture(file);
        stopCamera();
      };

      mediaRecorder.start();
      setIsRecording(true);
    }
  }, [onMediaCapture]);

  const stopVideoRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMediaPreview(URL.createObjectURL(file));
      onMediaCapture(file);
    }
  };

  const removeMedia = () => {
    setMediaPreview(null);
    onMediaCapture(null);
  };

  const isVideo = (src) => {
    return (
      src &&
      (src.includes("video") ||
        src.includes(".webm") ||
        src.includes(".mp4") ||
        src.includes("blob:"))
    );
  };

  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "user",
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-[500px] mx-auto">
        {/* Media Preview/Camera View */}
        <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
          {captureMode ? (
            // Camera is active
            <div className="relative w-full h-full">
              <Webcam
                ref={webcamRef}
                audio={captureMode === "video"}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }} // Mirror effect
                muted={true}
              />

              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm">Recording</span>
                </div>
              )}

              {/* Camera Controls */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                {captureMode === "photo" && (
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-4 py-2 bg-white text-gray-800 rounded-lg shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Take Photo
                  </button>
                )}

                {captureMode === "video" && (
                  <button
                    type="button"
                    onClick={
                      isRecording ? stopVideoRecording : startVideoRecording
                    }
                    className={`px-4 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-2 ${
                      isRecording
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-white text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {isRecording ? <Pause size={16} /> : <Play size={16} />}
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={stopCamera}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : mediaPreview ? (
            // Show captured/uploaded media
            <div className="relative w-full h-full">
              {isVideo(mediaPreview) ? (
                <video
                  src={mediaPreview}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={mediaPreview}
                  alt="Captured media"
                  className="w-full h-full object-cover"
                />
              )}

              <button
                type="button"
                onClick={removeMedia}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            // Empty state - show capture options
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">No media selected</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!captureMode && !mediaPreview && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => startCamera("photo")}
                className="px-4 py-3 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center gap-2"
              >
                <Camera size={16} />
                Take Photo
              </button>

              <button
                type="button"
                onClick={() => startCamera("video")}
                className="px-4 py-3 bg-purple-600 text-white rounded-full shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center gap-2"
              >
                <Video size={16} />
                Record Video
              </button>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => document.getElementById("media-upload").click()}
                className="w-full px-4 py-3 bg-transparent border border-purple-600 text-purple-600 rounded-full hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center gap-2"
              >
                <Upload size={16} />
                Upload File
              </button>
              <input
                id="media-upload"
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaCapture;
