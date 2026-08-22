/**
 * Combines the template mockup and the print canvas into a single preview image.
 */
export const generateCompositePreview = (canvas, templateImageUrl, printArea) => {
  return new Promise((resolve, reject) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 400;
    tempCanvas.height = 400;
    const ctx = tempCanvas.getContext('2d');

    // 1. Draw template background
    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.onload = () => {
      ctx.drawImage(bgImg, 0, 0, 400, 400);

      // 2. Render print area canvas
      const printImg = new Image();
      printImg.onload = () => {
        // Draw the printable area canvas over the template at configuration coordinates
        ctx.drawImage(
          printImg,
          printArea.x,
          printArea.y,
          printArea.width,
          printArea.height
        );
        resolve(tempCanvas.toDataURL('image/png'));
      };
      printImg.onerror = (err) => {
        console.error('Failed to load canvas image for composite:', err);
        reject(err);
      };
      
      // Get data URL of current fabric canvas (hiding selection corners)
      canvas.discardActiveObject();
      canvas.requestRenderAll();
      printImg.src = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1
      });
    };
    bgImg.onerror = (err) => {
      console.error('Failed to load mockup template for composite:', err);
      reject(err);
    };
    bgImg.src = templateImageUrl;
  });
};

/**
 * Extracts and compiles design parameters alongside Fabric.js state.
 */
export const exportDesignJSON = (canvas, templateName) => {
  if (!canvas) return null;

  const objects = canvas.getObjects();
  const imageObj = objects.find(obj => obj.type === 'image' && obj.id !== 'placeholder');
  const textObj = objects.find(obj => obj.type === 'i-text');

  // Extract core design properties
  const design = {
    template: templateName,
    image: imageObj ? imageObj.src : null,
    text: textObj ? textObj.text : null,
    font: textObj ? textObj.fontFamily : null,
    fontSize: textObj ? textObj.fontSize : null,
    fontColor: textObj ? textObj.fill : null,
    rotation: imageObj ? Math.round(imageObj.angle || 0) : 0,
    scale: imageObj ? parseFloat((imageObj.scaleX || 1).toFixed(2)) : 1.0,
    positionX: imageObj ? Math.round(imageObj.left || 0) : 0,
    positionY: imageObj ? Math.round(imageObj.top || 0) : 0,
    
    // Also include text specifications specifically
    textRotation: textObj ? Math.round(textObj.angle || 0) : 0,
    textX: textObj ? Math.round(textObj.left || 0) : 0,
    textY: textObj ? Math.round(textObj.top || 0) : 0,

    // Store raw Fabric.js canvas JSON for subsequent editing
    fabricState: canvas.toJSON(['id', 'selectable', 'evented', 'excludeFromExport'])
  };

  return JSON.stringify(design);
};
