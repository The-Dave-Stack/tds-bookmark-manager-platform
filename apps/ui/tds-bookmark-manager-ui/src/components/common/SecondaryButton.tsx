import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SecondaryButton = ({ children, ...rest }: SecondaryButtonProps) => {
  return (
    <button
      type="button"
      className="px-4 py-2 text-sm font-medium text-mainText bg-lightBg hover:bg-lightBorder rounded-md transition-colors duration-200"
      {...rest}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
