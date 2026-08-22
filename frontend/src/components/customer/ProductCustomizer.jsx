// ProductCustomizer.jsx
// Interactive product customization drawer panel with drag, zoom, rotate, and text placement

import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiUpload, FiRotateCw, FiZoomIn, FiType, FiBold, FiItalic, FiAlignLeft, FiAlignCenter, FiAlignRight, FiCheck, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import Button from '../common/Button.jsx';
import { uploadCustomizationImage } from '../../services/productService.js';
import toast from 'react-hot-toast';

const FONTS_LIST = [
  { name: 'Sans-Serif', value: 'system-ui, sans-serif' },
  { name: 'Elegant Serif', value: '"Playfair Display", Georgia, serif' },
  { name: 'Playful Cursive', value: '"Pacifico", cursive' },
  { name: 'Modern Sans', value: '"Outfit", sans-serif' },
  { name: 'Retro Script', value: '"Caveat", cursive' }
];

const COLOR_SWATCHES = [
  '#ffffff', '#000000', '#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'
];

const DEFAULT_SAMPLE_IMAGE = 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=500'; // Beautiful sample flower design

const ProductCustomizer = ({ product, isOpen, onClose, onAddToCart }) => {
  const containerRef = useRef(null);

  // Customization States
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(DEFAULT_SAMPLE_IMAGE); // Default sample image initially
  
  // Image Transformations
  const [imageX, setImageX] = useState(0);
  const [imageY, setImageY] = useState(0);
  const [imageScale, setImageScale] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  
  // Custom Text States
  const [nameText, setNameText] = useState('');
  const [messageText, setMessageText] = useState('');
  const [textX, setTextX] = useState(0);
  const [textY, setTextY] = useState(80);
  const [textRotation, setTextRotation] = useState(0);
  const [textFont, setTextFont] = useState('system-ui, sans-serif');
  const [textSize, setTextSize] = useState(14);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textBold, setTextBold] = useState(true);
  const [textItalic, setTextItalic] = useState(false);
  const [textAlign, setTextAlign] = useState('center');

  // Dragging States
  const [dragMode, setDragMode] = useState(null); // 'image' or 'text'
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);

  // Active control tab
  const [activeTab, setActiveTab] = useState('image'); // 'image' or 'text'

  const categoryName = (product.category_name || '').toLowerCase();
  const isMug = categoryName.includes('mug');

  // Combined text block for rendering and saving
  const combinedText = [nameText.trim(), messageText.trim()].filter(Boolean).join('\n');

  // Handle local image file selections
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewImageUrl(url);
      
      // Reset translation offsets for clean fit
      setImageX(0);
      setImageY(0);
      setImageScale(1);
      setImageRotation(0);
      toast.success('Photo uploaded! Customizer updated.');
    }
  };

  // Remove custom photo and restore the default sample image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewImageUrl(DEFAULT_SAMPLE_IMAGE);
    setImageX(0);
    setImageY(0);
    setImageScale(1);
    setImageRotation(0);
    toast.success('Uploaded photo removed. Sample image restored.');
  };

  // Drag listeners
  const handleMouseDown = (e, mode) => {
    e.preventDefault();
    setDragMode(mode);
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    if (mode === 'image') {
      setDragStart({
        x: clientX - imageX,
        y: clientY - imageY
      });
    } else if (mode === 'text') {
      setDragStart({
        x: clientX - textX,
        y: clientY - textY
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!dragMode) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    if (dragMode === 'image') {
      setImageX(clientX - dragStart.x);
      setImageY(clientY - dragStart.y);
    } else if (dragMode === 'text') {
      setTextX(clientX - dragStart.x);
      setTextY(clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setDragMode(null);
  };

  const handleReset = () => {
    setImageX(0);
    setImageY(0);
    setImageScale(1);
    setImageRotation(0);
    setNameText('');
    setMessageText('');
    setTextX(0);
    setTextY(80);
    setTextRotation(0);
    setTextColor('#ffffff');
    setTextSize(14);
    setTextFont('system-ui, sans-serif');
    setTextBold(true);
    setTextItalic(false);
    setTextAlign('center');
    setSelectedFile(null);
    setPreviewImageUrl(DEFAULT_SAMPLE_IMAGE);
    toast.success('Customization configuration reset to defaults.');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      let finalImageUrl = null;

      // 1. Upload custom image if customer loaded their own file
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        
        const uploadRes = await uploadCustomizationImage(formData);
        if (uploadRes.success) {
          finalImageUrl = uploadRes.data.url;
        } else {
          throw new Error('Image upload failed.');
        }
      }

      // 2. Build the customization dataset payload
      // We serialize full text positioning and styling details in custom_text column
      const customTextPayload = JSON.stringify({
        name: nameText,
        message: messageText,
        textX: textX,
        textY: textY,
        textRotation: textRotation,
        bold: textBold,
        italic: textItalic,
        align: textAlign
      });

      const customizationData = {
        custom_image_url: finalImageUrl, // Store uploaded custom photo URL (or null if kept sample)
        custom_text: (nameText || messageText) ? customTextPayload : null,
        custom_font: (nameText || messageText) ? textFont : null,
        custom_font_size: (nameText || messageText) ? parseInt(textSize) : null,
        custom_font_color: (nameText || messageText) ? textColor : null,
        custom_rotation: parseInt(imageRotation),
        custom_scale: parseFloat(imageScale),
        custom_position_x: parseInt(imageX),
        custom_position_y: parseInt(imageY)
      };

      // 3. Dispatch to cart context callback
      await onAddToCart(customizationData);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to apply custom design.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const defaultMugImage = 'https://images.cloudinary.com/framewala/white_mug.jpg';
  const templateImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url || defaultMugImage;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh]">
        
        {/* Left Side: Live Preview Canvas */}
        <div 
          className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-6 relative select-none overflow-hidden group"
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Canvas Title */}
          <div className="absolute top-4 left-4 text-white font-extrabold text-xs uppercase tracking-widest opacity-80 z-10">
            Interactive Mockup Canvas
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 z-10 transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Mug preview layered workspace */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            
            {/* Layer 1: Mug Template Image */}
            <img 
              src={templateImage} 
              alt="Mug mockup base template" 
              className="w-72 h-72 object-contain pointer-events-none z-10" 
            />

            {/* Dotted Printable Area Box Container (Layer 2 & Layer 3 wrapper) */}
            {/* Centered on the mug body */}
            <div 
              className="absolute border border-dashed border-indigo-500/70 overflow-hidden z-20"
              style={{
                width: '124px',
                height: '142px',
                top: '95px',
                left: '110px',
                borderRadius: '6px',
                backgroundColor: selectedFile ? 'transparent' : 'rgba(255, 255, 255, 0.05)'
              }}
            >
              {/* Layer 2: Customer Uploaded Image or Sample Placeholder Image */}
              <div 
                className="absolute inset-0 cursor-move flex items-center justify-center"
                onMouseDown={(e) => handleMouseDown(e, 'image')}
                onTouchStart={(e) => handleMouseDown(e, 'image')}
              >
                <img
                  src={previewImageUrl}
                  alt="custom item preview"
                  className="max-w-none origin-center pointer-events-none select-none"
                  style={{
                    transform: `translate(${imageX}px, ${imageY}px) scale(${imageScale}) rotate(${imageRotation}deg)`,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              {/* Layer 3: Custom Text overlays (combined Name & Message) */}
              {combinedText.trim() && (
                <div
                  className="absolute z-10 cursor-move text-shadow select-none whitespace-pre-line p-1.5 hover:border hover:border-dashed hover:border-indigo-400 font-medium"
                  style={{
                    transform: `translate(${textX}px, ${textY}px) rotate(${textRotation}deg)`,
                    fontFamily: textFont,
                    fontSize: `${textSize}px`,
                    color: textColor,
                    fontWeight: textBold ? 'bold' : 'normal',
                    fontStyle: textItalic ? 'italic' : 'normal',
                    textAlign: textAlign,
                    lineHeight: '1.25',
                    maxWidth: '115px',
                    wordBreak: 'break-word'
                  }}
                  onMouseDown={(e) => handleMouseDown(e, 'text')}
                  onTouchStart={(e) => handleMouseDown(e, 'text')}
                >
                  {combinedText}
                </div>
              )}
            </div>

          </div>

          {/* Live indicator tag */}
          <div className="absolute bottom-4 text-center text-slate-500 text-[10px] uppercase font-bold tracking-widest pointer-events-none">
            🖱️ Drag photo or text to reposition inside print boundary
          </div>
        </div>

        {/* Right Side: Tools Control Box */}
        <div className="w-full md:w-96 bg-white flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 h-full overflow-hidden">
          
          {/* Tabs header */}
          <div className="flex border-b border-slate-100 bg-slate-50/50 shrink-0">
            <button
              onClick={() => setActiveTab('image')}
              className={`flex-1 py-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === 'image' 
                  ? 'border-indigo-600 text-indigo-600 bg-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Configure Photo
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === 'text' 
                  ? 'border-indigo-600 text-indigo-600 bg-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Add Message / Name
            </button>
          </div>

          {/* Configurator Controls Scroll Area */}
          <div className="flex-grow p-6 overflow-y-auto space-y-6">
            
            {/* Header info */}
            <div>
              <h3 className="text-base font-black text-slate-800 tracking-tight">Personalize Mug</h3>
              <p className="text-slate-400 text-[11px] font-semibold">Tweak printing settings below to preview live changes</p>
            </div>

            {/* TAB 1: IMAGE TRANSFORMS */}
            {activeTab === 'image' && (
              <div className="space-y-5 animate-fadeIn">
                
                {/* File Upload Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mug Print Image</label>
                  
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center space-x-2 px-4 py-3 border border-slate-200 hover:border-indigo-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-600 transition-colors text-xs font-bold justify-center">
                      <FiUpload className="w-4 h-4 shrink-0" />
                      <span>{selectedFile ? 'Replace Photo File' : 'Upload Your Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {selectedFile && (
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

                {/* Transform sliders */}
                <div className="space-y-4 pt-2 border-t border-slate-50">
                  
                  {/* Photo Scale (Zoom) */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500 font-bold">
                      <span className="flex items-center space-x-1">
                        <FiZoomIn className="w-3.5 h-3.5" />
                        <span>Photo Size (Zoom)</span>
                      </span>
                      <span>{parseFloat(imageScale).toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="4.0"
                      step="0.05"
                      value={imageScale}
                      onChange={(e) => setImageScale(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  {/* Photo Rotation */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-500 font-bold">
                      <span className="flex items-center space-x-1">
                        <FiRotateCw className="w-3.5 h-3.5" />
                        <span>Photo Rotation</span>
                      </span>
                      <span>{imageRotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="5"
                      value={imageRotation}
                      onChange={(e) => setImageRotation(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                </div>

                {/* Helpful tips panel */}
                <div className="bg-amber-50/50 border border-amber-100 text-amber-800 p-3 rounded-xl text-[10px] font-semibold leading-relaxed">
                  💡 You can drag the photo inside the dotted printing area box on the preview canvas to position it perfectly.
                </div>

              </div>
            )}

            {/* TAB 2: TEXT CONTROLS */}
            {activeTab === 'text' && (
              <div className="space-y-5 animate-fadeIn">
                
                {/* Text fields inputs */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Add Name</label>
                    <input
                      type="text"
                      maxLength={30}
                      value={nameText}
                      onChange={(e) => setNameText(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Add Message</label>
                    <input
                      type="text"
                      maxLength={60}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="e.g. Happy Birthday!"
                      className="w-full px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Font and formatting styles */}
                {combinedText.trim() && (
                  <div className="space-y-4 pt-3 border-t border-slate-100">
                    
                    {/* Font Style Picker */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Choose Font Style</label>
                      <select
                        value={textFont}
                        onChange={(e) => setTextFont(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none font-bold text-slate-700"
                      >
                        {FONTS_LIST.map((font) => (
                          <option key={font.name} value={font.value}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Font Size & Align row */}
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* Font Size */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-500 font-bold">
                          <span>Font Size</span>
                          <span>{textSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="8"
                          max="28"
                          step="1"
                          value={textSize}
                          onChange={(e) => setTextSize(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>

                      {/* Weight Formatting buttons */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block">Font Weight</label>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => setTextBold(prev => !prev)}
                            className={`flex-1 py-1.5 border rounded-lg transition-colors cursor-pointer flex items-center justify-center font-bold text-xs ${
                              textBold ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <FiBold className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setTextItalic(prev => !prev)}
                            className={`flex-1 py-1.5 border rounded-lg transition-colors cursor-pointer flex items-center justify-center font-bold text-xs ${
                              textItalic ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <FiItalic className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Text Alignment */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">Text Alignment</label>
                      <div className="flex space-x-2">
                        {[
                          { mode: 'left', icon: <FiAlignLeft className="w-3.5 h-3.5" /> },
                          { mode: 'center', icon: <FiAlignCenter className="w-3.5 h-3.5" /> },
                          { mode: 'right', icon: <FiAlignRight className="w-3.5 h-3.5" /> }
                        ].map((alignOpt) => (
                          <button
                            key={alignOpt.mode}
                            type="button"
                            onClick={() => setTextAlign(alignOpt.mode)}
                            className={`flex-1 py-1.5 border rounded-lg transition-colors cursor-pointer flex items-center justify-center ${
                              textAlign === alignOpt.mode 
                                ? 'bg-indigo-600 border-indigo-600 text-white' 
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {alignOpt.icon}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Rotation slider */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500 font-bold">
                        <span>Text Rotation</span>
                        <span>{textRotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        step="5"
                        value={textRotation}
                        onChange={(e) => setTextRotation(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>

                    {/* Font Color palette swatches */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">Choose Font Color</label>
                      <div className="flex flex-wrap gap-2">
                        {COLOR_SWATCHES.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setTextColor(color)}
                            className="w-6 h-6 rounded-full border border-slate-200 focus:outline-none flex items-center justify-center shrink-0 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                            style={{ backgroundColor: color }}
                          >
                            {textColor === color && (
                              <FiCheck className={`w-3.5 h-3.5 ${color === '#ffffff' ? 'text-slate-800' : 'text-white'}`} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>

          {/* Footer Save & Reset Operations */}
          <div className="p-6 border-t border-slate-100 flex items-center space-x-3 bg-slate-50 shrink-0">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 border border-slate-200 text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-xl text-xs font-extrabold transition-colors cursor-pointer flex items-center space-x-1"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <Button
              onClick={handleSave}
              loading={saving}
              className="flex-grow py-2.5 text-xs font-bold"
            >
              Save & Add to Cart
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductCustomizer;
