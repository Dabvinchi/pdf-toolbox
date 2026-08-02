function ToolCard({ icon, title, description }) {
  return (
    <div className="tool-card">
      <div className="tool-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{description}</p>
    </div>
  );
}

export default ToolCard;