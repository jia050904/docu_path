# 서류길

행정 전문용어가 낯선 사용자가 일상 언어로 업무를 찾고, 준비 서류와 처리 순서를 확인하는 수업용 React MVP입니다. 실제 민원 신청이나 법률 판단을 제공하지 않습니다.

## 로컬 실행

Node.js 20 이상을 권장합니다.

```bash
npm install
npm run dev
```

프로덕션 빌드는 `npm run build`, 빌드 미리보기는 `npm run preview`로 실행합니다. 정적 결과물은 `dist/`에 생성됩니다.

## Demo 로그인

- 이메일: `demo@seoryugil.kr`
- 비밀번호: `demo1234`

이 로그인은 수업 시연용이며 실제 인증이나 안전한 운영용 세션이 아닙니다. 로그인 상태, 체크리스트, 관심 업무, 최근 검색은 브라우저 `localStorage`에 저장됩니다. 비밀번호 입력값은 저장하거나 Analytics로 보내지 않습니다.

## 행정업무 자료 교체

모든 업무 데이터와 TypeScript 구조는 `src/data/procedures.ts`, `src/types/procedure.ts`에 모여 있습니다. 담당 기관의 최신 공식 안내를 기준으로 서류, 절차, URL, 출처와 `verifiedAt`을 함께 갱신하세요. 확인하지 못한 URL은 비워 두면 UI에 `공식 링크 확인 중`이 표시됩니다. 현재 학교별 장학금/증명서 정보는 실제 학교 공지로 보완해야 합니다.

## Google Analytics 4

Google Analytics는 `G-TGSDGEZE45` 측정 ID로 기본 설정되어 있으며, `src/lib/analytics.ts`에서 Google 공식 gtag 스크립트를 로드합니다.

1. Google Analytics에서 속성을 만들고 **관리 → 데이터 스트림 → 웹**에서 `https://docupath.netlify.app/` 스트림을 확인합니다.
2. 웹 스트림의 Measurement ID가 `G-TGSDGEZE45`인지 확인합니다.
3. 다른 GA4 속성으로 변경할 때는 `src/lib/analytics.ts`의 `GA_MEASUREMENT_ID`를 수정하고 다시 빌드합니다.

페이지 전환의 `page_view`와 `search`, `view_service`, `service_complete`를 비롯한 기존 기능 이벤트를 전송합니다. 검색 원문이나 이메일·비밀번호 등 개인정보는 전송하지 않습니다. 배포 후 GA의 **보고서 → 실시간**에서 확인하고, DebugView는 브라우저용 Google Analytics Debugger 등을 켠 뒤 **관리 → DebugView**에서 확인할 수 있습니다.

## 배포

### Vercel CLI

```bash
npm install
npm run build
npx vercel
```

질문에 따라 프로젝트를 연결하고 Production 배포 시 `npx vercel --prod`를 실행합니다. 또는 Vercel 대시보드의 수동 배포 기능이 제공되는 경우 빌드 산출물 `dist`를 업로드합니다. `vercel.json`에 SPA rewrite가 포함되어 상세 경로 새로고침도 `index.html`로 연결됩니다.

### Netlify 드래그 앤 드롭

`npm run build` 후 Netlify Drop에 `dist` 폴더를 드래그하면 공개 URL을 받을 수 있습니다. `public/_redirects`와 `netlify.toml`에 SPA fallback이 설정되어 있습니다.

GA ID를 호스팅 서비스의 `VITE_GA_MEASUREMENT_ID` 환경변수로 넣은 경우 반드시 다시 빌드하고 배포하세요.

## 주요 구조

- `src/components`: 검색, 카드, 체크리스트, 내비게이션 등 재사용 UI
- `src/pages`: 홈, 로그인, 검색, 업무 상세, 저장 목록, 안내
- `src/data/procedures.ts`: 교체 가능한 행정업무 자료
- `src/lib/search.ts`: 부분검색·별칭·축약어 매칭
- `src/lib/analytics.ts`: 선택적 GA 초기화와 이벤트 전송
- `src/lib/storage.ts`: 사용자별 localStorage 키 관리
