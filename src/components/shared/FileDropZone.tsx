import { FileText, Upload, X } from "lucide-react";
import React from "react";
import { Control, useController } from "react-hook-form";

const FileDropZone = ({
  control,
  name,
}: {
  control: Control<any>;
  name: string;
}) => {
  const { field, fieldState } = useController({
    name: name,
    control,
    defaultValue: [],
  });

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    updateFiles(files);
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    updateFiles(files);
  }

  function updateFiles(newFiles: File[]) {
    const existing = Array.isArray(field.value) ? field.value : [];

    const unique = [
      ...existing,
      ...newFiles.filter(
        (newFile) =>
          !existing.some(
            (old) => old.name === newFile.name && old.size === newFile.size
          )
      ),
    ];
    field.onChange(unique);
  }

  function removeFile(index: number): void {
    const existing = Array.isArray(field.value) ? field.value : [];
    const updated = existing.filter((_, i) => i !== index);
    field.onChange(updated);
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-all"
    >
      <Upload className="mx-auto text-gray-400 mb-2" size={32} />
      <label className="cursor-pointer">
        <span className="text-indigo-600 hover:text-indigo-700 font-medium">
          Click to upload
        </span>
        <span className="text-gray-600"> or drop files here</span>
        <input
          type="file"
          onChange={handleSelect}
          accept=".pdf,.jpg,.jpeg,.png"
          hidden
          multiple
        />
      </label>
      <p className="text-red-500">{fieldState.error?.message}</p>
      {field.value.length > 0 && (
        <div className="mt-3 space-y-2">
          {field.value.map((file: File, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-indigo-600" />
                <span className="text-sm text-gray-700">{file.name}</span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileDropZone;
