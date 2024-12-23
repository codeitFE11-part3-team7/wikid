module.exports = {
  root: true, // 최상위 설정임을 명시
  parser: '@typescript-eslint/parser', // TypeScript 파서
  parserOptions: {
    project: './tsconfig.json', // TypeScript 설정 파일 경로
    tsconfigRootDir: __dirname, // tsconfig의 루트 경로
    ecmaVersion: 'latest', // 최신 ECMAScript 문법 허용
    sourceType: 'module', // 모듈 사용
    ecmaFeatures: {
      jsx: true, // JSX 지원
    },
  },
  env: {
    browser: true, // 브라우저 환경 지원
    es2021: true, // ECMAScript 2021 지원
    node: true, // Node.js 환경 지원
  },
  plugins: [
    'prettier',
    'react',
    '@typescript-eslint',
    'import',
    'simple-import-sort',
    'tailwindcss',
  ],
  extends: [
    'eslint:recommended', // ESLint 기본 추천 규칙
    'plugin:jsx-a11y/recommended', // 접근성 권장 규칙
    'plugin:react/recommended', // React 추천 규칙
    'plugin:@typescript-eslint/recommended', // TypeScript 추천 규칙
    'plugin:prettier/recommended', // Prettier 추천 규칙
    'next/core-web-vitals', // Next.js 권장 규칙
    'plugin:tailwindcss/recommended', // TailwindCSS 권장 규칙 추가
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // 타입 체크 권장 규칙
  ],
  rules: {
    // Prettier 규칙
    'prettier/prettier': ['error', { endOfLine: 'auto' }],

    // React 관련 규칙
    'react/react-in-jsx-scope': 'off', // React 17+에서는 불필요한 import 제거
    'react/jsx-uses-react': 'off',
    'react/prop-types': 'off', // PropTypes 사용하지 않음

    // TypeScript 관련 규칙
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_', // _로 시작하는 변수는 무시
        varsIgnorePattern: '^_', // _로 시작하는 변수는 무시
      },
    ], // 사용하지 않는 변수 에러 처리
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 반환 타입 강제 비활성화

    'no-undef': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'error',
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false, // void 반환을 기대하지 않는 상황에서 경고 비활성화
      },
    ],

    // Import 관련 규칙
    'import/newline-after-import': 'error', // import 문 이후 빈 줄 강제
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          ['^node:'], // Node.js 기본 모듈
          ['^@?\\w'], // 외부 패키지
          ['^@/'], // 프로젝트 절대 경로 import
          ['^\\.'], // 상대 경로 import
          ['^.+\\.s?css$'], // 스타일 파일 import
        ],
      },
    ],
    'simple-import-sort/exports': 'error', // export 정렬
  },
  settings: {
    react: {
      version: 'detect', // React 버전 자동 감지
    },
    'import/resolver': {
      node: {
        paths: ['.'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  ignorePatterns: ['node_modules', '.next', 'dist'], // 린트 제외 경로
};
