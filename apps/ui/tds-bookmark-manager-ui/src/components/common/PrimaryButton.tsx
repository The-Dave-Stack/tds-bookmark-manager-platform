import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
}

const PrimaryButton = ({ children, loading, disabled, ...rest }: PrimaryButtonProps) => {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-invertedText bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      {...rest}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};

export default PrimaryButton;
