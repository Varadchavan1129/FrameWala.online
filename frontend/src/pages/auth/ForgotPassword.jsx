// ForgotPassword.jsx
// Password Recovery Page

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../services/authService.js';
import Button from '../../components/common/Button.jsx';
import { FiMail, FiArrowLeft, FiKey } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword(email);
      if (res.success) {
        toast.success(res.message || 'Recovery email sent.');
      }
    } catch (error) {
      toast.error('Failed to request recovery link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-6 shadow-md">
        
        {/* Header Icon */}
        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <FiKey className="w-6 h-6" />
        </div>

        {/* Header Text */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Forgot Password</h1>
          <p className="text-slate-400 text-xs">Enter your email below to request a reset link.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <FiMail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="raj@example.com"
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <Button type="submit" loading={loading} className="w-full py-3 text-xs font-bold">
            <span>Send Reset Instructions</span>
          </Button>
        </form>

        {/* Back Link */}
        <div className="text-center pt-2 border-t border-slate-50">
          <Link to="/login" className="inline-flex items-center text-xs text-slate-400 hover:text-indigo-600 font-bold transition-colors">
            <FiArrowLeft className="mr-1 w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
