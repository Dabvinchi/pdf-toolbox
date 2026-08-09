import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaGripVertical, FaFilePdf } from "react-icons/fa";

function SortableFile({ file, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: file.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function formatFileSize(bytes) {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="file-card"
    >
      <div className="file-info">
        <span
          className="drag-handle"
          {...attributes}
          {...listeners}
        >
          <FaGripVertical />
        </span>

        <FaFilePdf className="file-icon" />

        <div>
          <strong>{file.file.name}</strong>

          <p>{formatFileSize(file.file.size)}</p>
        </div>
      </div>

      <button
        className="remove-button"
        onClick={onRemove}
      >
        ✕
      </button>
    </div>
  );
}

export default SortableFile;