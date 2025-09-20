import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './IconComponents';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageUrl }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  // FIX: Corrected event types to `React.DragEvent<HTMLLabelElement>` to match the <label> element and resolve type errors.
  const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label
        htmlFor="image-upload"
        className={`relative flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
        ${isDragging ? 'border-indigo-500 bg-slate-800' : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'}`}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Vista previa de la imagen" className="object-contain h-full w-full rounded-lg p-2" />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadIcon />
            <p className="mb-2 text-sm text-slate-400">
              <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
            </p>
            <p className="text-xs text-slate-500">PNG, JPG, WEBP (MÁX. 10MB)</p>
          </div>
        )}
      </label>
      <input
        id="image-upload"
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
      />
    </div>
  );
};
