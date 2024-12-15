interface LinkBarProps {
  link: string;
  onClick?: () => void;
}

/**
 * 링크 주소를 표시하는 컴포넌트
 * @param link 링크 주소
 * @param onClick 링크 클릭 시 실행할 함수
 */
export default function LinkBar({ link, onClick }: LinkBarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-[5px] rounded-custom bg-green-100 px-[10px] py-[3px] mo:py-1"
    >
      <img
        src="icon/icon-link.svg"
        alt="링크 아이콘"
        className="h-5 w-5 mo:h-4 mo:w-4"
      />
      <p className="text-14 text-green-200 mo:text-12">{link}</p>
    </button>
  );
}