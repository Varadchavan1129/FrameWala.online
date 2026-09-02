import React, { useState, useEffect } from 'react';
import { FiX, FiCheck, FiRefreshCw } from 'react-icons/fi';
import { fabric } from 'fabric';
import CanvasEditor from './CanvasEditor.jsx';
import Toolbar from './Toolbar.jsx';
import ImageUploader from './ImageUploader.jsx';
import TextEditor from './TextEditor.jsx';
import PreviewPanel from './PreviewPanel.jsx';
import TemplateLoader from './TemplateLoader.jsx';
import { generateCompositePreview, exportDesignJSON } from './DesignExporter.jsx';
import useHistoryManager from './HistoryManager.jsx';
import { getPrintAreaConfig } from '../../utils/printAreaHelpers.js';
import { uploadCustomizationImage } from '../../services/productService.js';
import toast from 'react-hot-toast';

const MUG_TEMPLATES = [
  {
    id: 'white_mug',
    name: 'White Mug',
    image_url: '/templates/mugs/white_mug.png',
    print_area: { x: 105, y: 80, width: 190, height: 180, rotation: 0 }
  },
  {
    id: 'black_mug',
    name: 'Black Mug',
    image_url: '/templates/mugs/black_mug.png',
    print_area: { x: 105, y: 80, width: 190, height: 180, rotation: 0 }
  }
];

