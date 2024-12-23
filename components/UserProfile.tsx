import Image from 'next/image';
import React, { useState } from 'react';

import InputField from './Input';

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

interface UserProfileProps {
  data: ProfileData;
  isEditing?: boolean;
  onDataChange?: (field: keyof ProfileData, value: string) => void;
}

function UserProfile({
  data,
  isEditing = false,
  onDataChange,
}: UserProfileProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange =
    (field: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onDataChange?.(field, e.target.value);
    };

  const toggleExpand = () => setIsExpanded(!isExpanded);

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
      <p
        className={`mb-[16px] flex h-[18px] ${isEditing ? 'w-full' : 'w-[250px]'} gap-[10px] text-14 mo:text-12`}
      >
        <span className="flex-[1] text-gray-400">{label}</span>
        <span className="flex-[2] text-gray-500">{value}</span>
      </p>
    );
  };

  return (
    <div
      className={`max-w-4xl rounded-custom bg-white py-2 shadow-custom dark:bg-gray-600 dark:shadow-custom-dark ${isEditing ? `pc:h-[828px]` : `pc:h-[671px]`} pc:w-[320px] pc:px-[30px] tamo:w-full tamo:p-[20px]`}
    >
      {/* PC 버전은 세로 레이아웃, 모바일/태블릿은 가로 레이아웃 */}
      <div
        className={`flex ${isEditing ? 'flex-col' : 'flex-col mo:flex-row ta:flex-row pc:flex-col tamo:gap-[40px]'} pc:items-center`}
      >
        {/* 프로필 이미지 섹션 */}
        <div
          className={`flex items-center justify-center pc:my-[60px] ${isEditing ? '' : 'mo:self-start ta:self-start'}`}
        >
          <div className="relative flex size-fit">
            <Image
              src={data?.image || '/icon/icon-profile.svg'}
              alt="Profile"
              width={100}
              height={100}
              className={`rounded-full object-cover ${
                isEditing
                  ? 'mo:size-[62px] ta:size-[71px] pc:size-48'
                  : 'mo:size-[62px] ta:size-[71px] pc:size-48'
              }`}
            />
            {isEditing && (
              <div className="absolute left-0 top-0 flex size-full items-center justify-center rounded-full bg-black/50">
                <Image
                  src="/icon/icon-camera.svg"
                  alt="Edit photo"
                  width={24}
                  height={24}
                  className={`text-white mo:size-6 ta:size-6 pc:size-12`}
                />
              </div>
            )}
          </div>
        </div>

        {/* 프로필 정보 섹션 */}
        <div
          className={`${isEditing ? 'mt-4 mo:justify-center' : 'mo:flex-1 ta:flex-1 pc:mt-4'} pc:w-full`}
        >
          <div
            className={`space-y-3 ${isEditing ? 'tamo:max-w-full' : 'tamo:max-w-[200px]'}`}
          >
            {/* 기본 정보 */}
            <div
              className={`${
                isEditing
                  ? 'mo:space-y-3 ta:grid ta:grid-cols-2 ta:place-items-center ta:gap-3 ta:space-y-0 pc:space-y-3'
                  : ''
              } space-y-3`}
            >
              {renderField('거주 도시', 'city')}
              {renderField('MBTI', 'mbti')}
              {renderField('직업', 'job')}
              {isEditing && renderField('SNS 계정', 'sns')}
            </div>

            {/* 추가 정보 섹션 */}
            {isEditing ? (
              <div
                className={`mo:space-y-3 ta:grid ta:grid-cols-2 ta:place-items-center ta:gap-3 pc:space-y-3`}
              >
                {renderField('생일', 'birthday')}
                {renderField('별명', 'nickname')}
                {renderField('혈액형', 'bloodType')}
                {renderField('국적', 'nationality')}
              </div>
            ) : (
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
                    <div className="space-y-3">
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

                {/* PC 추가 정보 섹션 */}
                <div className="hidden space-y-3 pc:block">
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
    </div>
  );
}

export default UserProfile;
