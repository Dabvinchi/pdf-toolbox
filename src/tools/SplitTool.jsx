import { useEffect, useState } from "react";
import UploadBox from "../components/UploadBox";
import SplitButton from "../components/SplitButton";
import FileList from "../features/merge/FileList";
import PdfThumbnailViewer from "../features/split/PdfThumbnailViewer";
import { getPdfPageCount } from "../utils/getPdfPageCount";

function SplitTool({ setActiveTool }) {
  const [files, setFiles] = useState([]);
  const [startPage, setStartPage] = useState("");
  const [endPage, setEndPage] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPageCount() {
      if (files.length !== 1) {
        setPageCount(0);
        setStartPage("");
        setEndPage("");
        setError("");
        return;
      }

      try {
        const count = await getPdfPageCount(files[0].file);

        setPageCount(count);
        setStartPage("1");
        setEndPage(String(count));
      } catch (error) {
        console.error(error);
        setError("Failed to read the PDF.");
      }
    }

    loadPageCount();
  }, [files]);

  useEffect(() => {
    if (files.length !== 1) {
      setError("");
      return;
    }

    const start = Number(startPage);
    const end = Number(endPage);

    if (!start || !end) {
      setError("Enter both page numbers.");
      return;
    }

    if (start < 1) {
      setError("Start page must be at least 1.");
      return;
    }

    if (end > pageCount) {
      setError(`This PDF only has ${pageCount} pages.`);
      return;
    }

    if (start > end) {
      setError(
        "Start page must be less than or equal to the end page."
      );
      return;
    }

    setError("");
  }, [startPage, endPage, pageCount, files]);

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
          Extract a range of pages from a PDF into a new document.
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
          <PdfThumbnailViewer
            file={files[0].file}
          />
        )}

        {pageCount > 0 && (
          <p className="page-count">
            📄 Total Pages: <strong>{pageCount}</strong>
          </p>
        )}

        <div className="split-options">
          <h3>Pages</h3>

          <div className="page-inputs">
            <input
              type="number"
              min="1"
              max={pageCount}
              placeholder="Start"
              value={startPage}
              onChange={(e) => setStartPage(e.target.value)}
            />

            <span>—</span>

            <input
              type="number"
              min="1"
              max={pageCount}
              placeholder="End"
              value={endPage}
              onChange={(e) => setEndPage(e.target.value)}
            />
          </div>

          <p className="split-help">
            Example: 1–{pageCount || 5}
          </p>

          {error && (
            <p className="split-error">
              {error}
            </p>
          )}

          <SplitButton
            files={files}
            startPage={startPage}
            endPage={endPage}
            error={error}
          />
        </div>
      </div>
    </>
  );
}

export default SplitTool;