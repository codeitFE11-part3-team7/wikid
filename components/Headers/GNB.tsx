import Link from 'next/link';

export default function GNB() {
  return (
    <div className="flex items-center gap-10 text-14">
      <Link className="mo:hidden" href="/wikilist">
        위키목록
      </Link>
      <Link className="mo:hidden" href="/boards">
        자유게시판
      </Link>
    </div>
  );
}
