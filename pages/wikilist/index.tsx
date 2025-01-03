import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';

import { getProfiles } from '@/services/api/profileAPI';
import EmptyList from '@/components/EmptyList';
import ListItem from '@/components/wikiList.page/ListItem';
import Pagination from '@/components/Pagination/Pagination';
import SearchInput from '@/components/SearchInput';
import FullCoverSpinner from '@/components/FullCoverSpinner';
import { useSnackbar } from 'context/SnackBarContext';
import ErrorMessage from '@/components/ErrorMessage';

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
export interface ListProps {
  totalCount: number;
  list: ProfileProps[];
}

// 페이지당 목록 개수
const PAGE_SIZE = 5;

// 서버사이드 렌더링 적용
export const getServerSideProps: GetServerSideProps = async (context) => {
  const queryClient = new QueryClient();
  const { page, name } = context.query;

  await queryClient.prefetchQuery({
    queryKey: ['profiles', page, name],
    queryFn: () =>
      getProfiles({
        page: Number(page),
        name: name as string,
        pageSize: PAGE_SIZE,
      }),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

/**
 * 위키 목록 페이지 컴포넌트
 */
export default function WikiList() {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const { page, name } = router.query;
  const { isPending, error, data } = useQuery<ListProps, Error>({
    queryKey: ['profiles', page, name],
    queryFn: () =>
      getProfiles({
        page: Number(page),
        name: name as string,
        pageSize: PAGE_SIZE,
      }),
    enabled: !!page,
  });
  const { list, totalCount } = data ?? { list: [], totalCount: 0 };
  const hasList = totalCount > 0;
  const emptyListText =
    name === ''
      ? '위키 목록이 없어요.'
      : `${name}와(과) 일치하는 검색 결과가 없어요.`;

  // 검색 인풋 값 변경 핸들러 함수
  const handleChange = (value: string) => {
    setSearchValue(value);
  };
  // 검색 제출 핸들러 함수
  const handleSubmit = () => {
    router.push({
      pathname: '/wikilist',
      query: { page: 1, name: searchValue },
    });
  };
  // 페이지 변경 핸들러 함수
  const handlePageChange = (pageNumber: number) => {
    router.push({
      pathname: '/wikilist',
      query: { page: pageNumber, name: name },
    });
  };

  // 목록의 위키 링크 클릭
  const handleSnackBarClick = (name: string) => {
    showSnackbar(`${name}님 위키 링크가 복사되었습니다.`, 'success');
  };

  useEffect(() => {
    if (!page)
      router.push({
        pathname: '/wikilist',
        query: { page: 1, name: '' },
      });
  }, [page, router]);

  if (isPending)
    return <FullCoverSpinner>위키 목록 가져오는 중...</FullCoverSpinner>;

  if (error) {
    console.error('--- 위키 목록 에러:', error.name, error.message);
    const errorTitle = error.message || '서버 에러가 발생하였습니다.';

    return (
      <div className="min-h-svh">
        <Head>
          <title>위키 목록 - {errorTitle} | wikied</title>
        </Head>

        <div className="container flex min-h-screen items-center justify-center pb-5">
          <ErrorMessage title={errorTitle} code="500">
            위키 목록을 가져오는 중 서버 에러가 발생하였습니다.
            <br />
            이용에 불편을 드려 죄송합니다. 잠시 후 다시 시도해 주십시오.
          </ErrorMessage>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh">
      <Head>
        <title>위키 목록{name && ` - 검색어 '${name}'`} | wikied</title>
      </Head>

      <div className="container pb-5 pt-20 mo:pt-10 ta:pt-[60px]">
        <div className="mt-20 px-20 mo:mt-10 ta:mt-[60px] tamo:px-0">
          <SearchInput
            size="full"
            value={searchValue}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
          {name && hasList && (
            <p className="mt-4 text-16 text-gray-400">
              {`“${name}”님을 총 `}
              <span className="text-green-200">{totalCount}</span>명 찾았습니다.
            </p>
          )}

          {hasList ? (
            <ul className="my-[57px] flex flex-col gap-6 mo:my-10 mo:gap-2">
              {list.map((profile) => (
                <ListItem
                  key={profile.id}
                  data={profile}
                  onSnackBarClick={handleSnackBarClick}
                />
              ))}
            </ul>
          ) : (
            <EmptyList classNames="my-52" text={emptyListText} />
          )}

          {hasList && (
            <div className="my-[120px] flex justify-center mo:my-10 ta:my-20">
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
