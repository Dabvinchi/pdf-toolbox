import { useState } from "react";
import compressPDF from "../utils/compressPdf";

function CompressButton({
  files,
  compressionMode,
  compressionLevel,
  onSuccess,
  onError,
}) {
  const [isCompressing, setIsCompressing] =
    useState(false);

  const [progress, setProgress] =
    useState(null);

  async function handleCompress() {
    if (files.length !== 1) {
      onError("Please select one PDF.");
      return;
    }

    try {
      setIsCompressing(true);
      setProgress(null);

      const result = await compressPDF(
        files[0].file,
        compressionMode,
        compressionLevel,
        ({ current, total }) => {
          setProgress({
            current,
            total,
          });
        }
      );

      onSuccess(result);
    } catch (error) {
      console.error(error);

      onError(
        error.message ||
          "Something went wrong while compressing the PDF."
      );
    } finally {
      setIsCompressing(false);
      setProgress(null);
    }
  }

  let buttonText = "🗜️ Compress PDF";

  if (isCompressing && progress) {
    buttonText =
      `⏳ Compressing Page ${progress.current} of ${progress.total}...`;
  } else if (isCompressing) {
    buttonText = "⏳ Compressing...";
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
      {buttonText}
    </button>
  );
}

export default CompressButton;