// Helper to convert base64 image data URL to a File object for multipart uploads
const dataURLtoFile = (dataurl, filename) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export const ProductCustomizer = ({ product, isOpen, onClose, onAddToCart }) => {
  if (!isOpen) return null;

  const [canvas, setCanvas] = useState(null);
  const [activeTab, setActiveTab] = useState('image'); // 'image' or 'text'
  const [saving, setSaving] = useState(false);

  // Template resolution: if customizable product is a Mug, support toggling options.
  const isMugProduct = (product.product_name || '').toLowerCase().includes('mug') || 
                       (product.category_name || '').toLowerCase().includes('mug');

  const templatesList = isMugProduct
    ? MUG_TEMPLATES
    : [
        {
          id: `product_${product.product_id}`,
          name: product.product_name,
          image_url: product.template_image || (product.images?.[0]?.image_url) || 'https://via.placeholder.com/400',
          print_area: getPrintAreaConfig(product.print_area_json)
        }
      ];

  const [activeTemplate, setActiveTemplate] = useState(templatesList[0]);

  // History Manager setup
  const { undo, redo, canUndo, canRedo, saveState, clearHistory } = useHistoryManager();

  // Reset history stack whenever active template changes
  useEffect(() => {
    if (canvas) {
      clearHistory(canvas);
    }
  }, [activeTemplate, canvas]);

  const handleSaveState = () => {
    if (canvas) {
      saveState(canvas);
    }
  };

  const handleReset = () => {
    if (!canvas) return;
    
    // Clear and restore sample placeholders
    clearHistory(canvas);
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
      const scaleX = canvas.width / img.width;
      const scaleY = canvas.height / img.height;
      img.scale(Math.min(scaleX, scaleY));
      canvas.centerObject(img);
      canvas.add(img);
      img.sendToBack();

      const textObj = new fabric.IText('Your Photo Here', {
        id: 'sample_text',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 16,
        fill: '#ffffff',
        fontWeight: 'bold',
        left: canvas.width / 2 - 60,
        top: canvas.height / 2 + 20,
        textAlign: 'center',
        borderColor: '#6366f1',
        cornerColor: '#6366f1',
        cornerSize: 8,
        transparentCorners: false
      });
      canvas.add(textObj);
      canvas.setActiveObject(textObj);
      canvas.renderAll();
      toast.success('Customizer design has been reset.');
    }, { crossOrigin: 'anonymous' });
  };

  const handleSaveAndAdd = async () => {
    if (!canvas) return;

    try {
      setSaving(true);
      toast.loading('Compiling and saving design...', { id: 'saving' });

      // 1. Check if user uploaded a custom graphic, and upload it if needed
      const objects = canvas.getObjects();
      const customerImageObj = objects.find(obj => obj.id === 'customer_image');
      const textObj = objects.find(obj => obj.type === 'i-text');

      let finalCustomImageUrl = null;
      
      // If customer image exists, check if it's a blob and needs to be uploaded to server
      if (customerImageObj && customerImageObj.src.startsWith('blob:')) {
        // Fetch raw blob data
        const blobResponse = await fetch(customerImageObj.src);
        const imageBlob = await blobResponse.blob();
        const uploadFile = new File([imageBlob], `custom_${Date.now()}.png`, { type: imageBlob.type });

        const formData = new FormData();
        formData.append('image', uploadFile);

        const uploadRes = await uploadCustomizationImage(formData);
        if (uploadRes.success) {
          finalCustomImageUrl = uploadRes.data.url;
          // Temporarily set src to server URL so exportDesignJSON serializes the remote URL
          customerImageObj.src = finalCustomImageUrl;
        } else {
          throw new Error('Customer graphic file upload failed.');
        }
      } else if (customerImageObj) {
        finalCustomImageUrl = customerImageObj.src;
      }

      // 2. Generate composite print template preview image
      const previewDataUrl = await generateCompositePreview(canvas, activeTemplate.image_url, activeTemplate.print_area);
      
      // 3. Upload composite preview image to server
      const previewFile = dataURLtoFile(previewDataUrl, `preview_${Date.now()}.png`);
      const previewFormData = new FormData();
      previewFormData.append('image', previewFile);

      const previewUploadRes = await uploadCustomizationImage(previewFormData);
      if (!previewUploadRes.success) {
        throw new Error('Composite preview image upload failed.');
      }
      const finalPreviewImageUrl = previewUploadRes.data.url;

      // 4. Export serializable design JSON parameters
      const designJsonPayload = exportDesignJSON(canvas, activeTemplate.id);

      // 5. Structure payload matching cart requirements
      const customizationPayload = {
        custom_image_url: finalCustomImageUrl,
        custom_text: textObj ? textObj.text : null,
        design_json: designJsonPayload,
        preview_image: finalPreviewImageUrl,
        template_name: activeTemplate.id
      };

      toast.success('Design saved successfully!', { id: 'saving' });
      await onAddToCart(customizationPayload);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to save customization details.', { id: 'saving' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh]">
        
        {/* Left Side: Live Preview Panel */}
        <div className="flex-1 relative flex flex-col h-full bg-slate-950">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 z-40 transition-colors cursor-pointer"
            title="Close Editor"
          >
            <FiX className="w-5 h-5" />
          </button>

          <PreviewPanel templateImage={activeTemplate.image_url} printArea={activeTemplate.print_area}>
            <CanvasEditor
              canvas={canvas}
              setCanvas={setCanvas}
              printArea={activeTemplate.print_area}
              onSaveState={handleSaveState}
            />
          </PreviewPanel>
        </div>

        {/* Right Side: Configuration Sidebar */}
        <div className="w-full md:w-96 bg-white flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 h-full overflow-hidden">
          
          {/* Tab Selector */}
          <div className="flex border-b border-slate-100 bg-slate-50/50 shrink-0">
            <button
              onClick={() => setActiveTab('image')}
              className={`flex-1 py-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === 'image' 
                  ? 'border-indigo-600 text-indigo-600 bg-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Mug Graphics
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-4 text-xs font-extrabold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === 'text' 
                  ? 'border-indigo-600 text-indigo-600 bg-white' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Text Overlay
            </button>
          </div>

          {/* Configurator Scroll Area */}
          <div className="flex-grow p-6 overflow-y-auto space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-800 tracking-tight">Personalize Product</h3>
              <p className="text-slate-400 text-[11px] font-semibold">Customize print properties to compile mockup design</p>
            </div>

            {/* Common Workspace Toolbar (Undo/Redo/Reset) */}
            <Toolbar
              canvas={canvas}
              onSaveState={handleSaveState}
              onReset={handleReset}
              undo={undo}
              redo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
            />

            {/* Template Selector (White vs Black Mug option toggle) */}
            {isMugProduct && (
              <TemplateLoader
                templates={MUG_TEMPLATES}
                activeTemplate={activeTemplate}
                onSelectTemplate={setActiveTemplate}
              />
            )}

            {/* Graphic Selection tab */}
            {activeTab === 'image' && (
              <ImageUploader canvas={canvas} onSaveState={handleSaveState} />
            )}

            {/* Custom Text selection tab */}
            {activeTab === 'text' && (
              <TextEditor canvas={canvas} onSaveState={handleSaveState} />
            )}
          </div>

          {/* Footer Save Actions */}
          <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 text-slate-500 hover:text-slate-700 bg-white hover:bg-slate-100 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndAdd}
              disabled={saving}
              className="flex-grow py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiCheck className="w-4 h-4" />
              <span>{saving ? 'Saving Design...' : 'Save & Add to Cart'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductCustomizer;
