// Register.jsx
// User Registration SignUp page

import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import Button from '../../components/common/Button.jsx';
import { FiUser, FiMail, FiPhone, FiLock, FiUserPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [valErrors, setValErrors] = useState({});

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValErrors({});

    if (!firstName || !lastName || !email || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password
      });
      if (!res.success && res.validationErrors) {
        setValErrors(res.validationErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white border border-slate-100 p-8 rounded-3xl space-y-6 shadow-md">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Create Account</h1>
          <p className="text-slate-400 text-xs">Join FrameWala to start ordering custom gifts.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">First Name *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <FiUser className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Varad"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              {valErrors.first_name && (
                <p className="text-red-500 text-[10px] font-bold mt-1">{valErrors.first_name}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Last Name *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <FiUser className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Chavan"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              {valErrors.last_name && (
                <p className="text-red-500 text-[10px] font-bold mt-1">{valErrors.last_name}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Email Address *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <FiMail className="w-4 h-4" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="varad@example.com"
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            {valErrors.email && (
              <p className="text-red-500 text-[10px] font-bold mt-1">{valErrors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Phone Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <FiPhone className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            {valErrors.phone && (
              <p className="text-red-500 text-[10px] font-bold mt-1">{valErrors.phone}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Password *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <FiLock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full pl-10 pr-4 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            {valErrors.password && (
              <p className="text-red-500 text-[10px] font-bold mt-1">{valErrors.password}</p>
            )}
          </div>

          <Button type="submit" loading={loading} className="w-full py-3 text-xs font-bold">
            <FiUserPlus className="mr-1.5 w-4 h-4" />
            <span>Create Account</span>
          </Button>
        </form>

        {/* Footer info links */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-50">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            Login Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
