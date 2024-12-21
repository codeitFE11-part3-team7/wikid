import Image from 'next/image';

interface Props {
  classNames?: string;
  text: string;
}

export default function EmptyList({
  classNames,
  text = '일치하는 검색 결과가 없어요.',
}: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-8 ${classNames}`}
    >
      <p className="text-20sb text-gray-400 mo:text-18md">{text}</p>
      <Image src="/images/empty.png" alt="" width="144" height="144" />
    </div>
  );
}
