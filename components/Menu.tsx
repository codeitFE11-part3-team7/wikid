interface MenuProps {
  options: string[];
  menuSize?: string;
  onSelect: (option: string) => void;
}

/**
 * 메뉴팝업을 띄우는 컴포넌트
 * @param options 메뉴팝업에 들어가는 옵션을 담을 배열
 * @param menuSize 팝업의 크기
 * @param onSelect 선택한 옵션을 반환
 */

export default function Menu({ options, onSelect, menuSize }: MenuProps) {
  return (
    <ul
      className={`${menuSize} absolute z-10 mt-2 rounded-xl border border-gray-300 bg-background p-1 text-14 shadow-custom mo:right-0 pc:right-1/2 pc:translate-x-1/2 tamo:right-0`}
    >
      {options.map((option, index) => (
        <button
          key={index}
          tabIndex={0}
          onClick={() => onSelect(option)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelect(option);
          }}
          className={`flex w-full cursor-pointer flex-col rounded-md px-3 py-2.5 hover:bg-green-100`}
        >
          {option}
        </button>
      ))}
    </ul>
  );
}
