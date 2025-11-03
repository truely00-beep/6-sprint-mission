module.exports = {
    env: {
        node: true, // 👈 브라우저(browser)가 아닌 Node.js 환경
        es2021: true,
    },
    parser: '@typescript-eslint/parser', // TypeScript 파서
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'prettier', // Prettier 플러그인
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended', // TypeScript 추천 규칙
        'plugin:prettier/recommended', // ⭐️ Prettier 충돌 규칙 비활성화 (가장 마지막)
    ],
    rules: {
        // ⭐️ Prettier 규칙을 ESLint 오류로 표시
        'prettier/prettier': 'error',

        // 기타 필요한 규칙들...
        '@typescript-eslint/no-unused-vars': 'warn', // 사용하지 않는 변수 경고
        '@typescript-eslint/no-explicit-any': 'off', // (선택) any 타입 허용
    },
    ignorePatterns: ['.eslintrc.cjs', 'node_modules/'], // ESLint 무시 패턴
};