import { useState } from 'react';

import Button from '@/components/Button';
import WikiQuizModal from '@/components/Modal/WikiQuizModal';

interface BlankProps {
  onQuizSuccess: () => void;
  question: string;
  code: string;
}

/**
 * 내 위키가 비어있을 때 띄우는 컴포넌트
 * @param onQuizSuccess 퀴즈 성공 후 호출되는 함수
 * @param question 퀴즈에 사용되는 질문
 * @param answer 퀴즈에 대한 답변
 */

export default function Blank({ onQuizSuccess, question, code }: BlankProps) {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const onQuizClose = () => setIsQuizOpen(false);

  return (
    <div className="mt-[56px] flex h-[192px] w-full flex-col items-center justify-center gap-[20px] rounded-custom bg-gray-100 text-gray-400 mo:h-[184px] mo:gap-[16px]">
      <div className="text-center text-16 mo:text-14">
        <p>아직 작성된 내용이 없네요.</p>
        <p>위키에 참여해 보세요!</p>
      </div>
      <Button onClick={() => setIsQuizOpen(true)}>시작하기</Button>

      <WikiQuizModal
        isOpen={isQuizOpen}
        onClose={onQuizClose}
        securityQuestion={question}
        userCode={code}
        onQuizComplete={() => {
          onQuizSuccess();
          onQuizClose();
        }}
      />
    </div>
  );
}
