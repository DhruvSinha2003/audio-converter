import React from "react";
import { colors } from "../styles/colors";

const MediaPlayer = ({ file }) => {
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
      <audio controls className="w-full rounded" src={file.url}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default MediaPlayer;
