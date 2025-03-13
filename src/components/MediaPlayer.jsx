import React, { useEffect, useRef, useState } from "react";
import { colors } from "../styles/colors";

const MediaPlayer = ({ file, files, onSelectFile }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentIndex = files?.findIndex((f) => f === file) ?? -1;
  const totalFiles = files?.length ?? 0;
  const currentPosition = currentIndex !== -1 ? currentIndex + 1 : 0;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!file || !files || files.length <= 1) return;

      if (e.ctrlKey && e.key === "ArrowLeft") {
        e.preventDefault();
        handleNavigation("prev");
      }

      if (e.ctrlKey && e.key === "ArrowRight") {
        e.preventDefault();
        handleNavigation("next");
      }

      if (e.ctrlKey && e.key === " ") {
        e.preventDefault();
        handlePlayPause();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Clean up event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [file, files]);

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

  // Update time and duration info
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  // Handle play/pause state changes
  const handlePlayStateChange = () => {
    setIsPlaying(!audioRef.current.paused);
  };

  // Toggle play/pause
  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .catch((err) => console.error("Playback failed:", err));
    } else {
      audioRef.current.pause();
    }
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
        <h3 className="text-lg font-medium truncate flex items-center">
          {totalFiles > 0 && (
            <span className="font-mono text-sm mr-2 opacity-75">
              {currentPosition}/{totalFiles}
            </span>
          )}
          {file.convertedName || file.originalName}
        </h3>
        <p className="text-sm opacity-75">
          {file.status === "converted" ? "Converted to MP3" : "Original MP3"}
        </p>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-sm opacity-75">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        controls
        className="w-full rounded"
        src={file.url}
        onPlay={handlePlayStateChange}
        onPause={handlePlayStateChange}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
      >
        Your browser does not support the audio element.
      </audio>

      {files && files.length > 1 && (
        <div>
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

          <div
            className="mt-4 bg-opacity-25 rounded p-3 text-sm"
            style={{ backgroundColor: colors.divider }}
          >
            <p className="font-medium mb-1">Keyboard Shortcuts:</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span
                  className="font-mono bg-opacity-25 px-1 rounded text-xs"
                  style={{ backgroundColor: colors.primaryVariant }}
                >
                  Ctrl + ←
                </span>{" "}
                Previous
              </div>
              <div>
                <span
                  className="font-mono bg-opacity-25 px-1 rounded text-xs"
                  style={{ backgroundColor: colors.primaryVariant }}
                >
                  Ctrl + →
                </span>{" "}
                Next
              </div>
              <div>
                <span
                  className="font-mono bg-opacity-25 px-1 rounded text-xs"
                  style={{ backgroundColor: colors.primaryVariant }}
                >
                  Ctrl + Space
                </span>{" "}
                Play/Pause
              </div>
              <div>
                <span
                  className="font-mono bg-opacity-25 px-1 rounded text-xs"
                  style={{ backgroundColor: colors.primaryVariant }}
                >
                  Click File
                </span>{" "}
                Select & Play
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Format time for display
const formatTime = (seconds) => {
  if (isNaN(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default MediaPlayer;
