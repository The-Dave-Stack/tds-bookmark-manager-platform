import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  if (!message) return null;
  return (
    <div className="mb-4 text-sm text-danger bg-danger/10 p-3 rounded-md">
      {message}
    </div>
  );
};

export default ErrorMessage;
