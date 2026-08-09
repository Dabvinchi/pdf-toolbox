import { useEffect, useState } from "react";
import JSZip from "jszip";

import UploadBox from "../components/UploadBox";
import FileList from "../features/merge/FileList";
import ImagePageSelector from "../features/pdfImages/ImagePageSelector";

import { convertPdfPagesToImages } from "../utils/pdfToImages";

function PdfImagesTool({ setActiveTool }) {
  const [files, setFiles] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);

  const [format, setFormat] = useState("png");
  const [quality, setQuality] = useState(80);
  const [scale, setScale] = useState(1);

  const [isConverting, setIsConverting] =
    useState(false);

  const [progress, setProgress] = useState(0);

  const [conversionStage, setConversionStage] =
    useState("");

  const [convertedCount, setConvertedCount] =
    useState(0);

  const [error, setError] = useState("");

  const [downloadUrl, setDownloadUrl] =
    useState(null);

  const [downloadFilename, setDownloadFilename] =
    useState("pdf-images.zip");

  useEffect(() => {
    setSelectedPages([]);
    setError("");
    setProgress(0);
    setConversionStage("");
    setConvertedCount(0);

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  }, [files]);

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  function handleFilesChange(newFiles) {
    setFiles(newFiles);
    setSelectedPages([]);
    setError("");
    setProgress(0);
    setConversionStage("");
    setConvertedCount(0);
  }

  function getZipFilename(filename) {
    const lastDot =
      filename.lastIndexOf(".");

    const baseName =
      lastDot > 0
        ? filename.substring(0, lastDot)
        : filename;

    return `${baseName}-images.zip`;
  }

  async function handleConvert() {
    if (
      files.length !== 1 ||
      selectedPages.length === 0 ||
      isConverting
    ) {
      return;
    }

    let temporaryUrl = null;

    try {
      setIsConverting(true);
      setProgress(0);
      setConversionStage(
        "Rendering PDF pages..."
      );
      setConvertedCount(0);
      setError("");

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
        setDownloadUrl(null);
      }

      const pdfFile = files[0].file;

      const images =
        await convertPdfPagesToImages({
          file: pdfFile,
          pages: selectedPages,
          format,
          quality,
          scale,

          onProgress: (pageProgress) => {
            setProgress(pageProgress);

            const completedPages =
              Math.round(
                (pageProgress /
                  100) *
                  selectedPages.length
              );

            setConvertedCount(
              Math.min(
                completedPages,
                selectedPages.length
              )
            );
          },
        });

      setConversionStage(
        "Creating ZIP file..."
      );

      setProgress(0);

      const zip = new JSZip();

      images.forEach((image) => {
        zip.file(
          image.filename,
          image.blob
        );
      });

      const zipBlob =
        await zip.generateAsync(
          {
            type: "blob",
          },
          (metadata) => {
            setProgress(
              Math.round(metadata.percent)
            );
          }
        );

      temporaryUrl =
        URL.createObjectURL(zipBlob);

      const filename =
        getZipFilename(
          pdfFile.name
        );

      setDownloadFilename(filename);
      setDownloadUrl(temporaryUrl);

      setProgress(100);
      setConversionStage(
        "Conversion complete!"
      );
      setConvertedCount(images.length);
    } catch (conversionError) {
      console.error(
        "PDF to Images error:",
        conversionError
      );

      setError(
        conversionError?.message ||
          "Something went wrong while converting the PDF."
      );

      setConversionStage("");
      setProgress(0);
    } finally {
      setIsConverting(false);
    }
  }

  function handleDownload() {
    if (!downloadUrl) {
      return;
    }

    const link =
      document.createElement("a");

    link.href = downloadUrl;
    link.download = downloadFilename;

    document.body.appendChild(link);

    link.click();

    link.remove();
  }

  function handleStartOver() {
    if (isConverting) {
      return;
    }

    setFiles([]);
    setSelectedPages([]);
    setProgress(0);
    setConversionStage("");
    setConvertedCount(0);
    setError("");

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  }

  const pdfFile =
    files.length === 1
      ? files[0].file
      : null;

  const conversionComplete =
    Boolean(downloadUrl) &&
    !isConverting &&
    !error;

  return (
    <>
      <button
        className="back-button"
        onClick={() =>
          setActiveTool(null)
        }
        disabled={isConverting}
      >
        ← Back to Tools
      </button>

      <div className="tool-page">
        <h1>🖼️ PDF to Images</h1>

        <p>
          Convert selected PDF pages into
          PNG or JPG images.
        </p>

        {!conversionComplete && (
          <>
            <UploadBox
              files={files}
              setFiles={handleFilesChange}
            />

            <FileList
              files={files}
              setFiles={handleFilesChange}
            />
          </>
        )}

        {pdfFile &&
          !conversionComplete && (
            <ImagePageSelector
              file={pdfFile}
              selectedPages={selectedPages}
              setSelectedPages={
                setSelectedPages
              }
            />
          )}

        {pdfFile &&
          selectedPages.length > 0 &&
          !conversionComplete && (
            <div className="image-options">
              <h3>Image Options</h3>

              <div className="image-option-group">
                <label>
                  Image Format
                </label>

                <div className="format-buttons">
                  <button
                    type="button"
                    className={
                      format === "png"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setFormat("png")
                    }
                    disabled={
                      isConverting
                    }
                  >
                    PNG
                  </button>

                  <button
                    type="button"
                    className={
                      format === "jpg"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setFormat("jpg")
                    }
                    disabled={
                      isConverting
                    }
                  >
                    JPG
                  </button>
                </div>
              </div>

              {format === "jpg" && (
                <div className="image-option-group">
                  <div className="option-label-row">
                    <label>
                      JPG Quality
                    </label>

                    <span>
                      {quality}%
                    </span>
                  </div>

                  <input
                    className="quality-slider"
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={quality}
                    onChange={(e) =>
                      setQuality(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    disabled={
                      isConverting
                    }
                  />

                  <div className="slider-labels">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              )}

              <div className="image-option-group">
                <label>
                  Resolution
                </label>

                <div className="scale-buttons">
                  <button
                    type="button"
                    className={
                      scale === 1
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setScale(1)
                    }
                    disabled={
                      isConverting
                    }
                  >
                    1×
                  </button>

                  <button
                    type="button"
                    className={
                      scale === 1.5
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setScale(1.5)
                    }
                    disabled={
                      isConverting
                    }
                  >
                    1.5×
                  </button>

                  <button
                    type="button"
                    className={
                      scale === 2
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setScale(2)
                    }
                    disabled={
                      isConverting
                    }
                  >
                    2×
                  </button>
                </div>
              </div>

              <div className="image-settings-summary">
                <span>
                  <strong>
                    {
                      selectedPages.length
                    }
                  </strong>{" "}
                  {selectedPages.length ===
                  1
                    ? "page"
                    : "pages"}
                </span>

                <span>
                  <strong>
                    {format.toUpperCase()}
                  </strong>
                </span>

                {format === "jpg" && (
                  <span>
                    <strong>
                      {quality}%
                    </strong>{" "}
                    quality
                  </span>
                )}

                <span>
                  <strong>
                    {scale}×
                  </strong>{" "}
                  resolution
                </span>
              </div>

              {error && (
                <p className="split-error">
                  {error}
                </p>
              )}

              {isConverting && (
                <div className="conversion-progress">
                  <div className="progress-header">
                    <span>
                      {conversionStage}
                    </span>

                    <strong>
                      {progress}%
                    </strong>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  {conversionStage ===
                    "Rendering PDF pages..." && (
                    <p className="progress-detail">
                      Page{" "}
                      {convertedCount} of{" "}
                      {
                        selectedPages.length
                      }
                    </p>
                  )}
                </div>
              )}

              <button
                type="button"
                className="convert-images-button"
                onClick={handleConvert}
                disabled={
                  isConverting ||
                  selectedPages.length ===
                    0
                }
              >
                {isConverting
                  ? "Converting..."
                  : "🖼️ Convert to Images"}
              </button>
            </div>
          )}

        {conversionComplete && (
          <div className="conversion-complete">
            <div className="success-icon">
              ✓
            </div>

            <h2>
              Conversion complete!
            </h2>

            <p>
              Successfully created{" "}
              <strong>
                {convertedCount}
              </strong>{" "}
              {convertedCount === 1
                ? "image"
                : "images"}.
            </p>

            <p className="download-filename">
              {downloadFilename}
            </p>

            <div className="completion-actions">
              <button
                type="button"
                className="convert-images-button"
                onClick={handleDownload}
              >
                ⬇️ Download Images
              </button>

              <button
                type="button"
                className="start-over-button"
                onClick={handleStartOver}
              >
                Convert Another PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default PdfImagesTool;