import { Swiper, SwiperSlide } from 'swiper/react';

import BoardCard from './BoardCard';

import 'swiper/css';

interface BoardCardData {
  id: number;
  title: string;
  image: string;
  writer: {
    name: string;
  };
  likeCount: number;
  updatedAt: string;
}

interface BoardCardListSwiperProps {
  data: BoardCardData[];
}

export default function BoardCardListSwiper({
  data,
}: BoardCardListSwiperProps) {
  return (
    <Swiper slidesPerView="auto" spaceBetween={16} className="-my-5 !p-5">
      {data.map((item) => (
        <SwiperSlide key={item.id} className="!w-[250px]">
          <BoardCard
            id={item.id}
            image={item.image}
            updatedAt={item.updatedAt}
            title={item.title}
            name={item.writer.name}
            likeCount={item.likeCount}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
