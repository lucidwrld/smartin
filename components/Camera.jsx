const { CameraIcon } = require("lucide-react");

const Camera = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [image, setImage] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // Forces front camera on mobile
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOpen(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const photoUrl = canvas.toDataURL("image/jpeg");
      setImage(photoUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      setIsCameraOpen(false);
    }
  };

  return (
    <div className="relative">
      {isCameraOpen ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-96 bg-gray-100 rounded-lg object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button
              onClick={capturePhoto}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Take Photo
            </button>
            <button
              onClick={stopCamera}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </>
      ) : image ? (
        <div className="relative">
          <img
            src={image}
            alt="Captured"
            className="w-full h-96 bg-gray-100 rounded-lg object-cover"
          />
          <button
            onClick={() => setImage(null)}
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          onClick={startCamera}
          className="w-full flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-600"
        >
          <CameraIcon className="w-8 h-8 text-gray-400" />
          <span>Capture Photo</span>
        </button>
      )}
    </div>
  );
};

export { Camera };
