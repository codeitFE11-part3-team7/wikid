import { useState } from 'react';

import DisconnectionModal from '@/components/Modal/DisconnectionModal';
import ImageUploadModal from '@/components/Modal/ImageUploadModal';
import UnsavedChangesModal from '@/components/Modal/UnsavedChangesModal';
import WikiQuizModal from '@/components/Modal/WikiQuizModal';

const QUESTION = '특별히 싫어하는 음식은?';
const ANSWER = '카레';

function ModalTest() {
  const [isDMOpen, setIsDMOpen] = useState(false);
  const [isUCOpen, setIsUCOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const onUCClose = () => setIsUCOpen(false);
  const onDMClose = () => setIsDMOpen(false);
  const onQuizClose = () => setIsQuizOpen(false);
  const onImageClose = () => setIsImageOpen(false);

  const handleQuizSuccess = () => {
    alert('퀴즈를 성공하셨습니다.');
    setIsQuizOpen(false);
  };

  return (
    <div className="flex size-full flex-col items-center justify-center pt-48">
      <button
        onClick={() => setIsDMOpen(true)}
        className="rounded-custom bg-green-200 px-6 py-2 text-background"
      >
        접속 끊김 확인
      </button>
      <button
        onClick={() => setIsUCOpen(true)}
        className="rounded-custom bg-red-100 px-6 py-2 text-background"
      >
        저장하지 않고 나가기
      </button>
      <button
        onClick={() => setIsQuizOpen(true)}
        className="rounded-custom bg-blue-200 px-6 py-2 text-background"
      >
        퀴즈 시작
      </button>
      <button
        onClick={() => setIsImageOpen(true)}
        className="rounded-custom bg-yellow-200 px-6 py-2 text-background"
      >
        이미지 업로드
      </button>
      <DisconnectionModal isOpen={isDMOpen} onClose={onDMClose} />
      <UnsavedChangesModal isOpen={isUCOpen} onClose={onUCClose} />
      <ImageUploadModal isOpen={isImageOpen} onClose={onImageClose} />
      <WikiQuizModal
        isOpen={isQuizOpen}
        onClose={onQuizClose}
        securityQuestion={QUESTION}
        securityAnswer={ANSWER}
        onQuizComplete={handleQuizSuccess}
      />
    </div>
  );
}

export default ModalTest;
