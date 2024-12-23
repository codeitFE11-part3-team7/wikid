import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import instance from '@/lib/axios-client';

export interface Profile {
  image: string;
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
  code: string;
  name: string;
  id: number;
}

interface UserProfileResponse {
  profile: Profile;
}

interface ProfileContextType {
  isAuthenticated: boolean;
  profile: Profile | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  //사용자 프로필 가져오기
  const getProfile = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const res = await instance.get<UserProfileResponse>('/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const profileData = res.data.profile ?? null;

      if (profileData == null) {
        setProfile(null);
        return;
      }

      const code = profileData.code ?? null;

      if (!code) {
        setProfile(profileData);
        return;
      }

      const profileRes = await instance.get<Profile>(`/profiles/${code}`);

      setProfile(profileRes.data);
    } catch {
      setProfile(null);
    }
  };

  //인증 상태 업데이트
  useEffect(() => {
    const handleLocalStorageChange = () => {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken !== null) {
        setIsAuthenticated(true);
        getProfile().catch(() => {
          console.error('프로필을 불러오던 중 에러가 발생했습니다.');
          setProfile(null);
        });
      } else {
        setIsAuthenticated(false);
        setProfile(null);
      }
    };

    const originalSetItem = localStorage.setItem.bind(localStorage);
    const originalRemoveItem = localStorage.removeItem.bind(localStorage);

    localStorage.setItem = (key: string, value: string) => {
      originalSetItem.call(localStorage, key, value);
      if (key === 'accessToken') {
        handleLocalStorageChange();
      }
    };

    localStorage.removeItem = (key: string) => {
      originalRemoveItem.call(localStorage, key);
      if (key === 'accessToken') {
        handleLocalStorageChange();
      }
    };

    handleLocalStorageChange();

    return () => {
      localStorage.setItem = originalSetItem;
      localStorage.removeItem = originalRemoveItem;
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ isAuthenticated, profile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('ProfileProvider로 감싸져야 합니다');
  }
  return context;
};
