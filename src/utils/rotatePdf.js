import { PDFDocument, degrees } from "pdf-lib";

export async function rotatePdfPages({
  file,
  selectedPages,
  rotation,
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

  const pdfDoc =
    await PDFDocument.load(arrayBuffer);

  const pages = pdfDoc.getPages();

  for (const pageNumber of selectedPages) {
    const pageIndex = pageNumber - 1;

    if (
      pageIndex < 0 ||
      pageIndex >= pages.length
    ) {
      continue;
    }

    const page = pages[pageIndex];

    const currentRotation =
      page.getRotation().angle;

    const newRotation =
      (currentRotation + rotation) % 360;

    page.setRotation(
      degrees(newRotation)
    );
  }

  return await pdfDoc.save();
}