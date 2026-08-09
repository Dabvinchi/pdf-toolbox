import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function PdfThumbnailViewer({ file }) {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPdf() {
      if (!file) {
        setPages([]);
        return;
      }

      setLoading(true);
      setError("");
      setPages([]);

      try {
        const arrayBuffer = await file.arrayBuffer();

        const loadingTask = pdfjsLib.getDocument({
          data: arrayBuffer,
        });

        const pdf = await loadingTask.promise;

        const renderedPages = [];

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          if (cancelled) {
            return;
          }

          const page = await pdf.getPage(pageNumber);

          const viewport = page.getViewport({
            scale: 0.5,
          });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;

          renderedPages.push({
            pageNumber,
            canvas,
          });
        }

        if (!cancelled) {
          setPages(renderedPages);
        }
      } catch (err) {
        console.error("PDF thumbnail error:", err);

        if (!cancelled) {
          setError("Failed to load PDF file.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      cancelled = true;
    };
  }, [file]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    containerRef.current.innerHTML = "";

    pages.forEach(({ pageNumber, canvas }) => {
      const card = document.createElement("div");
      card.className = "thumbnail-card";

      const canvasWrapper = document.createElement("div");
      canvasWrapper.className = "thumbnail-canvas";

      canvasWrapper.appendChild(canvas);

      const label = document.createElement("p");
      label.textContent = `Page ${pageNumber}`;

      card.appendChild(canvasWrapper);
      card.appendChild(label);

      containerRef.current.appendChild(card);
    });
  }, [pages]);

  if (!file) {
    return null;
  }

  return (
    <div className="thumbnail-section">
      <h3>PDF Preview</h3>

      {loading && (
        <p className="thumbnail-status">
          Loading PDF pages...
        </p>
      )}

      {error && (
        <p className="split-error">
          {error}
        </p>
      )}

      <div
        ref={containerRef}
        className="thumbnail-viewer"
      />
    </div>
  );
}

export default PdfThumbnailViewer;