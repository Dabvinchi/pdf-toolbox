import { useEffect, useState } from "react";

import UploadBox from "../components/UploadBox";
import FileList from "../features/merge/FileList";
import PdfThumbnailViewer from "../features/split/PdfThumbnailViewer";

import { extractPages } from "../utils/extractPages";

function ExtractPagesTool({ setActiveTool }) {
  const [files, setFiles] = useState([]);
  const [selectedPages, setSelectedPages] =
    useState([]);
  const [totalPages, setTotalPages] =
    useState(0);

  const [isExtracting, setIsExtracting] =
    useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSelectedPages([]);
    setTotalPages(0);
    setError("");
  }, [files]);

  function handleFilesChange(newFiles) {
    setFiles(newFiles);
    setSelectedPages([]);
    setTotalPages(0);
    setError("");
  }

  function selectAllPages() {
    if (!totalPages) {
      return;
    }

    const allPages = Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );

    setSelectedPages(allPages);
  }

  function clearSelection() {
    setSelectedPages([]);
    setError("");
  }

  async function handleExtract() {
    if (
      files.length !== 1 ||
      selectedPages.length === 0 ||
      isExtracting
    ) {
      return;
    }

    try {
      setIsExtracting(true);
      setError("");

      const pdfFile = files[0].file;

      const pdfBytes = await extractPages({
        file: pdfFile,
        selectedPages,
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
        `${baseName}-extracted.pdf`;

      const link =
        document.createElement("a");

      link.href = url;
      link.download = filename;

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(
        "Extract PDF error:",
        err
      );

      setError(
        err?.message ||
          "Failed to extract pages."
      );
    } finally {
      setIsExtracting(false);
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
        onClick={() => setActiveTool(null)}
        disabled={isExtracting}
      >
        ← Back to Tools
      </button>

      <div className="tool-page">
        <h1>📑 Extract Pages</h1>

        <p>
          Select the pages you want to
          extract into a new PDF.
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
          <>
            <div className="extract-selection-header">
              <div>
                <h3>Select Pages</h3>

                <p>
                  Click the pages you want
                  to extract.
                </p>
              </div>

              <div className="extract-selection-actions">
                <button
                  type="button"
                  onClick={selectAllPages}
                  disabled={isExtracting}
                >
                  Select All
                </button>

                <button
                  type="button"
                  onClick={clearSelection}
                  disabled={isExtracting}
                >
                  Clear
                </button>
              </div>
            </div>

            <PdfThumbnailViewer
              file={pdfFile}
              selectedPages={selectedPages}
              setSelectedPages={
                setSelectedPages
              }
              setTotalPages={
                setTotalPages
              }
            />
          </>
        )}

        {pdfFile && (
          <div className="extract-options">
            <div className="extract-summary">
              <span>
                <strong>
                  {selectedPages.length}
                </strong>{" "}
                {selectedPages.length === 1
                  ? "page"
                  : "pages"}{" "}
                selected
              </span>
            </div>

            {error && (
              <p className="split-error">
                {error}
              </p>
            )}

            <button
              type="button"
              className="extract-pages-button"
              onClick={handleExtract}
              disabled={
                selectedPages.length === 0 ||
                isExtracting
              }
            >
              {isExtracting
                ? "Extracting Pages..."
                : "📑 Extract Pages"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default ExtractPagesTool;