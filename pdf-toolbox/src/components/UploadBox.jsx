import { useState } from "react";

function UploadBox() {
  const [files, setFiles] = useState([]);

  function handleFiles(event) {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  }
  function handleDrop(event) {
  event.preventDefault();

  const droppedFiles = Array.from(event.dataTransfer.files);

  const pdfFiles = droppedFiles.filter(
    (file) => file.type === "application/pdf"
  );

  setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
}
  return (
    <div
  className="upload-box"
  onDragOver={(e) => e.preventDefault()}
  onDrop={handleDrop}
>
      <h2>📂 Upload PDFs</h2>
      <p>Drag & Drop PDFs here.</p>

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

      {files.length > 0 && (
        <div className="file-list">
          <h3>Selected Files</h3>

          {files.map((file, index) => (
  <div className="file-card" key={index}>
    <div>
      <strong>📄 {file.name}</strong>
      <p>{(file.size / 1024).toFixed(1)} KB</p>
    </div>

    <button
      className="remove-button"
      onClick={() =>
        setFiles(files.filter((_, i) => i !== index))
      }
    >
      ❌
    </button>
  </div>
))}
        </div>
      )}
    </div>
  );
}

export default UploadBox;