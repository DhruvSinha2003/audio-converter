import React, { useEffect, useState } from "react";
import ConversionSummary from "./components/ConversionSummary";
import Dropzone from "./components/Dropzone";
import FileList from "./components/FileList";
import MediaPlayer from "./components/MediaPlayer";
import urlManager from "./utils/urlManager";

import { colors } from "./styles/colors";
import { getFileCounts, processFiles } from "./utils/fileUtils";
import { createAndDownloadZip } from "./utils/zipUtils";

function App() {
  const [files, setFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const [fileCounts, setFileCounts] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const handleDrop = (acceptedFiles) => {
    console.log("Dropped files:", acceptedFiles);
    setFiles(acceptedFiles);
    setIsConverted(false);
    setProcessedFiles([]);
    setSelectedFile(null);
    setPreviewFile(null);
    const processed = processFiles(acceptedFiles);
    setFileCounts(getFileCounts(processed));
  };

  const handleConvert = () => {
    if (files.length === 0) return;
    console.log("Starting conversion for files:", files);
    setIsProcessing(true);

    setTimeout(() => {
      const processed = processFiles(files);
      setProcessedFiles(processed);
      setIsConverted(true);
      setIsProcessing(false);

      console.log("Processed files:", processed);

      if (processed.length > 0) {
        setSelectedFile(processed[0]);
      }
    }, 1500);
  };

  const handleSelectFile = (file) => {
    console.log("Selected file:", file);
    setSelectedFile(file);
  };

  const handlePreviewFile = (file) => {
    console.log("Preview file:", file);
    setPreviewFile(file);
  };

  const handleDownloadAll = () => {
    if (processedFiles.length > 0) {
      console.log("Downloading all files:", processedFiles);
      createAndDownloadZip(processedFiles);
    }
  };

  useEffect(() => {
    return () => {
      urlManager.revokeAll();
    };
  }, []);

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{
        backgroundColor: colors.background,
        color: colors.onBackground,
        backgroundImage:
          "radial-gradient(circle at 10% 20%, rgba(90, 60, 130, 0.1) 0%, rgba(30, 30, 30, 0) 80%)",
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{
              color: colors.primary,
              textShadow: "0 0 15px rgba(187, 134, 252, 0.3)",
            }}
          >
            Audio File Converter
          </h1>
          <p className="mt-3 text-lg opacity-80 font-light">
            Convert WAPTT and OPUS to MP3 with ease
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            className="backdrop-blur-sm backdrop-filter rounded-xl p-6"
            style={{
              backgroundColor: "rgba(30, 30, 30, 0.7)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h2 className="text-xl font-semibold mb-5 flex items-center">
              <span className="mr-2" style={{ color: colors.primary }}>
                📁
              </span>
              Files
            </h2>

            {fileCounts && <ConversionSummary counts={fileCounts} />}

            {isConverted ? (
              <>
                <div className="mb-5">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <span className="mr-2" style={{ color: colors.secondary }}>
                      ✓
                    </span>
                    Converted Files
                  </h3>
                  <FileList
                    files={processedFiles}
                    onSelectFile={handleSelectFile}
                    selectedFile={selectedFile}
                  />
                </div>
                <button
                  className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:scale-105 mt-4 flex items-center justify-center"
                  style={{
                    backgroundColor: colors.secondary,
                    color: colors.onSecondary,
                    boxShadow: "0 4px 12px rgba(3, 218, 198, 0.3)",
                  }}
                  onClick={handleDownloadAll}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Download All Files
                </button>
              </>
            ) : (
              <div
                className="p-8 rounded-xl flex flex-col items-center justify-center min-h-64 text-center transition-all duration-300"
                style={{
                  backgroundColor: "rgba(30, 30, 30, 0.7)",
                  borderLeft:
                    files.length > 0 ? `4px solid ${colors.primary}` : "none",
                }}
              >
                {files.length > 0 ? (
                  <>
                    <div
                      className="mb-4 text-xl"
                      style={{ color: colors.primary }}
                    >
                      🎵
                    </div>
                    <p className="mb-5 text-lg">
                      Ready to convert{" "}
                      <span
                        className="font-bold"
                        style={{ color: colors.primary }}
                      >
                        {files.length}
                      </span>{" "}
                      files
                    </p>
                    <button
                      className="py-3 px-8 rounded-full font-medium transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.onPrimary,
                        boxShadow: "0 4px 15px rgba(187, 134, 252, 0.3)",
                      }}
                      onClick={handleConvert}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                          Converting...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Convert Files
                        </div>
                      )}
                    </button>
                  </>
                ) : (
                  <p className="text-lg opacity-70">
                    Upload files to get started
                  </p>
                )}
              </div>
            )}
          </div>

          <div
            className="backdrop-blur-sm backdrop-filter rounded-xl p-6"
            style={{
              backgroundColor: "rgba(30, 30, 30, 0.7)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            {isConverted ? (
              <div>
                <h2 className="text-xl font-semibold mb-5 flex items-center">
                  <span className="mr-2" style={{ color: colors.primary }}>
                    🎧
                  </span>
                  Media Player
                </h2>
                <MediaPlayer
                  file={selectedFile}
                  files={processedFiles}
                  onSelectFile={handleSelectFile}
                />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-5 flex items-center">
                  <span className="mr-2" style={{ color: colors.primary }}>
                    ⬆️
                  </span>
                  Upload Files
                </h2>
                <Dropzone onDrop={handleDrop} isProcessing={isProcessing} />
                {files.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <span
                        className="mr-2"
                        style={{ color: colors.secondary }}
                      >
                        📋
                      </span>
                      Uploaded Files
                    </h3>
                    <FileList
                      files={processFiles(files)}
                      onSelectFile={handlePreviewFile}
                      selectedFile={previewFile}
                    />
                    {previewFile && (
                      <div className="mt-5">
                        <MediaPlayer
                          file={previewFile}
                          files={processFiles(files)}
                          onSelectFile={handlePreviewFile}
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center text-sm opacity-60">
          <a
            href="https://dhruvsinha.com"
            className="hover:text-gray-400 transition-colors duration-300 hover:underline"
          >
            <p className="text-sm font-light">dhruvsinha.com</p>
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
