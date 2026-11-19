/**
 * 샘플 체험 모드 및 Firebase 클라우드 연동 설정
 *
 * 기본값(mode: "sample")에서는 별도 서버·로그인 없이 브라우저 로컬 스토리지 기반의
 * '샘플 체험 모드'(가상 이용인·출결·활동·운영일지 예시 데이터 포함)로 즉시 실행됩니다.
 * 실제 기관 도입 시 아래 항목에 기관 전용 Firebase 웹 앱 설정값을 입력하면 실시간 클라우드 모드로 동작합니다.
 */

const firebaseConfig = {
  mode: "sample",
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// 전역 변수로 내보내기
window.FIREBASE_CONFIG = firebaseConfig;
