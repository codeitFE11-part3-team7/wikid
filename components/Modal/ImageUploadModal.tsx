import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import Button from '../Button';
import Modal from './Modal';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 이미지 업로드 모달 컴포넌트
 * @param isOpen 모달 오픈 여부
 * @param onClose 모달 닫기 함수
 * @returns ImageUploadModal 컴포넌트
 */

const ImageUploadModal = ({ isOpen, onClose }: ImageUploadModalProps) => {
  // input 요소를 참조하기 위한 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 선택한 이미지의 미리보기 url
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false); // 드래그 중인지 여부

  const [isUpload, setIsUpload] = useState(false);

  // 카메라 아이콘 클릭시 input 요소 클릭이 되도록
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택시
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일을 url로 변환하여 미리보기 생성
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  // 드래그 관련 이벤트
  // 드래그 시작
  const handleDragEnter = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation(); // 이벤트 전파 중지
    setIsDragging(true);
  };
  // 드래그가 영역을 벗어날 때
  const handleDragLeave = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  // 드래그 중
  const handleDragOver = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  // 드래그로 파일을 드랍했을 때
  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    }
  };

  const handleImageUpload = async () => {
    try {
      setIsUpload(true);
      // 이미지 업로드 api 통신 로직
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsUpload(false);
      alert('이미지 업로드 성공');
      onClose();
    } catch (error) {
      console.error('이미지 업로드 error:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUpload(false);
    }
  };

  useEffect(() => {
    return () => {
      // 이전 미리보기 url 정리
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    };
  }, [previewUrl, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-lg font-bold">이미지</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          aria-label="파일 선택"
        />

        {previewUrl ? (
          <div className="relative h-40 w-full overflow-hidden rounded-lg">
            <Image
              src={previewUrl}
              alt="선택된 이미지"
              layout="fill" // 부모 요소 크기에 맞게
              objectFit="contain" // 비율 유지
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={handleCameraClick}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${
              isDragging
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 bg-gray-100 hover:border-gray-400'
            }`}
            aria-label="이미지 업로드"
          >
            <Image
              src="/icon/icon-camera.svg"
              alt="카메라 아이콘"
              width={40}
              height={40}
            />
            <p className="text-sm text-gray-500">
              클릭 또는 이미지를 드래그하여 올려주세요
            </p>
          </button>
        )}
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={!previewUrl}
            isLoading={isUpload}
            onClick={handleImageUpload}
            className="w-40"
          >
            삽입하기
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ImageUploadModal;
