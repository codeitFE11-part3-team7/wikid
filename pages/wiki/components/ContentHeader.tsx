import { useState } from 'react';

import InputField from '@/components/Input';
import LinkBar from '@/components/LinkBar';
import SnackBar from '@/components/SnackBar';

interface ContentHeaderProps {
  name: string;
  link: string;
  onNameChange: (value: string) => void;
  isEditing: boolean;
}

/**
 * Content 컴포넌트의 헤더에 해당하는 컴포넌트
 * @param name 위키문서의 이름
 * @param link 위키문서의 링크
 * @param onNameChange 이름이 변경될 때 호출되는 콜백 함수
 * @param isEditing 편집 모드인지 여부
 */

export default function ContentHeader({
  name,
  link,
  onNameChange,
  isEditing,
}: ContentHeaderProps) {
  const [snackState, setSnackState] = useState<'success' | 'null'>('null');

  const handleLinkClick = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setSnackState('success');
        setTimeout(() => setSnackState('null'), 1500);
      })
      .catch(() => {
        alert('링크 복사에 실패했습니다.');
      });
  };
  return (
    <div>
      <div className="mb-[32px] flex items-center justify-between text-48sb text-gray-500 mo:mb-[24px] mo:text-32sb">
        {/*TODO 인풋 스타일은 일단 임시로 잡아놨습니다*/}
        {isEditing ? (
          <InputField
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        ) : (
          <span>{name}</span>
        )}
      </div>
      {!isEditing && <LinkBar link={link} onClick={handleLinkClick} />}

      {snackState !== 'null' && <SnackBar state={snackState} />}
    </div>
  );
}
