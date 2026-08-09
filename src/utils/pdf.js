import { PDFDocument } from "pdf-lib";

export async function mergePDFs(files) {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();

    const pdf = await PDFDocument.load(bytes);

    const copiedPages = await mergedPdf.copyPages(
      pdf,
      pdf.getPageIndices()
    );

    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  const mergedBytes = await mergedPdf.save();

  const blob = new Blob([mergedBytes], {
    type: "application/pdf",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "merged.pdf";

  link.click();

  URL.revokeObjectURL(url);
}