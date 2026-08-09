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

  useEffect(() => {
    async function loadPageCount() {
      if (files.length !== 1) {
        setPageCount(0);
        setSelectedPages([]);
        setError("");
        return;
      }

      try {
        const count = await getPdfPageCount(
          files[0].file
        );

        setPageCount(count);

        // Select every page initially.
        setSelectedPages(
          Array.from(
            { length: count },
            (_, index) => index + 1
          )
        );

        setError("");
      } catch (error) {
        console.error(error);

        setPageCount(0);
        setSelectedPages([]);
        setError("Failed to read the PDF.");
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
  }

  function handleClearSelection() {
    setSelectedPages([]);
  }

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

        {error && (
          <p className="split-error">
            {error}
          </p>
        )}

        <div className="split-summary">
          <p>
            Selected pages:{" "}
            <strong>
              {selectedPages.length}
            </strong>
          </p>
        </div>

        <SplitButton
          files={files}
          selectedPages={selectedPages}
        />
      </div>
    </>
  );
}

export default SplitTool;