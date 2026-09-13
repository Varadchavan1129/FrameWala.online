// Button.jsx — Admin portal button component

import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  ...rest
}) => {
  const base =
    'inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 focus:outline-none active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary:   'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm',
    secondary: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200',
    danger:    'bg-red-600 hover:bg-red-700 text-white',
    dark:      'bg-slate-900 hover:bg-slate-800 text-white',
  };

  const sizes = {
    small:  'px-4 py-2 text-xs',
    medium: 'px-6 py-3 text-sm',
    large:  'px-8 py-4 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.medium} ${className}`}
      {...rest}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          Please wait...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
