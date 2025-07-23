import React from 'react';

interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
