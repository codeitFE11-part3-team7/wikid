import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import Button from '../Button';
import Modal from './Modal';

interface WikiQuizModalProps {
  isOpen: boolean; // 모달 오픈 여부
  onClose: () => void; // 모달 닫기 함수
  securityQuestion: string; // from user.profile.code
  securityAnswer: string;
  onQuizComplete: () => void; // 퀴즈 완료 함수
}

interface WarningTextProps {
  warning: boolean;
}

const WarningText = ({ warning }: WarningTextProps) => {
  if (!warning) return null;
  return (
    <p id="warning-message" className="text-xs text-red-500">
      정답이 아닙니다. 다시 입력해 주세요.
    </p>
  );
};

/**
 * 위키 퀴즈 모달 컴포넌트
 * @param isOpen 모달 오픈 여부
 * @param onClose 모달 닫기 함수
 * @param securityQuestion 질문
 * @param securityAnswer 답변
 * @param onQuizComplete 퀴즈 완료 함수
 * @returns WikiQuizModal 컴포넌트
 */
const WikiQuizModal = ({
  isOpen,
  onClose,
  securityQuestion,
  securityAnswer,
  onQuizComplete,
}: WikiQuizModalProps) => {
  // 통합된 상태 관리
  const [state, setState] = useState({
    isCorrect: false,
    warning: false,
    isSubmitting: false,
    userAnswer: '',
  });

  // 모바일 대응
  const [isMobile, setIsMobile] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // 상태 초기화 함수
  const resetModal = () => {
    setState({
      isCorrect: false,
      warning: false,
      isSubmitting: false,
      userAnswer: '',
    });
  };

  // 모바일 여부 감지
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 모바일 키보드 표시 감지
  useEffect(() => {
    if (!isMobile) return;

    const handleResize = () => {
      // 모바일 브라우저에서 키보드가 올라오면 viewport 높이가 줄어듦을 이용
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

    // 초기 실행
    handleResize();

    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // 모달 초기화
  useEffect(() => {
    if (isOpen) {
      resetModal();
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // 정답 타이핑 관리 함수
  const handleUserAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      userAnswer: e.target.value,
      warning: false, // 타이핑시 경고문 제거
    }));
  };

  // 답변 검증 로직
  const validateAnswer = (userAnswer: string, correctAnswer: string) => {
    return userAnswer.trim() === correctAnswer.trim();
  };

  const handleQuizSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 새로고침 방지
    try {
      if (!state.userAnswer) return;

      setState((prev) => ({ ...prev, isSubmitting: true })); // 제출 시 로딩 ui 표시

      // api 통신 로직
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 실제 통신 대신 시뮬레이션션
      // 정답이면
      // {
      //   "registeredAt": "2024-12-16T07:56:44.829Z",
      //   "userId": 1799
      // }
      // 오답이면
      // {
      //   "message": "보안 답변이 일치하지 않습니다."
      // }

      const isValid = validateAnswer(state.userAnswer, securityAnswer);
      if (isValid) {
        setState((prev) => ({ ...prev, isCorrect: true }));
        onQuizComplete();
      } else {
        setState((prev) => ({
          ...prev,
          warning: true,
          userAnswer: '', // 오답시 입력값 초기화
        }));
        inputRef.current?.focus(); // 오답시 input에 포커스
      }
    } catch (error) {
      console.error('Quiz 제출 error:', error);
      alert('퀴즈 제출 중 오류가 발생했습니다.');
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false })); // 제출 완료 시 로딩 종료
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnBackgroundClick={false} // 배경 클릭으로 닫히지 않도록 설정
    >
      <form
        ref={formRef}
        onSubmit={handleQuizSubmit}
        className="mx-auto flex max-w-md flex-col items-center px-4 ta:px-6"
      >
        <div className={`w-full ${keyboardVisible ? 'pt-1' : 'pt-4'}`}>
          {!keyboardVisible && (
            <div className="flex flex-col items-center">
              <Image
                src="/icon/icon-lock.svg"
                alt="자물쇠 아이콘"
                width={isMobile ? 16 : 20}
                height={isMobile ? 16 : 20}
                priority
              />
              <p className="mt-2 text-sm">다음 퀴즈를 맞추고</p>
              <p className="text-sm">위키를 작성해 보세요.</p>
            </div>
          )}

          <div
            className={`w-full text-left text-lg font-bold ${
              keyboardVisible ? 'mt-1' : 'mt-4'
            }`}
          >
            {securityQuestion}
          </div>

          <input
            type="text"
            placeholder="답변을 입력해 주세요."
            ref={inputRef}
            value={state.userAnswer}
            onChange={handleUserAnswer}
            aria-invalid={state.warning}
            aria-describedby={state.warning ? 'warning-message' : undefined}
            className={`mt-4 min-h-[44px] w-full rounded-lg p-2 text-base focus:outline-none focus:ring-2 ${
              state.warning
                ? 'bg-red-300 focus:ring-red-200'
                : 'bg-gray-100 focus:ring-green-200'
            }`}
          />
          <WarningText warning={state.warning} />
          <Button
            type="submit"
            disabled={!state.userAnswer.trim() || state.isCorrect}
            isLoading={state.isSubmitting}
            className="mt-4 min-h-[44px] w-full"
          >
            확인
          </Button>
        </div>
      </form>

      {!keyboardVisible && (
        <div className="mt-2 px-4 text-center">
          <p className="text-xs">
            위키드는 지인들과 함께하는 즐거운 공간입니다.
          </p>
          <p className="text-xs">지인에게 상처를 주지 않도록 작성해 주세요.</p>
        </div>
      )}
    </Modal>
  );
};

export default WikiQuizModal;
