import { useEffect, useState } from "react";
import UploadBox from "../components/UploadBox";
import SplitButton from "../components/SplitButton";
import FileList from "../features/merge/FileList";
import PdfThumbnailViewer from "../features/split/PdfThumbnailViewer";
import { getPdfPageCount } from "../utils/getPdfPageCount";

function SplitTool({ setActiveTool }) {
  const [files, setFiles] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadPageCount() {
      if (files.length !== 1) {
        setPageCount(0);
        setSelectedPages([]);
        setError("");
        setSuccess("");
        return;
      }

      try {
        const count = await getPdfPageCount(
          files[0].file
        );

        setPageCount(count);

        // Select all pages initially.
        setSelectedPages(
          Array.from(
            { length: count },
            (_, index) => index + 1
          )
        );

        setError("");
        setSuccess("");
      } catch (error) {
        console.error(error);

        setPageCount(0);
        setSelectedPages([]);
        setError("Failed to read the PDF.");
        setSuccess("");
      }
    }

    loadPageCount();
  }, [files]);

  function handleSelectAll() {
    if (pageCount === 0) {
      return;
    }

    setSelectedPages(
      Array.from(
        { length: pageCount },
        (_, index) => index + 1
      )
    );

    setError("");
    setSuccess("");
  }

  function handleClearSelection() {
    setSelectedPages([]);
    setError("");
    setSuccess("");
  }

  function handleSuccess() {
    setSuccess(
      "PDF split successfully! Your file has been downloaded."
    );

    setError("");
  }

  function handleError(message) {
    setError(message);
    setSuccess("");
  }

  const selectedPagesText =
    selectedPages.length > 0
      ? [...selectedPages]
          .sort((a, b) => a - b)
          .join(", ")
      : "None";

  return (
    <>
      <button
        className="back-button"
        onClick={() => setActiveTool(null)}
      >
        ← Back to Tools
      </button>

      <div className="tool-page">
        <h1>✂ Split PDF</h1>

        <p>
          Select the pages you want to extract
          into a new PDF.
        </p>

        <UploadBox
          files={files}
          setFiles={setFiles}
        />

        <FileList
          files={files}
          setFiles={setFiles}
        />

        {files.length === 1 && (
          <>
            <div className="thumbnail-actions">
              <button
                type="button"
                onClick={handleSelectAll}
              >
                Select All
              </button>

              <button
                type="button"
                onClick={handleClearSelection}
              >
                Clear Selection
              </button>
            </div>

            <PdfThumbnailViewer
              file={files[0].file}
              selectedPages={selectedPages}
              setSelectedPages={setSelectedPages}
            />
          </>
        )}

        {pageCount > 0 && (
          <p className="page-count">
            📄 Total Pages:{" "}
            <strong>{pageCount}</strong>
          </p>
        )}

        {files.length === 1 && (
          <div className="split-summary">
            <p>
              Selected pages:
            </p>

            <strong>
              {selectedPagesText}
            </strong>
          </div>
        )}

        {error && (
          <p className="split-error">
            {error}
          </p>
        )}

        {success && (
          <p className="split-success">
            ✓ {success}
          </p>
        )}

        <SplitButton
          files={files}
          selectedPages={selectedPages}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </>
  );
}

export default SplitTool;