# `daily-record-web` (샘플 웹 애플리케이션)

종합사회복지관 · 주간보호시설 일일 활동 기록 및 운영일지 웹 애플리케이션 샘플 소스 디렉토리입니다.

- **상세 프로젝트 설명**: [루트 README.md](../README.md) 참조

## 주요 구성
- `index.html` · `styles.css` · `app.js`: 상단 4탭(`일일 활동 기록` · `운영일지 작성` · `통합 인쇄` · `환경 · 계정 관리`), 샘플 체험 모드(가상 데이터 및 권한 전환), 대분류 관리 모달, 공문서 1:1 A4 출력 엔진
- `firebase-config.js`: `daily-record-web-sample` Firebase 설정이 연결되어 있으며, 기본값 `mode: "sample"`로 동작하여 별도 로그인 없이 방문자마다 독립된 브라우저 로컬 저장소에서 체험할 수 있습니다. `mode: "firebase"`로 바꾸면 실시간 클라우드 모드로 전환됩니다.
- `firestore.rules` · `firebase.json`: 서버 강제 보안 규칙 및 CSP·보안 헤더 설정 (`*.md`, `*.bat`, `*.json` 등 설정 파일은 호스팅 배포에서 자동 제외)
- `sw.js` · `manifest.webmanifest` · `icon.*`: PWA 오프라인 지원 및 상대 경로 기반(`"./"`) 앱 설치 매니페스트 (GitHub Pages 서브경로 호스팅 호환)

## GitHub Pages 배포 안내
저장소 루트의 `index.html` 및 `.nojekyll`을 통해 GitHub Pages(`main` 브랜치 · `/(root)` 폴더)로 바로 배포할 수 있습니다.

## 로컬 실행 (샘플 모드 바로 보기)
```powershell
npx --yes serve . -l 5173
```
브라우저에서 `http://localhost:5173`으로 접속합니다.

## 실제 Firebase 클라우드 배포 (`daily-record-web-sample`, 선택)
`firebase-config.js`의 `mode`를 `"firebase"`로 변경한 뒤 배포합니다.
```powershell
firebase deploy --only firestore:rules,hosting --project daily-record-web-sample
```
