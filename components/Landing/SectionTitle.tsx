import React from 'react';

interface SectionTitleProps {
  caption: string;
  title: string | React.ReactNode;
  align?: 'left' | 'right' | 'center';
  variant?: 'default' | 'hero';
}

const SectionTitle = ({
  caption,
  title,
  align = 'left',
  variant = 'default',
}: SectionTitleProps) => {
  const alignClass = {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
  }[align];

  if (variant === 'hero') {
    return (
      <h1 className={`mb-[40px] flex flex-col gap-[15px] ${alignClass}`}>
        <div className="text-[60px] font-thin leading-none text-gray-500 mo:text-[40px]">
          {caption}
        </div>
        <div className="text-[90px] font-bold leading-none text-gray-500 mo:text-[60px]">
          {title}
        </div>
      </h1>
    );
  }

  return (
    <div className={`w-full ${alignClass} mo:pr-[20px] ta:pr-[48px]`}>
      <div className="text-[30px] font-bold text-green-200 mo:text-[20px] ta:text-[30px]">
        {caption}
      </div>
      <h2 className="mt-[10px] text-[50px] font-normal leading-snug mo:text-[26px] ta:text-[42px]">
        {title}
      </h2>
    </div>
  );
};

export default SectionTitle;
