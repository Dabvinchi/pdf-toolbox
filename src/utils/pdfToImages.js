import { pdfjs } from "react-pdf";

async function getPdfDocument(file) {
  const arrayBuffer = await file.arrayBuffer();

  return pdfjs.getDocument({
    data: arrayBuffer,
  }).promise;
}

export async function convertPdfPagesToImages({
  file,
  pages,
  format,
  quality,
  scale,
  onProgress,
}) {
  if (!file) {
    throw new Error("No PDF file selected.");
  }

  if (!pages || pages.length === 0) {
    throw new Error("No pages selected.");
  }

  const pdf = await getPdfDocument(file);

  const results = [];

  for (let index = 0; index < pages.length; index++) {
    const pageNumber = pages[index];

    const page = await pdf.getPage(pageNumber);

    const viewport = page.getViewport({
      scale,
    });

    const canvas =
      document.createElement("canvas");

    const context = canvas.getContext("2d", {
      alpha: false,
    });

    if (!context) {
      throw new Error(
        "Could not create canvas context."
      );
    }

    canvas.width = Math.ceil(
      viewport.width
    );

    canvas.height = Math.ceil(
      viewport.height
    );

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    const mimeType =
      format === "jpg"
        ? "image/jpeg"
        : "image/png";

    const imageQuality =
      format === "jpg"
        ? quality / 100
        : undefined;

    const blob = await new Promise(
      (resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) {
              resolve(result);
            } else {
              reject(
                new Error(
                  "Failed to create image."
                )
              );
            }
          },
          mimeType,
          imageQuality
        );
      }
    );

    results.push({
      blob,
      pageNumber,
      filename: `page-${pageNumber}.${format}`,
    });

    if (onProgress) {
      onProgress(
        Math.round(
          ((index + 1) /
            pages.length) *
            100
        )
      );
    }

    page.cleanup();
    canvas.width = 1;
    canvas.height = 1;
  }

  return results;
}