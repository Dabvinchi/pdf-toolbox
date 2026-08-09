import { PDFDocument } from "pdf-lib";

export async function extractPages({
  file,
  selectedPages,
}) {
  if (!file) {
    throw new Error("No PDF file selected.");
  }

  if (
    !selectedPages ||
    selectedPages.length === 0
  ) {
    throw new Error("No pages selected.");
  }

  const arrayBuffer =
    await file.arrayBuffer();

  const sourcePdf =
    await PDFDocument.load(arrayBuffer);

  const outputPdf =
    await PDFDocument.create();

  const pageIndexes =
    selectedPages
      .map((pageNumber) => pageNumber - 1)
      .filter(
        (index) =>
          index >= 0 &&
          index < sourcePdf.getPageCount()
      );

  if (pageIndexes.length === 0) {
    throw new Error(
      "No valid pages were selected."
    );
  }

  const copiedPages =
    await outputPdf.copyPages(
      sourcePdf,
      pageIndexes
    );

  copiedPages.forEach((page) => {
    outputPdf.addPage(page);
  });

  return await outputPdf.save();
}