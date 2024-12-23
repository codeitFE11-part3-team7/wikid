import Head from 'next/head';
import Image from 'next/image';

import SectionTitle from '@/components/Landing/SectionTitle';

function ShareSection() {
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
      <section className="relative flex h-[1051px] flex-col items-center justify-center overflow-hidden bg-blue-50 font-['NEXON_Lv1_Gothic_Low'] mo:h-[376px] ta:h-[676px]">
        <div className="flex h-full flex-col items-center justify-center">
          <div className="flex w-full max-w-[924px] flex-col items-center gap-[120px] mo:gap-[40px] ta:gap-[80px]">
            <SectionTitle
              caption="SHARE"
              title={
                <>
                  내 위키 만들고
                  <br />
                  친구에게 공유해요
                </>
              }
              align="right"
            />

            <div className="relative w-screen">
              <Image
                src="/images/img-belt.svg"
                alt="벨트 이미지"
                width={1920}
                height={200}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ShareSection;
