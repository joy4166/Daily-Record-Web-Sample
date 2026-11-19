/**
 * 샘플 체험 모드 및 Firebase 프로젝트 연동 설정 (daily-record-web-sample)
 *
 * 기본값(mode: "sample")에서는 별도 로그인 없이 브라우저 로컬 스토리지 기반의
 * '샘플 체험 모드'(가상 이용인·출결·활동·운영일지 예시 데이터 포함)로 즉시 실행되어,
 * 방문자마다 데이터가 서로 섞이지 않고 독립적으로 체험할 수 있습니다.
 * 실제 클라우드 인증·DB 모드로 전환하려면 mode를 "firebase"로 변경하세요.
 */

const firebaseConfig = {
  mode: "sample",
  apiKey: "AIzaSyDkaDqhORb2JpoUufPPitQJFez1S_pbIhw",
  authDomain: "daily-record-web-sample.firebaseapp.com",
  projectId: "daily-record-web-sample",
  storageBucket: "daily-record-web-sample.firebasestorage.app",
  messagingSenderId: "951677822365",
  appId: "1:951677822365:web:2b27f6e7678dba8de5bb74"
};

// 전역 변수로 내보내기
window.FIREBASE_CONFIG = firebaseConfig;
