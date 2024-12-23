import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';

import Button from '@/components/Button';
import InputField from '@/components/Input';
import { useValidation } from '@/hooks/useValidation';
import { AuthAPI } from '@/services/api/auth';
import { ProfileAPI } from '@/services/api/profileAPI';

function MyPage(): React.ReactElement {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const currentPasswordValidation = useValidation({ type: 'password' });
  const newPasswordValidation = useValidation({ type: 'password' });
  const newPasswordConfirmValidation = useValidation({
    type: 'passwordConfirm',
    compareValue: newPassword,
  });

  const handleCurrentPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setCurrentPassword(value);
    currentPasswordValidation.validate(value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    newPasswordValidation.validate(value);
    // 새 비밀번호가 변경되면 확인 비밀번호도 다시 검증
    if (newPasswordConfirm) {
      newPasswordConfirmValidation.validate(newPasswordConfirm);
    }
  };

  const handleNewPasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setNewPasswordConfirm(value);
    newPasswordConfirmValidation.validate(value);
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      await AuthAPI.changePassword({
        currentPassword,
        newPassword,
        newPasswordConfirm,
      });

      // 성공 시 로그인 페이지로 이동
      await router.push('/login');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 위키 생성 제출
  const handleWikiSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      // 프로필 생성 API 호출
      await ProfileAPI.createProfile({
        securityQuestion: question,
        securityAnswer: answer,
      });

      // 성공 시 위키 목록 페이지로 이동
      await router.push('/wiki/{code}');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 비밀번호 변경 폼 유효성 검사
  const isPasswordFormValid = Boolean(
    currentPassword !== null &&
      currentPassword !== undefined &&
      typeof currentPassword === 'string' &&
      currentPassword.length > 0 &&
      newPassword !== null &&
      newPassword !== undefined &&
      typeof newPassword === 'string' &&
      newPassword.length > 0 &&
      newPasswordConfirm !== null &&
      newPasswordConfirm !== undefined &&
      typeof newPasswordConfirm === 'string' &&
      newPasswordConfirm.length > 0 &&
      typeof currentPasswordValidation?.errorMessage === 'string' &&
      currentPasswordValidation.errorMessage.length === 0 &&
      typeof newPasswordValidation?.errorMessage === 'string' &&
      newPasswordValidation.errorMessage.length === 0 &&
      typeof newPasswordConfirmValidation?.errorMessage === 'string' &&
      newPasswordConfirmValidation.errorMessage.length === 0
  );

  const isWikiFormValid = Boolean(
    question !== null &&
      question !== undefined &&
      typeof question === 'string' &&
      question.length > 0 &&
      answer !== null &&
      answer !== undefined &&
      typeof answer === 'string' &&
      answer.length > 0
  );

  const inputSectionStyle = 'flex w-full flex-col items-center gap-[8px]';
  const inputContainerStyle = 'flex w-full flex-col gap-[8px]';

  return (
    <div className="flex min-h-screen justify-center pt-[221px] mo:pt-[108px]">
      <form onSubmit={handleSubmit} className="w-[400px] mo:w-[355px]">
        <div className="flex w-full flex-col items-center gap-[32px]">
          <h2 className="mb-[32px] text-center text-24sb text-gray-500">
            계정설정
          </h2>{' '}
          <div className={inputSectionStyle}>
            <div className={inputContainerStyle}>
              <InputField
                label="비밀번호 변경"
                type="password"
                value={currentPassword}
                width="100%"
                onChange={handleCurrentPasswordChange}
                placeholder="기존 비밀번호"
              />
              <InputField
                label=""
                type="password"
                value={newPassword}
                width="100%"
                onChange={handleNewPasswordChange}
                placeholder="새 비밀번호"
              />
              <InputField
                label=""
                type="password"
                value={newPasswordConfirm}
                width="100%"
                onChange={handleNewPasswordConfirmChange}
                placeholder="새 비밀번호 확인"
              />

              <Button
                type="submit"
                disabled={!isPasswordFormValid}
                isLoading={Boolean(isSubmitting)}
                variant="primary"
                size="small"
                className="mt-[8px] self-end"
              >
                변경하기
              </Button>
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>{' '}
          </div>
          <div className="w-full border-b border-gray-200"></div>
          <div className={inputSectionStyle}>
            <div className={inputContainerStyle}>
              <InputField
                label="위키 생성하기"
                type="text"
                value={question}
                width="100%"
                onChange={handleQuestionChange}
                placeholder="질문을 입력해 주세요"
              />
              <InputField
                label=""
                type="text"
                value={answer}
                width="100%"
                onChange={handleAnswerChange}
                placeholder="답을 입력해 주세요"
              />
              <Button
                type="submit"
                disabled={!isWikiFormValid}
                isLoading={Boolean(isSubmitting)}
                variant="primary"
                size="small"
                className="mt-[8px] self-end"
                onClick={(e) => handleWikiSubmit(e)}
              >
                생성하기
              </Button>{' '}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default MyPage;
