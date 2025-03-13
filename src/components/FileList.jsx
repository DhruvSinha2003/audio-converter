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

  const getStatusIcon = (status) => {
    switch (status) {
      case "converted":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "unchanged":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "converted":
        return colors.secondary;
      case "unchanged":
        return colors.primary;
      default:
        return colors.error;
    }
  };

  if (!files || files.length === 0) {
    return (
      <div
        className="text-center p-6 rounded-lg"
        style={{
          backgroundColor: "rgba(45, 45, 45, 0.5)",
          color: colors.onBackground,
          border: `1px dashed ${colors.divider}`,
        }}
      >
        <div className="opacity-50 flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <p>No files uploaded yet</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-y-auto max-h-96 rounded-xl"
      style={{ backgroundColor: "rgba(30, 30, 30,.6)" }}
    >
      <ul className="divide-y" style={{ borderColor: colors.divider }}>
        {files.map((file, index) => (
          <li
            key={index}
            className="py-3 px-4 cursor-pointer transition-all duration-200 flex items-center justify-between hover:bg-opacity-50"
            style={{
              backgroundColor:
                selectedFile === file ? "rgba(55, 0, 179, 0.3)" : "transparent",
              color: colors.onSurface,
              borderLeft:
                selectedFile === file
                  ? `3px solid ${colors.primary}`
                  : "3px solid transparent",
            }}
            onClick={() => onSelectFile(file)}
          >
            <div className="flex items-center">
              <span
                className="text-xs font-mono mr-3 min-w-6 h-6 flex items-center justify-center rounded-full"
                style={{
                  backgroundColor:
                    selectedFile === file
                      ? colors.primary
                      : "rgba(45, 45, 45, 0.8)",
                  color:
                    selectedFile === file
                      ? colors.onPrimary
                      : colors.onBackground,
                }}
              >
                {index + 1}
              </span>

              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                style={{
                  backgroundColor: "rgba(55, 0, 179, 0.2)",
                  color:
                    file.status === "converted"
                      ? colors.secondary
                      : file.status === "unchanged"
                      ? colors.primary
                      : colors.error,
                }}
              >
                {file.status === "converted" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              <div>
                <p
                  className="text-sm font-medium truncate"
                  style={{ maxWidth: "200px" }}
                >
                  {file.convertedName || file.originalName}
                </p>
                <p className="text-xs opacity-75 flex items-center">
                  {file.status === "converted" ? (
                    <>
                      <span className="font-mono mr-1">{file.extension}</span> →{" "}
                      <span
                        className="text-xs font-mono ml-1"
                        style={{ color: colors.secondary }}
                      >
                        mp3
                      </span>
                    </>
                  ) : file.status === "unchanged" ? (
                    <span style={{ color: colors.primary }}>Already MP3</span>
                  ) : (
                    <span style={{ color: colors.error }}>
                      Unsupported format
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs mr-3 opacity-75 font-mono bg-black bg-opacity-30 px-2 py-1 rounded">
                {formatDuration(fileDurations[file.url])}
              </span>
              <span
                className="text-xs px-2 py-1 rounded-full flex items-center"
                style={{
                  backgroundColor: getStatusColor(file.status),
                  color: colors.onSecondary,
                }}
              >
                {getStatusIcon(file.status)}
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
