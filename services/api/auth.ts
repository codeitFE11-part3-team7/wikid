import { AxiosError } from 'axios';

import instance from '../../lib/axios-client';

export const AuthAPI = {
  signup: async (data: {
    email: string;
    name: string;
    password: string;
    passwordConfirmation: string;
  }) => {
    try {
      const res = await instance.post('/auth/signUp', data);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        // 400 에러 (이미 존재하는 이메일)
        if (error.response?.status === 400) {
          throw new Error(error.response.data.message);
        }
        // 500 에러 (서버 내부 오류)
        if (error.response?.status === 500) {
          throw new Error(
            '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
          );
        }
      }
      // 기타 예상치 못한 에러
      throw new Error('회원가입 중 오류가 발생했습니다.');
    }
  },

  signin: async (data: { email: string; password: string }) => {
    try {
      const res = await instance.post('/auth/signIn', data);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        // 400 에러 (이메일 또는 비밀번호 불일치)
        if (error.response?.status === 400) {
          throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.');
        }
        // 500 에러 (서버 내부 오류)
        if (error.response?.status === 500) {
          throw new Error(
            '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
          );
        }
      }
      // 기타 예상치 못한 에러
      throw new Error('로그인 중 오류가 발생했습니다.');
    }
  },
};
