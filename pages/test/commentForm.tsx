import { useState } from 'react';

import CommentForm from '../boards/components/CommentForm';

export default function CommentFormTest() {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="pt-24">
      <CommentForm value={value} onChange={handleChange} />
    </div>
  );
}
