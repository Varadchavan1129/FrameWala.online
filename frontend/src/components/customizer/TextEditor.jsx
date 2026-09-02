import React, { useState, useEffect } from 'react';
import { FiPlus, FiBold, FiItalic, FiTrash2, FiAlignLeft, FiAlignCenter, FiAlignRight } from 'react-icons/fi';
import { createFabricText } from '../../utils/fabricHelpers.js';

const FONTS = [
  { name: 'Sans-Serif', value: 'system-ui, sans-serif' },
  { name: 'Elegant Serif', value: 'Georgia, serif' },
  { name: 'Playful Cursive', value: 'cursive' },
  { name: 'Monospace Code', value: 'monospace' },
  { name: 'Comic Style', value: 'sans-serif' }
];

const COLORS = [
  '#ffffff', '#000000', '#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899'
];

export const TextEditor = ({ canvas, onSaveState }) => {
  const [textInput, setTextInput] = useState('');
  const [activeTextObj, setActiveTextObj] = useState(null);
  
  // State for syncing values
  const [fontFamily, setFontFamily] = useState('system-ui, sans-serif');
  const [fontSize, setFontSize] = useState(16);
  const [fill, setFill] = useState('#000000');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlign, setTextAlign] = useState('center');

  // Monitor canvas selections to sync controls with canvas IText objects
  useEffect(() => {
    if (!canvas) return;

    const handleSelection = () => {
      const activeObj = canvas.getActiveObject();
      if (activeObj && activeObj.type === 'i-text') {
        setActiveTextObj(activeObj);
        setTextInput(activeObj.text || '');
        setFontFamily(activeObj.fontFamily || 'system-ui, sans-serif');
        setFontSize(activeObj.fontSize || 16);
        setFill(activeObj.fill || '#000000');
        setIsBold(activeObj.fontWeight === 'bold');
        setIsItalic(activeObj.fontStyle === 'italic');
        setTextAlign(activeObj.textAlign || 'center');
      } else {
        setActiveTextObj(null);
        setTextInput('');
      }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleSelection);
    canvas.on('text:changed', handleSelection);

    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleSelection);
      canvas.off('text:changed', handleSelection);
    };
  }, [canvas]);

  const handleAddText = () => {
    if (!canvas) return;
    const txtVal = textInput.trim() || 'Custom Text';
    
    // Add text object to center of printable area
    const textObj = createFabricText(txtVal, {
      fontFamily,
      fontSize,
      fill,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textAlign,
      left: canvas.width / 2 - 40,
      top: canvas.height / 2 - 10
    });

    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.renderAll();
    
    onSaveState();
  };

  const handleTextChange = (e) => {
    const val = e.target.value;
    setTextInput(val);
    if (activeTextObj) {
      activeTextObj.set('text', val);
      canvas.renderAll();
    }
  };

  const updateProperty = (key, val) => {
    if (activeTextObj) {
      activeTextObj.set(key, val);
      canvas.renderAll();
      onSaveState();
    }
  };

  const handleDeleteText = () => {
    if (!canvas || !activeTextObj) return;
    canvas.remove(activeTextObj);
    canvas.discardActiveObject();
    canvas.renderAll();
    setActiveTextObj(null);
    setTextInput('');
    onSaveState();
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase">Text Message</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={handleTextChange}
            placeholder={activeTextObj ? "Editing message..." : "Type text message..."}
            className="flex-grow px-3 py-2 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs focus:outline-none"
            maxLength={40}
          />
          {!activeTextObj && (
            <button
              onClick={handleAddText}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <FiPlus />
              Add
            </button>
          )}
        </div>
      </div>

      {activeTextObj && (
        <div className="space-y-4 pt-3 border-t border-slate-100 animate-fadeIn">
          {/* Font Family */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Font Style</label>
            <select
              value={fontFamily}
              onChange={(e) => {
                setFontFamily(e.target.value);
                updateProperty('fontFamily', e.target.value);
              }}
              className="w-full px-3 py-2 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
            >
              {FONTS.map(f => (
                <option key={f.name} value={f.value}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Size & Weight Toggles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Font Size ({fontSize}px)</label>
              <input
                type="range"
                min="10"
                max="40"
                value={fontSize}
                onChange={(e) => {
                  const size = parseInt(e.target.value);
                  setFontSize(size);
                  updateProperty('fontSize', size);
                }}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Weight</label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const boldVal = !isBold;
                    setIsBold(boldVal);
                    updateProperty('fontWeight', boldVal ? 'bold' : 'normal');
                  }}
                  className={`flex-1 py-1.5 border rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                    isBold ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                  }`}
                >
                  <FiBold className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    const italicVal = !isItalic;
                    setIsItalic(italicVal);
                    updateProperty('fontStyle', italicVal ? 'italic' : 'normal');
                  }}
                  className={`flex-1 py-1.5 border rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                    isItalic ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                  }`}
                >
                  <FiItalic className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Alignment */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Text Align</label>
            <div className="flex gap-2">
              {[
                { align: 'left', icon: <FiAlignLeft className="w-3.5 h-3.5" /> },
                { align: 'center', icon: <FiAlignCenter className="w-3.5 h-3.5" /> },
                { align: 'right', icon: <FiAlignRight className="w-3.5 h-3.5" /> }
              ].map(opt => (
                <button
                  key={opt.align}
                  onClick={() => {
                    setTextAlign(opt.align);
                    updateProperty('textAlign', opt.align);
                  }}
                  className={`flex-1 py-1.5 border rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                    textAlign === opt.align ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                  }`}
                >
                  {opt.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color swatches */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase block">Font Color</label>
            <div className="flex flex-wrap gap-1.5">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => {
                    setFill(c);
                    updateProperty('fill', c);
                  }}
                  className={`w-5.5 h-5.5 rounded-full border border-slate-200 shadow-sm shrink-0 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center`}
                  style={{ backgroundColor: c }}
                >
                  {fill === c && (
                    <span className={`w-1.5 h-1.5 rounded-full ${c === '#ffffff' ? 'bg-slate-800' : 'bg-white'}`}></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Delete Action */}
          <button
            onClick={handleDeleteText}
            className="w-full py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <FiTrash2 className="w-4.5 h-4.5" />
            Delete Text Layer
          </button>
        </div>
      )}
    </div>
  );
};

export default TextEditor;
