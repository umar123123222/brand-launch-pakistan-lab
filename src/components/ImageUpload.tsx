
import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImageChange: (imageUrl: string) => void;
  currentImage?: string;
  productTitle: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageChange, currentImage, productTitle }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const removeImage = () => {
    onImageChange("/placeholder.svg");
  };

  return (
    <div className="relative">
      {currentImage && currentImage !== "/placeholder.svg" ? (
        <div className="relative">
          <img 
            src={currentImage} 
            alt={productTitle}
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <Button
            onClick={removeImage}
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`w-full h-64 border-2 border-dashed rounded-t-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => document.getElementById(`file-input-${productTitle}`)?.click()}
        >
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-600 text-center px-4">
            Drop an image here or click to upload
          </p>
          <p className="text-sm text-gray-400 mt-2">
            For {productTitle}
          </p>
        </div>
      )}
      
      <input
        id={`file-input-${productTitle}`}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
