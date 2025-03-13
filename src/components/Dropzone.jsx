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
      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all"
      style={{
        borderColor: isDragActive ? colors.primary : colors.divider,
        backgroundColor: colors.surface,
        color: colors.onSurface,
        opacity: isProcessing ? 0.6 : 1,
      }}
    >
      <input {...getInputProps()} />
      {isProcessing ? (
        <div className="flex flex-col items-center justify-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mb-4"
            style={{ borderColor: colors.primary }}
          ></div>
          <p className="text-lg">Converting files...</p>
        </div>
      ) : (
        <>
          <div className="text-6xl mb-4">📂</div>
          {isDragActive ? (
            <p className="text-lg">Drop the audio files here...</p>
          ) : (
            <div>
              <p className="text-lg mb-2">
                Drag & drop audio files here, or click to select files
              </p>
              <p className="text-sm opacity-75">
                Supports MP3, OPUS, and WAPTT files
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dropzone;
