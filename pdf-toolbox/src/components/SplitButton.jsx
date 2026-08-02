function SplitButton({ files }) {
  async function handleSplit() {
    alert(`Ready to split ${files.length} PDF(s)!`);
  }

  return (
    <button
      className="merge-button"
      onClick={handleSplit}
      disabled={files.length !== 1}
    >
      Split PDF
    </button>
  );
}

export default SplitButton;