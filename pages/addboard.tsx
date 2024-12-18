import instance from 'lib/axios-client';
import { FormEvent, useState } from 'react';

import Button from '@/components/Button';
import Headers from '@/components/Headers/Headers';
import TextEditor from '@/components/TextEditor';

// 제목 글자수 제한
const MAX_TITLE = 30;

// HTML에서 Text만 추출하는 함수
const extractContent = (str: string) => str.replace(/<[^>]*>/g, '').trim();

// 포멧된 날짜 반환하는 함수
const formatDate = (date: string) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}. ${month}. ${day}.`;
};

/**
 * 게시글 등록하기 페이지
 */
export default function Addboard() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 등록 버튼 비활성화
  const submitDisabled = title.length === 0 || content.length === 0;
  // 내용에서 추출된 텍스트
  const textContent = extractContent(content);
  // 오늘 날짜
  const today = formatDate(new Date().toISOString());

  // 제목 input 콜백 함수
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log('handleChange:e:', e);
    setTitle(e.target.value);
  };
  // 내용 에디터 콜백 함수
  const handleContentChange = (value: string) => {
    // console.log('value:', value);
    setContent(value);
  };
  // 작성 폼 서브밋 함수
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // API 연결 및 처리
    // TODO - 로그인 및 인증되면 그때 다시 테스트
    instance
      .post('/articles', {
        image: '',
        content,
        title,
      })
      .then((res) => console.log('subtmi:res:', res))
      .catch((err) => console.log('submit:err:', err));
  };

  return (
    <div className="min-h-svh">
      <Headers />

      <main>
        <div className="container pt-20">
          <div className="mb-5 mt-[54px] rounded-custom px-[30px] py-[30px] shadow-custom dark:shadow-custom-dark">
            <header className="my-4 flex items-center justify-between">
              <h1 className="mo:text-16sb ta:text-20sb pc:text-24sb">
                게시물 등록하기
              </h1>
              <Button
                form="write-form"
                className="w-[140px] mo:w-auto"
                disabled={submitDisabled}
              >
                등록하기
              </Button>
            </header>

            <div className="my-6 text-16 text-gray-300 mo:my-4 mo:text-12">
              등록일
              <span className="ml-3 mo:ml-2">{today}</span>
            </div>

            <form
              id="write-form"
              className="mt-[33px] mo:mt-5 ta:mt-6"
              onSubmit={handleSubmit}
            >
              <fieldset className="my-5 flex items-center justify-between border-y border-gray-200">
                <label htmlFor="title" className="sr-only">
                  제목
                </label>
                <input
                  id="title"
                  className="w-0 flex-1 bg-transparent py-3 text-20md focus-visible:outline-green-200"
                  type="text"
                  maxLength={MAX_TITLE}
                  value={title}
                  onChange={handleInputChange}
                  placeholder="제목을 입력해주세요"
                />
                <div className="ml-4 w-10 text-14md">
                  {title.length}/
                  <span className="text-green-200">{MAX_TITLE}</span>
                </div>
              </fieldset>

              <p className="mb-2 mt-5 text-16md mo:text-14md">
                공백포함 : 총 {textContent.length}자 | 공백제외 총{' '}
                {textContent.replaceAll(' ', '').length}자
              </p>

              <div className="h-[520px] mo:h-[320px] ta:h-[480px]">
                <TextEditor value={content} onChange={handleContentChange} />
              </div>
            </form>
          </div>

          <div className="mb-8 text-center">
            <Button href="/boards" variant="secondary" className="w-[140px]">
              목록으로
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
