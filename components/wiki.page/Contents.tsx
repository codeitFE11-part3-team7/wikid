import { useRef, useState } from 'react';
import { ProfileAnswer } from 'types/profile';

import EditorViewer from '@/components/EditorViewer';
import DisconnectionModal from '@/components/Modal/DisconnectionModal';
import WikiQuizModal from '@/components/Modal/WikiQuizModal';
import TextEditor from '@/components/TextEditor';
import UserProfile from '@/components/UserProfile';
import { useTimer } from '@/hooks/useTimer';
import instance from '@/lib/axios-client';

import Blank from './Blank';
import ContentHeader from './ContentHeader';
import { useProfileContext } from '@/hooks/useProfileContext';
import SnackBar from '../SnackBar';
import useSnackBar from '@/hooks/useSnackBar';

interface ProfileProps {
  profile: ProfileAnswer;
}

export default function Contents({ profile }: ProfileProps) {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isInfoSnackBarOpen, setIsInfoSnackBarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileEdit, setIsProfileEdit] = useState(false);
  const [isDMOpen, setIsDMOpen] = useState(false);
  const [newContent, setNewContent] = useState<string>(profile.content || '');
  const [profileData, setProfileData] = useState<ProfileAnswer>(profile);
  const { snackBarValues, snackBarOpen } = useSnackBar();

  const [diffTime, setDiffTime] = useState<number>(0);

  const previousContent = useRef<string>(newContent);
  const isEmpty = newContent === '';
  const { isAuthenticated } = useProfileContext();

  const handleQuizOpen = async () => {
    if (!isAuthenticated) {
      snackBarOpen('fail', '로그인이 필요합니다.');
      return;
    }
    const res = await instance.get(`/profiles/${profile.code}/ping`);
    if (res.status === 204) {
      setIsInfoSnackBarOpen(false);
      setIsQuizOpen(true);
    } else {
      const registeredDate = new Date(res.data.registeredAt);
      const nowDate = new Date();
      const diff = nowDate.getTime() - registeredDate.getTime();
      setDiffTime(diff);
      setIsInfoSnackBarOpen(true);
    }
  };

  //퀴즈 성공 후 위키 편집모드
  const handleQuizSuccess = async () => {
    snackBarOpen('success', '정답입니다!');
    setIsQuizOpen(false);

    const accessToken = localStorage.getItem('accessToken');
    const res = await instance.get('/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userCode = (res.data as { profile: ProfileAnswer }).profile.code;
    if (profile.code === userCode) {
      setIsProfileEdit(true);
    } else {
      setIsProfileEdit(false);
    }
    setIsEditing(true);
  };

  //위키 제목과 내용 편집
  const handleContentChange = (value: string) => {
    setNewContent(value);
  };

  const handleDataChange = (field: keyof ProfileAnswer, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  //편집된 내용 저장 후 편집모드 종료
  const saveContent = async () => {
    try {
      // PATCH 요청을 보내는 코드
      const updatedProfile = {
        securityQuestion: profile.securityQuestion,
        nationality: profileData.nationality,
        family: profileData.family,
        bloodType: profileData.bloodType,
        nickname: profileData.nickname,
        birthday: profileData.birthday,
        sns: profileData.sns,
        job: profileData.job,
        mbti: profileData.mbti,
        city: profileData.city,
        image: profileData.image,
        content: newContent, // 새로운 내용
      };

      // 프로필 수정 API 호출 ("/profiles/{code}"에 PATCH 요청)
      await instance.patch(`/profiles/${profile.code}`, updatedProfile);

      // 수정이 완료되면 상태 업데이트
      previousContent.current = newContent;
      setProfileData(profileData);
      setIsEditing(false);
      setIsProfileEdit(false);
      snackBarOpen('success', '저장되었습니다.');
    } catch (error) {
      console.error('프로필을 저장하는 데 실패했습니다.', error);
      // 요청 실패시 오류 처리 추가 (예: 사용자에게 알림)
    }
  };

  //수정 취소시 이전 내용으로 복구
  const closeAndNoSave = () => {
    setIsEditing(false);
    setIsProfileEdit(false);
    setNewContent(previousContent.current);
    setProfileData(profile);
  };

  //5분동안 미기입시 뒤로가기
  const handleInactivityWarning = () => {
    setIsDMOpen(true);
  };

  const timeleft = useTimer(isEditing, handleInactivityWarning, 300);

  //연결 끊김 모달 (수정중인 내용 취소, 기존 내용으로 복구)
  const onDMClose = () => {
    setIsDMOpen(false);
    setIsEditing(false);
    setIsProfileEdit(false);
    setNewContent(previousContent.current);
    setProfileData(profile);
  };

  return (
    <div
      className={`pc:grid ${isEditing ? `pc:grid-rows-[90px]` : `pc:grid-rows-[200px]`} mo:px-[20px] ta:px-[60px] pc:gap-x-[80px] tamo:flex tamo:w-full tamo:flex-col tamo:gap-[10px]`}
      style={{ gridTemplateColumns: 'minmax(300px, 800px) 320px' }}
    >
      <div>
        <div className="pc:pt-[40px]">
          <ContentHeader
            name={profile.name || ''}
            link={`https://wikied-ten.vercel.app/wiki/${profile.code}`}
            isEditing={isEditing}
            isInfoSnackBarOpen={isInfoSnackBarOpen}
            handleQuizOpen={handleQuizOpen}
            isEmpty={isEmpty}
            closeAndNoSave={closeAndNoSave}
            saveContent={saveContent}
            diffTime={diffTime}
          />
        </div>

        <div className="fixed z-20">
          <SnackBar
            severity={snackBarValues.severity}
            open={snackBarValues.open}
            onClose={snackBarValues.onClose}
            autoHideDuration={snackBarValues.autoHideDuration}
          >
            {snackBarValues.children}
          </SnackBar>
        </div>
      </div>
      <WikiQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        securityQuestion={profile.securityQuestion || ''}
        userCode={profile.code || ''}
        onQuizComplete={handleQuizSuccess}
      />

      <div className="tamo:my-[20px]">
        <UserProfile
          data={profileData}
          isEditing={isProfileEdit}
          onDataChange={handleDataChange}
        />
      </div>

      {isEmpty && !isEditing && (
        <Blank
          onQuizOpen={handleQuizOpen}
          onQuizSuccess={handleQuizSuccess}
          question={profile.securityQuestion || ''}
          code={profile.code || ''}
        />
      )}

      <div className="mb-[50px] mt-[20px]">
        {isEditing ? (
          <>
            <div className="mb-[8px] text-right font-bold text-red-100">
              남은시간 {Math.floor(timeleft / 60)}:{timeleft % 60}
            </div>
            <div className="h-[700px] w-full rounded-md border p-[20px] focus:border-gray-300">
              <TextEditor value={newContent} onChange={handleContentChange} />
            </div>
          </>
        ) : (
          <div className="break-words">
            <EditorViewer content={newContent} />
          </div>
        )}
      </div>

      <DisconnectionModal
        isOpen={isDMOpen}
        onClose={onDMClose}
        confirmReset={onDMClose}
      />
    </div>
  );
}
