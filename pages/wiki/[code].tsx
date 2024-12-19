import { useRouter } from 'next/router';

import Content from './components/Contents';

//TODO 임시 페이지입니다. 프로필 컴퍼넌트 제작되면 추후 제작하겠습니다.
export default function Wiki() {
  const router = useRouter();
  const { code } = router.query;

  return (
    <>
      <div className="mt-[160px] w-full px-[100px]">
        <Content />
        <div>프로필 컴포넌트{code}</div>
      </div>
    </>
  );
}
