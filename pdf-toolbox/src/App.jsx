import { useState } from "react";
import Hero from "./components/Hero";
import ToolDashboard from "./components/ToolDashboard";
import MergeTool from "./tools/MergeTool";
import SplitTool from "./tools/SplitTool";

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
  setActiveTool={setActiveTool}
/>
      )}

      {activeTool === "split" && (
        <SplitTool
  setActiveTool={setActiveTool}
/>
      )}
    </div>
  );
}

export default App;