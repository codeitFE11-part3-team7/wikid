import { useState } from 'react';

type ValidationType =
  | 'text'
  | 'email'
  | 'password'
  | 'name'
  | 'passwordConfirm';

interface UseValidationProps {
  type: ValidationType;
  compareValue?: string;
}

export function useValidation({ type, compareValue }: UseValidationProps) {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const validateInput = (value: string) => {
    if (!value) return undefined;

    switch (type) {
      case 'email':
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          return '이메일 형식으로 작성해 주세요.';
        }
        break;
      case 'password':
        if (
          !/^([a-z]|[A-Z]|[0-9]|[!@#$%^&*])+$/.test(value) ||
          value.length < 8
        ) {
          return '8자 이상 입력해주세요.';
        }
        break;
      case 'name':
        if (value.length < 1 || value.length > 10) {
          return '1자 이상 10자 이하로 작성해주세요.';
        }
        break;
      case 'passwordConfirm':
        if (compareValue !== undefined && value !== compareValue) {
          return '비밀번호가 일치하지 않습니다.';
        }
        break;
    }
    return undefined;
  };

  const validate = (value: string) => {
    const error = validateInput(value);
    setErrorMessage(error);
    return error;
  };

  return {
    errorMessage,
    validate,
    setErrorMessage,
  };
}
