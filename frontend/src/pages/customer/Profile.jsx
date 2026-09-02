// Profile.jsx
// User Profile details and Shipping addresses management dashboard

import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { getAddresses, deleteAddress, changePassword } from '../../services/authService.js';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { FiUser, FiMapPin, FiLock, FiTrash2, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile Form States
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Change Password Form States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setPhone(user.phone || '');
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const res = await getAddresses();
      if (res.success) {
        setAddresses(res.data.addresses);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfileSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      toast.error('First name and last name are required.');
      return;
    }

    try {
      setUpdatingProfile(true);
      await updateProfile({ first_name: firstName, last_name: lastName, phone });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }

    try {
      setUpdatingPassword(true);
      const res = await changePassword({ old_password: oldPassword, new_password: newPassword });
      if (res.success) {
        toast.success('Password changed successfully.');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    try {
      const res = await deleteAddress(addressId);
      if (res.success) {
        toast.success('Address removed successfully.');
        setAddresses(res.data.addresses);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove address. Ensure it is not linked to active orders.');
    }
  };

  if (loading && addresses.length === 0) return <Loader />;

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Your Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage names, passwords, and saved shipping addresses.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side Column: Profile & Password settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Edit Profile Form Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl space-y-4">
            <h2 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center space-x-2">
              <FiUser className="w-5 h-5 text-indigo-500" />
              <span>Personal Details</span>
            </h2>

            <form onSubmit={handleUpdateProfileSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Email (Locked)</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full px-3.5 py-2 border rounded-lg text-xs bg-slate-50 text-slate-400 cursor-not-allowed outline-none"
                    disabled
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <Button type="submit" loading={updatingProfile} className="text-xs font-bold py-2.5">
                Save Profile Changes
              </Button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl space-y-4">
            <h2 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center space-x-2">
              <FiLock className="w-5 h-5 text-indigo-500" />
              <span>Change Password</span>
            </h2>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Current Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <Button type="submit" loading={updatingPassword} className="text-xs font-bold py-2.5">
                Update Password
              </Button>
            </form>
          </div>

        </div>

        {/* Right Side Column: Saved Addresses registry */}
        <div className="lg:col-span-1 bg-white border border-slate-100 p-6 rounded-3xl h-fit space-y-4">
          <h2 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center space-x-2">
            <FiMapPin className="w-5 h-5 text-indigo-500" />
            <span>Address Book</span>
          </h2>

          {addresses.length === 0 ? (
            <p className="text-slate-400 text-xs py-4 text-center">No shipping addresses registered.</p>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <div 
                  key={addr.address_id}
                  className="p-4 bg-slate-50 border border-slate-100 rounded-2xl relative space-y-1 group"
                >
                  <span className="font-extrabold text-slate-800 text-sm block">{addr.full_name}</span>
                  <span className="text-slate-500 text-xs block">{addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}</span>
                  <span className="text-slate-400 text-[10px] block">Phone: {addr.phone}</span>
                  
                  {/* Delete address action */}
                  <button
                    onClick={() => handleDeleteAddress(addr.address_id)}
                    className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors focus:outline-none"
                    title="Delete address"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Profile;
