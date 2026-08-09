import ToolCard from "./ToolCard";

function ToolGrid() {
  return (
    <div className="tool-grid">
      <ToolCard
        icon="📄"
        title="Merge PDFs"
        description="Combine multiple PDFs into one."
      />

      <ToolCard
        icon="✂️"
        title="Split PDFs"
        description="Split one PDF into multiple files."
      />

      <ToolCard
        icon="🗜️"
        title="Compress"
        description="Reduce PDF file size."
      />

      <ToolCard
        icon="🖼️"
        title="PDF to Images"
        description="Convert PDF pages into images."
      />
    </div>
  );
}

export default ToolGrid;