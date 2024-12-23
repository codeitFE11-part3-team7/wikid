import BoardItem from './BoardItem';

interface BoardItemData {
  id: number;
  title: string;
  writer: {
    name: string;
  };
  likeCount: number;
  createdAt: string;
}

interface BoardListProps {
  data: BoardItemData[];
}

/**
 * 게시글 리스트
 * @param {any[]} data - 게시글 데이터
 * @example <BoardList data={data} />
 */
export default function BoardList({ data }: BoardListProps) {
  const tableStyles =
    'grid grid-cols-[50px_2fr_120px_120px_130px] ta:grid-cols-[50px 2fr 70px 100px 110px] py-[11px] mo:py-[14px] border-b items-center text-16 pc:px-[30px] ta:px-[10px]';

  return (
    <div className="w-full text-center mo:text-left">
      <div className={`${tableStyles} border-t text-gray-400 mo:hidden`}>
        <span>번호</span>
        <span>제목</span>
        <span>작성자</span>
        <span>좋아요</span>
        <span>날짜</span>
      </div>
      {data.map((item) => (
        <BoardItem
          key={item.id}
          id={item.id}
          title={item.title}
          name={item.writer.name}
          likeCount={item.likeCount}
          createdAt={item.createdAt}
          className={`${tableStyles} mo:flex`}
        />
      ))}
    </div>
  );
}
