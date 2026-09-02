// Contact.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e) => { e.preventDefault(); toast.success('Thanks! We\'ll get back to you shortly.'); setForm({ name: '', email: '', message: '' }); };
  const input = 'w-full px-4 py-2.5 border border-warmDark-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 bg-white';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-warmDark-900 tracking-tight">Get In Touch</h1>
        <p className="text-warmDark-600 text-sm">We'd love to help you frame your memories.</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          {[{ icon: FiPhone, t: 'Call Us', d: '+91 98765 43210' }, { icon: FiMail, t: 'Email', d: 'care@framewala.com' }, { icon: FiMapPin, t: 'Visit', d: 'Pune, Maharashtra, India' }].map((c, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-warmDark-100/60 rounded-2xl p-4">
              <div className="w-11 h-11 rounded-xl bg-gold-100 text-brand-700 flex items-center justify-center"><c.icon className="w-5 h-5" /></div>
              <div><p className="font-bold text-warmDark-900 text-sm">{c.t}</p><p className="text-xs text-warmDark-500">{c.d}</p></div>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="lg:col-span-2 bg-white border border-warmDark-100/60 rounded-3xl p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input className={input} placeholder="Your Name" value={form.name} onChange={set('name')} required />
            <input className={input} placeholder="Email Address" type="email" value={form.email} onChange={set('email')} required />
          </div>
          <textarea rows={5} className={input} placeholder="Your message..." value={form.message} onChange={set('message')} required />
          <button type="submit" className="inline-flex items-center gap-2 px-7 py-3 bg-brand-600 hover:bg-brand-700 text-cream-50 rounded-full font-bold text-sm"><FiSend className="w-4 h-4" /> Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
