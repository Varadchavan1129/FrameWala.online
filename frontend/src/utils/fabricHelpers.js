import { fabric } from 'fabric';

/**
 * Creates a Fabric.js text object with standard properties.
 */
export const createFabricText = (text, options = {}) => {
  const {
    fontFamily = 'system-ui, sans-serif',
    fontSize = 24,
    fill = '#000000',
    fontWeight = 'normal',
    fontStyle = 'normal',
    textAlign = 'center',
    left = 50,
    top = 50,
    ...rest
  } = options;

  return new fabric.IText(text, {
    fontFamily,
    fontSize,
    fill,
    fontWeight,
    fontStyle,
    textAlign,
    left,
    top,
    borderColor: '#6366f1',
    cornerColor: '#6366f1',
    cornerSize: 8,
    transparentCorners: false,
    ...rest
  });
};

/**
 * Fits a Fabric.js image object to the target dimensions while maintaining aspect ratio.
 */
export const fitImageToDimensions = (imgObj, maxWidth, maxHeight) => {
  const scaleX = maxWidth / imgObj.width;
  const scaleY = maxHeight / imgObj.height;
  const scale = Math.min(scaleX, scaleY);
  
  imgObj.scale(scale);
  return imgObj;
};
