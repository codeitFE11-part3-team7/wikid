import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
  const [comments, setComments] = useState<CommentsData | null>(null);
  const router = useRouter();
  const { articleId } = router.query;
  const userId = 1909; // TODO : 임시 유저 아이디 - context로 변경 필요
  const LIMIT = 10; // TODO : 댓글 무한 스크롤 기능 시 추가

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
      const res = await instance.get(
        `/articles/${articleId}/comments?limit=${LIMIT}`
      );
      setComments(res.data);
    } catch (error) {
      console.error('댓글을 등록하지 못했습니다.', error);
    }
  };

  // 댓글 수정
  const handleUpdate = async (id: number, newContent: string) => {
    try {
      await instance.patch(`/comments/${id}`, { content: newContent });
      const res = await instance.get(
        `/articles/${articleId}/comments?limit=${LIMIT}`
      );
      setComments(res.data);
    } catch (error) {
      console.error('댓글을 수정하지 못했습니다.', error);
    }
  };

  // 댓글 삭제
  const handleDelete = async (id: number) => {
    try {
      await instance.delete(`/comments/${id}`);
      const res = await instance.get(
        `/articles/${articleId}/comments?limit=${LIMIT}`
      );
      setComments(res.data);
    } catch (error) {
      console.error('댓글을 삭제하지 못했습니다.', error);
    }
  };

  useEffect(() => {
    // 게시글 상세 내용 불러오기
    const getBoardDetail = async () => {
      try {
        const res = await instance.get(`/articles/${articleId}`);
        return res.data;
      } catch (error) {
        console.error('게시글 상세 내용을 불러오지 못했습니다.', error);
        return null;
      }
    };

    // 게시글 댓글 리스트 불러오기
    const getComments = async () => {
      try {
        const res = await instance.get(
          `/articles/${articleId}/comments?limit=${LIMIT}`
        );
        return res.data;
      } catch (error) {
        console.error('게시글 댓글 리스트를 불러오지 못했습니다.', error);
        return null;
      }
    };

    // 게시글 상세 내용 로드
    const fetchBoardsDetail = async () => {
      const res = await getBoardDetail();
      if (res) {
        setData(res);
      }
    };

    // 게시글 댓글 리스트 로드
    const fetchComments = async () => {
      const res = await getComments();
      if (res) {
        setComments(res);
      }
    };

    if (articleId) {
      fetchBoardsDetail();
      fetchComments();
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
            {/* 댓글 from */}
            <div className="mb-[42px] tamo:mb-6">
              <div className="mb-[15px] text-18sb mo:mb-2 mo:text-16sb">
                댓글&nbsp;
                <span className="text-green-200">{comments?.list.length}</span>
              </div>
              <CommentForm
                value={value}
                onChange={handleChange}
                onSubmit={handleCommentSubmit}
              />
            </div>

            {/* 댓글 리스트 */}
            <ul className="flex flex-col gap-6 mo:gap-[14px] ta:gap-4">
              {comments?.list.map((item) => (
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
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
