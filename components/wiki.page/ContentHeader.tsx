import { useEffect, useState } from 'react';

import Button from '@/components/Button';
import LinkBar from '@/components/LinkBar';
import UnsavedChangesModal from '@/components/Modal/UnsavedChangesModal';
import SnackBar from '@/components/SnackBar';
import useSnackBar from '@/hooks/useSnackBar';

interface ContentHeaderProps {
  name: string;
  link: string;
  isEditing: boolean;
  isInfoSnackBarOpen: boolean;
  isEmpty: boolean;
  diffTime?: number;
  handleQuizOpen: () => void;
  closeAndNoSave: () => void;
  saveContent: () => void;
}

/**
 * Content 컴포넌트의 헤더에 해당하는 컴포넌트
 * @param name 위키문서의 이름
 * @param link 위키문서의 링크
 * @param isEditing 편집모드인지 여부
 * @param isInfoSnackBarOpen 정보 스낵바의 열림 여부
 * @param isEmpty 위키문서가 비어있는지 여부
 * @param handleQuizOpen 퀴즈 모달을 열기 위한 함수
 * @param closeAndNoSave 편집모드에서 저장하지 않고 닫기 위한 함수
 * @param saveContent 편집모드에서 저장하기 위한 함수
 */

export default function ContentHeader({
  name,
  link,
  isEditing,
  isInfoSnackBarOpen,
  handleQuizOpen,
  isEmpty,
  diffTime,
  closeAndNoSave,
  saveContent,
}: ContentHeaderProps) {
  const [isUCOpen, setIsUCOpen] = useState(false);
  const { snackBarValues, snackBarOpen } = useSnackBar();
  const { snackBarValues: snackBarValues2, snackBarOpen: snackBarOpen2 } =
    useSnackBar();

  useEffect(() => {
    const infoSnackBarMessage = diffTime
      ? `${Math.floor(5 - diffTime / 60 / 1000)}분 후 위키 참여가 가능합니다.`
      : '';

    snackBarOpen2('info', infoSnackBarMessage, () => {}, 300000);
  }, [diffTime, snackBarOpen2]);

  const onUCClose = () => {
    setIsUCOpen(false);
  };

  const handleCloseAndNoSave = () => {
    setIsUCOpen(false);
    closeAndNoSave();
  };

  const handleLinkClick = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        snackBarOpen('success', '링크가 복사되었습니다.');
      })
      .catch(() => {
        alert('링크 복사에 실패했습니다.');
      });
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="mb-[32px] flex items-center justify-between text-48sb text-gray-500 mo:mb-[24px] mo:text-32sb">
          {name}
        </div>
        <div>
          {!isEditing ? (
            !isEmpty && <Button onClick={handleQuizOpen}>위키 수정하기</Button>
          ) : (
            <div className="flex gap-[5px] justify-self-end">
              <Button variant="secondary" onClick={() => setIsUCOpen(true)}>
                취소
              </Button>
              <UnsavedChangesModal
                isOpen={isUCOpen}
                closeAndNoSave={handleCloseAndNoSave}
                onClose={onUCClose}
              />
              <Button onClick={saveContent}>저장</Button>
            </div>
          )}
        </div>
      </div>
      {!isEditing && (
        <LinkBar link={link.slice(0, 43)} onClick={handleLinkClick} />
      )}
      {isInfoSnackBarOpen && (
        <SnackBar
          severity={snackBarValues2.severity}
          open={snackBarValues2.open}
          onClose={snackBarValues2.onClose}
          autoHideDuration={snackBarValues2.autoHideDuration}
        >
          {snackBarValues2.children}
        </SnackBar>
      )}

      <SnackBar
        severity={snackBarValues.severity}
        open={snackBarValues.open}
        onClose={snackBarValues.onClose}
        autoHideDuration={snackBarValues.autoHideDuration}
      >
        {snackBarValues.children}
      </SnackBar>
    </div>
  );
}
