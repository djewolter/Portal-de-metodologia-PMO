import React, { useState, useRef, useEffect } from 'react';
import { ChevronRightIcon } from './Icons';

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onOptionClick: (option: string) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ label, options, selectedOptions, onOptionClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectionText = selectedOptions.length > 0 ? `${label} (${selectedOptions.length})` : `Todos os ${label}`;

  return (
    <div className="relative w-full" ref={dropdownRef}>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate text-gray-700">{selectionText}</span>
        <ChevronRightIcon className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto scrollbar-thin">
          <ul role="listbox">
            {options.map(option => (
              <li
                key={option}
                className="px-3 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                onClick={() => onOptionClick(option)}
                role="option"
                aria-selected={selectedOptions.includes(option)}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    readOnly
                    tabIndex={-1}
                    className="h-4 w-4 rounded border-gray-300 text-[#3095A6] focus:ring-[#3095A6]"
                  />
                  <span>{option}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
