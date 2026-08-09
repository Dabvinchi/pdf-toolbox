import { PDFDocument } from "pdf-lib";

async function splitPDF(file, selectedPages) {
  if (!file) {
    throw new Error("No PDF file selected.");
  }

  if (!selectedPages || selectedPages.length === 0) {
    throw new Error("No pages selected.");
  }

  const fileBytes = await file.arrayBuffer();

  const sourcePdf = await PDFDocument.load(fileBytes);

  const newPdf = await PDFDocument.create();

  // Sort pages so they stay in their original PDF order.
  const sortedPages = [...selectedPages].sort(
    (a, b) => a - b
  );

  // Convert page numbers (1-based) to indexes (0-based).
  const pageIndexes = sortedPages.map(
    (pageNumber) => pageNumber - 1
  );

  const copiedPages = await newPdf.copyPages(
    sourcePdf,
    pageIndexes
  );

  copiedPages.forEach((page) => {
    newPdf.addPage(page);
  });

  const pdfBytes = await newPdf.save();

  const blob = new Blob([pdfBytes], {
    type: "application/pdf",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "split-pdf.pdf";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export default splitPDF;