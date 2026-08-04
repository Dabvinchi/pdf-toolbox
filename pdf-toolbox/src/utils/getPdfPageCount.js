import { PDFDocument } from "pdf-lib";

export async function getPdfPageCount(file) {
  const bytes = await file.arrayBuffer();

  const pdf = await PDFDocument.load(bytes);

  return pdf.getPageCount();
}