import { useEffect, useState } from "react";
import JSZip from "jszip";

import UploadBox from "../components/UploadBox";
import FileList from "../features/merge/FileList";
import ImagePageSelector from "../features/pdfImages/ImagePageSelector";

import { convertPdfPagesToImages } from "../utils/pdfToImages";

function PdfImagesTool({ setActiveTool }) {
  const [files, setFiles] = useState([]);
  const [selectedPages, setSelectedPages] =
    useState([]);

  const [format, setFormat] = useState("png");
  const [quality, setQuality] = useState(80);
  const [scale, setScale] = useState(1);

  const [isConverting, setIsConverting] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [error, setError] = useState("");

  useEffect(() => {
    setSelectedPages([]);
    setError("");
    setProgress(0);
  }, [files]);

  function handleFilesChange(newFiles) {
    setFiles(newFiles);
    setSelectedPages([]);
    setError("");
    setProgress(0);
  }

  async function handleConvert() {
    if (
      files.length !== 1 ||
      selectedPages.length === 0
    ) {
      return;
    }

    try {
      setIsConverting(true);
      setProgress(0);
      setError("");

      const pdfFile = files[0].file;

      const images =
        await convertPdfPagesToImages({
          file: pdfFile,
          pages: selectedPages,
          format,
          quality,
          scale,
          onProgress: setProgress,
        });

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
              Math.max(
                progress,
                Math.round(
                  metadata.percent
                )
              )
            );
          }
        );

      const url =
        URL.createObjectURL(zipBlob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        "pdf-images.zip";

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);

      setProgress(100);
    } catch (error) {
      console.error(
        "PDF to Images error:",
        error
      );

      setError(
        error?.message ||
          "Failed to convert PDF pages."
      );
    } finally {
      setIsConverting(false);
    }
  }

  const pdfFile =
    files.length === 1
      ? files[0].file
      : null;

  return (
    <>
      <button
        className="back-button"
        onClick={() =>
          setActiveTool(null)
        }
      >
        ← Back to Tools
      </button>

      <div className="tool-page">
        <h1>🖼️ PDF to Images</h1>

        <p>
          Convert selected PDF pages into
          PNG or JPG images.
        </p>

        <UploadBox
          files={files}
          setFiles={handleFilesChange}
        />

        <FileList
          files={files}
          setFiles={handleFilesChange}
        />

        {pdfFile && (
          <ImagePageSelector
            file={pdfFile}
            selectedPages={selectedPages}
            setSelectedPages={
              setSelectedPages
            }
          />
        )}

        {pdfFile &&
          selectedPages.length > 0 && (
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
                    disabled={isConverting}
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
                    disabled={isConverting}
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
                      Converting...
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
                  ? `Converting... ${progress}%`
                  : "🖼️ Convert to Images"}
              </button>
            </div>
          )}
      </div>
    </>
  );
}

export default PdfImagesTool;