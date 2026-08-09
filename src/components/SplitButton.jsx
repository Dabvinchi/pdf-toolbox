import { useState } from "react";
import splitPDF from "../utils/splitPdf";

function SplitButton({
  files,
  selectedPages,
  onSuccess,
  onError,
}) {
  const [isSplitting, setIsSplitting] = useState(false);

  async function handleSplit() {
    if (files.length !== 1) {
      onError("Please select one PDF.");
      return;
    }

    if (!selectedPages || selectedPages.length === 0) {
      onError("Please select at least one page.");
      return;
    }

    try {
      setIsSplitting(true);

      await splitPDF(
        files[0].file,
        selectedPages
      );

      onSuccess();
    } catch (error) {
      console.error(error);

      onError(
        "Something went wrong while splitting the PDF."
      );
    } finally {
      setIsSplitting(false);
    }
  }

  const disabled =
    isSplitting ||
    files.length !== 1 ||
    !selectedPages ||
    selectedPages.length === 0;

  const pageText =
    selectedPages?.length === 1
      ? "Page"
      : "Pages";

  return (
    <button
      className="split-button"
      onClick={handleSplit}
      disabled={disabled}
    >
      {isSplitting
        ? "⏳ Splitting..."
        : `✂ Split ${selectedPages?.length || 0} ${pageText}`}
    </button>
  );
}

export default SplitButton;