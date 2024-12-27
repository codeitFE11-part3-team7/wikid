import useOutsideClick from 'hooks/useOutsideClick';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Profile } from 'types/profile';

import Menu from '../Menu';
import useSnackBar from '@/hooks/useSanckBar';
import SnackBar from '../SnackBar';

interface LoginProps {
  isMobile: boolean;
  isLoggedIn: boolean;
  profile: Profile | null;
}

/**
 * 로그인 컴포넌트
 * @param login 로그인처리를 위한 함수
 * @param logout 로그아웃처리를 위한 함수
 * @param isMobile 화면 크기에 따라 모바일 여부 판별
 * @param isLoggedIn 로그인 여부 판별
 */

export default function Login({ isMobile, isLoggedIn, profile }: LoginProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState<string[]>([]);
  const { snackBarValues, snackBarOpen } = useSnackBar();

  const profileImage = profile?.image ?? '/icon/icon-profile.svg';
  const router = useRouter();
  const loginMenuRef = useRef<HTMLDivElement>(null);

  const updateProfileMenu = useCallback(() => {
    if (!isLoggedIn) {
      if (isMobile) return ['로그인', '위키목록', '자유게시판'];
    } else if (isMobile) {
      return ['위키목록', '자유게시판', '알림', '마이페이지', '로그아웃'];
    } else {
      return ['마이페이지', '로그아웃'];
    }
    return [];
  }, [isLoggedIn, isMobile]); // 의존성 배열에 필요한 값만 포함

  useEffect(() => {
    setProfileMenu(updateProfileMenu());
  }, [updateProfileMenu]); // updateProfileMenu가 변경될 때만 실행

  const handleLoginMenu = async (option: string) => {
    if (option === '위키목록') {
      await router.push('/wikilist');
    } else if (option === '자유게시판') {
      await router.push('/boards');
    } else if (option === '마이페이지') {
      await router.push('/mypage');
    } else if (option === '로그인') {
      await router.push('/login');
    } else if (option === '로그아웃') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      snackBarOpen('fail', '로그아웃 되었습니다.');
      await router.push('/');
    }
  };

  useOutsideClick(loginMenuRef, () => setIsOpen(false));

  return (
    <>
      <SnackBar
        severity={snackBarValues.severity}
        open={snackBarValues.open}
        onClose={snackBarValues.onClose}
        autoHideDuration={snackBarValues.autoHideDuration}
      >
        {snackBarValues.children}
      </SnackBar>
      {isLoggedIn ? (
        <div ref={loginMenuRef} className="flex">
          <div
            role="button"
            tabIndex={0}
            className="relative cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsOpen(!isOpen);
              }
            }}
          >
            <div className="flex size-[32px] overflow-hidden rounded-full mo:hidden">
              <Image
                src={profileImage}
                className="object-cover mo:hidden"
                alt="프로필 아이콘"
                width={32}
                height={32}
              />
            </div>
            <Image
              src="/icon/icon-menu.svg"
              className="hidden mo:block"
              alt="메뉴 아이콘"
              width={32}
              height={32}
            />

            {isOpen && (
              <Menu
                options={profileMenu}
                onSelect={handleLoginMenu}
                menuSize="w-28"
              />
            )}
          </div>
        </div>
      ) : isMobile ? (
        <div ref={loginMenuRef} className="flex">
          <button className="relative" onClick={() => setIsOpen(!isOpen)}>
            <Image
              src="/icon/icon-menu.svg"
              alt="메뉴 아이콘"
              width={24}
              height={24}
            />
            {isOpen && (
              <Menu
                options={profileMenu}
                onSelect={handleLoginMenu}
                menuSize="w-28"
              />
            )}
          </button>
        </div>
      ) : (
        <button
          onClick={() => router.push('/login')}
          className="text-14 text-gray-400"
        >
          로그인
        </button>
      )}
    </>
  );
}
