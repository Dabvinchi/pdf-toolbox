import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";

import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  workerUrl;

const compressionSettings = {
  high: {
    scale: 1.5,
    quality: 0.85,
  },

  recommended: {
    scale: 1.25,
    quality: 0.65,
  },

  small: {
    scale: 1.0,
    quality: 0.45,
  },
};

async function compressPDF(
  file,
  compressionMode = "standard",
  compressionLevel = "recommended",
  onProgress
) {
  if (!file) {
    throw new Error("No PDF file selected.");
  }

  if (compressionMode === "strong") {
    return compressStrong(
      file,
      compressionLevel,
      onProgress
    );
  }

  return compressStandard(
    file,
    onProgress
  );
}

async function compressStandard(
  file,
  onProgress
) {
  const fileBytes =
    await file.arrayBuffer();

  const pdfDoc =
    await PDFDocument.load(fileBytes, {
      ignoreEncryption: false,
    });

  const pageCount =
    pdfDoc.getPageCount();

  /*
   * Standard compression preserves the
   * original PDF content and text.
   */
  const compressedBytes =
    await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

  if (onProgress) {
    onProgress({
      current: pageCount,
      total: pageCount,
    });
  }

  return createResult(
    file,
    compressedBytes,
    "standard"
  );
}

async function compressStrong(
  file,
  compressionLevel,
  onProgress
) {
  const settings =
    compressionSettings[
      compressionLevel
    ] ||
    compressionSettings.recommended;

  const fileBytes =
    await file.arrayBuffer();

  const loadingTask =
    pdfjsLib.getDocument({
      data: fileBytes,
    });

  const pdf =
    await loadingTask.promise;

  const outputPdf =
    await PDFDocument.create();

  for (
    let pageNumber = 1;
    pageNumber <= pdf.numPages;
    pageNumber++
  ) {
    if (onProgress) {
      onProgress({
        current: pageNumber,
        total: pdf.numPages,
      });
    }

    const page =
      await pdf.getPage(pageNumber);

    const viewport =
      page.getViewport({
        scale: settings.scale,
      });

    const canvas =
      document.createElement("canvas");

    const context =
      canvas.getContext("2d", {
        alpha: false,
      });

    if (!context) {
      throw new Error(
        "Could not create a canvas for PDF compression."
      );
    }

    canvas.width =
      Math.floor(viewport.width);

    canvas.height =
      Math.floor(viewport.height);

    context.fillStyle = "#ffffff";

    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    const jpegDataUrl =
      canvas.toDataURL(
        "image/jpeg",
        settings.quality
      );

    const jpegBase64 =
      jpegDataUrl.split(",")[1];

    const jpegBytes =
      base64ToUint8Array(
        jpegBase64
      );

    const image =
      await outputPdf.embedJpg(
        jpegBytes
      );

    const originalViewport =
      page.getViewport({
        scale: 1,
      });

    const outputPage =
      outputPdf.addPage([
        originalViewport.width,
        originalViewport.height,
      ]);

    outputPage.drawImage(image, {
      x: 0,
      y: 0,
      width: originalViewport.width,
      height: originalViewport.height,
    });

    canvas.width = 1;
    canvas.height = 1;

    page.cleanup();
  }

  const compressedBytes =
    await outputPdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
    });

  return createResult(
    file,
    compressedBytes,
    "strong",
    compressionLevel,
    pdf.numPages
  );
}

function createResult(
  file,
  compressedBytes,
  compressionMode,
  compressionLevel = null,
  pageCount = null
) {
  const originalSize =
    file.size;

  const compressedSize =
    compressedBytes.length;

  const savedBytes =
    Math.max(
      0,
      originalSize - compressedSize
    );

  const percentageSaved =
    originalSize > 0
      ? (savedBytes / originalSize) *
        100
      : 0;

  const originalName =
    file.name.replace(
      /\.pdf$/i,
      ""
    );

  const suffix =
    compressionMode === "strong"
      ? "_strong_compressed.pdf"
      : "_compressed.pdf";

  const downloadName =
    `${originalName}${suffix}`;

  const blob =
    new Blob(
      [compressedBytes],
      {
        type: "application/pdf",
      }
    );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = downloadName;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);

  return {
    originalSize,
    compressedSize,
    savedBytes,
    percentageSaved,
    compressionMode,
    compressionLevel,
    pageCount,
  };
}

function base64ToUint8Array(
  base64
) {
  const binaryString =
    window.atob(base64);

  const bytes =
    new Uint8Array(
      binaryString.length
    );

  for (
    let i = 0;
    i < binaryString.length;
    i++
  ) {
    bytes[i] =
      binaryString.charCodeAt(i);
  }

  return bytes;
}

export default compressPDF;