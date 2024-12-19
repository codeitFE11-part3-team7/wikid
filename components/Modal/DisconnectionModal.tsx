import Modal from './Modal';

interface DisconnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DisconnectionModal = ({ isOpen, onClose }: DisconnectionModalProps) => {
  return (
    <Modal closeOnBackgroundClick={true} isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold">
          5분 이상 글을 쓰지 않아 접속이 끊어졌어요.
        </p>
        <p className="text-sm">
          위키 참여하기를 통해 다시 위키를 수정해 주세요.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mt-2 w-20 rounded-custom bg-green-200 px-6 py-2 text-background"
          >
            확인
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DisconnectionModal;
