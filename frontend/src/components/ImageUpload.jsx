import React, { useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ onImageSelect, isLoading }) => {
    const [preview, setPreview] = useState(null);

    const handleFile = (file) => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onImageSelect(file);
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
    };

    const onChange = (e) => {
        handleFile(e.target.files[0]);
    };

    return (
        <div
            className={`border-2 border-dashed border-gray-300 rounded-lg p-12 text-center transition-all cursor-pointer bg-white group hover:border-blue-400
            ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => document.getElementById('fileInput').click()}
        >
            <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="image/*"
                onChange={onChange}
            />

            {preview ? (
                <div className="relative">
                    <img src={preview} alt="Upload Preview" className="mx-auto max-h-64 rounded-lg shadow-md object-contain" />
                    <p className="mt-4 text-sm text-gray-500 font-medium">Click to change image</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-4">
                    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-20 h-20 text-indigo-500" />
                    </div>
                    <p className="text-gray-400 font-medium text-lg">No file chosen, yet!</p>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
