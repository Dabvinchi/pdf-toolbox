import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableFile from "./SortableFile";

function FileList({ files, setFiles }) {
  function removeFile(index) {
    setFiles(files.filter((_, i) => i !== index));
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = files.findIndex(
      (file) => file.name === active.id
    );

    const newIndex = files.findIndex(
      (file) => file.name === over.id
    );

    setFiles(arrayMove(files, oldIndex, newIndex));
  }

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="file-list">
      <h3>Selected Files</h3>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={files.map((file) => file.name)}
          strategy={verticalListSortingStrategy}
        >
          {files.map((file, index) => (
            <SortableFile
              key={file.name}
              file={file}
              onRemove={() => removeFile(index)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default FileList;