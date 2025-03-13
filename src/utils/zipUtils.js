import { saveAs } from "file-saver";
import JSZip from "jszip";

export const createAndDownloadZip = async (files) => {
  const zip = new JSZip();

  files.forEach((file) => {
    if (file.convertedFile) {
      zip.file(file.convertedName, file.convertedFile);
    }
  });

  const content = await zip.generateAsync({ type: "blob" });

  saveAs(content, "converted_audio_files.zip");
};
