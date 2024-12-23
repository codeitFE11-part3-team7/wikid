import { useState } from 'react';

import Button from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import LinkBar from '@/components/LinkBar';
import SnackBar from '@/components/SnackBar';

export default function Test() {
  const commonCellClass = 'border-r border-gray-300';
  const commonRowClass = 'flex flex-wrap items-end gap-2';

  const [snackBarState, setSnackBarState] = useState<{
    open: boolean;
    severity: 'fail' | 'success' | 'info';
    message: string;
    autoHideDuration?: number;
  }>({
    open: false,
    severity: 'info',
    message: '',
  });

  const handleErrorClick = () => {
    setSnackBarState({
      open: true,
      severity: 'fail',
      message: '에러가 발생했습니다.',
      autoHideDuration: 3000,
    });
  };

  const handleSuccessClick = () => {
    setSnackBarState({
      open: true,
      severity: 'success',
      message: '성공적으로 처리되었습니다.',
      autoHideDuration: 3000,
    });
  };
  const handleInfoClick = () => {
    setSnackBarState({
      open: true,
      severity: 'info',
      message: '안내 메세지 입니다.',
      autoHideDuration: 3000,
    });
  };

  const handleCloseSnackBar = () => {
    setSnackBarState({
      ...snackBarState,
      open: false,
    });
  };

  //-----dropdown(start)-----
  const options = ['옵션1', '옵션2', '옵션3'];

  const handleOption1 = () => {
    console.log('옵션1');
  };

  const handleOption2 = () => {
    console.log('옵션2');
  };

  const handleOption3 = () => {
    console.log('옵션3');
  };

  const handleOptionSelect = (option: string) => {
    if (option === '옵션1') {
      handleOption1();
    } else if (option === '옵션2') {
      handleOption2();
    } else if (option === '옵션3') {
      handleOption3();
    }
  };
  //-----dropdown(end)-----

  return (
    <div className="px-4 py-10">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="border-b border-gray-300">
          <tr>
            <th className={commonCellClass}>컴포넌트명</th>
            <th>스타일</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-300">
            <td className={commonCellClass}>Button</td>
            <td className={commonRowClass}>
              <Button size="small">small</Button>
              <Button>normal</Button>
              <Button size="large">large</Button>
              <Button disabled>disabled</Button>
              <Button isLoading>isLoading</Button>
              <Button onClick={() => alert('button onClick')}>onClick</Button>
              <Button variant="secondary">secondary</Button>
              <Button variant="danger">danger</Button>
              <Button variant="dark">dark</Button>
              <Button variant="light">light</Button>
              <Button href="https://github.com/codeitFE11-part3-team7">
                link
              </Button>
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className={commonCellClass}>SnackBar</td>
            <td className={commonRowClass}>
              <SnackBar
                severity={snackBarState.severity}
                open={snackBarState.open}
                onClose={handleCloseSnackBar}
                autoHideDuration={snackBarState.autoHideDuration}
              >
                {snackBarState.message}
              </SnackBar>
              <Button onClick={handleInfoClick}>안내 메세지</Button>
              <Button onClick={handleErrorClick}>에러 메세지</Button>
              <Button onClick={handleSuccessClick}>완료 메세지</Button>
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className={commonCellClass}>LinkBar</td>
            <td className={commonRowClass}>
              <LinkBar link="https://www.google.com" />
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <td className={commonCellClass}>Dropdown</td>
            <td className={commonRowClass}>
              <Dropdown
                options={options}
                onSelect={handleOptionSelect}
                dropdownSize="w-40"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
