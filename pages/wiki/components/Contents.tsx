import { useEffect, useRef, useState } from 'react';

import Button from '@/components/Button';
import EditorViewer from '@/components/EditorViewer';
import DisconnectionModal from '@/components/Modal/DisconnectionModal';
import UnsavedChangesModal from '@/components/Modal/UnsavedChangesModal';
import WikiQuizModal from '@/components/Modal/WikiQuizModal';
import TextEditor from '@/components/TextEditor';
import UserProfile from '@/components/UserProfile';
import instance from '@/lib/axios-client';

import { Profile } from '../[code]';
import Blank from './Blank';
import ContentHeader from './ContentHeader';

interface ProfileProps {
  profile: Profile;
}

export default function Contents({ profile }: ProfileProps) {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isInfoSnackBarOpen, setIsInfoSnackBarOpen] = useState(false);
  const [isUCOpen, setIsUCOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileEdit, setIsProfileEdit] = useState(false);
  const [isDMOpen, setIsDMOpen] = useState(false);
  const [newContent, setNewContent] = useState<string>(profile?.content || '');
  const [profileData, setProfileData] = useState<Profile>(profile);
  const [timeLeft, setTimeLeft] = useState(300);

  const previousContent = useRef<string>(newContent);

  const isEmpty = newContent === null || newContent === '';

  const handleQuizOpen = async () => {
    const res = await instance.get(`/profiles/${profile?.code}/ping`);
    if (res.status === 204) {
      setIsInfoSnackBarOpen(false);
      setIsQuizOpen(true);
    } else {
      setIsInfoSnackBarOpen(true);
    }
  };

  //퀴즈 성공 후 위키 편집모드
  const handleQuizSuccess = async () => {
    alert('퀴즈를 성공하셨습니다.');
    setIsQuizOpen(false);

    const accessToken = localStorage.getItem('accessToken');
    const res = await instance.get('/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userCode = res.data.profile.code;
    if (profile?.code === userCode) {
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

  const handleDataChange = (field: keyof Profile, value: string) => {
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
        securityAnswer: profile?.securityAnswer,
        securityQuestion: profile?.securityQuestion,
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
      await instance.patch(`/profiles/${profile?.code}`, updatedProfile);

      // 수정이 완료되면 상태 업데이트
      previousContent.current = newContent;
      setProfileData(profileData);
      setIsEditing(false);
      setIsProfileEdit(false);
    } catch (error) {
      console.error('프로필을 저장하는 데 실패했습니다.', error);
      // 요청 실패시 오류 처리 추가 (예: 사용자에게 알림)
    }
  };

  const onUCClose = () => {
    setIsUCOpen(false);
  };

  const closeAndNoSave = () => {
    setIsUCOpen(false);
    setIsEditing(false);
    setIsProfileEdit(false);
    setNewContent(previousContent.current);
    setProfileData(profile);
  };

  //5분동안 미기입시 뒤로가기
  const handleInactivityWarning = () => {
    setIsDMOpen(true);
  };

  //연결 끊김 모달 (수정중인 내용 취소, 기존 내용으로 복구)
  const onDMClose = () => {
    setIsDMOpen(false);
    setIsEditing(false);
    setIsProfileEdit(false);
    setNewContent(previousContent.current);
  };

  useEffect(() => {
    let inactivityTimeout: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    if (isEditing) {
      inactivityTimeout = setTimeout(() => {
        handleInactivityWarning();
      }, 300000);

      countdownInterval = setInterval(() => {
        setTimeLeft((prev) => Math.max(prev - 1, 0)); // 1초씩 감소, 0초로 고정
      }, 1000);

      return () => {
        clearTimeout(inactivityTimeout);
        clearInterval(countdownInterval);
      };
    }

    return () => {
      setTimeLeft(300);
      clearTimeout(inactivityTimeout);
      clearInterval(countdownInterval);
    };
  }, [isEditing]);

  return (
    <div className="pc:grid pc:grid-cols-[auto_auto] pc:grid-rows-[150px_500px_400px_100px] pc:gap-x-[30px]">
      <div className="grid grid-cols-[auto_auto] grid-rows-[auto_auto]">
        <ContentHeader
          name={profile?.name || ''}
          link={`https://www.wikid.kr/wiki/${profile?.code}`}
          isEditing={isEditing}
          isInfoSnackBarOpen={isInfoSnackBarOpen}
        />

        <div className="h-[30px]">
          {!isEditing ? (
            !isEmpty && <Button onClick={handleQuizOpen}>위키 수정하기</Button>
          ) : (
            <div className="flex gap-[5px] justify-self-end">
              <Button variant="secondary" onClick={() => setIsUCOpen(true)}>
                취소
              </Button>
              <UnsavedChangesModal
                isOpen={isUCOpen}
                closeAndNoSave={closeAndNoSave}
                onClose={onUCClose}
              />
              <Button onClick={saveContent}>저장</Button>
            </div>
          )}
        </div>
        <WikiQuizModal
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          securityQuestion={profile?.securityQuestion || ''}
          userCode={profile?.code || ''}
          onQuizComplete={handleQuizSuccess}
        />
      </div>
      <div className="tamo:m-[20px]">
        <UserProfile
          data={profileData}
          isEditing={isProfileEdit}
          onDataChange={handleDataChange}
        />
      </div>

      {isEmpty && !isEditing && (
        <Blank
          onQuizSuccess={handleQuizSuccess}
          question={profile?.securityQuestion || ''}
          code={profile?.code || ''}
        />
      )}

      <div className="mt-[8px]">
        {isEditing ? (
          <>
            <div className="mb-[8px] text-right font-bold text-red-100">
              남은시간 {Math.floor(timeLeft / 60)}:{timeLeft % 60}
            </div>
            <div className="h-[600px] w-full rounded-md border p-[20px] focus:border-gray-300">
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
