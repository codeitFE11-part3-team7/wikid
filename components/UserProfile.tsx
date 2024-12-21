import Image from 'next/image';
import React, { useState } from 'react';

import InputField from './Input';

// 프로필 데이터 타입 정의
interface ProfileData {
  updatedAt: string;
  securityQuestion: string;
  teamId: string;
  content: string;
  nationality: string;
  family: string;
  bloodType: string;
  nickname: string;
  birthday: string;
  sns: string;
  job: string;
  mbti: string;
  city: string;
  image: string;
  code: string;
  name: string;
  id: number;
}

// 프로필 컴포넌트 props 타입 정의
interface UserProfileProps {
  data: ProfileData; // 프로필 데이터
  isEditing?: boolean; // 수정 모드 여부
  onDataChange?: (field: keyof ProfileData, value: string) => void; // 데이터 변경 핸들러
}

const UserProfile = ({
  data,
  isEditing = false,
  onDataChange,
}: UserProfileProps) => {
  // 모바일/태블릿에서 추가 정보 표시 여부 상태 (조회 모드에서만 사용)
  const [isExpanded, setIsExpanded] = useState(false);

  // 입력 필드 변경 핸들러
  const handleInputChange =
    (field: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onDataChange?.(field, e.target.value);
    };

  // 추가 정보 펼침/접기 토글 (조회 모드에서만 사용)
  const toggleExpand = () => setIsExpanded(!isExpanded);

  // 필드 렌더링 함수 - 조회/수정 모드에 따라 다르게 렌더링
  const renderField = (label: string, field: keyof ProfileData) => {
    const value = data[field];

    if (isEditing) {
      return (
        <InputField
          value={String(value)}
          onChange={handleInputChange(field)}
          label={label}
          layout="horizontal"
        />
      );
    }

    return (
      <p className="flex text-14 text-gray-700">
        <span className="flex-[1] text-14md">{label}</span>
        <span className="flex-[3]">{value}</span>
      </p>
    );
  };

  return (
    <div className="mx-auto max-w-4xl rounded-custom bg-white p-6 shadow-custom dark:bg-gray-600 dark:shadow-custom-dark mo:w-11/12 ta:w-11/12 pc:w-[400px]">
      {/* 프로필 전체 컨테이너 - 레이아웃은 모드와 화면 크기에 따라 변경 */}
      <div
        className={`flex gap-8 ${isEditing ? 'flex-col' : 'flex-row'} pc:flex-col`}
      >
        {/* 프로필 이미지 섹션 */}
        <div className={`flex items-center justify-center pc:w-full`}>
          <div className="relative">
            <Image
              src={data.image}
              alt="Profile"
              width={200}
              height={200}
              className={`rounded-full object-cover ${isEditing ? 'mo:size-32 ta:size-32 pc:size-48' : 'mo:size-24 ta:size-32 pc:size-48'}`}
            />
            {/* 수정 모드일 때 이미지 변경 UI */}
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <Image
                  src="/icon/icon-camera.svg"
                  alt="Edit photo"
                  width={24}
                  height={24}
                  className="text-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* 프로필 정보 섹션 */}
        <div className="flex-1 justify-center space-y-4">
          {/* 기본 정보 (항상 표시) */}
          <div
            className={`${isEditing ? 'mo:space-y-4 ta:grid ta:grid-cols-2 ta:gap-4' : ''} pc:space-y-4`}
          >
            {renderField('거주 도시', 'city')}
            {renderField('MBTI', 'mbti')}
            {renderField('직업', 'job')}
            {isEditing && renderField('SNS 계정', 'sns')}
          </div>

          {/* 추가 정보 섹션 - 수정 모드일 때는 항상 모든 필드 표시 */}
          {isEditing ? (
            // 수정 모드 - 모든 필드 표시
            <div
              className={`mo:space-y-4 ta:grid ta:grid-cols-2 ta:gap-4 pc:space-y-4`}
            >
              {renderField('생일', 'birthday')}
              {renderField('별명', 'nickname')}
              {renderField('혈액형', 'bloodType')}
              {renderField('국적', 'nationality')}
            </div>
          ) : (
            // 조회 모드 - 화면 크기에 따라 다르게 표시
            <>
              {/* 모바일/태블릿 추가 정보 섹션 */}
              <div className="pc:hidden">
                {!isExpanded ? (
                  <button
                    onClick={toggleExpand}
                    className="flex items-center gap-2 text-14md text-green-200 hover:text-green-300"
                  >
                    <Image
                      src="/icon/icon-expand.svg"
                      alt="Expand"
                      width={16}
                      height={16}
                    />
                  </button>
                ) : (
                  <div className="space-y-4">
                    {renderField('SNS 계정', 'sns')}
                    {renderField('생일', 'birthday')}
                    {renderField('별명', 'nickname')}
                    {renderField('혈액형', 'bloodType')}
                    {renderField('국적', 'nationality')}
                    <button
                      onClick={toggleExpand}
                      className="flex items-center gap-2 text-14md text-green-200 hover:text-green-300"
                    >
                      <Image
                        src="/icon/icon-collapse.svg"
                        alt="Collapse"
                        width={16}
                        height={16}
                      />
                    </button>
                  </div>
                )}
              </div>

              {/* PC 추가 정보 섹션 (항상 표시) */}
              <div className="hidden space-y-4 pc:block">
                {renderField('SNS 계정', 'sns')}
                {renderField('생일', 'birthday')}
                {renderField('별명', 'nickname')}
                {renderField('혈액형', 'bloodType')}
                {renderField('국적', 'nationality')}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
