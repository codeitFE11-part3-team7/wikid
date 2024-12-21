interface PaginationButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Pagination button component
 * @param children - 버튼 컨텐츠(아이콘, 텍스트 등)
 * @param onClick - 버튼 클릭 핸들러
 * @param className - 커스텀 클래스
 * @param disabled - 버튼 비활성화 여부
 */
export default function PaginationButton({
  children,
  onClick,
  className,
  disabled,
}: PaginationButtonProps) {
  return (
    <button
      className={`${className} flex size-[45px] items-center justify-center rounded-custom bg-background text-18 text-gray-400 shadow-custom dark:shadow-custom-dark mo:size-[40px]`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
