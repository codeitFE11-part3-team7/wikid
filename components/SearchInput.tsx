import Image from 'next/image';
import React, { useState } from 'react';

interface SearchInputProps {
  size: 'large' | 'medium' | 'full';
  value?: string;
  onSubmit?: (value: string) => void;
  onChange: (value: string) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

function SearchInput({
  size = 'large',
  onChange,
  value = '',
  onSubmit = () => {},
  placeholder = '검색어를 입력해 주세요',
  onKeyPress,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  // 크기별 스타일
  const sizeStyles = {
    large: {
      container: 'w-[860px] h-[45px] ',
      padding: 'p-[20px] pl-[15px]',
    },
    medium: {
      container: 'w-[800px] h-[40px] ',
      padding: 'p-[20px] pl-[15px]',
    },
    full: {
      container: 'w-full h-[40px] ',
      padding: 'p-[20px] pl-[15px]',
    },
  };

  const currentSize = sizeStyles[size];

  const inputStyles = [
    currentSize.container,
    currentSize.padding,
    'rounded-lg',
    'border-none',
    'bg-gray-100',
    'text-gray-500',
    'text-16',
    'placeholder:text-gray-400',
    isFocused
      ? 'outline outline-2 outline-green-100'
      : 'focus:outline-green-100',
  ].join(' ');

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value); // 부모 컴포넌트에 값 전달
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(value); // 부모 컴포넌트에서 관리하는 value 전달
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center rounded-lg bg-gray-100 px-[20px]"
    >
      <label htmlFor="searchInput">
        <Image src="/icon/icon-search.svg" alt="검색" width={22} height={22} />
      </label>
      <input
        id="searchInput"
        className={inputStyles}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={handleInputChange}
        onKeyPress={onKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </form>
  );
}

export default SearchInput;
