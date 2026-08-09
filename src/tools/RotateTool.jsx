import { useEffect, useState } from "react";

import UploadBox from "../components/UploadBox";
import FileList from "../features/merge/FileList";
import PdfThumbnailViewer from "../features/split/PdfThumbnailViewer";

import { rotatePdfPages } from "../utils/rotatePdf";

function RotateTool({ setActiveTool }) {
  const [files, setFiles] = useState([]);
  const [selectedPages, setSelectedPages] =
    useState([]);

  const [rotation, setRotation] = useState(90);

  const [isRotating, setIsRotating] =
    useState(false);

  const [error, setError] = useState("");

  async function handleRotate() {
    if (
      files.length !== 1 ||
      selectedPages.length === 0 ||
      isRotating
    ) {
      return;
    }

    try {
      setIsRotating(true);
      setError("");

      const pdfFile = files[0].file;

      const pdfBytes =
        await rotatePdfPages({
          file: pdfFile,
          selectedPages,
          rotation,
        });

      const blob = new Blob(
        [pdfBytes],
        {
          type: "application/pdf",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const originalName =
        pdfFile.name;

      const lastDot =
        originalName.lastIndexOf(".");

      const baseName =
        lastDot > 0
          ? originalName.substring(
              0,
              lastDot
            )
          : originalName;

      const filename =
        `${baseName}-rotated.pdf`;

      const link =
        document.createElement("a");

      link.href = url;
      link.download = filename;

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Rotate PDF error:",
        error
      );

      setError(
        error?.message ||
          "Failed to rotate PDF."
      );
    } finally {
      setIsRotating(false);
    }
  }

  useEffect(() => {
    setSelectedPages([]);
    setError("");
  }, [files]);

  function handleFilesChange(newFiles) {
    setFiles(newFiles);
    setSelectedPages([]);
    setError("");
  }

  const pdfFile =
    files.length === 1
      ? files[0].file
      : null;

  return (
    <>
      <button
        className="back-button"
        onClick={() => setActiveTool(null)}
        disabled={isRotating}
      >
        ← Back to Tools
      </button>

      <div className="tool-page">
        <h1>🔄 Rotate PDF</h1>

        <p>
          Rotate selected pages of your PDF.
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
          <PdfThumbnailViewer
            file={pdfFile}
            selectedPages={selectedPages}
            setSelectedPages={
              setSelectedPages
            }
          />
        )}

        {pdfFile &&
          selectedPages.length > 0 && (
            <div className="rotate-options">
              <h3>
                Rotate Selected Pages
              </h3>

              <div className="rotation-buttons">
                <button
                  type="button"
                  className={
                    rotation === 90
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setRotation(90)
                  }
                  disabled={isRotating}
                >
                  ↷ 90°
                </button>

                <button
                  type="button"
                  className={
                    rotation === 180
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setRotation(180)
                  }
                  disabled={isRotating}
                >
                  ↻ 180°
                </button>

                <button
                  type="button"
                  className={
                    rotation === 270
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setRotation(270)
                  }
                  disabled={isRotating}
                >
                  ↶ 90°
                </button>
              </div>

              <div className="rotate-summary">
                <span>
                  <strong>
                    {selectedPages.length}
                  </strong>{" "}
                  {selectedPages.length === 1
                    ? "page"
                    : "pages"}{" "}
                  selected
                </span>

                <span>
                  <strong>
                    {rotation}°
                  </strong>{" "}
                  rotation
                </span>
              </div>

              {error && (
                <p className="split-error">
                  {error}
                </p>
              )}

              <button
                type="button"
                className="rotate-pdf-button"
                onClick={handleRotate}
                disabled={isRotating}
              >
                {isRotating
                  ? "Rotating PDF..."
                  : "🔄 Rotate PDF"}
              </button>
            </div>
          )}
      </div>
    </>
  );
}

export default RotateTool;