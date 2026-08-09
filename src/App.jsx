import { useState } from "react";
import ToolDashboard from "./components/ToolDashboard";
import MergeTool from "./tools/MergeTool";
import SplitTool from "./tools/SplitTool";
import CompressTool from "./tools/CompressTool";
import PdfImagesTool from "./tools/PdfImagesTool";
import RotateTool from "./tools/RotateTool";

function App() {
  const [activeTool, setActiveTool] = useState(null);

  return (
    <>
      {activeTool === null && (
        <ToolDashboard
          setActiveTool={setActiveTool}
        />
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

      {activeTool === "compress" && (
        <CompressTool
          setActiveTool={setActiveTool}
        />
      )}

      {activeTool === "images" && (
        <PdfImagesTool
          setActiveTool={setActiveTool}
        />
      )}

      {activeTool === "rotate" && (
        <RotateTool
          setActiveTool={setActiveTool}
        />
      )}
    </>
  );
}

export default App;