import Image from 'next/image';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean; // 모달 오픈 여부
  onClose: () => void; // 모달 닫기 함수
  children: React.ReactNode; // 모달 내용
  width?: string; // 모달 너비
  closeOnBackgroundClick?: boolean; // 배경 클릭시 모달 닫기 여부
  closeOnEsc?: boolean; // esc 키로 모달 닫기 여부
}

/**
 * 모달 공통 레이아웃 컴포넌트
 * @param isOpen 모달 오픈 여부
 * @param onClose 모달 닫기 함수
 * @param children 모달 내용
 * @param width 모달 너비
 * @param closeOnBackgroundClick 배경 클릭시 닫기 여부 (기본값: false)
 * @param closeOnEsc ESC 키로 닫기 여부 (기본값: true)
 * @returns Modal 컴포넌트
 */

const Modal = ({
  isOpen,
  onClose,
  children,
  width = 'w-3/4 mo:w-11/12 pc:w-[395px]',
  closeOnBackgroundClick = false,
  closeOnEsc = true,
}: ModalProps) => {
  // 모달이 닫혀있으면 null 반환
  if (!isOpen) return null;

  // 배경 클릭시 모달 닫기
  const handleBackGroundClick = (e: React.MouseEvent) => {
    if (closeOnBackgroundClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  // esc 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        onClose();
      }
    };

    if (closeOnEsc) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [closeOnEsc]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackGroundClick}
    >
      <div
        className={`${width} relative max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl`}
      >
        {/* 닫기 버튼 영역 */}
        <div
          className="absolute right-0 top-0 m-2 cursor-pointer"
          onClick={onClose}
        >
          <Image
            src="/icon/icon-close.svg"
            alt="닫기 아이콘"
            width={22}
            height={22}
          />
        </div>
        {/* 컨텐츠 영역 */}
        <div className="px-5 pb-6 pt-16">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
