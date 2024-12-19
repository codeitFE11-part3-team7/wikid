import Modal from './Modal';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UnsavedChangesModal = ({ isOpen, onClose }: UnsavedChangesModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnBackgroundClick={true}>
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold">저장하지 않고 나가시겠어요?</p>
        <p className="text-sm">작성하신 모든 내용이 사라집니다.</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mt-2 w-40 rounded-custom bg-red-100 px-6 py-2 text-background"
          >
            페이지 나가기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UnsavedChangesModal;
