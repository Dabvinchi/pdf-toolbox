function UploadBox({ files, setFiles }) {
  function handleFiles(event) {
    const selectedFiles = Array.from(event.target.files).map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));

    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  }

  function handleDrop(event) {
    event.preventDefault();

    const droppedFiles = Array.from(event.dataTransfer.files);

    const pdfFiles = droppedFiles
      .filter((file) => file.type === "application/pdf")
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
      }));

    setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
  }

  return (
    <div
      className="upload-box"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <h2>Drag & Drop PDFs Here</h2>

      <p>or click the button below to browse your files.</p>

      <input
        type="file"
        accept=".pdf"
        multiple
        id="pdf-upload"
        hidden
        onChange={handleFiles}
      />

      <label htmlFor="pdf-upload" className="upload-button">
        Choose PDFs
      </label>
    </div>
  );
}

export default UploadBox;