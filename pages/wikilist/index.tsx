import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { instance } from '@/lib/axios-client';

import EmptyList from '@/components/EmptyList';
import ListItem from '@/components/wikiList.page/ListItem';
import Pagination from '@/components/Pagination/Pagination';
import SearchInput from '@/components/SearchInput';

// 위키 목록 페이지 프로필 데이터 타입
export interface ProfileProps {
  id: number;
  name: string;
  code: string;
  image: string;
  city: string;
  nationality: string;
  job: string;
}

// 위키 목록 페이지 리스트 데이터 타입
interface ListProps {
  totalCount: number;
  list: ProfileProps[];
}

// 페이지당 목록 개수
const PAGE_SIZE = 5;

// TODO: 서버사이드 렌더링 적용
// export const getServerSideProps = async (context) => {}

const fetchProfiles = async (page: number, submitValue: string) => {
  const { data } = await instance.get<ListProps>('/profiles', {
    params: {
      page,
      pageSize: PAGE_SIZE,
      name: submitValue,
    },
  });
  return data;
};

/**
 * 위키 목록 페이지 컴포넌트
 */
export default function WikiList() {
  const [searchValue, setSearchValue] = useState('');
  const [submitValue, setSubmitValue] = useState('');
  const router = useRouter();

  const { page } = router.query;
  const { isPending, error, data } = useQuery<ListProps, Error>({
    queryKey: ['profiles', page, submitValue],
    queryFn: () => fetchProfiles(Number(page), submitValue),
    enabled: !!page,
  });
  const { list, totalCount } = data ?? { list: [], totalCount: 0 };
  const hasList = totalCount > 0;
  const emptyListText =
    submitValue === ''
      ? '위키 목록이 없어요.'
      : `${submitValue}와(과) 일치하는 검색 결과가 없어요.`;

  // 검색 인풋 값 변경 핸들러 함수
  const handleChange = (value: string) => {
    setSearchValue(value);
  };
  // 검색 제출 핸들러 함수
  const handleSubmit = () => {
    setSubmitValue(searchValue);
  };
  // 페이지 변경 핸들러 함수
  const handlePageChange = (pageNumber: number) => {
    router.push(`/wikilist?page=${pageNumber}`);
  };

  useEffect(() => {
    if (!page) router.push('/wikilist?page=1');
  }, [page, router]);

  // TODO: 로딩 스피너 & 에러 페이지 컴포넌트 추가
  if (isPending) return <div>Loading...</div>;

  // TODO: 에러 컴포넌트 추가
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-svh">
      <Head>
        <title>
          위키 목록{submitValue && ` - 검색어 '${submitValue}'`} | wikied
        </title>
      </Head>

      <div className="container pb-5 pt-20 mo:pt-10">
        <div className="mt-20 px-20 mo:px-0">
          <SearchInput
            size="large"
            value={searchValue}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
          {submitValue && hasList && (
            <p className="mt-4 text-16 text-gray-400">
              {`“${submitValue}”님을 총 `}
              <span className="text-green-200">{totalCount}</span>명 찾았습니다.
            </p>
          )}

          {hasList ? (
            <ul className="my-[57px] flex flex-col gap-6 mo:my-10 mo:gap-2">
              {list.map((profile) => (
                <ListItem key={profile.id} data={profile} />
              ))}
            </ul>
          ) : (
            <EmptyList classNames="my-52" text={emptyListText} />
          )}

          {hasList && (
            <div className="my-[120px] flex justify-center mo:my-10">
              <Pagination
                totalCount={totalCount}
                currentPage={Number(page)}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
