import urlManager from "./urlManager";

export const processFiles = (files) => {
  return files.map((file) => {
    const fileName = file.name;
    const lastDotIndex = fileName.lastIndexOf(".");
    const fileExtension =
      lastDotIndex !== -1
        ? fileName.substring(lastDotIndex + 1).toLowerCase()
        : "";

    // If it's already an mp3, don't convert it
    if (fileExtension === "mp3") {
      return {
        originalFile: file,
        convertedFile: file,
        originalName: fileName,
        convertedName: fileName,
        extension: fileExtension,
        status: "unchanged",
        url: urlManager.getUrl(file),
      };
    }

    // For opus and waptt, just rename to mp3
    if (fileExtension === "opus" || fileExtension === "waptt") {
      const newName = fileName.substring(0, lastDotIndex) + ".mp3";
      const convertedFile = new File([file], newName, { type: "audio/mp3" });

      return {
        originalFile: file,
        convertedFile: convertedFile,
        originalName: fileName,
        convertedName: newName,
        extension: fileExtension,
        status: "converted",
        url: urlManager.getUrl(convertedFile),
      };
    }

    // For unsupported files
    return {
      originalFile: file,
      convertedFile: null,
      originalName: fileName,
      convertedName: null,
      extension: fileExtension || "unknown",
      status: "unsupported",
      url: urlManager.getUrl(file),
    };
  });
};

export const getFileCounts = (files) => {
  const counts = {
    total: files.length,
    mp3: 0,
    opus: 0,
    waptt: 0,
    other: 0,
  };

  files.forEach((file) => {
    const extension = file.extension;
    if (extension === "mp3") counts.mp3++;
    else if (extension === "opus") counts.opus++;
    else if (extension === "waptt") counts.waptt++;
    else counts.other++;
  });

  return counts;
};
