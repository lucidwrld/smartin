"use client";

import React, { useState, useEffect, useRef } from "react";
import { QrCode, X, RefreshCw } from "lucide-react";
import QrScanner from "qr-scanner";

const QRCodeScanner = ({ onScan, scanMode, setScanMode }) => {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("unknown");

  // Request camera permissions
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop()); // Stop the test stream
      setPermissionStatus("granted");
      await getAvailableCameras();
      return true;
    } catch (error) {
      console.error("Camera permission error:", error);
      setPermissionStatus("denied");
      return false;
    }
  };

  // Get available cameras
  const getAvailableCameras = async () => {
    try {
      const cameras = await QrScanner.listCameras(true);
      setCameras(cameras);
      setSelectedCamera(cameras[0]); // Default to the first camera
    } catch (error) {
      console.error("Error getting cameras:", error);
      setPermissionStatus("denied");
    }
  };

  // Initialize the QR scanner
  const initializeScanner = async () => {
    if (!selectedCamera) return;

    try {
      stopScanner(); // Stop any existing scanner

      if (videoRef.current) {
        const qrScanner = new QrScanner(
          videoRef.current,
          (result) => {
            onScan(result.data); // Pass scanned data to parent
          },
          {
            preferredCamera: selectedCamera.deviceId,
            highlightScanRegion: true,
            maxScansPerSecond: 3,
          }
        );

        scannerRef.current = qrScanner;
        await qrScanner.start();
      }
    } catch (error) {
      console.error("Error initializing scanner:", error);
      setPermissionStatus("denied");
    }
  };

  // Stop the scanner
  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Toggle between cameras
  const toggleCamera = () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex(
      (cam) => cam.deviceId === selectedCamera.deviceId
    );
    const nextIndex = (currentIndex + 1) % cameras.length;
    setSelectedCamera(cameras[nextIndex]);
    setTimeout(() => initializeScanner(), 100);
  };

  // Handle scan mode toggle
  useEffect(() => {
    if (scanMode) {
      requestCameraPermission().then((success) => {
        if (success) initializeScanner();
      });
    } else {
      stopScanner();
    }
  }, [scanMode]);

  return (
    <div>
      {/* Scan Mode Toggle Button */}

      {/* QR Scanner View */}
      {scanMode && (
        <div className="mb-6">
          {permissionStatus === "loading" ? (
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Checking camera access...</p>
            </div>
          ) : permissionStatus === "denied" ? (
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Camera Access Required
              </h3>
              <p className="text-gray-600 mb-4">
                We need access to your camera to scan QR codes. Please allow
                camera access in your browser settings.
              </p>
              <button
                onClick={requestCameraPermission}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
              >
                <QrCode className="mr-2 h-4 w-4" />
                Grant Camera Access
              </button>
            </div>
          ) : (
            <div className="bg-black relative overflow-hidden rounded-lg aspect-video">
              {/* Video element for QR scanning */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
                autoPlay
              />

              {/* Scan region overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="border-2 border-white border-opacity-50 w-2/3 h-2/3 rounded-lg">
                  {/* Corner markers */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-500 rounded-tl-sm"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple-500 rounded-tr-sm"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple-500 rounded-bl-sm"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-500 rounded-br-sm"></div>
                </div>
              </div>

              {/* Camera controls */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-20">
                {cameras.length > 1 && (
                  <button
                    onClick={toggleCamera}
                    className="bg-black bg-opacity-70 p-3 rounded-full text-white hover:bg-opacity-90"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                )}

                {/* Cancel button */}
                <button
                  onClick={() => setScanMode(false)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <p className="text-center text-sm text-gray-600 mt-2">
            {permissionStatus === "granted" || permissionStatus === "unknown"
              ? "Position the QR code within the frame to scan"
              : "Camera access is needed to scan QR codes"}
          </p>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
