import React, { useRef, useState, useEffect } from "react";

function useIntersectionObserver(ref, options) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return isIntersecting;
}

function DisplayFile({ fileUrl = "" }) {
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const isInView = useIntersectionObserver(videoRef, { threshold: 0.5 });

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      if (isInView && isPaused) {
        videoRef.current.play();
        setIsPaused(false);
      } else if (!isInView && !isPaused) {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  }, [isInView, isPaused]);

  if (fileUrl.endsWith(".mp4")) {
    return (
      <div className="relative">
        <video
          onClick={handleVideoClick}
          ref={videoRef}
          className="rounded-[6px] w-full"
          muted={isMuted}
          playsInline
        >
          <source src={fileUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute bottom-2 right-2 flex space-x-2">
          <button
            onClick={handleVideoClick}
            className="bg-black bg-opacity-50 text-white p-2 rounded"
          >
            {isPaused ? "Play" : "Pause"}
          </button>
          <button
            onClick={toggleMute}
            className="bg-black bg-opacity-50 text-white p-2 rounded"
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
        </div>
      </div>
    );
  } else if (fileUrl.endsWith(".pdf")) {
    return (
      <embed
        className="rounded-[6px]"
        src={fileUrl}
        type="application/pdf"
        width="100%"
        height="400"
      />
    );
  } else if (
    fileUrl.endsWith(".jpg") ||
    fileUrl.endsWith(".jpeg") ||
    fileUrl.endsWith(".png")
  ) {
    return <img src={fileUrl} alt="file" className="rounded-[6px]" />;
  } else {
    return (
      <div className="max-w-full w-full truncate1">
        {fileUrl
          ? `Unsupported file format: ${fileUrl}`
          : "No Attachment found"}
      </div>
    );
  }
}

export default DisplayFile;
