import { useState } from 'react';

import Button from '@/components/Button';
import ContentHeader from '@/pages/wiki/components/ContentHeader';

export default function TestWiki() {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState<string>('테스트');

  const handleNameChange = (value: string) => {
    setNewName(value);
  };

  const handleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="mt-[120px]">
      <ContentHeader
        name={newName}
        link="https://www.codeit.kr"
        onNameChange={handleNameChange}
        isEditing={isEditing}
      />
      <Button onClick={handleEditing}>isEditing?</Button>
    </div>
  );
}
