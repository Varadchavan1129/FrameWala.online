// CustomFrame.jsx — upload photo + frame selection UI (FrameVision AI placeholder).

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CartContext } from '../../context/CartContext.jsx';
import { FINISHES, SIZES } from '../../constants/productConstants.js';
import { formatINR } from '../../utils/formatters.js';
import { getProducts } from '../../services/productService.js';
import toast from 'react-hot-toast';
import { FiUpload, FiZap, FiCheck, FiRefreshCw, FiShoppingCart, FiImage } from 'react-icons/fi';


const CustomFrame = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [samples, setSamples] = useState([]);
  const [framesForCustom, setFramesForCustom] = useState([]);
  const [photo, setPhoto] = useState('/api/images/products/product_01.jpg');
  const [frame, setFrame] = useState(null);
  const [finishIdx, setFinishIdx] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(res => {
      const prods = res.data.products;
      const frames = prods.filter(p => p.is_customizable).slice(0, 6);
      setFramesForCustom(frames);
      if (frames.length > 0) setFrame(frames[0]);

      const familyProd = prods.find(p => p.category_name === 'Family Frames');
      const coupleProd = prods.find(p => p.category_name === 'Couple Frames');
      const babyProd = prods.find(p => p.category_name === 'Baby Frames');
      const weddingProd = prods.find(p => p.category_name === 'Wedding Frames');

      const dynamicSamples = [
        { label: 'Family', url: familyProd?.primary_image || '/api/images/products/product_01.jpg' },
        { label: 'Couple', url: coupleProd?.primary_image || '/api/images/products/product_08.jpg' },
        { label: 'Baby', url: babyProd?.primary_image || '/api/images/products/product_05.jpg' },
        { label: 'Wedding', url: weddingProd?.primary_image || '/api/images/products/product_09.jpg' },
      ];
      setSamples(dynamicSamples);
      if (dynamicSamples.length > 0) setPhoto(dynamicSamples[0].url);

      setLoading(false);
    });
  }, []);

  const finish = FINISHES[finishIdx];
  const price = frame ? Number(frame.price) + SIZES[sizeIdx].delta : 0;

  const onUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProcessing(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setTimeout(() => {
        setPhoto(ev.target.result);
        setProcessing(false);
        toast.success('Photo added! Preview updated inside your frame.');
      }, 700);
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = async () => {
    return await addToCart(frame, 1, { price, size: SIZES[sizeIdx].label, finish: finish.name, image: frame.primary_image, custom_image: photo });
  };
  const handleBuy = async () => { 
    const ok = await handleAdd(); 
    if (ok) navigate('/checkout'); 
  };

  if (loading || !frame) return <div className="py-20 flex justify-center text-brand-600"><FiZap className="w-8 h-8 animate-pulse" /></div>;

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
              <span className="text-sm font-bold text-warmDark-800">Click to upload a photo</span>
              <span className="text-[11px] text-warmDark-500">JPG, PNG up to 10MB</span>
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
              {framesForCustom.map((f) => (
                <button key={f.id} onClick={() => setFrame(f)} className={`rounded-xl overflow-hidden border-2 transition-all text-left ${frame.id === f.id ? 'border-brand-600 ring-2 ring-brand-100' : 'border-warmDark-100 hover:border-warmDark-300'}`} data-testid={`custom-frame-${f.id}`}>
                  <img src={f.primary_image} alt={f.name} className="w-full aspect-square object-cover" />
                  <p className="text-[10px] font-semibold text-warmDark-700 px-2 py-1 line-clamp-1">{f.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Finish + size */}
          <div className="bg-white border border-warmDark-100/60 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-brand-600 text-cream-50 text-xs font-bold flex items-center justify-center">3</span><h3 className="font-bold text-warmDark-900">Finish & Size</h3></div>
            <div>
              <p className="text-xs font-semibold text-warmDark-600 mb-2">Finish: {finish.name}</p>
              <div className="flex gap-3">
                {FINISHES.map((f, i) => (
                  <button key={f.name} onClick={() => setFinishIdx(i)} title={f.name} className={`w-9 h-9 rounded-full border-2 transition-all ${finishIdx === i ? 'ring-2 ring-brand-600 ring-offset-2 border-white' : 'border-white shadow'}`} style={{ backgroundColor: f.hex }} data-testid={`custom-finish-${i}`} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-warmDark-600 mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s, i) => (
                  <button key={s.label} onClick={() => setSizeIdx(i)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${sizeIdx === i ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-warmDark-100 text-warmDark-700 hover:border-warmDark-300'}`} data-testid={`custom-size-${i}`}>{s.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:sticky lg:top-28 space-y-6">
          <div className="bg-gradient-to-br from-cream-200/70 to-cream-100 border border-warmDark-100/60 rounded-3xl p-8 flex flex-col items-center">
            <div className="relative rounded-sm shadow-warm-lg" style={{ padding: '22px', backgroundColor: finish.hex }}>
              <div className="bg-white p-4">
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
              <p className="font-extrabold text-warmDark-900">{frame.name}</p>
              <p className="text-sm text-warmDark-500">{finish.name} · {SIZES[sizeIdx].label}</p>
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
                <h4 className="font-bold text-cream-50 text-sm">FrameVision AI — Coming Soon</h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-500/30 text-brand-100 rounded-full text-[10px] font-bold"><FiCheck className="w-3 h-3" /> Preview</span>
              </div>
              <p className="text-xs text-cream-300/80 leading-relaxed">Soon, FrameVision will automatically detect the photo slot inside any frame design and place your uploaded photo perfectly — with smart cropping and realistic previews.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomFrame;
