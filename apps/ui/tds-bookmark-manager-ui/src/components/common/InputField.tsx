import React, { useState } from 'react';

import { Eye, EyeOff } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'url';
}

const InputField = ({ label, id, error, type = 'text', ...rest }: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-mainText">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          type={isPassword && !showPassword ? 'password' : type}
          className={`block w-full px-3 py-2 rounded-md shadow-sm ${
            isPassword ? 'pr-10' : ''
          } ${
            error ? 'border-danger focus:border-danger focus:ring-danger' : 'border-lightBorder focus:border-primary focus:ring-primary'
          }`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center"
          >
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
};

export default InputField;
