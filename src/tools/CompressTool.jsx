import { useState } from "react";
import UploadBox from "../components/UploadBox";
import FileList from "../features/merge/FileList";
import CompressButton from "../components/CompressButton";

function CompressTool({ setActiveTool }) {
  const [files, setFiles] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleFilesChange(newFiles) {
    setFiles(newFiles);
    setSuccess("");
    setError("");
  }

  function handleSuccess(message) {
    setSuccess(message);
    setError("");
  }

  function handleError(message) {
    setError(message);
    setSuccess("");
  }

  return (
    <>
      <button
        className="back-button"
        onClick={() => setActiveTool(null)}
      >
        ← Back to Tools
      </button>

      <div className="tool-page">
        <h1>🗜️ Compress PDF</h1>

        <p>
          Reduce the size of your PDF while keeping
          the document usable.
        </p>

        <UploadBox
          files={files}
          setFiles={handleFilesChange}
        />

        <FileList
          files={files}
          setFiles={handleFilesChange}
        />

        {files.length === 1 && (
          <div className="compress-info">
            <p>
              Original size:
              <strong>
                {" "}
                {formatFileSize(files[0].file.size)}
              </strong>
            </p>
          </div>
        )}

        {error && (
          <p className="compress-error">
            {error}
          </p>
        )}

        {success && (
          <p className="compress-success">
            ✓ {success}
          </p>
        )}

        <CompressButton
          files={files}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </>
  );
}

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default CompressTool;