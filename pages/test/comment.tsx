import { useEffect, useState } from 'react';

import Comment from '@/pages/boards/components/Comment';

const data = {
  nextCursor: 0,
  list: [
    {
      writer: {
        image: 'string',
        name: 'string',
        id: 1,
      },
      updatedAt: '2024-12-19T05:26:36.719Z',
      createdAt: '2024-12-19T05:26:36.719Z',
      content: 'string',
      id: 1,
    },
    {
      writer: {
        image: 'string',
        name: 'string',
        id: 2,
      },
      updatedAt: '2024-12-19T05:26:36.719Z',
      createdAt: '2024-12-19T05:26:36.719Z',
      content: 'string',
      id: 2,
    },
    {
      writer: {
        image: 'string',
        name: 'string',
        id: 3,
      },
      updatedAt: '2024-12-19T05:26:36.719Z',
      createdAt: '2024-12-19T05:26:36.719Z',
      content: 'string',
      id: 3,
    },
  ],
};

export default function CommentTest() {
  const [comments, setComments] = useState<typeof data.list>([]);
  const [update, setUpdate] = useState(false);
  const userId = 1; // TODO: 실제 로그인한 사용자의 ID로 대체

  useEffect(() => {
    // TODO: 실제 API 요청으로 대체
    const fetchComments = async () => {
      // 더미 API 요청
      const response = await new Promise<{
        nextCursor: number;
        list: typeof data.list;
      }>((resolve) => {
        setTimeout(() => resolve(data), 1000);
      });
      setComments(response.list);
    };

    fetchComments();
  }, []);

  const handleUpdate = (id: number, newContent: string) => {
    const updatedComments = comments.map((comment) =>
      comment.id === id ? { ...comment, content: newContent } : comment
    );
    setComments(updatedComments);
    setUpdate(true);
  };

  const handleDelete = (id: number): void => {
    const filteredComments = comments.filter((comment) => comment.id !== id);
    setComments(filteredComments);
  };

  useEffect(() => {
    if (update) {
      // TODO: 실제 API 요청으로 대체
      setComments(comments);
      setUpdate(false);
    }
  }, [update, comments]);

  return (
    <div className="px-5 pt-24">
      <ul className="flex flex-col gap-6 mo:gap-[14px] ta:gap-4">
        {comments.map((item) => (
          <li key={item.id}>
            <Comment
              name={item.writer.name}
              content={item.content}
              date={item.updatedAt}
              onclick={{
                update: () => handleUpdate(item.id, 'Updated content'),
                delete: () => handleDelete(item.id),
              }}
              isOwner={item.writer.id === userId}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
