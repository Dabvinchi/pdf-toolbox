import { PDFDocument } from "pdf-lib";

async function compressPDF(file) {
  if (!file) {
    throw new Error("No PDF file selected.");
  }

  const fileBytes = await file.arrayBuffer();

  const pdfDoc = await PDFDocument.load(fileBytes, {
    ignoreEncryption: false,
  });

  /*
   * pdf-lib uses object streams to reduce
   * the size of the generated PDF structure.
   */
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  const originalSize = file.size;
  const compressedSize = compressedBytes.length;

  const savedBytes = Math.max(
    0,
    originalSize - compressedSize
  );

  const originalName = file.name.replace(
    /\.pdf$/i,
    ""
  );

  const downloadName =
    `${originalName}_compressed.pdf`;

  const blob = new Blob(
    [compressedBytes],
    {
      type: "application/pdf",
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

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
  };
}

export default compressPDF;