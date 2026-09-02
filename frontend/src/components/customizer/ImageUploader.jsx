import React, { useState, useEffect } from 'react';
import { FiUpload, FiTrash2 } from 'react-icons/fi';
import { fabric } from 'fabric';
import { fitImageToDimensions } from '../../utils/fabricHelpers.js';

export const ImageUploader = ({ canvas, onSaveState }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [hasCustomerImage, setHasCustomerImage] = useState(false);

  // Sync state with canvas objects
  useEffect(() => {
    if (!canvas) return;

    const syncState = () => {
      const objects = canvas.getObjects();
      const hasImage = objects.some(obj => obj.id === 'customer_image');
      setHasCustomerImage(hasImage);
    };

    canvas.on('object:added', syncState);
    canvas.on('object:removed', syncState);
    
    // Initial sync
    syncState();

    return () => {
      canvas.off('object:added', syncState);
      canvas.off('object:removed', syncState);
    };
  }, [canvas]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !canvas) return;

    setSelectedFile(file);
    const fileUrl = URL.createObjectURL(file);

    // Hide sample image if it exists
    const sampleObj = canvas.getObjects().find(obj => obj.id === 'sample_image');
    if (sampleObj) {
      sampleObj.set('visible', false);
    }

    // Remove any existing customer image first
    const existingCust = canvas.getObjects().find(obj => obj.id === 'customer_image');
    if (existingCust) {
      canvas.remove(existingCust);
    }

    // Load new user image into Fabric
    fabric.Image.fromURL(fileUrl, (imgObj) => {
      imgObj.set({
        id: 'customer_image',
        selectable: true,
        evented: true,
        left: 0,
        top: 0
      });

      // Scale to fit canvas dimensions nicely
      fitImageToDimensions(imgObj, canvas.width, canvas.height);
      
      // Center the image on canvas
      canvas.centerObject(imgObj);
      
      canvas.add(imgObj);
      canvas.setActiveObject(imgObj);
      canvas.renderAll();
      
      onSaveState();
    }, { crossOrigin: 'anonymous' });
  };

  const handleRemoveImage = () => {
    if (!canvas) return;

    setSelectedFile(null);

    // Remove customer image object
    const existingCust = canvas.getObjects().find(obj => obj.id === 'customer_image');
    if (existingCust) {
      canvas.remove(existingCust);
    }

    // Restore sample image visibility
    const sampleObj = canvas.getObjects().find(obj => obj.id === 'sample_image');
    if (sampleObj) {
      sampleObj.set('visible', true);
    }

    canvas.discardActiveObject();
    canvas.renderAll();
    onSaveState();
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
        Printable Graphic
      </label>

      <div className="flex flex-col gap-2">
        <label className="flex items-center space-x-2 px-4 py-3 border border-slate-200 hover:border-indigo-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-600 transition-colors text-xs font-bold justify-center">
          <FiUpload className="w-4 h-4 shrink-0" />
          <span>{hasCustomerImage ? 'Replace Graphic Image' : 'Upload Graphic Photo'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {hasCustomerImage && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="flex items-center space-x-1.5 px-3 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold justify-center transition-colors cursor-pointer"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
            <span>Remove Uploaded Photo</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
