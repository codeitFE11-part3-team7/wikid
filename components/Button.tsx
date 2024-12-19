import Link from 'next/link';
import { ReactNode } from 'react';

// 로딩 이미지 svg
const IconLoad = () => (
  <svg
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className="size-6"
  >
    <circle cx="4" cy="12" r="2" opacity="1">
      <animate
        id="spinner_qYjJ"
        begin="0;spinner_t4KZ.end-0.25s"
        attributeName="opacity"
        dur="0.75s"
        values="1;.2"
        fill="freeze"
      />
    </circle>
    <circle cx="12" cy="12" r="2" opacity=".4">
      <animate
        begin="spinner_qYjJ.begin+0.15s"
        attributeName="opacity"
        dur="0.75s"
        values="1;.2"
        fill="freeze"
      />
    </circle>
    <circle cx="20" cy="12" r="2" opacity=".3">
      <animate
        id="spinner_t4KZ"
        begin="spinner_qYjJ.begin+0.3s"
        attributeName="opacity"
        dur="0.75s"
        values="1;.2"
        fill="freeze"
      />
    </circle>
  </svg>
);

interface Props {
  className?: string;
  size?: 'small' | 'normal' | 'large';
  variant?: 'primary' | 'secondary' | 'danger' | 'dark' | 'light';
  href?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children: ReactNode;
  [property: string]:
    | string
    | boolean
    | ReactNode
    | ((e: React.MouseEvent<HTMLElement>) => void);
}

/**
 * 공통 버튼 컴포넌트
 * @param {object} props
 * @param {string} props.className - 추가 클래스
 * @param {string} props.size - 사이즈 선택
 * @param {string} props.variant - 스타일 선택
 * @param {string} props.href - 링크 주소값
 * @param {boolean} props.disabled - disabled 속성값
 * @param {boolean} props.isLoading - loading 여부
 * @param {function} props.onClick - onClick에 전달할 함수
 * @param {ReactNode} props.children - button태그 사이 들어갈 필수 요소
 * @returns {JSX.Element} 링크값 없으면 button 있으면 Link 요소 반환
 */
export default function Button({
  className = '',
  size = 'normal',
  variant = 'primary',
  href = '',
  disabled = false,
  isLoading = false,
  onClick,
  children,
  ...props
}: Props) {
  // 사이즈에 따른 클래스
  const sizeClass = {
    small: 'rounded-custom px-5 py-2 text-14sb',
    normal: 'rounded-custom px-6 py-[10px] text-14sb',
    large: 'rounded-[15px] px-[30px] py-[14px] text-24b',
  };
  // 스타일에 따른 클래스
  const variantClass = {
    primary: 'bg-green-200 text-background hover:bg-green-300',
    secondary:
      'border border-green-200 text-green-200 bg-transparent hover:bg-green-200 hover:text-background disabled:text-background disabled:border-gray-300',
    danger: 'bg-red-100 text-background',
    dark: 'bg-gray-500 text-background hover:bg-gray-600',
    light: 'bg-background text-gray-500 hover:bg-gray-100',
  };
  // 링크 disabled 적용하기 위한 클래스
  const linkDisabledClass = disabled
    ? 'cursor-default bg-gray-300 pointer-events-none'
    : '';
  // 공통 클래스
  const classNames = `inline-flex items-center text-nowrap justify-center gap-[10px] transition-colors disabled:bg-gray-300 disabled:pointer-events-none ${sizeClass[size]} ${variantClass[variant]} ${className}`;

  return (
    <>
      {href ? (
        <Link
          href={href}
          className={`${classNames} ${linkDisabledClass}`}
          onClick={onClick}
          {...props}
        >
          {children}
          {isLoading && <IconLoad />}
        </Link>
      ) : (
        <button
          className={classNames}
          onClick={onClick}
          disabled={isLoading || disabled}
          {...props}
        >
          {children}
          {isLoading && <IconLoad />}
        </button>
      )}
    </>
  );
}
