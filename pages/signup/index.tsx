import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import Button from '@/components/Button';
import InputField from '@/components/Input';
import { AuthAPI } from '@/services/api/auth';

function SignUp() {
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [validFields, setValidFields] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirm(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleValidation = (field: string, isValid: boolean) => {
    setValidFields((prev) => ({
      ...prev,
      [field]: isValid,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !isFormValid) return;

    setIsSubmitting(true);

    try {
      await AuthAPI.signup({
        email,
        password,
        passwordConfirmation: passwordConfirm,
        name,
      });

      // 회원가입 성공 시 로그인 페이지로 이동
      await router.push('/login');
    } catch (error) {
      // 에러 발생 시 처리
      if (error instanceof Error) {
        alert(error.message);
        setErrorMessage(error.message);
        console.log(errorMessage);
      } else {
        alert('회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = Object.values(validFields).every(Boolean);

  return (
    <div className="flex min-h-screen justify-center pt-[233px] mo:pt-[108px]">
      <form onSubmit={handleSubmit} className="w-[400px] mo:w-[355px]">
        <div className="flex flex-col items-center gap-[24px]">
          <h2 className="mb-[40px] text-center text-24sb text-gray-500 mo:mb-[8px] ta:mb-[24px]">
            회원가입
          </h2>
          <InputField
            label="이름"
            type="name"
            value={name}
            width="100%"
            onChange={handleNameChange}
            placeholder="이름을 입력해 주세요"
            onValidation={(isValid) => handleValidation('name', isValid)}
          />
          <InputField
            label="이메일"
            type="email"
            value={email}
            width="100%"
            onChange={handleEmailChange}
            placeholder="이메일을 입력해 주세요"
            onValidation={(isValid) => handleValidation('email', isValid)}
          />
          <InputField
            label="비밀번호"
            type="password"
            value={password}
            width="100%"
            onChange={handlePasswordChange}
            placeholder="비밀번호를 입력해 주세요"
            onValidation={(isValid) => handleValidation('password', isValid)}
          />
          <InputField
            label="비밀번호 확인"
            type="passwordConfirm"
            value={passwordConfirm}
            width="100%"
            onChange={handlePasswordConfirmChange}
            placeholder="비밀번호를 다시 입력해 주세요"
            compareValue={password}
            onValidation={(isValid) =>
              handleValidation('passwordConfirm', isValid)
            }
          />
          <Button
            type="submit"
            disabled={!isFormValid}
            isLoading={isSubmitting}
            variant="primary"
            className="mt-[6px] h-[45px] w-full"
          >
            가입하기
          </Button>
          <div className="mt-[16px] text-center">
            <span className="text-14 text-gray-400">이미 회원이신가요?</span>{' '}
            <Link
              href="/login"
              className="text-14 text-green-300 hover:underline"
            >
              로그인하기
            </Link>
          </div>{' '}
        </div>
      </form>
    </div>
  );
}

export default SignUp;
