import React, { useState, useRef, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: 'left' | 'right';
}

const DropdownMenu = ({ trigger, children, position = 'right' }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when language changes
  useEffect(() => {
    setIsOpen(false);
  }, [i18n.language]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const menuPositionClass = position === 'right' ? 'right-0' : 'left-0';

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={toggleMenu}>{trigger}</div>

      {isOpen && (
        <div
          className={`absolute mt-1 w-48 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5 ${menuPositionClass}`}
          onClick={() => setIsOpen(false)} // Close menu when an item is clicked
        >
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
