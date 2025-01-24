// FileUpload.tsx
import React, { useCallback, useMemo } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { useUploadFile, type UploadThingFile } from '@/hooks/use-upload-file';

interface FileUploadProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  uploadConfig: {
    category: string;
    entityType: string;
    entityId: string;
    maxFileCount?: number;
    allowedFileTypes: string[];
  };
  required?: boolean;
  error?: { message?: string };
  onUploadComplete?: (files: UploadThingFile[], tempId: string) => void;
}

const FileUpload = ({
  name,
  label,
  register,
  uploadConfig,
  required = false,
  error,
  onUploadComplete,
}: FileUploadProps) => {
  // Use a temporary ID for initial upload
  const tempId = useMemo(() => `temp_${Date.now()}`, []);
  const config = {
    ...uploadConfig,
    entityId: tempId
  };

  const uploader = useUploadFile("fileUploader", config);
  
  const { onChange: registerOnChange, ...registerProps } = register(name, {
    required: required ? `${label} is required` : false
  });

  const handleChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    registerOnChange(event); // Call the react-hook-form onChange
    
    if (event.target.files?.length) {
      try {
        const result = await uploader.onUpload(Array.from(event.target.files));
        // Store with temp ID
        onUploadComplete?.(result, tempId);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  }, [registerOnChange, uploader, onUploadComplete, tempId]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && '*'}
      </label>
      <input
        type="file"
        accept={uploadConfig.allowedFileTypes.join(',')}
        className={`mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-yellow-400 file:px-4 file:py-2 file:text-white hover:file:bg-yellow-500 ${
          uploader.isUploading ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={uploader.isUploading}
        onChange={handleChange}
        {...registerProps}
      />
      {uploader.isUploading && (
        <div className="mt-2 text-sm text-gray-500">
          Uploading... {uploader.progresses.progress}%
        </div>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default React.memo(FileUpload);