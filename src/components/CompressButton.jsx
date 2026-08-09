import { useState } from "react";
import compressPDF from "../utils/compressPdf";

function CompressButton({
  files,
  compressionLevel,
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
        files[0].file,
        compressionLevel
      );

      onSuccess(result);
    } catch (error) {
      console.error(error);

      onError(
        "Something went wrong while compressing the PDF."
      );
    } finally {
      setIsCompressing(false);
    }
  }

  const buttonText = {
    high: "🗜️ Compress PDF",
    recommended: "🗜️ Compress PDF",
    small: "🗜️ Compress PDF",
  };

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
        : buttonText[compressionLevel]}
    </button>
  );
}

export default CompressButton;