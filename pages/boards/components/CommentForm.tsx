import Button from '@/components/Button';

interface CommentFormProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCancel?: () => void;
  onSubmit?: React.FormEventHandler;
  update?: boolean;
}

/**
 * 댓글 입력 폼 컴포넌트
 * @param {string} value - 댓글 내용
 * @param {function} props.onChange - 댓글 내용 변경 함수
 * @param {function} props.onCancel - 댓글 등록 취소 함수
 * @param {function} props.onSubmit - 댓글 등록 함수
 * @param {boolean} props.update - 수정 모드 여부
 */
export default function CommentForm({
  value,
  onChange,
  onCancel,
  onSubmit,
  update = false,
}: CommentFormProps) {
  const MAX_LENGTH = 500;
  const length = value.length;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
  };

  return (
    <form
      className="relative h-[133px] w-full rounded-custom bg-gray-100 px-[15px] py-[13px]"
      onSubmit={onSubmit}
    >
      <textarea
        className="mb-[2px] h-14 w-full resize-none bg-gray-100 text-14"
        value={value}
        maxLength={MAX_LENGTH}
        onChange={handleChange}
        placeholder="댓글을 입력해 주세요"
      />
      <span className="absolute bottom-3 left-[15px] text-14 text-gray-400">
        {length} / {MAX_LENGTH}
      </span>
      <div className="absolute bottom-3 right-[15px] flex items-center gap-3">
        {update && (
          <Button variant="secondary" onClick={onCancel}>
            취소
          </Button>
        )}
        <Button type="submit" disabled={value.length === 0}>
          댓글 등록
        </Button>
      </div>
    </form>
  );
}
