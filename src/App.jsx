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
      style={{ backgroundColor: colors.background, color: colors.onBackground }}
    >
      <div className="container mx-auto">
        <header className="mb-8 text-center">
          <h1
            className="text-3xl md:text-4xl font-bold"
            style={{ color: colors.primary }}
          >
            Audio File Converter
          </h1>
          <p className="mt-2 opacity-80">Convert WAPTT and OPUS to MP3</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Files</h2>
            {fileCounts && <ConversionSummary counts={fileCounts} />}
            {isConverted ? (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Converted Files</h3>
                  <FileList
                    files={processedFiles}
                    onSelectFile={handleSelectFile}
                    selectedFile={selectedFile}
                  />
                </div>
                <button
                  className="w-full py-3 px-4 rounded-lg font-medium transition-all mt-4"
                  style={{
                    backgroundColor: colors.secondary,
                    color: colors.onSecondary,
                  }}
                  onClick={handleDownloadAll}
                >
                  Download All Files
                </button>
              </>
            ) : (
              <div
                className="p-8 rounded-lg flex flex-col items-center justify-center h-64 text-center"
                style={{ backgroundColor: colors.surface }}
              >
                {files.length > 0 ? (
                  <>
                    <p className="mb-4">
                      Ready to convert {files.length} files
                    </p>
                    <button
                      className="py-3 px-6 rounded-lg font-medium transition-all"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.onPrimary,
                      }}
                      onClick={handleConvert}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Converting..." : "Convert Files"}
                    </button>
                  </>
                ) : (
                  <p className="opacity-70">Upload files to get started</p>
                )}
              </div>
            )}
          </div>
          <div>
            {isConverted ? (
              <div>
                <h2 className="text-xl font-semibold mb-4">Media Player</h2>
                <MediaPlayer
                  file={selectedFile}
                  files={processedFiles}
                  onSelectFile={handleSelectFile}
                />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
                <Dropzone onDrop={handleDrop} isProcessing={isProcessing} />
                {files.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Uploaded Files</h3>
                    <FileList
                      files={processFiles(files)}
                      onSelectFile={handlePreviewFile}
                      selectedFile={previewFile}
                    />
                    {previewFile && (
                      <div className="mt-4">
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
      </div>
    </div>
  );
}

export default App;
