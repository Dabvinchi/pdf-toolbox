import { useState } from "react";
import compressPDF from "../utils/compressPdf";

function CompressButton({
  files,
  onSuccess,
  onError,
}) {
  const [isCompressing, setIsCompressing] =
    useState(false);

  async function handleCompress() {
    if (files.length !== 1) {
      onError("Please select one PDF.");
      return;
    }

    try {
      setIsCompressing(true);

      const result = await compressPDF(
        files[0].file
      );

      onSuccess(
        `PDF compressed successfully! Saved ${formatFileSize(
          result.savedBytes
        )}. Your file has been downloaded.`
      );
    } catch (error) {
      console.error(error);

      onError(
        "Something went wrong while compressing the PDF."
      );
    } finally {
      setIsCompressing(false);
    }
  }

  return (
    <button
      className="compress-button"
      onClick={handleCompress}
      disabled={
        isCompressing ||
        files.length !== 1
      }
    >
      {isCompressing
        ? "⏳ Compressing..."
        : "🗜️ Compress PDF"}
    </button>
  );
}

function formatFileSize(bytes) {
  if (bytes <= 0) {
    return "0 B";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default CompressButton;