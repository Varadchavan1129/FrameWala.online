// About.jsx
// Corporate mission page

import React from 'react';
import { FiTarget, FiHeart, FiStar } from 'react-icons/fi';

const About = () => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight">About FrameWala</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">We preserve your treasured memories into custom wooden photo frames, magic coffee mugs, and printed apparel.</p>
      </div>

      {/* Main visual section */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold">Our Philosophy</h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Founded with a passion for customization, FrameWala aims to make personalized gifting simple, premium, and affordable. We source only high-durability matte acrylics, real pine wood frame moldings, and direct-to-garment print inks to bring your digital photographs to life.
          </p>
        </div>
      </div>

      {/* Three Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 p-6 rounded-2xl space-y-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
            <FiTarget className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">Our Mission</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            To provide students and gift seekers with customized tools to layout frames and merchandise at the tap of a button.
          </p>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-2xl space-y-4">
          <div className="p-3 bg-rose-50 text-rose-500 rounded-xl w-fit">
            <FiHeart className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">Made with Love</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Every photo frame layout, mug template design, and t-shirt vector print is verified by design experts before shipping.
          </p>
        </div>

        <div className="bg-white border border-slate-100 p-6 rounded-2xl space-y-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl w-fit">
            <FiStar className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-base">Premium Materials</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            We use premium sublimation processes on ceramic mugs and heavy-gauge cotton t-shirts to guarantee prints last forever.
          </p>
        </div>
      </div>

    </div>
  );
};

export default About;
