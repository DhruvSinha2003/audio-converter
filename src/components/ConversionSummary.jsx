import React from "react";
import { colors } from "../styles/colors";

const ConversionSummary = ({ counts }) => {
  if (!counts) return null;

  return (
    <div
      className="rounded-lg p-4 mb-4"
      style={{ backgroundColor: colors.surface, color: colors.onSurface }}
    >
      <h3 className="text-lg font-medium mb-2">File Summary</h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center">
          <span
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: colors.primary }}
          ></span>
          <span className="text-sm">Total: {counts.total}</span>
        </div>
        <div className="flex items-center">
          <span
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: colors.secondary }}
          ></span>
          <span className="text-sm">MP3: {counts.mp3}</span>
        </div>
        <div className="flex items-center">
          <span
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: colors.primaryVariant }}
          ></span>
          <span className="text-sm">OPUS: {counts.opus}</span>
        </div>
        <div className="flex items-center">
          <span
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: colors.error }}
          ></span>
          <span className="text-sm">WAPTT: {counts.waptt}</span>
        </div>
      </div>
    </div>
  );
};

export default ConversionSummary;
