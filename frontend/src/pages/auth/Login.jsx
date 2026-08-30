// Login.jsx — local (mock) sign in.
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => { if (user) navigate(location.state?.from?.pathname || '/', { replace: true }); }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please enter email and password.'); return; }
    await login({ email, password });
  };

  const input = 'w-full pl-10 pr-4 py-2.5 border border-warmDark-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 bg-white';

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="bg-white border border-warmDark-100/60 p-8 rounded-3xl shadow-warm-md space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-warmDark-900">Welcome Back</h1>
          <p className="text-warmDark-500 text-xs">Sign in to your FrameWala account.</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="relative"><FiMail className="w-4 h-4 text-warmDark-400 absolute left-3 top-1/2 -translate-y-1/2" /><input className={input} type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required data-testid="login-email" /></div>
          <div className="relative"><FiLock className="w-4 h-4 text-warmDark-400 absolute left-3 top-1/2 -translate-y-1/2" /><input className={input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required data-testid="login-password" /></div>
          <button type="submit" className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-700 text-cream-50 rounded-full font-bold text-sm" data-testid="login-submit"><FiLogIn className="w-4 h-4" /> Login</button>
        </form>
        <p className="text-center text-xs text-warmDark-500">Don't have an account? <Link to="/register" className="text-brand-600 font-bold hover:underline">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
