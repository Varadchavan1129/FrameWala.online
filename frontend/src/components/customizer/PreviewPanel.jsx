import React from 'react';

/**
 * PreviewPanel manages the visual layering of the mockup template and the Fabric canvas.
 */
export const PreviewPanel = ({ templateImage, printArea, children }) => {
  if (!printArea) return null;

  return (
    <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-4 relative select-none overflow-hidden h-full group">
      
      {/* Canvas Title */}
      <div className="absolute top-4 left-4 text-white font-extrabold text-[10px] uppercase tracking-widest opacity-60 z-10">
        Live Customization Mockup
      </div>

      {/* Mug preview layered workspace */}
      <div className="relative w-[400px] h-[400px] flex items-center justify-center scale-90 sm:scale-100 transition-transform">
        
        {/* Layer 1: Mug Template Image */}
        <img 
          src={templateImage} 
          alt="Mug mockup base template" 
          className="w-full h-full object-contain pointer-events-none z-10" 
        />

        {/* Dotted Printable Area Boundary (Overlay Guide) */}
        <div 
          className="absolute border border-dashed border-indigo-500/80 z-20 pointer-events-none rounded"
          style={{
            width: `${printArea.width}px`,
            height: `${printArea.height}px`,
            top: `${printArea.y}px`,
            left: `${printArea.x}px`
          }}
        />

        {/* Layer 2: Interactive Fabric.js Canvas */}
        <div 
          className="absolute z-30"
          style={{
            width: `${printArea.width}px`,
            height: `${printArea.height}px`,
            top: `${printArea.y}px`,
            left: `${printArea.x}px`
          }}
        >
          {children}
        </div>

      </div>

      {/* Helper Guidance */}
      <div className="absolute bottom-4 text-center text-slate-500 text-[10px] uppercase font-bold tracking-widest pointer-events-none">
        🖱️ Select, drag, rotate or scale layers inside print boundaries
      </div>

    </div>
  );
};

export default PreviewPanel;
