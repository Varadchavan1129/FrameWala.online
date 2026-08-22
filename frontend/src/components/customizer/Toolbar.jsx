import React, { useState, useEffect } from 'react';
import { FiTrash2, FiCornerUpRight, FiCornerDownLeft, FiRotateCcw, FiArrowUp, FiArrowDown } from 'react-icons/fi';

export const Toolbar = ({ canvas, onSaveState, onReset, undo, redo, canUndo, canRedo }) => {
  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    if (!canvas) return;

    const handleSelection = () => {
      setHasSelection(!!canvas.getActiveObject());
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', handleSelection);

    return () => {
      canvas.off('selection:created', handleSelection);
      canvas.off('selection:updated', handleSelection);
      canvas.off('selection:cleared', handleSelection);
    };
  }, [canvas]);

  const handleDeleteSelected = () => {
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    // If it's the sample image, we just hide it instead of deleting it permanently
    if (activeObj.id === 'sample_image') {
      activeObj.set('visible', false);
    } else {
      canvas.remove(activeObj);
    }

    canvas.discardActiveObject();
    canvas.renderAll();
    onSaveState();
  };

  const handleBringToFront = () => {
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;
    
    activeObj.bringToFront();
    canvas.renderAll();
    onSaveState();
  };

  const handleSendToBack = () => {
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    // Send to back, but make sure sample image stays in the very back if it's there
    activeObj.sendToBack();
    const sampleObj = canvas.getObjects().find(o => o.id === 'sample_image');
    if (sampleObj) {
      sampleObj.sendToBack();
    }
    
    canvas.renderAll();
    onSaveState();
  };

  return (
    <div className="flex items-center justify-between border-b pb-3 gap-2 flex-wrap">
      {/* Undo / Redo */}
      <div className="flex gap-1">
        <button
          onClick={() => undo(canvas)}
          disabled={!canUndo}
          className={`p-2 border rounded-lg cursor-pointer transition-colors ${
            canUndo ? 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50' : 'border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed'
          }`}
          title="Undo"
        >
          <FiCornerDownLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => redo(canvas)}
          disabled={!canRedo}
          className={`p-2 border rounded-lg cursor-pointer transition-colors ${
            canRedo ? 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50' : 'border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed'
          }`}
          title="Redo"
        >
          <FiCornerUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Layer Actions */}
      {hasSelection && (
        <div className="flex gap-1 animate-fadeIn">
          <button
            onClick={handleBringToFront}
            className="p-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg cursor-pointer transition-colors flex items-center gap-1 text-[11px] font-bold"
            title="Bring Layer Forward"
          >
            <FiArrowUp className="w-3.5 h-3.5" />
            <span>Forward</span>
          </button>
          <button
            onClick={handleSendToBack}
            className="p-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-lg cursor-pointer transition-colors flex items-center gap-1 text-[11px] font-bold"
            title="Send Layer Backward"
          >
            <FiArrowDown className="w-3.5 h-3.5" />
            <span>Backward</span>
          </button>
          <button
            onClick={handleDeleteSelected}
            className="p-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg cursor-pointer transition-colors"
            title="Delete Layer"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Reset */}
      <button
        onClick={onReset}
        className="p-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 rounded-lg cursor-pointer transition-colors flex items-center gap-1 text-[11px] font-bold ml-auto"
        title="Reset Customizer"
      >
        <FiRotateCcw className="w-3.5 h-3.5" />
        <span>Reset</span>
      </button>
    </div>
  );
};

export default Toolbar;
