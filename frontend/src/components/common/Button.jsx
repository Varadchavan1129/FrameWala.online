// Button.jsx
// Warm/premium button with green primary + brown dark variants.

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
    'inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 focus:outline-none active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100';

  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-700 text-cream-50 shadow-warm-md',
    dark: 'bg-warmDark-900 hover:bg-warmDark-800 text-cream-50 shadow-warm-md',
    secondary: 'bg-white hover:bg-cream-100 text-warmDark-900 border border-warmDark-200',
    accent: 'bg-terracotta-600 hover:bg-terracotta-700 text-white shadow-warm-md',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  const sizes = {
    small: 'px-4 py-2 text-xs',
    medium: 'px-6 py-3 text-sm',
    large: 'px-8 py-4 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          Please wait...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
