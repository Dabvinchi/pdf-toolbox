import { PDFDocument } from "pdf-lib";

export async function splitPDF(file, startPage, endPage) {
  const bytes = await file.arrayBuffer();

  const pdf = await PDFDocument.load(bytes);

  const newPdf = await PDFDocument.create();

  const totalPages = pdf.getPageCount();

  if (
    startPage < 1 ||
    endPage > totalPages ||
    startPage > endPage
  ) {
    throw new Error("Invalid page range.");
  }

  const pageIndexes = [];

  for (let i = startPage - 1; i < endPage; i++) {
    pageIndexes.push(i);
  }

  const copiedPages = await newPdf.copyPages(pdf, pageIndexes);

  copiedPages.forEach((page) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();

  const blob = new Blob([pdfBytes], {
    type: "application/pdf",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = `pages-${startPage}-${endPage}.pdf`;

  link.click();

  URL.revokeObjectURL(url);
}