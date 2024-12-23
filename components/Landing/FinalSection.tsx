import { useProfileContext } from 'context/ProfileContext';
import { useRouter } from 'next/router';

import Button from '@/components/Button';

function FinalSection() {
  const router = useRouter();
  const { isAuthenticated, profile } = useProfileContext();

  const handleButtonClick = async () => {
    try {
      if (!isAuthenticated) {
        await router.push('/login');
      } else if (!profile) {
        await router.push('/mypage');
      } else {
        await router.push(profile.code ? `/wiki/${profile.code}` : '/wiki');
      }
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden bg-gray-500 py-[200px] font-['NEXON_Lv1_Gothic_Low'] mo:py-[100px] ta:py-[160px]">
      <div className="flex h-full flex-col items-center justify-center">
        <h2 className="text-[60px] font-bold leading-none text-white mo:text-[30px]">
          나만의 위키 만들어 보기
        </h2>
        <Button
          onClick={handleButtonClick}
          variant="light"
          size="large"
          className="mt-[40px] mo:h-[54px] mo:w-[169px]"
        >
          지금 시작하기
        </Button>
      </div>
    </section>
  );
}

export default FinalSection;
