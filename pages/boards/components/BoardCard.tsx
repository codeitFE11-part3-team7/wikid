import Image from 'next/image';
import Link from 'next/link';

import Heart from '@/components/Heart/Heart';
import dateConversion from '@/utils/dateConversion';

interface BoardCardProps {
  id: number;
  image: string;
  title: string;
  name: string;
  updatedAt: string;
  likeCount: number;
}

/**
 * 게시글 카드 컴포넌트
 * @param {number} id - 게시글 id
 * @param {string} image - 게시글 이미지
 * @param {string} title - 게시글 제목
 * @param {string} name - 유저 이름
 * @param {string} updatedAt - 게시글 수정일
 * @param {number} likeCount - 게시글 좋아요 수
 */
export default function BoardCard({
  id,
  image,
  title,
  name,
  updatedAt,
  likeCount,
}: BoardCardProps) {
  return (
    <Link
      href={`/boards/${id}`}
      className="block h-auto w-[250px] overflow-hidden rounded-custom shadow-custom dark:shadow-custom-dark ta:w-full"
    >
      <div className="relative h-[130px] w-auto overflow-hidden bg-gray-100 ta:h-[17.475vw]">
        <Image
          src={image === '' ? '/icon/icon-no-image.svg' : image}
          alt={`${title} 썸네일`}
          style={{ objectFit: 'cover' }}
          fill
        />
      </div>
      <div className="bg-background px-[20px] pb-[14px] pt-[20px] mo:pt-[11px]">
        <h3 className="mb-[6px] truncate text-18sb mo:mb-0 mo:text-16sb">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-14 text-gray-300 mo:text-12">
          <p>{name}</p>
          <span className="flex-1">{dateConversion(updatedAt)}</span>
          <Heart initialCount={likeCount} />
        </div>
      </div>
    </Link>
  );
}
