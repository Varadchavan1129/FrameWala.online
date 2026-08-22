// Contact.jsx
// Customer feedback and inquiries page

import React, { useState } from 'react';
import Button from '../../components/common/Button.jsx';
import { FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('All fields are required.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      toast.success('Your message has been sent successfully (mocked).');
      setName('');
      setEmail('');
      setMessage('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight">Contact Us</h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">Have questions about dimensions, bulk frame orders, or customized templates? Get in touch.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Contact Cards */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-start space-x-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
              <FiPhone className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold">
              <span className="text-slate-400 uppercase text-[9px] block">Call Us</span>
              <span className="text-slate-800 font-extrabold text-sm block mt-0.5">+91 98765 43210</span>
              <span className="text-slate-400 text-[10px] block mt-0.5">Mon - Sat (9am - 6pm)</span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-start space-x-4">
            <div className="p-3 bg-rose-50 text-rose-500 rounded-xl shrink-0">
              <FiMail className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold">
              <span className="text-slate-400 uppercase text-[9px] block">Email Us</span>
              <span className="text-slate-800 font-extrabold text-sm block mt-0.5">support@framewala.online</span>
              <span className="text-slate-400 text-[10px] block mt-0.5">We respond within 24 hours</span>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-5 rounded-2xl flex items-start space-x-4">
            <div className="p-3 bg-amber-50 text-amber-500 rounded-xl shrink-0">
              <FiMapPin className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold">
              <span className="text-slate-400 uppercase text-[9px] block">Our Office</span>
              <span className="text-slate-800 font-extrabold text-sm block mt-0.5 leading-tight">102, Crafting Street, IT Hub, Mumbai</span>
            </div>
          </div>
        </div>

        {/* Right Side: Inquiry Form */}
        <div className="md:col-span-2 bg-white border border-slate-100 p-6 md:p-8 rounded-3xl space-y-6">
          <h2 className="font-extrabold text-slate-800 text-lg">Send a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Varad Chavan"
                  className="w-full px-3.5 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. varad@example.com"
                  className="w-full px-3.5 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Message Comments</label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What details are you looking for?"
                className="w-full px-3.5 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500 bg-slate-50 focus:bg-white"
                required
              ></textarea>
            </div>

            <Button type="submit" loading={loading} className="text-xs font-bold py-2.5 px-6">
              <FiSend className="mr-1.5 w-3.5 h-3.5" />
              <span>Send Message</span>
            </Button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default Contact;
