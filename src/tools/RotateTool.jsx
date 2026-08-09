import { useEffect, useState } from "react";

import UploadBox from "../components/UploadBox";
import FileList from "../features/merge/FileList";
import PdfThumbnailViewer from "../features/split/PdfThumbnailViewer";

function RotateTool({ setActiveTool }) {
  const [files, setFiles] = useState([]);
  const [selectedPages, setSelectedPages] =
    useState([]);

  const [rotation, setRotation] = useState(90);

  useEffect(() => {
    setSelectedPages([]);
  }, [files]);

  function handleFilesChange(newFiles) {
    setFiles(newFiles);
    setSelectedPages([]);
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

              <button
                type="button"
                className="rotate-pdf-button"
              >
                🔄 Rotate PDF
              </button>
            </div>
          )}
      </div>
    </>
  );
}

export default RotateTool;