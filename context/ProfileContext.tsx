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

  //accessToken이 있는지 확인 (로그인 여부)
  const updateAuthStatus = () => {
    const accessToken = localStorage.getItem('accessToken');
    setIsAuthenticated(!!accessToken);
  };

  //사용자 프로필 가져오기
  const getProfile = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const res = await instance.get('/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const profileData = res.data.profile ?? null;

      if (!profileData) {
        setProfile(null);
        return;
      }

      const code = profileData.code ?? null;

      if (!code) {
        setProfile(profileData);
        return;
      }

      const profileRes = await instance.get(`/profiles/${code}`);

      setProfile(profileRes.data);
    } catch {
      setProfile(null);
    }
  };

  //초기 인증 상태 확인
  useEffect(() => {
    updateAuthStatus();
  }, []);

  //다른 탭에서 localStorage가 변경될때 인증 상태 업데이트
  useEffect(() => {
    window.addEventListener('storage', updateAuthStatus);

    return () => {
      window.removeEventListener('storage', updateAuthStatus);
    };
  }, []);

  //accessToken이 변경되거나 삭제될때 인증 상태 업데이트
  useEffect(() => {
    const handleLocalStorageChange = () => {
      const accessToken = localStorage.getItem('accessToken');
      setIsAuthenticated(!!accessToken);

      if (accessToken) {
        getProfile();
      } else {
        setProfile(null);
      }
    };

    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;

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
