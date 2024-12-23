import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import instance from '@/lib/axios-client';

import Contents from './components/Contents';

export interface Profile {
  updatedAt: string;
  securityAnswer: string;
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

const getProfileData = async (code: string): Promise<Profile | null> => {
  try {
    const res = await instance.get<Profile>(`/profiles/${code}`);
    return res.data;
  } catch (e) {
    console.error('프로필을 불러오지 못했습니다.', e);
    return null; // 오류 발생 시 null 반환
  }
};

export default function Wiki() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    const fetchProfile = async () => {
      if (typeof code === 'string') {
        try {
          const profileData = await getProfileData(code); // code를 문자열로 변환
          if (profileData) {
            setProfile(profileData); // 프로필 상태 업데이트
          } else {
            alert('프로필을 불러오지 못했습니다.');
          }
        } catch (error) {
          console.error('프로필을 불러오는 중에 오류가 발생했습니다.', error);
          alert('프로필을 불러오는 중에 오류가 발생했습니다.');
        }
      }
    };

    fetchProfile().catch((error) => {
      // Promise 거부 처리
      console.error('useEffect에서 오류가 발생했습니다.', error);
    });
  }, [code]);

  return (
    <>
      <div className="mt-[160px] flex w-full justify-center pc:mx-[100px] tamo:px-[20px]">
        {profile ? <Contents profile={profile} /> : <p>불러오는 중입니다...</p>}
      </div>
    </>
  );
}
