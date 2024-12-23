import { useValidation } from 'hooks/useValidation';
import React, { useState } from 'react';

import CustomDayPicker from './DayPicker';

interface InputFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'password' | 'name' | 'passwordConfirm';
  placeholder?: string;
  label?: string;
  compareValue?: string;
  layout?: 'vertical' | 'horizontal';
  width?: string;
  onValidation?: (isValid: boolean) => void;
  ref?: React.Ref<HTMLInputElement>;
}

function InputField({
  value,
  onChange,
  type = 'text',
  placeholder,
  label,
  compareValue,
  layout = 'vertical',
  width,
  onValidation,
  ref,
  ...props
}: InputFieldProps) {
  const { errorMessage, validate } = useValidation({
    type,
    compareValue,
  });

  const [showDayPicker, setShowDayPicker] = useState(false);

  const handleFocus = () => {
    if (
      typeof layout === 'string' &&
      layout === 'horizontal' &&
      typeof label === 'string' &&
      label === '생일'
    ) {
      setShowDayPicker(true);
    }
  };

  const closeDayPicker = () => {
    setShowDayPicker(false);
  };

  const handleBlur = () => {
    if (typeof layout === 'string' && layout === 'vertical') {
      const error = validate(value);
      const isValid = !error && typeof value === 'string' && value.length > 0;
      onValidation?.(isValid);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    if (
      typeof layout === 'string' &&
      layout === 'vertical' &&
      typeof errorMessage === 'string' &&
      errorMessage.length > 0
    ) {
      const error = validate(e.target.value);
      const isValid =
        !error &&
        typeof e.target.value === 'string' &&
        e.target.value.length > 0;
      onValidation?.(isValid);
    }
  };

  const getInputType = () => {
    if (type === 'name') {
      return 'text';
    } else if (type === 'passwordConfirm') {
      return 'password';
    }
    return type;
  };

  //스타일에 따른 클래스
  const variantClass = {
    containerVertical: 'flex flex-col gap-[10px]',
    containerHorizontal: 'flex items-center gap-[10px]',
    labelVertical: 'text-14 text-gray-500',
    labelHorizontal: 'text-14 text-gray-400 w-[60px] flex-shrink-0',
    base: 'px-[20px] py-[10px] h-[45px] w-full rounded-md text-[14px] text-gray-500 placeholder:text-14 focus:outline-none',
    error: 'border border-red-100 bg-red-50',
    normal:
      'bg-gray-100 focus:border-green-200 focus:ring-1 focus:ring-green-200',
    errorText: 'text-12 text-red-100',
  };

  const labelClass =
    typeof layout === 'string' && layout === 'horizontal'
      ? variantClass.labelHorizontal
      : variantClass.labelVertical;

  const inputClass = `${variantClass.base} ${
    typeof layout === 'string' &&
    layout === 'vertical' &&
    typeof errorMessage === 'string' &&
    errorMessage.length > 0
      ? variantClass.error
      : variantClass.normal
  }`;

  return (
    <div
      className={
        typeof layout === 'string' && layout === 'horizontal'
          ? `${variantClass.containerHorizontal} relative`
          : `${variantClass.containerVertical} relative`
      }
      style={
        typeof width === 'string' && width.length > 0 ? { width } : undefined
      }
    >
      {typeof label === 'string' && label.length > 0 && (
        <label className={labelClass}>{label}</label>
      )}
      <input
        type={getInputType()}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={inputClass}
        ref={ref}
        {...props}
      />
      {typeof layout === 'string' &&
        layout === 'vertical' &&
        typeof errorMessage === 'string' &&
        errorMessage.length > 0 && (
          <span className={variantClass.errorText}>{errorMessage}</span>
        )}
      {typeof showDayPicker === 'boolean' && showDayPicker && (
        <div className="absolute left-0 top-full z-50 mt-2 rounded bg-white p-4 shadow-md">
          <div>
            <CustomDayPicker />
          </div>
          <button onClick={closeDayPicker} className="mt-2 text-gray-500">
            닫기
          </button>
        </div>
      )}
    </div>
  );
}

export default InputField;
