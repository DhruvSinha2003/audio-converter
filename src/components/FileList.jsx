import React, { useEffect, useState } from "react";
import { colors } from "../styles/colors";

const FileList = ({ files, onSelectFile, selectedFile }) => {
  const [fileDurations, setFileDurations] = useState({});
  const BATCH_SIZE = 10;

  // Load audio durations for files in batches
  useEffect(() => {
    if (!files || files.length === 0) return;

    let isMounted = true;
    const durations = { ...fileDurations }; // Start with existing durations

    const processBatch = async (startIndex) => {
      if (!isMounted) return;

      const endIndex = Math.min(startIndex + BATCH_SIZE, files.length);
      const batch = files.slice(startIndex, endIndex);

      // Process this batch
      const batchPromises = batch.map(async (file) => {
        // Skip if we already have the duration
        if (durations[file.url] !== undefined) return;

        try {
          const audio = new Audio(file.url);

          // Get duration or timeout after 3 seconds
          const duration = await Promise.race([
            new Promise((resolve) => {
              audio.addEventListener("loadedmetadata", () => {
                resolve(audio.duration);
              });

              audio.addEventListener("error", () => {
                resolve(null);
              });
            }),
            new Promise((resolve) => setTimeout(() => resolve(null), 3000)),
          ]);

          durations[file.url] = duration;

          // Release the audio element
          audio.src = "";
          audio.load();
        } catch (error) {
          console.error("Error loading audio duration:", error);
          durations[file.url] = null;
        }
      });

      await Promise.all(batchPromises);

      if (isMounted) {
        setFileDurations({ ...durations });

        // Process next batch if there are more files
        if (endIndex < files.length) {
          setTimeout(() => processBatch(endIndex), 100);
        }
      }
    };

    // Start processing the first batch
    processBatch(0);

    return () => {
      isMounted = false;
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
