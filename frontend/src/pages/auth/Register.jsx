// Register.jsx — local (mock) sign up.
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => { if (user) navigate('/', { replace: true }); }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.first_name || !form.email || !form.password) { toast.error('Please fill all required fields.'); return; }
    await register(form);
  };

  const input = 'w-full pl-10 pr-4 py-2.5 border border-warmDark-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 bg-white';

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="bg-white border border-warmDark-100/60 p-8 rounded-3xl shadow-warm-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-warmDark-900">Create Account</h1>
          <p className="text-warmDark-500 text-xs">Join the FrameWala family.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative"><FiUser className="w-4 h-4 text-warmDark-400 absolute left-3 top-1/2 -translate-y-1/2" /><input className={input} placeholder="First name" value={form.first_name} onChange={set('first_name')} required data-testid="reg-first" /></div>
            <input className="w-full px-4 py-2.5 border border-warmDark-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 bg-white" placeholder="Last name" value={form.last_name} onChange={set('last_name')} data-testid="reg-last" />
          </div>
          <div className="relative"><FiMail className="w-4 h-4 text-warmDark-400 absolute left-3 top-1/2 -translate-y-1/2" /><input className={input} type="email" placeholder="Email address" value={form.email} onChange={set('email')} required data-testid="reg-email" /></div>
          <div className="relative"><FiLock className="w-4 h-4 text-warmDark-400 absolute left-3 top-1/2 -translate-y-1/2" /><input className={input} type="password" placeholder="Password" value={form.password} onChange={set('password')} required data-testid="reg-password" /></div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-700 text-cream-50 rounded-full font-bold text-sm" data-testid="reg-submit"><FiUserPlus className="w-4 h-4" /> Create Account</button>
        </form>
        <p className="text-center text-xs text-warmDark-500">Already have an account? <Link to="/login" className="text-brand-600 font-bold hover:underline">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
