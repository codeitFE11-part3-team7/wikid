import { useRouter } from "next/router";
import Button from "@/components/Button";
import { useProfileContext } from "@/hooks/useProfileContext";

function FinalSection() {
  const router = useRouter();
  const { isAuthenticated, profile } = useProfileContext();

  const handleButtonClick = async () => {
    try {
      if (!isAuthenticated) {
        await router.push("/login");
      } else if (!profile) {
        await router.push("/mypage");
      } else {
        await router.push(profile.code ? `/wiki/${profile.code}` : "/wiki");
      }
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  };

  return (
    <section className="mo:py-[100px] ta:py-[160px] relative flex flex-col items-center justify-center overflow-hidden bg-gray-500 py-[200px] font-['NEXON_Lv1_Gothic_Low']">
      <div className="flex h-full flex-col items-center justify-center">
        <h2 className="mo:text-[30px] text-[60px] font-bold leading-none text-white">
          나만의 위키 만들어 보기
        </h2>
        <Button
          onClick={handleButtonClick}
          variant="light"
          size="large"
          className="mo:h-[54px] mo:w-[169px] mt-[40px]"
        >
          지금 시작하기
        </Button>
      </div>
    </section>
  );
}

export default FinalSection;
