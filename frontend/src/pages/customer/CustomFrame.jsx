// CustomFrame.jsx — upload photo + frame selection UI (FrameVision AI studio).

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CartContext } from '../../context/CartContext.jsx';
import { FRAME_COLORS, SIZES, resolveFrameColor } from '../../constants/productConstants.js';
import { formatINR } from '../../utils/formatters.js';
import { getProducts, uploadCustomizationImage } from '../../services/productService.js';
import toast from 'react-hot-toast';
import { FiUpload, FiZap, FiCheck, FiRefreshCw, FiShoppingCart, FiImage, FiArrowLeft } from 'react-icons/fi';

const CustomFrame = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedProductId = searchParams.get('productId');
  const requestedPhoto = searchParams.get('photo');

  const { addToCart } = useContext(CartContext);

  const [samples, setSamples] = useState([]);
  const [framesForCustom, setFramesForCustom] = useState([]);
  const [photo, setPhoto] = useState('/images/products/product_01.jpg');
  const [frame, setFrame] = useState(null);
  const [finishIdx, setFinishIdx] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(res => {
      const prods = res?.data?.products || res?.products || [];
      const customizableList = prods.filter(p => p.is_customizable);
      const allFrames = customizableList.length > 0 ? customizableList : prods;
      setFramesForCustom(allFrames.slice(0, 8));

      // Match requested product if provided
      const matched = requestedProductId
        ? prods.find(p => String(p.id || p.product_id) === String(requestedProductId))
        : null;

      if (matched) {
        setFrame(matched);
        if (!allFrames.some(f => String(f.id || f.product_id) === String(matched.id || matched.product_id))) {
          setFramesForCustom(prev => [matched, ...prev]);
        }
      } else if (allFrames.length > 0) {
        setFrame(allFrames[0]);
      }

      const familyProd = prods.find(p => p.category_name === 'Family Frames');
      const coupleProd = prods.find(p => p.category_name === 'Couple Frames');
      const babyProd = prods.find(p => p.category_name === 'Baby Frames');
      const weddingProd = prods.find(p => p.category_name === 'Wedding Frames');

      const dynamicSamples = [
        { label: 'Family', url: familyProd?.primary_image || '/images/products/product_01.jpg' },
        { label: 'Couple', url: coupleProd?.primary_image || '/images/products/product_08.jpg' },
        { label: 'Baby', url: babyProd?.primary_image || '/images/products/product_05.jpg' },
        { label: 'Wedding', url: weddingProd?.primary_image || '/images/products/product_09.jpg' },
      ];
      setSamples(dynamicSamples);

      if (requestedPhoto) {
        setPhoto(requestedPhoto);
      } else if (dynamicSamples.length > 0) {
        setPhoto(dynamicSamples[0].url);
      }

      setLoading(false);
    });
  }, [requestedProductId, requestedPhoto]);

  const rawFinishes = (frame && frame.finishes && frame.finishes.length > 0) ? frame.finishes : FRAME_COLORS;
  const activeFinishes = rawFinishes.map(f => resolveFrameColor(f));
  const activeSizes = (frame && frame.sizes) ? frame.sizes : SIZES;

  const finish = activeFinishes[finishIdx] || activeFinishes[0];
  const price = frame ? Number(frame.price) + (activeSizes[sizeIdx]?.delta || 0) : 0;

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    setProcessing(true);
    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setPhoto(localUrl);

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await uploadCustomizationImage(formData);
      if (res.success && res.data?.url) {
        setPhoto(res.data.url);
        toast.success('Photo added! Preview updated inside your frame.');
      } else {
        toast.success('Photo preview ready inside frame!');
      }
    } catch (error) {
      console.warn('Backend upload notice:', error.message);
      toast.success('Photo preview loaded!');
    } finally {
      setProcessing(false);
    }
  };

  const handleAdd = async () => {
    return await addToCart(frame, 1, { 
      price, 
      size: activeSizes[sizeIdx]?.label, 
      finish: finish?.name, 
      image: frame.primary_image, 
      custom_image: photo 
    });
  };

  const handleBuy = async () => { 
    const ok = await handleAdd(); 
    if (ok) navigate('/checkout'); 
  };

  if (loading || !frame) return (
    <div className="py-24 flex flex-col items-center justify-center gap-3 text-brand-700">
      <FiZap className="w-8 h-8 animate-pulse" />
      <p className="text-xs font-bold tracking-widest uppercase text-warmDark-600">Loading Frame Studio...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gold-100 text-brand-800 rounded-full text-xs font-extrabold uppercase tracking-wider">
          <FiZap className="w-4 h-4" /> Powered by FrameVision AI
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-warmDark-900 tracking-tight">Design Your Custom Frame</h1>
        <p className="text-warmDark-600 text-sm">Upload your photo, choose a frame and finish, and preview it live before you order.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 items-start">
        {/* Controls */}
        <div className="space-y-6">
          {/* Upload */}
          <div className="bg-white border border-warmDark-100/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-brand-600 text-cream-50 text-xs font-bold flex items-center justify-center">1</span><h3 className="font-bold text-warmDark-900">Upload Your Photo</h3></div>
            <label className="border-2 border-dashed border-warmDark-200 hover:border-brand-500 bg-cream-50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors text-center" data-testid="upload-dropzone">
              <FiUpload className="w-7 h-7 text-brand-600 mb-2" />
              <span className="text-sm font-bold text-warmDark-800">Click to upload your photo</span>
              <span className="text-[11px] text-warmDark-500">JPG, PNG up to 5MB</span>
              <input type="file" accept="image/*" onChange={onUpload} className="hidden" data-testid="upload-input" />
            </label>
            <div>
              <p className="text-[11px] font-semibold text-warmDark-600 mb-2">Or try a sample photo:</p>
              <div className="grid grid-cols-4 gap-2">
                {samples.map((s) => (
                  <button key={s.label} onClick={() => { setPhoto(s.url); toast.success(`Loaded ${s.label} sample`); }} className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${photo === s.url ? 'border-brand-600 ring-2 ring-brand-100' : 'border-warmDark-100 hover:border-warmDark-300'}`} title={s.label} data-testid={`sample-${s.label}`}>
                    <img src={s.url} alt={s.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Frame select */}
          <div className="bg-white border border-warmDark-100/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-brand-600 text-cream-50 text-xs font-bold flex items-center justify-center">2</span><h3 className="font-bold text-warmDark-900">Choose Your Frame</h3></div>
            <div className="grid grid-cols-3 gap-3">
              {framesForCustom.map((f) => {
                const fId = f.id || f.product_id;
                const activeId = frame.id || frame.product_id;
                const isSelected = String(fId) === String(activeId);
                return (
                  <button 
                    key={fId} 
                    onClick={() => setFrame(f)} 
                    className={`rounded-xl overflow-hidden border-2 transition-all text-left ${isSelected ? 'border-brand-600 ring-2 ring-brand-100' : 'border-warmDark-100 hover:border-warmDark-300'}`} 
                    data-testid={`custom-frame-${fId}`}
                  >
                    <img src={f.primary_image || '/images/products/product_01.jpg'} alt={f.name || f.product_name} className="w-full aspect-square object-cover" />
                    <p className="text-[10px] font-semibold text-warmDark-700 px-2 py-1 line-clamp-1">{f.name || f.product_name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Finish & Color + size */}
          <div className="bg-white border border-warmDark-100/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-brand-600 text-cream-50 text-xs font-bold flex items-center justify-center">3</span><h3 className="font-bold text-warmDark-900">Finish & Size</h3></div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-warmDark-800">Frame Moulding Finish: <span className="text-brand-700 font-extrabold">{finish?.name || 'Classic Black'}</span></p>
              </div>
              <div className="flex flex-wrap gap-3" data-testid="frame-color-swatches">
                {activeFinishes.map((rawItem, i) => {
                  const resolved = resolveFrameColor(rawItem);
                  const isSelected = finishIdx === i;
                  return (
                    <button
                      key={resolved.name + i}
                      onClick={() => setFinishIdx(i)}
                      title={resolved.name}
                      aria-label={`Select frame color ${resolved.name}`}
                      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${resolved.border} ${
                        isSelected ? 'ring-2 ring-brand-600 ring-offset-2 scale-105' : 'hover:scale-105 opacity-90 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: resolved.hex }}
                      data-testid={`custom-finish-${i}`}
                    >
                      {isSelected && (
                        <FiCheck className={`w-4 h-4 ${resolved.hex === '#F5F5F7' || resolved.hex === '#FFFFFF' ? 'text-warmDark-900' : 'text-white'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-warmDark-600 mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {activeSizes.map((s, i) => (
                  <button key={s.label} onClick={() => setSizeIdx(i)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${sizeIdx === i ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-warmDark-100 text-warmDark-700 hover:border-warmDark-300'}`} data-testid={`custom-size-${i}`}>{s.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-28 space-y-6">
          <div className="bg-gradient-to-br from-cream-200/70 to-cream-100 border border-warmDark-100/60 rounded-3xl p-8 flex flex-col items-center">
            <div className="relative rounded-md shadow-2xl transition-all duration-300" style={{ padding: '24px', backgroundColor: finish?.hex || '#1E1E1E' }}>
              <div className="bg-white p-4 shadow-inner">
                <div className="relative w-64 sm:w-72 aspect-[4/5] overflow-hidden bg-cream-200">
                  {processing && (
                    <div className="absolute inset-0 z-20 bg-warmDark-900/40 backdrop-blur-sm flex flex-col items-center justify-center text-cream-50 gap-2">
                      <FiRefreshCw className="w-7 h-7 animate-spin text-gold-400" />
                      <span className="text-xs font-bold">Fitting your photo...</span>
                    </div>
                  )}
                  <motion.img key={photo} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} src={photo} alt="Your photo preview" className="w-full h-full object-cover" data-testid="custom-preview-image" />
                  {/* AI slot detection placeholder overlay */}
                  <div className="absolute inset-3 border border-gold-400/50 pointer-events-none">
                    <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gold-400" />
                    <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gold-400" />
                    <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gold-400" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gold-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="font-extrabold text-warmDark-900">{frame.name || frame.product_name}</p>
              <p className="text-sm text-warmDark-500">{finish?.name} · {activeSizes[sizeIdx]?.label}</p>
              <p className="text-2xl font-extrabold text-brand-700 mt-1">{formatINR(price)}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full mt-5">
              <button onClick={handleBuy} className="py-3.5 bg-brand-600 hover:bg-brand-700 text-cream-50 rounded-full font-bold text-sm shadow-warm-md transition-all active:scale-95" data-testid="custom-buy-now">Buy Now</button>
              <button onClick={handleAdd} className="py-3.5 bg-white border-2 border-warmDark-900 text-warmDark-900 hover:bg-warmDark-900 hover:text-cream-50 rounded-full font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2" data-testid="custom-add-cart"><FiShoppingCart className="w-4 h-4" /> Add to Cart</button>
            </div>
          </div>

          {/* FrameVision AI placeholder banner */}
          <div className="bg-warmDark-900 text-cream-100 rounded-3xl p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gold-400/20 text-gold-400 flex items-center justify-center shrink-0"><FiImage className="w-5 h-5" /></div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-cream-50 text-sm">FrameVision AI Studio</h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-500/30 text-brand-100 rounded-full text-[10px] font-bold"><FiCheck className="w-3 h-3" /> Ready</span>
              </div>
              <p className="text-xs text-cream-300/80 leading-relaxed">FrameVision places your uploaded photo inside high-resolution solid wood frames with museum UV glass simulations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomFrame;