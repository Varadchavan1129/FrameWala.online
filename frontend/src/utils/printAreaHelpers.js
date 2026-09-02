/**
 * Parses and returns the print area coordinate configuration.
 * Fallback config is returned if parsing fails.
 */
export const getPrintAreaConfig = (jsonString) => {
  const fallback = {
    x: 105,
    y: 80,
    width: 190,
    height: 180,
    rotation: 0
  };

  if (!jsonString) return fallback;

  try {
    const config = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    return {
      x: typeof config.x === 'number' ? config.x : fallback.x,
      y: typeof config.y === 'number' ? config.y : fallback.y,
      width: typeof config.width === 'number' ? config.width : fallback.width,
      height: typeof config.height === 'number' ? config.height : fallback.height,
      rotation: typeof config.rotation === 'number' ? config.rotation : fallback.rotation
    };
  } catch (err) {
    console.error('Error parsing print area json:', err);
    return fallback;
  }
};
