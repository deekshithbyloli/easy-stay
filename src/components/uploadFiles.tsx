import { ImageDown, Trash } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';


type MultiFileUploadProps = {
  onFilesSelected: (files: File[]) => void;
  initialFileUrls?: string[];
  onRemoveFile: (index: number) => void;
  title: string;
  description: string;
  isEditable?: boolean;
};

const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  onFilesSelected,
  onRemoveFile,
  initialFileUrls = [],
  title,
  description,
  isEditable = true
}) => {
  const [filePreviews, setFilePreviews] = useState<string[]>(initialFileUrls);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (!isEditable) return;

      const validFiles = acceptedFiles.filter((file) => {
        if (!file.type.startsWith('image/')) {
          setErrorMessage('Invalid file type. Please upload an image.');
          return false;
        }

        if (file.size > 500 * 1024) {
          setErrorMessage('File size exceeds the 500KB limit.');
          return false;
        }

        return true;
      });

      if (validFiles.length > 0) {
        const newFilePreviews = validFiles.map((file) => URL.createObjectURL(file));
        setFilePreviews((prev) => [...prev, ...newFilePreviews]);
        onFilesSelected(validFiles);
        setErrorMessage(null);
      }
    },
    maxFiles: 5,
    disabled: !isEditable
  });

  useEffect(() => {
    return () => {
      filePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [filePreviews]);

  useEffect(() => {
    setFilePreviews(initialFileUrls);
  }, [initialFileUrls]);

  const handleRemoveFile = (index: number) => {
    if (!isEditable) return;

    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
    onRemoveFile(index);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white shadow-md rounded-lg w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full h-[180px] border-2 border-dashed rounded-lg p-4 transition duration-300 ease-in-out ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-800'
            : 'border-gray-300 bg-gray-50 dark:bg-slate-800'
        } hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-950 ${
          !isEditable && 'opacity-50 cursor-not-allowed'
        }`}
      >
        <input {...getInputProps()} />
        <ImageDown className="w-12 h-12 text-slate-400" />
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-100 text-center">
          Drag and drop images here, or click to select files.
        </p>
      </div>

      <p className="text-sm text-center text-gray-500">Maximum file size: 500KB. Supported formats: JPG, PNG.</p>

      {errorMessage && <p className="text-sm text-red-500 mt-2 text-center">{errorMessage}</p>}

      <div className="grid grid-cols-3 gap-4 w-full">
        {filePreviews.map((preview, index) => (
          <div key={index} className="relative w-full h-[120px] rounded-lg overflow-hidden shadow-md">
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {isEditable && (
              <Button
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md"
                size="sm"
                variant="outline"
                onClick={() => handleRemoveFile(index)}
              >
                <Trash className="w-4 h-4 text-red-500" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default MultiFileUpload;
