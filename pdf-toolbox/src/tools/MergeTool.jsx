import UploadBox from "../components/UploadBox";
import MergeButton from "../components/MergeButton";
import MergeHeader from "../features/merge/MergeHeader";
import FileList from "../features/merge/FileList";

function MergeTool({ files, setFiles, setActiveTool }) {
  return (
    <>
      <button
        className="back-button"
        onClick={() => setActiveTool(null)}
      >
        ← Back to Tools
      </button>

      <MergeHeader />

      <UploadBox
        files={files}
        setFiles={setFiles}
      />
        <FileList
  files={files}
  setFiles={setFiles}
/>
      <MergeButton
        files={files}
      />
    </>
  );
}

export default MergeTool;