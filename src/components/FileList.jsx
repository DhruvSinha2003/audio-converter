// src/components/FileList.jsx
import React, { useEffect, useState } from "react";
import { colors } from "../styles/colors";

const FileList = ({ files, onSelectFile, selectedFile }) => {
  const [fileDurations, setFileDurations] = useState({});

  // Load audio durations for all files
  useEffect(() => {
    const loadDurations = async () => {
      const durations = {};

      for (const file of files) {
        try {
          // Create audio element to get duration
          const audio = new Audio(file.url);

          // Wait for metadata to load
          const getDuration = new Promise((resolve) => {
            audio.addEventListener("loadedmetadata", () => {
              resolve(audio.duration);
            });

            // Handle errors or unsupported files
            audio.addEventListener("error", () => {
              resolve(null);
            });
          });

          const duration = await getDuration;
          durations[file.url] = duration;
        } catch (error) {
          console.error("Error loading audio duration:", error);
          durations[file.url] = null;
        }
      }

      setFileDurations(durations);
    };

    if (files && files.length > 0) {
      loadDurations();
    }

    // Cleanup function to prevent memory leaks
    return () => {
      files.forEach((file) => {
        URL.revokeObjectURL(file.url);
      });
    };
  }, [files]);

  const formatDuration = (seconds) => {
    if (seconds === null || isNaN(seconds)) return "--:--";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!files || files.length === 0) {
    return (
      <div
        className="text-center p-4 opacity-50"
        style={{ color: colors.onBackground }}
      >
        No files uploaded yet
      </div>
    );
  }

  return (
    <div
      className="overflow-y-auto max-h-96 rounded-lg"
      style={{ backgroundColor: colors.surface }}
    >
      <ul className="divide-y" style={{ borderColor: colors.divider }}>
        {files.map((file, index) => (
          <li
            key={index}
            className="p-3 cursor-pointer transition-all flex items-center justify-between"
            style={{
              backgroundColor:
                selectedFile === file ? colors.primaryVariant : "transparent",
              color: colors.onSurface,
            }}
            onClick={() => onSelectFile(file)}
          >
            <div className="flex items-center">
              <span className="text-sm font-mono mr-3 min-w-8 text-center opacity-75">
                {index + 1}
              </span>
              <span className="text-xl mr-3">🎵</span>
              <div>
                <p
                  className="text-sm font-medium truncate"
                  style={{ maxWidth: "200px" }}
                >
                  {file.convertedName || file.originalName}
                </p>
                <p className="text-xs opacity-75">
                  {file.status === "converted"
                    ? `${file.extension} → mp3`
                    : file.status === "unchanged"
                    ? "Already MP3"
                    : "Unsupported format"}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs mr-3 opacity-75 font-mono">
                {formatDuration(fileDurations[file.url])}
              </span>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor:
                    file.status === "converted"
                      ? colors.secondary
                      : file.status === "unchanged"
                      ? colors.primary
                      : colors.error,
                  color: colors.onSecondary,
                }}
              >
                {file.status === "converted"
                  ? "Converted"
                  : file.status === "unchanged"
                  ? "MP3"
                  : "Error"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
