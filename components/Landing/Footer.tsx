import Modal from '@/components/Modal/Modal';
import { useState } from 'react';

import { TERMS_OF_SERVICE, PRIVACY_POLICY, FINANCIAL_TERMS } from './terms';

function Footer() {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isFinanceModalOpen, setIsFinanceModalOpen] = useState(false);

  return (
    <footer className="flex flex-col bg-gray-600 px-[48px] py-[80px] mo:p-[20px]">
      <span className="mb-[10px] block text-[16px] font-bold text-white mo:text-[10px] ta:text-[16px]">
        Copyright ⓒ Wikied. All Rights Reserved <br />
      </span>
      <div className="mb-[30px] flex flex-col gap-px">
        <span className="text-[14px] font-normal text-white mo:text-[8px]">
          사업자등록번호 000-00-00000 | 통신판매신고 제2020-서울-00000호 | 대표
          : 이지은
        </span>
        <span className="text-[14px] font-normal text-white mo:text-[8px]">
          서울특별시 중구 청계천로 123, 위키드빌딩
        </span>
      </div>
      <div className="flex gap-[30px] mo:gap-[15px]">
        <span
          className="cursor-pointer text-[14px] font-medium text-white hover:opacity-80 mo:text-[8px] ta:text-[14px]"
          onClick={() => setIsTermsModalOpen(true)}
          onKeyDown={(e) => e.key === 'Enter' && setIsTermsModalOpen(true)}
          role="button"
          tabIndex={0}
        >
          서비스 이용약관
        </span>
        <span
          className="cursor-pointer text-[14px] font-medium text-white hover:opacity-80 mo:text-[8px] ta:text-[14px]"
          onClick={() => setIsPrivacyModalOpen(true)}
          onKeyDown={(e) => e.key === 'Enter' && setIsPrivacyModalOpen(true)}
          role="button"
          tabIndex={0}
        >
          개인정보 취급방침
        </span>
        <span
          className="cursor-pointer text-[14px] font-medium text-white hover:opacity-80 mo:text-[8px] ta:text-[14px]"
          onClick={() => setIsFinanceModalOpen(true)}
          onKeyDown={(e) => e.key === 'Enter' && setIsFinanceModalOpen(true)}
          role="button"
          tabIndex={0}
        >
          전자금융거래 기본약관
        </span>
      </div>

      <Modal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        width="w-[800px]"
        closeOnBackgroundClick={true}
      >
        <div>
          <h2 className="mb-[20px] text-[24px] font-bold">서비스 이용약관</h2>
          <div className="max-h-[60vh] overflow-y-auto text-[16px] leading-[1.6]">
            {TERMS_OF_SERVICE}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        width="w-[800px]"
        closeOnBackgroundClick={true}
      >
        <div>
          <h2 className="mb-[20px] text-[24px] font-bold">개인정보 취급방침</h2>
          <div className="max-h-[60vh] overflow-y-auto text-[16px] leading-[1.6]">
            {PRIVACY_POLICY}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isFinanceModalOpen}
        onClose={() => setIsFinanceModalOpen(false)}
        width="w-[800px]"
        closeOnBackgroundClick={true}
      >
        <div>
          <h2 className="mb-[20px] text-[24px] font-bold">
            전자금융거래 기본약관
          </h2>
          <div className="max-h-[60vh] overflow-y-auto text-[16px] leading-[1.6]">
            {FINANCIAL_TERMS}
          </div>
        </div>
      </Modal>
    </footer>
  );
}

export default Footer;
