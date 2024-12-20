'use client';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// 토큰 인증이 필요 없는 api 경로
// GET /profiles
// GET /profiles/{code}
// GET /profiles/{code}/ping
// GET /articles/{articleId}/cpmments
// GET /articles
// POST /auth/signUp
// POST /auth/signIn
// POST /auth/refresh-token
const PUBLIC_ENDPOINTS = {
  post: ['/auth/signUp', '/auth/signIn', '/auth/refresh-token'],
  get: [
    '/profiles',
    '/profiles/',
    '/articles',
    '/articles/',
    '/articles/*/comments', // 와일드카드 패턴 사용
  ],
};

/**
 * 인증 처리가 포함된 커스텀 axios 인스턴스
 * 클라이언트 컴포넌트에서만 사용
 * 서버 컴포넌트에서는 API 라우트 활용
 * 주요 기능:
 * - 보호된 엔드포인트에 자동으로 인증 토큰 추가
 * - 공개 엔드포인트(로그인, 회원가입 등)는 토큰 추가 제외
 * - 401 에러 발생 시 토큰 갱신 처리
 * - 토큰 저장소 관리 및 정리
 * - 인증 실패 시 로그인 페이지로 리다이렉트
 */

// axios 인스턴스 생성
export const instance = axios.create({
  baseURL: baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// 주어진 url이 공개 엔드포인트인지 확인
const isPublicEndPoint = (
  url: string | undefined,
  method: string | undefined
): boolean => {
  if (!url || !method) return false;

  const upperMethod = method.toUpperCase();

  // POST 요청인 경우 auth 관련 엔드포인트만 체크
  if (upperMethod === 'POST') {
    return PUBLIC_ENDPOINTS.post.includes(url);
  }

  // GET 요청인 경우
  if (upperMethod === 'GET') {
    // /profiles 또는 /articles로 시작하는 모든 GET 요청은 public
    return url.startsWith('/profiles') || url.startsWith('/articles');
  }

  return false; // POST, GET 이외의 요청은 모두 인증 필요
};

// 토큰 갱신 함수
// 새로운 액세스 토큰을 반환하거나 갱신 실패 시 null 반환환
const refreshToken = async (): Promise<string | null> => {
  try {
    // 가지고 있는 리프레시 토큰으로 액세스 토큰 갱신
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await axios.post(`${baseURL}/auth/refresh-token`, {
      refreshToken,
    });
    const newAccessToken = response.data.accessToken;
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // 리프레시 토큰도 만료된 경우
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
    window.location.href = '/login'; // 로그인 페이지로 리다이렉트
    return null;
  }
};

if (typeof window !== 'undefined') {
  // Request 인터셉터
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (isPublicEndPoint(config.url, config.method)) return config; // 공개 엔드포인트는 토큰 추가하지 않음

      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers = config.headers || {}; // headers 초기화
        config.headers.set('Authorization', `Bearer ${token}`);
      }
      return config;
    },
    (_error: AxiosError) => {
      return Promise.reject(_error);
    }
  );

  // Response 인터셉터
  // 토큰 만료를 감지하고 토큰 갱신 후 요청 재시도(_retry 플래그 사용)
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // 공개 엔드포인트는 토큰 갱신 처리하지 않음
      if (isPublicEndPoint(originalRequest.url, originalRequest.method)) {
        return Promise.reject(error);
      }

      // 토큰 만료 에러 (401) && 아직 재시도하지 않은 요청
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        const newToken = await refreshToken(); // 토큰 갱신 함수로 새 토큰 발급
        if (newToken) {
          // 새로운 토큰으로 원래 요청 재시도
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return instance(originalRequest);
        }
      }

      return Promise.reject(error);
    }
  );
}

export default instance;
