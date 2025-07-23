import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface LinkTextProps extends LinkProps {
  children: React.ReactNode;
}

const LinkText = ({ children, ...rest }: LinkTextProps) => {
  return (
    <Link className="font-medium text-link hover:text-linkHover transition-colors duration-200" {...rest}>
      {children}
    </Link>
  );
};

export default LinkText;
