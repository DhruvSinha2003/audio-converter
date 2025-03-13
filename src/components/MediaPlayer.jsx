// src/components/MediaPlayer.jsx
import React, { useEffect, useRef, useState } from "react";
import { colors } from "../styles/colors";

const MediaPlayer = ({ file, files, onSelectFile }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // When file changes, maintain the previous playing state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current
          .play()
          .catch((err) => console.error("Playback failed:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [file]);

  // Handle play/pause state changes
  const handlePlayStateChange = () => {
    setIsPlaying(!audioRef.current.paused);
  };

  // Navigate to next/previous file
  const handleNavigation = (direction) => {
    if (!files || !file || files.length <= 1) return;

    const currentIndex = files.findIndex((f) => f === file);
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % files.length;
    } else {
      newIndex = (currentIndex - 1 + files.length) % files.length;
    }

    onSelectFile(files[newIndex]);
  };

  if (!file) {
    return (
      <div
        className="rounded-lg p-8 text-center flex flex-col items-center justify-center h-48"
        style={{ backgroundColor: colors.surface, color: colors.onSurface }}
      >
        <div className="text-4xl mb-4">🎧</div>
        <p>Select a file to play</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: colors.surface, color: colors.onSurface }}
    >
      <div className="mb-4 px-2">
        <h3 className="text-lg font-medium truncate">
          {file.convertedName || file.originalName}
        </h3>
        <p className="text-sm opacity-75">
          {file.status === "converted" ? "Converted to MP3" : "Original MP3"}
        </p>
      </div>

      <audio
        ref={audioRef}
        controls
        className="w-full rounded"
        src={file.url}
        onPlay={handlePlayStateChange}
        onPause={handlePlayStateChange}
      >
        Your browser does not support the audio element.
      </audio>

      {files && files.length > 1 && (
        <div className="flex justify-between mt-4">
          <button
            className="py-2 px-4 rounded-lg font-medium transition-all flex items-center"
            style={{
              backgroundColor: colors.primaryVariant,
              color: colors.onPrimary,
            }}
            onClick={() => handleNavigation("prev")}
          >
            <span className="mr-1">◀</span> Previous
          </button>

          <button
            className="py-2 px-4 rounded-lg font-medium transition-all flex items-center"
            style={{
              backgroundColor: colors.primaryVariant,
              color: colors.onPrimary,
            }}
            onClick={() => handleNavigation("next")}
          >
            Next <span className="ml-1">▶</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaPlayer;
