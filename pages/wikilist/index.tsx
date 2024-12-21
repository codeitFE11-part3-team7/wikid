import Head from 'next/head';
import { useEffect, useState } from 'react';

import EmptyList from '@/components/EmptyList';
import Pagination from '@/components/Pagination/Pagination';
import SearchInput from '@/components/SearchInput';
import { instance } from '@/lib/axios-client';

import ListItem from './ListItem';

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

/**
 * 위키 목록 페이지 컴포넌트
 */
export default function WikiList() {
  const [searchValue, setSearchValue] = useState('');
  const [submitValue, setSubmitValue] = useState('');
  const [profiles, setProfiles] = useState<ListProps | null>(null);
  const [page, setPage] = useState(1);
  const hasList = (profiles?.totalCount ?? 0) > 0;
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
    setPage(pageNumber);
  };

  useEffect(() => {
    // 프로필 목록 데이터 요청 함수
    const getProfiles = async () => {
      try {
        const { data } = await instance.get('/profiles', {
          params: {
            page,
            pageSize: PAGE_SIZE,
            name: submitValue,
          },
        });
        setProfiles(data);
      } catch (error) {
        console.error('--- getProfiles:error:', error);
      }
    };

    getProfiles();
  }, [submitValue, page]);

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
              <span className="text-green-200">{profiles?.totalCount}</span>명
              찾았습니다.
            </p>
          )}

          {hasList ? (
            <ul className="my-[57px] flex flex-col gap-6 mo:my-10 mo:gap-2">
              {profiles?.list.map((profile) => (
                <ListItem key={profile.id} data={profile} />
              ))}
            </ul>
          ) : (
            <EmptyList classNames="my-52" text={emptyListText} />
          )}

          {hasList && (
            <div className="my-[120px] flex justify-center mo:my-10">
              <Pagination
                totalCount={profiles?.totalCount || 0}
                currentPage={page}
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
