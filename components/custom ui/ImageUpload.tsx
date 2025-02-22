import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
interface ImageUploadProps {
  value: string[]; // Array of image URLs
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, onRemove }) => {
  const handleUpload = (result: any) => {
    if (result.event === "success") {
      onChange(result.info.secure_url); // Secure URL from Cloudinary
    }
  };

  return (
    <div className="space-y-4">
      <CldUploadWidget uploadPreset="admin-ecommerce" onUpload={handleUpload}>
        {({ open }) => (
          <button
            type="button"
            onClick={() => open?.()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Upload an Image
          </button>
        )}
      </CldUploadWidget>

      <div className="flex gap-4 flex-wrap">
        {value.map((url, index) => (
          <div key={index} className="relative">
         <div className="relative w-32 h-32">
  <Image
    src={url}
    alt={`Upload ${index}`}
    fill
    className="object-cover rounded-md"
  />
</div>

            <button
              type="button"
              onClick={() => onRemove(url)}
              className="absolute top-1 right-1 bg-red-500 text-white text-sm rounded-full px-2"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
