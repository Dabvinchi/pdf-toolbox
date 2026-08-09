import splitPDF from "../utils/splitPdf";

function SplitButton({
  files,
  selectedPages,
}) {
  async function handleSplit() {
    if (files.length !== 1) {
      alert("Please select one PDF.");
      return;
    }

    if (!selectedPages || selectedPages.length === 0) {
      alert("Please select at least one page.");
      return;
    }

    try {
      await splitPDF(
        files[0].file,
        selectedPages
      );
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong while splitting the PDF."
      );
    }
  }

  const disabled =
    files.length !== 1 ||
    !selectedPages ||
    selectedPages.length === 0;

  return (
    <button
      className="split-button"
      onClick={handleSplit}
      disabled={disabled}
    >
      ✂ Split PDF
    </button>
  );
}

export default SplitButton;