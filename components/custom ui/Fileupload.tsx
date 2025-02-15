import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

interface FileUploadProps {
  uploadPreset: string;
  onUpload: (url: string) => void; // Function to handle the URL after upload
  buttonText: string;
  value: string; // URL of the uploaded file
}

const FileUpload: React.FC<FileUploadProps> = ({ uploadPreset, onUpload, buttonText, value }) => {
  const [fileName, setFileName] = useState<string | null>(null); // To store the name of the uploaded file

  const handleUpload = (result: any) => {
    if (result.event === "success") {
      const fileUrl = result.info.secure_url;
      const fileName = result.info.original_filename; // Get the file name
      setFileName(fileName); // Save the file name
      onUpload(fileUrl); // Pass the URL to the parent component
    }
  };

  const handleRemoveFile = () => {
    setFileName(null); // Reset file name
    onUpload(""); // Clear the file URL in parent component
  };

  return (
    <div className="space-y-4">
      <CldUploadWidget
        uploadPreset={uploadPreset}
        onUpload={handleUpload}
        options={{ resourceType: "raw" }} // Explicitly specify "raw" for non-image files like PDFs
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open?.()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            {buttonText}
          </button>
        )}
      </CldUploadWidget>

      {/* Display uploaded file name and cancel icon */}
      {fileName && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-blue-500">{fileName}</span>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="text-red-500 hover:text-red-700"
          >
            ❌ {/* Cancel icon */}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
