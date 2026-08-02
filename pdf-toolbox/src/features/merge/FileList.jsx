function FileList({ files, setFiles }) {
  function removeFile(index) {
    setFiles(files.filter((_, i) => i !== index));
  }

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="file-list">
      <h3>Selected Files</h3>

      {files.map((file, index) => (
        <div className="file-card" key={index}>
          <div>
            <strong>{file.name}</strong>
            <p>{(file.size / 1024).toFixed(1)} KB</p>
          </div>

          <button
            className="remove-button"
            onClick={() => removeFile(index)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default FileList;