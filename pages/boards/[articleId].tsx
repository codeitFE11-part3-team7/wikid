import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import Button from '@/components/Button';
import instance from '@/lib/axios-client';

import BoardDetailCard from './components/BoardDetailCard';
import Comment from './components/Comment';
import CommentForm from './components/CommentForm';

interface Writer {
  name: string;
  id: number;
  image: string | null;
}

interface ArticleData {
  updatedAt: string;
  createdAt: string;
  likeCount: number;
  writer: Writer;
  image: string;
  title: string;
  id: number;
  isLiked: boolean;
  content: string;
}

interface Comment {
  id: number;
  content: string;
  updatedAt: string;
  writer: Writer;
}

interface CommentsData {
  list: Comment[];
  nextCursor: string | null;
}

export default function BoardsDetails() {
  const [data, setData] = useState<ArticleData | null>(null);
  const [value, setValue] = useState('');
  const router = useRouter();
  const { articleId } = router.query;
  const userId = 1909; // TODO : 임시 유저 아이디 - context로 변경 필요
  const LIMIT = 10; // 페이지당 댓글 수

  // Intersection Observer 설정
  const { ref, inView } = useInView({
    threshold: 1.0,
    rootMargin: '100px',
  });

  // 댓글 데이터 가져오기
  const getComments = async ({
    queryKey,
    pageParam = 0, // 기본 값 설정
  }: QueryFunctionContext<[string, number, number]>): Promise<CommentsData> => {
    const [_key, articleId, LIMIT] = queryKey;
    try {
      const res = await instance.get(
        `/articles/${articleId}/comments?limit=${LIMIT}&cursor=${pageParam}`
      );
      return res.data;
    } catch (error) {
      console.error('게시글 댓글을 불러오지 못했습니다.', error);
      throw new Error('댓글 데이터를 가져오는 중 문제가 발생했습니다.');
    }
  };

  // 댓글 데이터 무한 스크롤 로직 (React Query)
  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['comments', articleId, LIMIT],
    // @ts-expect-error: queryFn 타입 미스매치로 인한 에러 무시
    queryFn: getComments,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor === null ? undefined : lastPage.nextCursor;
    },
    enabled: !!articleId,
  });

  // Intersection Observer를 통해 fetchNextPage 호출
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // 댓글 입력창 value 변경
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  // 댓글 등록
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await instance.post(`/articles/${articleId}/comments`, {
        content: value,
      });
      setValue('');
      refetch(); // 댓글 등록 후 데이터 다시 가져오기
    } catch (error) {
      console.error('댓글을 등록하지 못했습니다.', error);
    }
  };

  // 댓글 수정
  const handleUpdate = async (id: number, newContent: string) => {
    try {
      await instance.patch(`/comments/${id}`, { content: newContent });
      refetch(); // 댓글 수정 후 데이터 다시 가져오기
    } catch (error) {
      console.error('댓글을 수정하지 못했습니다.', error);
    }
  };

  // 댓글 삭제
  const handleDelete = async (id: number) => {
    try {
      await instance.delete(`/comments/${id}`);
      refetch(); // 댓글 삭제 후 데이터 다시 가져오기
    } catch (error) {
      console.error('댓글을 삭제하지 못했습니다.', error);
    }
  };

  useEffect(() => {
    // 게시글 상세 내용 불러오기
    const getBoardDetail = async () => {
      try {
        const res = await instance.get(`/articles/${articleId}`);
        setData(res.data);
      } catch (error) {
        console.error('게시글 상세 내용을 불러오지 못했습니다.', error);
      }
    };

    if (articleId) {
      getBoardDetail();
    }
  }, [articleId]);

  return (
    <>
      <Head>
        <title>{data?.title} - 자유게시판 | wikied</title>
      </Head>
      <main className="mt-20 py-[50px] mo:py-5 ta:py-10 tamo:mt-[60px]">
        <div className="container flex flex-col gap-[60px] ta:px-[60px] pc:max-w-[1095px] tamo:gap-10">
          {/* 게시글 상세 본문 */}
          {data && (
            <BoardDetailCard
              isOwner={data.writer.id === userId}
              title={data.title}
              name={data.writer.name}
              createdAt={data.createdAt}
              updatedAt={data.updatedAt}
              likeCount={data.likeCount}
              content={data.content}
              image={data.image}
            />
          )}

          {/* 목록으로 이동 버튼 */}
          <div className="flex justify-center">
            <Button href="/boards" variant="secondary" className="w-[140px]">
              목록으로
            </Button>
          </div>

          {/* 댓글 목록 */}
          <div>
            {/* 댓글 form */}
            <div className="mb-[42px] tamo:mb-6">
              <div className="mb-[15px] text-18sb mo:mb-2 mo:text-16sb">
                댓글&nbsp;
                <span className="text-green-200">
                  {comments?.pages
                    ?.map((page) => page.list.length)
                    .reduce((sum, count) => sum + count, 0) || 0}
                </span>
              </div>
              <CommentForm
                value={value}
                onChange={handleChange}
                onSubmit={handleCommentSubmit}
              />
            </div>

            {/* 댓글 리스트 */}
            <ul className="flex flex-col gap-6 mo:gap-[14px] ta:gap-4">
              {comments?.pages.map((page) =>
                page.list.map((item) => (
                  <li key={item.id}>
                    <Comment
                      name={item.writer.name}
                      content={item.content}
                      date={item.updatedAt}
                      onclick={{
                        update: (newContent: string) =>
                          handleUpdate(item.id, newContent),
                        delete: () => handleDelete(item.id),
                      }}
                      isOwner={item.writer.id === userId}
                    />
                  </li>
                ))
              )}
            </ul>

            {/* 무한 스크롤 로딩 감지용 div */}
            <div ref={ref} className="h-10" />
            {isFetchingNextPage && <p>로딩 중...</p>}
          </div>
        </div>
      </main>
    </>
  );
}
