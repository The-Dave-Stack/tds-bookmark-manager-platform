import React from 'react';

interface FormCardProps {
  children: React.ReactNode;
  title?: string;
}

const FormCard = ({ children, title }: FormCardProps) => {
  return (
    <div className="bg-invertedText py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
      {title && (
        <h3 className="text-lg font-medium text-mainText mb-6">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default FormCard;
