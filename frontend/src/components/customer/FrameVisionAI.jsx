// FrameVisionAI.jsx
// Interactive FrameVision AI feature component with live photo upload and slot preview

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiGift, FiCheck, FiRefreshCw, FiSliders, FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const FrameVisionAI = () => {
  const [selectedImage, setSelectedImage] = useState('/images/hero_frame.jpg');
  const [frameFinish, setFrameFinish] = useState('walnut'); // walnut, oak, black, white
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiSlotDetected, setAiSlotDetected] = useState(true);

  const samplePhotos = [
    { label: 'Family Moment', url: '/images/products/product_01.jpg' },
    { label: 'Romantic Couple', url: '/images/products/product_08.jpg' },
    { label: 'Baby Milestone', url: '/images/products/product_05.jpg' },
    { label: 'Wedding Memories', url: '/images/products/product_09.jpg' },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        setTimeout(() => {
          setSelectedImage(event.target.result);
          setIsProcessing(false);
          setAiSlotDetected(true);
          toast.success('FrameVision AI auto-fitted your photo cleanly!');
        }, 800);
      };
      reader.readAsDataURL(file);
    }
  };

  const frameStyles = {
    walnut: 'border-[18px] border-[#3D2E24] shadow-[0_15px_35px_rgba(42,30,23,0.35)]',
    oak: 'border-[18px] border-[#C29B72] shadow-[0_15px_35px_rgba(194,155,114,0.3)]',
    black: 'border-[18px] border-[#1A1615] shadow-[0_15px_35px_rgba(0,0,0,0.4)]',
    white: 'border-[18px] border-[#FFFFFF] shadow-[0_15px_35px_rgba(0,0,0,0.15)] ring-1 ring-warmDark-100',
  };

  return (
    <section className="py-16 bg-gradient-to-b from-cream-200/60 to-cream-100 rounded-3xl border border-warmDark-100/80 shadow-warm-md overflow-hidden relative">
      
      {/* Glow Effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-terracotta-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-amber-100/80 border border-amber-300/70 text-amber-900 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4 shadow-xs">
            <FiGift className="w-4 h-4 text-terracotta-600 animate-pulse" />
            <span>Powered by FrameVision™ AI</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-warmDark-900 tracking-tight font-sans">
            See Your Photos Live Inside Any Frame
          </h2>
          <p className="text-warmDark-700/80 text-sm sm:text-base mt-3 leading-relaxed">
            Upload your photo or try a sample to experience instant AI photo slot detection, mat auto-cropping, and realistic 3D wall previews.
          </p>
        </div>

        {/* Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Step 1: Upload */}
            <div className="bg-white p-5 rounded-2xl border border-warmDark-100 shadow-warm-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-terracotta-600 uppercase tracking-wider">Step 1</span>
                <span className="text-xs text-warmDark-500 font-medium">Upload or Choose</span>
              </div>
              <h3 className="font-bold text-warmDark-900 text-base">Select Your Photo</h3>
              
              {/* File Dropzone */}
              <label className="border-2 border-dashed border-warmDark-200 hover:border-terracotta-500 bg-cream-50 hover:bg-cream-100 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 text-center">
                <FiUpload className="w-6 h-6 text-terracotta-600 mb-1" />
                <span className="text-xs font-bold text-warmDark-800">Upload Your Own Photo</span>
                <span className="text-[10px] text-warmDark-500">JPG, PNG up to 10MB</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>

              {/* Sample Photo Pickers */}
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-warmDark-600 block mb-2">Or try sample photos:</span>
                <div className="grid grid-cols-4 gap-2">
                  {samplePhotos.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage(sample.url);
                        setAiSlotDetected(true);
                        toast.success(`Loaded sample: ${sample.label}`);
                      }}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === sample.url ? 'border-terracotta-600 ring-2 ring-terracotta-200 scale-105' : 'border-warmDark-100 hover:border-warmDark-300'
                      }`}
                      title={sample.label}
                    >
                      <img src={sample.url} alt={sample.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Frame Material Finish */}
            <div className="bg-white p-5 rounded-2xl border border-warmDark-100 shadow-warm-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-terracotta-600 uppercase tracking-wider">Step 2</span>
                <span className="text-xs text-warmDark-500 font-medium">Material Finish</span>
              </div>
              <h3 className="font-bold text-warmDark-900 text-base">Choose Frame Wood</h3>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'walnut', name: 'Dark Walnut', bg: '#3D2E24' },
                  { id: 'oak', name: 'Natural Oak', bg: '#C29B72' },
                  { id: 'black', name: 'Classic Black', bg: '#1A1615' },
                  { id: 'white', name: 'Matte White', bg: '#FFFFFF' },
                ].map((finish) => (
                  <button
                    key={finish.id}
                    onClick={() => setFrameFinish(finish.id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center space-y-1.5 transition-all ${
                      frameFinish === finish.id 
                        ? 'border-terracotta-600 bg-terracotta-50 text-terracotta-900 font-bold shadow-xs' 
                        : 'border-warmDark-100 hover:bg-cream-100 text-warmDark-700'
                    }`}
                  >
                    <span 
                      className="w-5 h-5 rounded-full shadow-inner border border-warmDark-300" 
                      style={{ backgroundColor: finish.bg }}
                    />
                    <span className="text-[10px] text-center font-semibold leading-tight">{finish.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: AI Status */}
            <div className="bg-warmDark-900 text-cream-100 p-4 rounded-2xl flex items-center justify-between shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-terracotta-600/30 text-amber-300 flex items-center justify-center">
                  <FiGift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-cream-50">AI Slot Auto-Detection</h4>
                  <p className="text-[11px] text-cream-300/70">Aspect ratio & matte spacing locked</p>
                </div>
              </div>
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-extrabold border border-emerald-500/40">
                <FiCheck className="w-3 h-3" />
                <span>Active</span>
              </span>
            </div>

          </div>

          {/* Frame Live Preview Column */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-4">
            <div className="relative max-w-md w-full flex items-center justify-center">
              
              {/* Outer Shadow Mat Frame */}
              <div className={`relative p-6 bg-[#FAF6F0] rounded-lg transition-all duration-500 ${frameStyles[frameFinish]}`}>
                
                {/* Inner Mat Board */}
                <div className="relative p-6 bg-white shadow-inner rounded border border-warmDark-200/60 overflow-hidden">
                  
                  {/* Photo Canvas */}
                  <div className="relative aspect-[4/5] w-full min-w-[240px] sm:min-w-[280px] overflow-hidden rounded shadow-sm bg-cream-200">
                    
                    {isProcessing ? (
                      <div className="absolute inset-0 bg-warmDark-900/40 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 space-y-2">
                        <FiRefreshCw className="w-8 h-8 animate-spin text-amber-400" />
                        <span className="text-xs font-bold">AI Auto-Fitting Photo...</span>
                      </div>
                    ) : null}

                    <motion.img
                      key={selectedImage}
                      initial={{ scale: 0.95, opacity: 0.8 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      src={selectedImage}
                      alt="Custom Photo Frame Preview"
                      className="w-full h-full object-cover"
                    />

                    {/* AI Grid Bounding Box Animation Overlay */}
                    {aiSlotDetected && (
                      <div className="absolute inset-2 border border-amber-400/40 pointer-events-none flex items-center justify-center">
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-amber-400"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-amber-400"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-amber-400"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-amber-400"></div>
                      </div>
                    )}

                  </div>

                </div>

                {/* Badge on Frame */}
                <div className="absolute -bottom-3 right-6 bg-warmDark-900 text-cream-50 font-bold text-[10px] px-3 py-1 rounded-full shadow-lg border border-warmDark-700">
                  Real Wood • UV Glass
                </div>

              </div>

            </div>

            {/* CTA below preview */}
            <div className="mt-8 text-center space-y-3">
              <button 
                onClick={() => toast.success('Redirecting to FrameVision customizer...')}
                className="px-8 py-3.5 bg-terracotta-600 hover:bg-terracotta-700 text-white rounded-full font-extrabold text-sm tracking-wide shadow-warm-md hover:shadow-warm-lg transition-all duration-300 active:scale-95 inline-flex items-center space-x-2"
              >
                <FiGift className="w-4 h-4" />
                <span>Customize This Frame Now</span>
              </button>
              <p className="text-xs text-warmDark-600">Free high-resolution print check by design experts before shipping.</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default FrameVisionAI;
