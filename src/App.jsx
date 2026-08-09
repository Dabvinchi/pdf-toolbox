import { useState } from "react";

import Hero from "./components/Hero";
import ToolDashboard from "./components/ToolDashboard";

import MergeTool from "./tools/MergeTool";
import SplitTool from "./tools/SplitTool";
import CompressTool from "./tools/CompressTool";
import PdfImagesTool from "./tools/PdfImagesTool";
import RotateTool from "./tools/RotateTool";
import ExtractPagesTool from "./tools/ExtractPagesTool";

function App() {
  const [files, setFiles] = useState([]);
  const [activeTool, setActiveTool] = useState(null);

  return (
    <>
      {activeTool === null && (
        <>
          <Hero />

          <ToolDashboard
            setActiveTool={setActiveTool}
          />
        </>
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

      {activeTool === "extract" && (
        <ExtractPagesTool
          setActiveTool={setActiveTool}
        />
      )}
    </>
  );
}

export default App;