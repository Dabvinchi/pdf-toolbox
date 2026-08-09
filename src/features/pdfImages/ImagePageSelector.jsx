import { useEffect, useState } from "react";
import {
  Document,
  Page,
  pdfjs,
} from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc =
  workerUrl;

function ImagePageSelector({
  file,
  selectedPages,
  setSelectedPages,
}) {
  const [numPages, setNumPages] =
    useState(0);

  useEffect(() => {
    setNumPages(0);
  }, [file]);

  function handleLoadSuccess({
    numPages,
  }) {
    setNumPages(numPages);
  }

  function handleLoadError(error) {
    console.error(
      "PDF thumbnail loading error:",
      error
    );
  }

  function togglePage(pageNumber) {
    setSelectedPages((current) => {
      if (current.includes(pageNumber)) {
        return current.filter(
          (page) => page !== pageNumber
        );
      }

      return [...current, pageNumber].sort(
        (a, b) => a - b
      );
    });
  }

  function selectAll() {
    const allPages = Array.from(
      { length: numPages },
      (_, index) => index + 1
    );

    setSelectedPages(allPages);
  }

  function deselectAll() {
    setSelectedPages([]);
  }

  return (
    <div className="image-page-selector">
      <div className="page-selector-header">
        <div>
          <h3>Select Pages</h3>

          <p>
            {selectedPages.length} of{" "}
            {numPages} pages selected
          </p>
        </div>

        <div className="page-selector-actions">
          <button
            type="button"
            onClick={selectAll}
            disabled={numPages === 0}
          >
            Select All
          </button>

          <button
            type="button"
            onClick={deselectAll}
            disabled={
              selectedPages.length === 0
            }
          >
            Deselect All
          </button>
        </div>
      </div>

      <Document
        file={file}
        onLoadSuccess={handleLoadSuccess}
        onLoadError={handleLoadError}
        loading={
          <p className="thumbnail-loading">
            Loading PDF pages...
          </p>
        }
        error={
          <p className="thumbnail-error">
            Failed to load PDF pages.
          </p>
        }
      >
        <div className="image-page-grid">
          {Array.from(
            { length: numPages },
            (_, index) => {
              const pageNumber =
                index + 1;

              const isSelected =
                selectedPages.includes(
                  pageNumber
                );

              return (
                <button
                  type="button"
                  key={pageNumber}
                  className={`image-page-card ${
                    isSelected
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    togglePage(pageNumber)
                  }
                >
                  <div className="page-checkbox">
                    {isSelected ? "✓" : ""}
                  </div>

                  <Page
                    pageNumber={pageNumber}
                    width={160}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />

                  <span>
                    Page {pageNumber}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </Document>
    </div>
  );
}

export default ImagePageSelector;