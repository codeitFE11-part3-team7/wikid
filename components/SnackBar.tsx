import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SnackBarProps {
  severity: 'fail' | 'success' | 'info';
  children: string;
  open: boolean;
  onClose: () => void;
  autoHideDuration?: number | undefined;
}

// state props styles object
const severityConfig = {
  fail: {
    style:
      'bg-red-50 border-red-100 fixed left-1/2 transform -translate-x-1/2 top-[120px] mx-auto mo:bottom-[80px] mo:top-auto whitespace-nowrap shadow-custom',
    icon: '/icon/icon-fail.svg',
    textStyle: 'text-red-100 text-14sb mo:text-12sb',
  },
  success: {
    style:
      'bg-green-100 border-green-200 fixed left-1/2 transform -translate-x-1/2 top-[120px] mx-auto mo:bottom-[80px] mo:top-auto whitespace-nowrap shadow-custom',
    icon: '/icon/icon-success.svg',
    textStyle: 'text-green-300 text-14sb mo:text-12sb',
  },
  info: {
    style: 'bg-background border-white',
    icon: '/icon/icon-info.svg',
    textStyle: 'text-gray-500 text-14 mo:text-12',
  },
};

/**
 * SnackBar 컴포넌트
 * @param severity - 상태에 따른 스타일을 적용하기 위한 props
 * @param children - Snackbar에 표시할 메시지
 * @param open - Snackbar가 열려있는지 여부
 * @param onClose - Snackbar를 닫기 위한 함수
 * @param autoHideDuration - 자동으로 닫히는 시간 (밀리초) 기본값은 3000
 */
export default function SnackBar({
  severity,
  children,
  open,
  onClose,
  autoHideDuration = 3000,
}: SnackBarProps) {
  const { style, icon, textStyle } = severityConfig[severity];
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setVisible(true);
      if (autoHideDuration !== undefined) {
        const timer = setTimeout(() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }, autoHideDuration);
        return () => clearTimeout(timer);
      }
    } else {
      setVisible(false);
    }
  }, [open, autoHideDuration, onClose]);

  return (
    <div
      className={`rounded-custom ${style} flex items-center gap-[15px] border px-5 py-[11px] transition-opacity duration-300 mo:px-[15px] mo:py-[11px] ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ display: open || visible ? 'flex' : 'none' }}
    >
      {icon && <Image src={icon} alt="snackbar icon" width={20} height={20} />}
      <p className={`${textStyle} break-words mo:break-words`}>{children}</p>
    </div>
  );
}
