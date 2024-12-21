import { useState } from 'react';

import UserProfile from '@/components/UserProfile';

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

const INITIAL_PROFILE_DATA = {
  updatedAt: '2024-12-19T06:47:31.687Z',
  securityQuestion: 'string',
  teamId: 'string',
  content: 'string',
  nationality: '대한민국',
  family: 'string',
  bloodType: 'A',
  nickname: '없음',
  birthday: '1999-12-31',
  sns: 'dlwlehd_official',
  job: '코드잇 콘텐츠 프로듀서',
  mbti: 'INFJ',
  city: '서울',
  image: '/images/image-profile.png',
  code: 'string',
  name: 'string',
  id: 1,
};

function ProfileTest() {
  // 프로필 데이터 상태 관리
  const [profileData, setProfileData] =
    useState<ProfileData>(INITIAL_PROFILE_DATA);
  // 수정 모드 상태 관리
  const [isEditing, setIsEditing] = useState(false);

  // 데이터 변경 핸들러
  const handleDataChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 저장 핸들러
  const handleSave = () => {
    console.log('저장된 데이터:', profileData);
    setIsEditing(false);
  };

  return (
    <div className="flex size-full flex-col items-start justify-center gap-4 pt-32">
      <UserProfile
        data={profileData}
        isEditing={isEditing}
        onDataChange={handleDataChange}
      />
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex justify-end gap-4">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="rounded-custom bg-gray-100 px-6 py-2 text-14md text-gray-500 hover:bg-gray-200"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="rounded-custom bg-green-200 px-6 py-2 text-14md text-white hover:bg-green-300"
              >
                저장
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-custom bg-green-200 px-6 py-2 text-14md text-white hover:bg-green-300"
            >
              수정
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileTest;
