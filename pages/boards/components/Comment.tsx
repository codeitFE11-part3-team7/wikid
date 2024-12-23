import Image from 'next/image';
import { useState } from 'react';

import dateConversion from '@/utils/dateConversion';

import CommentForm from './CommentForm';

interface CommentProps {
  name: string;
  content: string;
  date: string;
  onclick: { update: (value: string) => void; delete: () => void };
  isOwner: boolean;
}

/**
 * 댓글 컴포넌트
 * @param {string} name - 유저이름
 * @param {string} props.content - 코멘트
 * @param {string} props.date - 날짜
 * @param {object} props.onclick - 수정, 삭제 함수
 * @param {boolean} props.isOwner - 댓글 작성자와 로그인한 사용자가 일치하는지 여부
 */
export default function Comment({
  name = '유저이름',
  content = '코멘트',
  date = '2024-12-19T05:26:36.719Z',
  onclick = { update: () => {}, delete: () => {} },
  isOwner = false,
}: CommentProps) {
  const [value, setValue] = useState(content);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleCancel = () => {
    setValue(content);
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onclick.update(value);
    setIsEditing(false);
  };

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="flex items-start gap-5 rounded-custom px-[30px] py-[22px] shadow-custom dark:shadow-custom-dark mo:gap-[15px] mo:px-5 mo:py-4">
      <Image
        src="/icon/icon-profile.svg"
        alt="user profile"
        className="mo:size-10"
        width={50}
        height={50}
      />
      <div className="w-full">
        <div className="mb-2 flex items-center justify-between mo:mb-[6px]">
          <span className="text-18sb">{name}</span>

          {!isEditing && isOwner && (
            <div className="flex items-center gap-5">
              <button onClick={handleUpdateClick}>
                <Image
                  src="/icon/icon-write.svg"
                  alt="수정하기"
                  className="mo:size-5"
                  width={20}
                  height={20}
                />
              </button>
              <button onClick={onclick.delete}>
                <Image
                  src="/icon/icon-delete.svg"
                  alt="삭제하기"
                  className="mo:size-5"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          )}
        </div>

        {!isEditing ? (
          <>
            <p className="mb-[10px] text-16 mo:mb-1 mo:text-14">{content}</p>
            <span className="text-14 text-gray-400 mo:text-12">
              {dateConversion(date)}
            </span>
          </>
        ) : (
          <CommentForm
            value={value}
            onChange={handleChange}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            update
          />
        )}
      </div>
    </div>
  );
}
