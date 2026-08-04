const tools = [
  {
    title: "Merge PDFs",
    description: "Combine multiple PDFs into one file.",
    icon: "📄",
    available: true,
    tool: "merge",
  },
  {
    title: "Split PDF",
    description: "Split one PDF into separate files.",
    icon: "✂️",
    available: true,
    tool: "split",
  },
  {
    title: "Compress PDF",
    description: "Reduce PDF size.",
    icon: "🗜️",
    available: false,
    tool: "compress",
  },
  {
    title: "PDF to Images",
    description: "Convert every page into an image.",
    icon: "🖼️",
    available: false,
    tool: "images",
  },
  {
    title: "Rotate PDF",
    description: "Rotate pages.",
    icon: "🔄",
    available: false,
    tool: "rotate",
  },
  {
    title: "Extract Pages",
    description: "Save selected pages.",
    icon: "📑",
    available: false,
    tool: "extract",
  },
];

function ToolDashboard({ setActiveTool }) {
  return (
    <section className="tool-dashboard">
      <h2>Choose a Tool</h2>

      <div className="tool-grid">
        {tools.map((tool) => (
          <div
            key={tool.title}
            className={`tool-card ${
              tool.available ? "available" : "coming-soon"
            }`}
          >
            <div className="tool-icon">{tool.icon}</div>

            <h3>{tool.title}</h3>

            <p>{tool.description}</p>

            {tool.available ? (
              <button onClick={() => setActiveTool(tool.tool)}>
                Open
              </button>
            ) : (
              <span>Coming Soon</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default ToolDashboard;