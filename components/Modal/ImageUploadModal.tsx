import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

import Button from '../Button';
import Modal from './Modal';
import SnackBar from '../SnackBar';
import useSnackBar from '@/hooks/useSnackBar';

interface ImageUploadModalProps {
  imageFile?: File | null;
  isOpen: boolean;
  onClose: () => void;
  onGetImageFile: (file: File | null) => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB 를 바이트로
const NOT_SVG_MESSAGE =
  'JPG, PNG, GIF, WebP 형식의 이미지만 업로드 가능합니다.';
const SIZE_LIMIT_MESSAGE = '파일 크기는 5MB를 초과할 수 없습니다.';

const ImageUploadModal = ({
  imageFile: initialImageFile = null,
  isOpen,
  onClose,
  onGetImageFile,
}: ImageUploadModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(initialImageFile);
  const [isDragging, setIsDragging] = useState(false);
  const [isValidFile, setIsValidFile] = useState<boolean>(true);
  const { snackBarValues, snackBarOpen } = useSnackBar();

  const validateFile = (file: File): boolean => {
    setIsValidFile(true);

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      snackBarOpen('fail', NOT_SVG_MESSAGE);
      setIsValidFile(false);
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      snackBarOpen('fail', SIZE_LIMIT_MESSAGE);
      setIsValidFile(false);
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateFile(file)) {
        const previewUrl = URL.createObjectURL(file);
        setPreviewUrl(previewUrl);
        setImageFile(file);
      } else if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageDelete = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      setPreviewUrl(null);
      setImageFile(null);
      setIsValidFile(true);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const file = e.dataTransfer.items[0]?.getAsFile();
      if (file) {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
        ];
        setIsValidFile(allowedTypes.includes(file.type));
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setIsValidFile(true); // 드래그가 끝나면 상태 초기화
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file && validateFile(file)) {
        setPreviewUrl(URL.createObjectURL(file));
        setImageFile(file);
      }
    }
  };
  const handleImageSelect = () => {
    onGetImageFile(imageFile);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setIsValidFile(true);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl !== null) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (initialImageFile) {
      const previewUrl = URL.createObjectURL(initialImageFile);
      setPreviewUrl(previewUrl);
    }
  }, [initialImageFile]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-5 bg-background">
        <p className="text-center text-18sb">이미지</p>
        <input
          id="image"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
        />
        {previewUrl === null ? (
          <label
            htmlFor="image"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${
              isDragging
                ? isValidFile
                  ? 'border-green-300 bg-green-100'
                  : 'border-red-100 bg-red-50'
                : 'border-gray-300 bg-gray-100 hover:border-gray-400'
            }`}
          >
            <Image
              src="/icon/icon-camera.svg"
              alt="이미지 업로드"
              width={36}
              height={36}
            />
            <p className="mt-2 text-14 text-gray-400">
              클릭 또는 이미지를 드래그하여 올려주세요.
            </p>
            <p className="mt-1 text-12 text-gray-400">(최대 5MB)</p>
          </label>
        ) : (
          <div className="relative flex h-40 w-full items-center justify-center rounded-lg border-2 border-dashed">
            <Image
              src={previewUrl}
              alt="선택된 이미지"
              fill={true}
              className="object-contain"
              sizes="350px"
            />
            <button
              type="button"
              onClick={handleImageDelete}
              className="absolute right-2 top-2 rounded-full bg-gray-100 p-1 transition-colors hover:bg-gray-200"
            >
              <Image
                src="/icon/icon-delete.svg"
                alt="삭제"
                width={20}
                height={20}
              />
            </button>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="button" onClick={handleImageSelect}>
            선택하기
          </Button>
        </div>
      </div>

      <SnackBar
        severity={snackBarValues.severity}
        onClose={snackBarValues.onClose}
        open={snackBarValues.open}
      >
        {snackBarValues.children}
      </SnackBar>
    </Modal>
  );
};

export default ImageUploadModal;
