import dynamic from 'next/dynamic';

import Button from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import Pagination from '@/components/Pagination/Pagination';
import SearchInput from '@/components/SearchInput';
import useCheckMobile from '@/hooks/useCheckMobile';

import BoardCardList from './components/BoardCardList';
import BoardList from './components/BoardList';

import 'swiper/css';

// TODO - API 연결 후 데이터 수정
const data = {
  totalCount: 1,
  list: [
    {
      updatedAt: '2024-12-17T08:25:07.098Z',
      createdAt: '2024-12-17T08:25:07.098Z',
      likeCount: 0,
      writer: {
        name: '이름',
        id: 1,
      },
      image: 'https://via.placeholder.com/1000',
      title: '게시글 제목입니다.',
      id: 1,
    },
    {
      updatedAt: '2024-12-17T08:25:07.098Z',
      createdAt: '2024-12-17T08:25:07.098Z',
      likeCount: 0,
      writer: {
        name: '이름',
        id: 2,
      },
      image: 'https://via.placeholder.com/1000',
      title: '게시글 제목입니다.',
      id: 2,
    },
    {
      updatedAt: '2024-12-17T08:25:07.098Z',
      createdAt: '2024-12-17T08:25:07.098Z',
      likeCount: 0,
      writer: {
        name: '이름',
        id: 3,
      },
      image: 'https://via.placeholder.com/1000',
      title: '게시글 제목입니다.',
      id: 3,
    },
    {
      updatedAt: '2024-12-17T08:25:07.098Z',
      createdAt: '2024-12-17T08:25:07.098Z',
      likeCount: 0,
      writer: {
        name: '이름',
        id: 4,
      },
      image: 'https://via.placeholder.com/1000',
      title: '게시글 제목입니다.',
      id: 4,
    },
  ],
};

const BoardCardList_Swiper = dynamic(
  () => import('./components/BoardCardList.swiper'),
  {
    ssr: false,
  }
);

/**
 * 게시판 페이지
 */
export default function Boards() {
  const isMobile = useCheckMobile();

  const options = ['최신순', '인기순'];

  // TODO - API 연결 후 수정
  const handleOption1 = () => {
    console.log('최신순');
  };

  const handleOption2 = () => {
    console.log('인기순');
  };

  const handleOptionSelect = (option: string) => {
    if (option === '최신순') {
      handleOption1();
    } else if (option === '인기순') {
      handleOption2();
    }
  };

  const pxTablet = 'ta:px-[60px]';

  return (
    <main className="pt-[80px] tamo:pt-[60px]">
      <div className="flex flex-col gap-[60px] py-[60px] mo:gap-10 mo:py-10">
        <header
          className={`container flex items-center justify-between ${pxTablet}`}
        >
          <h1 className="text-32sb mo:text-24sb">베스트 게시글</h1>
          <Button href="/addboard">게시물 등록하기</Button>
        </header>

        <div className={`container mo:px-0 ${pxTablet}`}>
          {!isMobile ? (
            <BoardCardList data={data.list} />
          ) : (
            <BoardCardList_Swiper data={data.list} />
          )}
        </div>

        <div className={`container ${pxTablet}`}>
          <div className="mb-5 flex items-center gap-5 mo:mb-[30px] mo:flex-wrap mo:gap-x-[15px]">
            <div className="flex-1 basis-8/12">
              <SearchInput
                size="full"
                onChange={() => console.log('demo')}
                placeholder="제목을 검색해 주세요"
              />
            </div>
            <Button>검색</Button>
            <Dropdown
              options={options}
              onSelect={handleOptionSelect}
              dropdownSize="w-[140px] ta:w-[120px] mo:w-[89.337vw]"
            />
          </div>

          <BoardList data={data.list} />
        </div>

        <div className="mo:-mt-2">
          <Pagination
            totalCount={data.totalCount}
            currentPage={1}
            pageSize={1}
            onPageChange={() => console.log('페이지 변경')}
          />
        </div>
      </div>
    </main>
  );
}
