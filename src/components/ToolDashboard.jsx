const tools = [
  {
    title: "Merge PDFs",
    description: "Combine multiple PDFs into one file.",
    icon: "📄",
    id: "merge",
    available: true,
  },
  {
    title: "Split PDF",
    description: "Split one PDF into separate files.",
    icon: "✂️",
    id: "split",
    available: true,
  },
  {
    title: "Compress PDF",
    description: "Reduce PDF size.",
    icon: "🗜️",
    id: "compress",
    available: true,
  },
  {
    title: "PDF to Images",
    description: "Convert every page into an image.",
    icon: "🖼️",
    id: "images",
    available: true,
  },
  {
    title: "Rotate PDF",
    description: "Rotate pages.",
    icon: "🔄",
    id: "rotate",
    available: true,
  },
  {
    title: "Extract Pages",
    description: "Save selected pages.",
    icon: "📑",
    id: "extract",
    available: true,
  },
];

function ToolDashboard({ setActiveTool }) {
  return (
    <section className="tool-dashboard">
      <h2>Choose a Tool</h2>

      <div className="tool-grid">
        {tools.map((tool) => (
          <div
            className={`tool-card ${
              tool.available
                ? "available"
                : "coming-soon"
            }`}
            key={tool.title}
          >
            <div className="tool-icon">
              {tool.icon}
            </div>

            <h3>{tool.title}</h3>

            <p>{tool.description}</p>

            {tool.available ? (
              <button
                onClick={() =>
                  setActiveTool(tool.id)
                }
              >
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