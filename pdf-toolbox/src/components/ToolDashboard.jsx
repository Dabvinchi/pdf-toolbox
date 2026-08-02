const tools = [
  {
    title: "Merge PDFs",
    description: "Combine multiple PDFs into one file.",
    icon: "📄",
    available: true,
  },
  {
    title: "Split PDF",
    description: "Split one PDF into separate files.",
    icon: "✂️",
    available: false,
  },
  {
    title: "Compress PDF",
    description: "Reduce PDF size.",
    icon: "🗜️",
    available: false,
  },
  {
    title: "PDF to Images",
    description: "Convert every page into an image.",
    icon: "🖼️",
    available: false,
  },
  {
    title: "Rotate PDF",
    description: "Rotate pages.",
    icon: "🔄",
    available: false,
  },
  {
    title: "Extract Pages",
    description: "Save selected pages.",
    icon: "📑",
    available: false,
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
              tool.available ? "available" : "coming-soon"
            }`}
            key={tool.title}
          >
            <div className="tool-icon">{tool.icon}</div>

            <h3>{tool.title}</h3>

            <p>{tool.description}</p>

            {tool.available ? (
              <button onClick={() => setActiveTool("merge")}>
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