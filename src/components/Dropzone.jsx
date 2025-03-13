import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { colors } from "../styles/colors";

const Dropzone = ({ onDrop, isProcessing }) => {
  const onDropCallback = useCallback(
    (acceptedFiles) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/opus": [".opus"],
      "audio/waptt": [".waptt"],
      "audio/*": [".mp3", ".opus", ".waptt"],
    },
    disabled: isProcessing,
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-opacity-100"
      style={{
        borderColor: isDragActive ? colors.primary : colors.divider,
        borderOpacity: isDragActive ? 1 : 0.5,
        backgroundColor: isDragActive
          ? "rgba(55, 0, 179, 0.1)"
          : "rgba(30, 30, 30, 0.4)",
        color: colors.onSurface,
        opacity: isProcessing ? 0.6 : 1,
        minHeight: "220px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxShadow: isDragActive ? `0 0 15px rgba(187, 134, 252, 0.3)` : "none",
      }}
    >
      <input {...getInputProps()} />
      {isProcessing ? (
        <div className="flex flex-col items-center justify-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 mb-6"
            style={{ borderColor: colors.primary }}
          ></div>
          <p className="text-xl font-light">Converting files...</p>
          <p className="text-sm opacity-70 mt-2">This won't take long</p>
        </div>
      ) : (
        <>
          <div
            className="text-6xl mb-6"
            style={{
              filter: isDragActive
                ? "drop-shadow(0 0 8px rgba(187, 134, 252, 0.7))"
                : "none",
              transform: isDragActive ? "scale(1.1)" : "scale(1)",
              transition: "all 0.3s ease",
            }}
          >
            {isDragActive ? "🎵" : "📂"}
          </div>
          {isDragActive ? (
            <p
              className="text-xl font-medium"
              style={{ color: colors.primary }}
            >
              Drop your audio files here...
            </p>
          ) : (
            <div>
              <p className="text-xl mb-3 font-light">
                Drag & drop audio files here
              </p>
              <button
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 mb-4 hover:scale-105"
                style={{
                  backgroundColor: "rgba(187, 134, 252, 0.2)",
                  color: colors.primary,
                  border: `1px solid ${colors.primary}`,
                }}
              >
                Or click to select files
              </button>
              <div className="flex justify-center space-x-3 opacity-70 text-xs">
                <span
                  className="px-2 py-1 rounded-full"
                  style={{ backgroundColor: "rgba(187, 134, 252, 0.2)" }}
                >
                  MP3
                </span>
                <span
                  className="px-2 py-1 rounded-full"
                  style={{ backgroundColor: "rgba(187, 134, 252, 0.2)" }}
                >
                  OPUS
                </span>
                <span
                  className="px-2 py-1 rounded-full"
                  style={{ backgroundColor: "rgba(187, 134, 252, 0.2)" }}
                >
                  WAPTT
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dropzone;
