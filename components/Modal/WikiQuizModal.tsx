import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import InputField from '@/components/Input';
import useCheckMobile from '@/hooks/useCheckMobile';
import instance from '@/lib/axios-client';

import Button from '../Button';
import Modal from './Modal';

interface WikiQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  securityQuestion: string;
  userCode: string;
  onQuizComplete: () => void;
}

interface QuizState {
  isCorrect: boolean;
  isSubmitting: boolean;
  userAnswer: string;
}

function WikiQuizModal({
  isOpen,
  onClose,
  securityQuestion,
  userCode,
  onQuizComplete,
}: WikiQuizModalProps) {
  const [state, setState] = useState<QuizState>({
    isCorrect: false,
    isSubmitting: false,
    userAnswer: '',
  });

  const isMobile = useCheckMobile();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // 모바일 키보드 표시 감지
  useEffect(() => {
    if (!isMobile) return;

    const handleKeyboardVisibility = () => {
      const isKeyboardVisible = window.innerHeight < window.screen.height;
      setKeyboardVisible(isKeyboardVisible);

      if (isKeyboardVisible && inputRef.current) {
        inputRef.current.focus();
        setTimeout(() => {
          inputRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }, 100);
      }
    };

    handleKeyboardVisibility();
    window.addEventListener('resize', handleKeyboardVisibility);
    return () => window.removeEventListener('resize', handleKeyboardVisibility);
  }, [isMobile]);

  // 모달 초기화
  useEffect(() => {
    if (isOpen) {
      setState({
        isCorrect: false,
        isSubmitting: false,
        userAnswer: '',
      });
      setErrorMessage(undefined);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleUserAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setState((prev) => ({
      ...prev,
      userAnswer: value,
    }));
    setErrorMessage(undefined);
  };

  const submitQuizAnswer = async (answer: string) => {
    try {
      const response = await instance.post(`/profiles/${userCode}/ping`, {
        securityAnswer: answer,
      });

      return {
        registeredAt: response.data.registeredAt,
        userId: response.data.userId,
        success: true,
      };
    } catch (error) {
      console.error('퀴즈 제출 error:', error);
      return { success: false };
    }
  };

  const handleQuizSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { userAnswer } = state;
    if (!userAnswer) return;

    try {
      setState((prev) => ({ ...prev, isSubmitting: true }));

      const result = await submitQuizAnswer(userAnswer);

      if (result.success) {
        setState((prev) => ({ ...prev, isCorrect: true }));
        onQuizComplete();
      } else {
        setState((prev) => ({ ...prev, userAnswer: '' }));
        setErrorMessage('정답이 아닙니다. 다시 입력해 주세요.');
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error('Quiz 제출 error:', error);
      alert('퀴즈 제출 중 오류가 발생했습니다.');
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnBackgroundClick={false}>
      <form
        ref={formRef}
        onSubmit={handleQuizSubmit}
        className={`mb-5 flex flex-col gap-9 ${keyboardVisible && '!gap-5'}`}
      >
        <div
          className={`flex flex-col items-center gap-[10px] ${
            keyboardVisible && '!flex-row justify-center'
          }`}
        >
          <div
            className={`flex size-[42px] items-center justify-center rounded-full bg-white ${
              keyboardVisible && '!size-auto'
            }`}
          >
            <Image
              src="/icon/icon-lock.svg"
              alt="자물쇠 아이콘"
              width={20}
              height={20}
              priority
            />
          </div>
          <p className="text-center text-14 text-gray-400">
            다음 퀴즈를 맞추고
            <br className={`${keyboardVisible ? 'mo:hidden' : ''}`} />
            위키를 작성해 보세요.
          </p>
        </div>

        <div className="flex flex-col gap-[10px]">
          <p className="text-18b">{securityQuestion}</p>

          <InputField
            type="text"
            placeholder="답변을 입력해 주세요."
            ref={inputRef}
            value={state.userAnswer}
            onChange={handleUserAnswer}
            aria-invalid={!!errorMessage}
            aria-describedby={errorMessage ? 'error-message' : undefined}
          />

          {errorMessage && (
            <p id="error-message" className="text-12 text-red-100">
              {errorMessage}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!state.userAnswer.trim() || state.isCorrect}
          isLoading={state.isSubmitting}
          size="small"
          className="w-full"
        >
          확인
        </Button>
      </form>

      {!keyboardVisible && (
        <div className="mt-2 px-4 text-center text-12 text-gray-400">
          <p>위키드는 지인들과 함께하는 즐거운 공간입니다.</p>
          <p>지인에게 상처를 주지 않도록 작성해 주세요.</p>
        </div>
      )}
    </Modal>
  );
}

export default WikiQuizModal;
