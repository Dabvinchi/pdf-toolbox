import { useState } from "react";
import UploadBox from "../components/UploadBox";
import FileList from "../features/merge/FileList";
import CompressButton from "../components/CompressButton";

function CompressTool({ setActiveTool }) {
  const [files, setFiles] = useState([]);
  const [compressionLevel, setCompressionLevel] =
    useState("recommended");

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleSuccess(compressionResult) {
    setResult(compressionResult);
    setError("");
  }

  function handleError(message) {
    setError(message);
    setResult(null);
  }

  function handleFilesChange(newFiles) {
    setFiles(newFiles);
    setResult(null);
    setError("");
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
          Reduce your PDF file size while keeping
          your document usable.
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
          <>
            <div className="compress-info">
              <p>
                Original size:{" "}
                <strong>
                  {formatFileSize(
                    files[0].file.size
                  )}
                </strong>
              </p>
            </div>
            
                  <div className="compression-notice">
                    <strong>⚠️ Image-based compression</strong>

                    <p>
                        This compression method converts each PDF page
                        into a compressed image. It can significantly
                        reduce file size, but text may no longer be
                        selectable.
                    </p>
                    </div>

            <div className="compression-options">
              <h3>Compression Level</h3>

              <label
                className={
                  compressionLevel === "high"
                    ? "compression-option selected"
                    : "compression-option"
                }
              >
                <input
                  type="radio"
                  name="compression"
                  value="high"
                  checked={
                    compressionLevel === "high"
                  }
                  onChange={() =>
                    setCompressionLevel("high")
                  }
                />

                <div>
                  <strong>High Quality</strong>

                  <span>
                    Best quality with lighter
                    compression.
                  </span>
                </div>
              </label>

              <label
                className={
                  compressionLevel ===
                  "recommended"
                    ? "compression-option selected"
                    : "compression-option"
                }
              >
                <input
                  type="radio"
                  name="compression"
                  value="recommended"
                  checked={
                    compressionLevel ===
                    "recommended"
                  }
                  onChange={() =>
                    setCompressionLevel(
                      "recommended"
                    )
                  }
                />

                <div>
                  <strong>Recommended</strong>

                  <span>
                    Good balance between size
                    and quality.
                  </span>
                </div>
              </label>

              <label
                className={
                  compressionLevel === "small"
                    ? "compression-option selected"
                    : "compression-option"
                }
              >
                <input
                  type="radio"
                  name="compression"
                  value="small"
                  checked={
                    compressionLevel === "small"
                  }
                  onChange={() =>
                    setCompressionLevel("small")
                  }
                />

                <div>
                  <strong>Smallest File</strong>

                  <span>
                    Prioritize the smallest
                    possible file size.
                  </span>
                </div>
              </label>
            </div>
          </>
        )}

        {error && (
          <p className="compress-error">
            {error}
          </p>
        )}

        {result && (
          <div className="compression-result">
            <h3>Compression Complete</h3>

            <div className="compression-stats">
              <div>
                <span>Original Size</span>

                <strong>
                  {formatFileSize(
                    result.originalSize
                  )}
                </strong>
              </div>

              <div>
                <span>Compressed Size</span>

                <strong>
                  {formatFileSize(
                    result.compressedSize
                  )}
                </strong>
              </div>

              <div>
                <span>Space Saved</span>

                <strong>
                  {formatFileSize(
                    result.savedBytes
                  )}
                </strong>
              </div>

              <div>
                <span>Reduction</span>

                <strong>
                  {result.percentageSaved.toFixed(
                    1
                  )}
                  %
                </strong>
              </div>
            </div>

            <p className="compress-success">
              ✓ Your compressed PDF has been
              downloaded.
            </p>
          </div>
        )}

        <CompressButton
          files={files}
          compressionLevel={compressionLevel}
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