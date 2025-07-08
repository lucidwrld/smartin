import React, { useState } from "react";
import { Play, Pause } from "lucide-react";

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    const video = document.getElementById("mainVideo");
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto aspect-video rounded-xl overflow-hidden shadow-2xl">
      <video
        id="mainVideo"
        // className="w-full h-full"
        className="absolute inset-0 w-full h-full object-cover"
        src="/Smart Invites.mp4"
        poster="/Smart Invites-poster.png"
        controls
        playsInline
        preload="metadata"
      >
        <source src="/Smart Invites.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {!isPlaying && (
        <button
          onClick={handlePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
          aria-label="Play video"
        >
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Play className="text-purple-600 w-8 h-8" />
          </div>
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
