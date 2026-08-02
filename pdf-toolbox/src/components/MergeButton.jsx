import { mergePDFs } from "../utils/pdf";

function MergeButton({ files }) {
  async function handleMerge() {
  try {
    await mergePDFs(files);
  } catch (error) {
    console.error(error);
    alert("Something went wrong while merging PDFs.");
  }
}

  return (
    <button
      className="merge-button"
      onClick={handleMerge}
      disabled={files.length < 2}
    >
      Merge PDFs
    </button>
  );
}

export default MergeButton;