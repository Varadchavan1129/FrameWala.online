import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { fitImageToDimensions } from '../../utils/fabricHelpers.js';

export const CanvasEditor = ({ canvas, setCanvas, printArea, onSaveState, designJson }) => {
  const canvasRef = useRef(null);

  // Initialize and dispose canvas
  useEffect(() => {
    if (!canvasRef.current || !printArea) return;

    // Create Fabric.js canvas
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: printArea.width,
      height: printArea.height,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      preserveObjectStacking: true,
      selectionColor: 'rgba(99, 102, 241, 0.15)',
      selectionBorderColor: '#6366f1',
      selectionLineWidth: 1
    });

    setCanvas(fabricCanvas);

    // Setup canvas history change listeners
    const triggerSave = () => {
      onSaveState();
    };

    fabricCanvas.on('object:modified', triggerSave);
    fabricCanvas.on('object:added', triggerSave);
    fabricCanvas.on('object:removed', triggerSave);

    return () => {
      fabricCanvas.off('object:modified', triggerSave);
      fabricCanvas.off('object:added', triggerSave);
      fabricCanvas.off('object:removed', triggerSave);
      fabricCanvas.dispose();
      setCanvas(null);
    };
  }, [printArea]);

  // Load sample content or restore previous design once canvas is active
  useEffect(() => {
    if (!canvas || !printArea) return;

    const restoreOrCreateDesign = () => {
      if (designJson) {
        try {
          const parsed = typeof designJson === 'string' ? JSON.parse(designJson) : designJson;
          if (parsed && parsed.fabricState) {
            // Restore from saved Fabric.js state
            canvas.loadFromJSON(parsed.fabricState, () => {
              canvas.renderAll();
              console.log('Restored previous canvas design state successfully.');
            });
            return;
          }
        } catch (err) {
          console.error('Failed to restore existing design state:', err);
        }
      }

      // Default Initialization (Sample placeholders)
      canvas.clear();

      const sampleUrl = 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=500';
      fabric.Image.fromURL(sampleUrl, (img) => {
        img.set({
          id: 'sample_image',
          selectable: true,
          evented: true,
          left: 0,
          top: 0
        });

        fitImageToDimensions(img, printArea.width, printArea.height);
        canvas.centerObject(img);
        canvas.add(img);
        img.sendToBack();

        const textObj = new fabric.IText('Your Photo Here', {
          id: 'sample_text',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 16,
          fill: '#ffffff',
          fontWeight: 'bold',
          left: printArea.width / 2 - 60,
          top: printArea.height / 2 + 20,
          textAlign: 'center',
          borderColor: '#6366f1',
          cornerColor: '#6366f1',
          cornerSize: 8,
          transparentCorners: false
        });

        canvas.add(textObj);
        canvas.setActiveObject(textObj);
        canvas.renderAll();
      }, { crossOrigin: 'anonymous' });
    };

    restoreOrCreateDesign();
  }, [canvas, designJson, printArea]);

  return (
    <div className="w-full h-full bg-slate-900/10 rounded overflow-hidden">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default CanvasEditor;
