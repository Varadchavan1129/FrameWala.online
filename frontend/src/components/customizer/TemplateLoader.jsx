import React from 'react';

/**
 * Component for listing and selecting mockup templates.
 */
export const TemplateLoader = ({ templates, activeTemplate, onSelectTemplate }) => {
  if (!templates || templates.length === 0) return null;

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
        Choose Product Template
      </label>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((tpl) => {
          const isActive = activeTemplate.id === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl)}
              className={`p-2 border rounded-2xl flex flex-col items-center space-y-1.5 transition-all cursor-pointer bg-white text-center hover:scale-[1.02] active:scale-[0.98] ${
                isActive
                  ? 'border-indigo-600 ring-2 ring-indigo-100 text-indigo-600 font-bold'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center p-1">
                <img
                  src={tpl.image_url}
                  alt={tpl.name}
                  className="h-full object-contain pointer-events-none"
                />
              </div>
              <span className="text-[11px] leading-tight font-bold">{tpl.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateLoader;
