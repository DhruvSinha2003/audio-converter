import React from "react";
import { colors } from "../styles/colors";

const FileList = ({ files, onSelectFile, selectedFile }) => {
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
