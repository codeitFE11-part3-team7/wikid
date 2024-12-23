import { useProfileContext } from 'context/ProfileContext';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import Button from '@/components/Button';
import SectionTitle from '@/components/Landing/SectionTitle';

function HeroSection() {
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
    <>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/@kfonts/nexon-lv1-gothic-low-otf@0.2.0/index.min.css"
          rel="stylesheet"
        />
        <style>{`
          body {
            font-family: 'NEXON Lv1 Gothic Low', sans-serif;
          }
        `}</style>
      </Head>
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-blue-50 pt-[200px] font-['NEXON_Lv1_Gothic_Low'] mo:pt-[160px]">
        <div className="z-0 flex flex-col items-center">
          <SectionTitle
            caption="남들이 만드는"
            title="나만의 위키"
            align="center"
            variant="hero"
          />
          <Button onClick={handleButtonClick} variant="dark" size="large">
            {isAuthenticated && profile ? '위키 구경하기' : '위키 만들기'}
          </Button>
          <div className="mt-[54px]">
            <Image
              src="/images/img-wiki.svg"
              alt="위키 이미지"
              width={498}
              height={590}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
          {/* 배경 이미지 */}
          <div className="-z-10 mt-[-300px] w-screen">
            <Image
              src="/images/img-bg-bottom.svg"
              alt="배경 이미지"
              width={3000}
              height={590}
              className="w-full object-cover"
              priority
            />
          </div>
        </div>
        <div className="flex h-[1412px] w-full items-center justify-center bg-gray-500 pb-[200px] pt-[100px] text-white mo:h-auto mo:px-[20px] mo:pb-[100px] mo:pt-[300px] ta:h-[1059px] ta:px-[20px] ta:pb-[150px] ta:pt-[200px]">
          <div className="flex w-full max-w-[924px] items-center justify-between gap-[20px] mo:flex-col mo:items-stretch">
            {/* 텍스트와 이미지 영역 */}
            <div className="flex h-full flex-col items-start justify-end mo:block">
              {/* mo 레이아웃 */}
              <div className="hidden mo:block">
                <div className="mb-[20px]">
                  <SectionTitle
                    caption="WRITE"
                    title={
                      <>
                        친구의 위키,
                        <br />
                        직접 작성해 봐요
                      </>
                    }
                    align="left"
                  />
                </div>
                <div className="flex w-full items-end gap-[16px]">
                  <div className="w-1/2">
                    <Image
                      src="/images/img-write.svg"
                      alt="타이핑 이미지"
                      width={364}
                      height={681}
                      className="h-auto w-full object-contain"
                      priority
                    />
                  </div>
                  <div className="w-1/2">
                    <Image
                      src="/images/img-text-dark.svg"
                      alt="텍스트 이미지"
                      width={364}
                      height={681}
                      className="h-auto w-full object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>

              {/* pc/ta 레이아웃 */}
              <div className="mo:hidden">
                <div className="mb-[40px]">
                  <SectionTitle
                    caption="WRITE"
                    title={
                      <>
                        친구의 위키,
                        <br />
                        직접 작성해 봐요
                      </>
                    }
                    align="left"
                  />
                </div>
                <div className="mt-[40px]">
                  <Image
                    src="/images/img-write.svg"
                    alt="타이핑 이미지"
                    width={364}
                    height={681}
                    className="h-auto w-full object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* 오른쪽 이미지 - pc/ta */}
            <div className="flex h-full items-start mo:hidden">
              <Image
                src="/images/img-text-dark.svg"
                alt="텍스트 이미지"
                width={500}
                height={681}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;
