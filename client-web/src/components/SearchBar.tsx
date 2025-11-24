import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { HiOutlineSearch, HiX } from 'react-icons/hi';
// đúng cách import từ Heroicons

interface SearchBarProps {
  value: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  bgcolor?: string;
  radius?: string;
  autoFocus?: boolean;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  onSearch,
  placeholder = 'Tìm kiếm...',
  leftIcon,
  rightIcon,
  bgcolor = 'bg-gray-200',
  radius = 'rounded-full',
  autoFocus = false,
  className = '',
}) => {
  const [focused, setFocused] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) onSearch(value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div
      className={`flex items-center ${bgcolor} ${radius} px-3 py-2 transition-shadow duration-200 ${
        focused ? 'shadow-md ring-2 ring-indigo-400' : ''
      } ${className}`}
    >
      {/* Left Icon */}
      <div className='mr-2 text-gray-500 flex items-center'>
        {leftIcon || <HiOutlineSearch className='h-5 w-5' />}
      </div>

      {/* Input */}
      <input
        type='text'
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className='flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500 px-1 py-1'
      />

      {/* Right Icon / Clear */}
      {value ? (
        <button
          onClick={() => onClear?.()}
          className='ml-2 text-gray-500 hover:text-gray-700'
        >
          <HiX className='h-5 w-5' />
        </button>
      ) : (
        rightIcon && <div className='ml-2 text-gray-500'>{rightIcon}</div>
      )}
    </div>
  );
};

export default SearchBar;
