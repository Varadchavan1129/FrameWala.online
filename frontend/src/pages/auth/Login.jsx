// Login.jsx
// Sign In page for customers and admin accounts

import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import Button from '../../components/common/Button.jsx';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [valErrors, setValErrors] = useState({});

  // If token is already present, redirect user immediately
  useEffect(() => {
    if (token && user) {
      const from = location.state?.from?.pathname || (user.role === 'admin' ? '/admin' : '/');
      navigate(from, { replace: true });
    }
  }, [token, user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValErrors({});

    if (!email || !password) {
      toast.error('Please enter email and password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login({ email, password });
      if (!res.success && res.validationErrors) {
        setValErrors(res.validationErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-6 shadow-md">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400 text-xs">Sign in to manage your frames order checklist.</p>
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
            {valErrors.email && (
              <p className="text-red-500 text-[10px] font-bold mt-1">{valErrors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Password</label>
              <Link to="/forgot-password" className="text-[10px] text-indigo-600 hover:underline font-bold">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <FiLock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            {valErrors.password && (
              <p className="text-red-500 text-[10px] font-bold mt-1">{valErrors.password}</p>
            )}
          </div>

          <Button type="submit" loading={loading} className="w-full py-3 text-xs font-bold">
            <FiLogIn className="mr-1.5 w-4 h-4" />
            <span>Login Account</span>
          </Button>
        </form>

        {/* Footer info links */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-50">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-bold hover:underline">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
