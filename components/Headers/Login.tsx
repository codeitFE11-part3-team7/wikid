import useOutsideClick from 'hooks/useOutsideClick';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

import Menu from '../Menu';

interface LoginProps {
  login: () => void;
  logout: () => void;
  isMobile: boolean;
  isLoggedIn: boolean;
}

/**
 * 로그인 컴포넌트
 * @param login 로그인처리를 위한 함수
 * @param logout 로그아웃처리를 위한 함수
 * @param isMobile 화면 크기에 따라 모바일 여부 판별
 * @param isLoggedIn 로그인 여부 판별
 */

export default function Login({
  login,
  logout,
  isMobile,
  isLoggedIn,
}: LoginProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState<string[]>([]);

  //TODO 프로필 이미지 처리(추후 업데이트)
  const profileImage = null;
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

  const handleLoginMenu = (option: string) => {
    if (option === '위키목록') {
      router.push('/wikilist');
    } else if (option === '자유게시판') {
      router.push('/boards');
    } else if (option === '마이페이지') {
      router.push('/mypage');
    }
    //TODO 로그인 처리 (추후 업데이트)
    else if (option === '로그인') {
      login();
    } else if (option === '로그아웃') {
      logout();
    }
  };

  useOutsideClick(loginMenuRef, () => setIsOpen(false));

  return isLoggedIn ? (
    <div ref={loginMenuRef} className="flex">
      <button className="relative" onClick={() => setIsOpen(!isOpen)}>
        <Image
          src={profileImage || '/icon/icon-profile.svg'}
          className="mo:hidden"
          alt="프로필 아이콘"
          width={32}
          height={32}
        />
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
      </button>
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
    <button onClick={login}>로그인</button>
  );
}
