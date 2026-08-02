import { useState } from "react";
import Hero from "./components/Hero";
import ToolDashboard from "./components/ToolDashboard";
import UploadBox from "./components/UploadBox";
import MergeButton from "./components/MergeButton";
import MergeTool from "./tools/MergeTool";

function App() {
  const [files, setFiles] = useState([]);
  const [activeTool, setActiveTool] = useState(null);

  return (
    <div className="app">
      <Hero />

{activeTool === null && (
  <ToolDashboard setActiveTool={setActiveTool} />
)}

{activeTool === "merge" && (
  <MergeTool
    files={files}
    setFiles={setFiles}
    setActiveTool={setActiveTool}
  />
)}
    </div>
  );
}

export default App;