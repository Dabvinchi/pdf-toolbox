import { splitPDF } from "../utils/splitPdf";

function SplitButton({
  files,
  startPage,
  endPage,
  error,
}) {
  async function handleSplit() {
    try {
      await splitPDF(
        files[0].file,
        Number(startPage),
        Number(endPage)
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <button
      className="split-button"
      onClick={handleSplit}
      disabled={
        files.length !== 1 ||
        !startPage ||
        !endPage ||
        error
      }
    >
      ✂ Split PDF
    </button>
  );
}

export default SplitButton;