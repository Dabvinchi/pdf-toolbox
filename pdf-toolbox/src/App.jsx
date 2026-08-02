import { useState } from "react";
import Header from "./components/Header";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  function handleFileSelect(event) {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
    }
  }

  return (
    <div className="app">
      <Header />

      <div className="upload-box">
        <h2>📂 Upload PDF</h2>
        <p>Drag & Drop your PDF here</p>

        <input
          type="file"
          accept=".pdf"
          id="pdf-upload"
          onChange={handleFileSelect}
          hidden
        />

        <label htmlFor="pdf-upload" className="upload-button">
          Choose PDF
        </label>

        {selectedFile && (
          <div className="file-info">
            <h3>📄 {selectedFile.name}</h3>
            <p>Ready to process ✅</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;