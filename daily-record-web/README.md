# `daily-record-web` (샘플 웹 애플리케이션)

종합사회복지관 · 주간보호시설 일일 활동 기록 및 운영일지 웹 애플리케이션 샘플 소스 디렉토리입니다.

- **상세 프로젝트 설명**: [루트 README.md](../README.md) 참조

## 주요 구성
- `index.html` · `styles.css` · `app.js`: 상단 4탭(`일일 활동 기록` · `운영일지 작성` · `통합 인쇄` · `환경 · 계정 관리`), 샘플 체험 모드(가상 데이터 및 권한 전환), 대분류 관리 모달, 공문서 1:1 A4 출력 엔진
- `firebase-config.js`: 기본값 `mode: "sample"`(별도 서버 없이 로컬 체험). 실제 기관 도입 시 Firebase 웹 앱 설정값을 입력해 실시간 클라우드 모드로 전환 가능
- `firestore.rules` · `firebase.json`: 서버 강제 보안 규칙 및 CSP·보안 헤더 설정 (`*.md`, `*.bat`, `*.json` 등 설정 파일은 호스팅 배포에서 자동 제외)
- `sw.js` · `manifest.webmanifest` · `icon.*`: PWA 오프라인 지원 및 앱 설치 매니페스트

## 로컬 실행 (샘플 모드 바로 보기)
```powershell
npx --yes serve . -l 5173
```
브라우저에서 `http://localhost:5173`으로 접속합니다.

## 실제 기관 클라우드 배포 (선택)
`firebase-config.js`에 실제 Firebase 설정값을 입력하고 `.firebaserc`의 프로젝트 ID를 지정한 뒤 배포합니다.
```powershell
firebase deploy --only firestore:rules,hosting
```
