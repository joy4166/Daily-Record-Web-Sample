/* ============================================================================
   종합사회복지관 · 주간보호시설 — 일일 활동 기록 및 운영일지 시스템 (샘플)
   Sample Demo Mode & Firebase Auth + Server-Enforced Firestore Security Rules,
   Cross-Tab Session Sync, Delegated Events, Schema-Validated Backup & A4 Print
   ============================================================================ */

'use strict';

// ----------------------------------------------------------------------------
// 1. DEFAULT MASTER DATA (Zero-PII 16 Blank Slots + Official 46 Programs)
// ----------------------------------------------------------------------------
const DEFAULT_MEMBERS = Array.from({ length: 16 }, (_, idx) => ({
  id: `m${idx + 1}`,
  no: idx + 1,
  name: '',
  age: '',
  status: 'WAITING',
  joinDate: '',
  waitingDate: '',
  leaveDate: ''
}));

const DEFAULT_CATEGORIES = [
  '1. 의료재활',
  '2. 사회심리재활',
  '3. 교육재활',
  '4. 사회재활',
  '5. 일상생활지원',
  '6. 지역사회자원개발',
  '7. 홍보',
  '8. 연구개발'
];

const DEFAULT_PROGRAMS = [
  // 1. 의료재활
  { id: 'p_med_1', category: '1. 의료재활', name: '건강체크', shortLabel: '건강체크', target: 288, isDaily: true },
  { id: 'p_med_2', category: '1. 의료재활', name: '건강체조', shortLabel: '건강체조', target: 600, isDaily: true },
  { id: 'p_med_3', category: '1. 의료재활', name: '재활체조', shortLabel: '재활체조', target: 720, isDaily: false },
  { id: 'p_med_4', category: '1. 의료재활', name: '건강강좌', shortLabel: '건강강좌', target: 40, isDaily: false },

  // 2. 사회심리재활
  { id: 'p_psy_1', category: '2. 사회심리재활', name: '상담', shortLabel: '상담', target: 90, isDaily: false },
  { id: 'p_psy_2', category: '2. 사회심리재활', name: '미술교실', shortLabel: '미술교실', target: 240, isDaily: false },
  { id: 'p_psy_3', category: '2. 사회심리재활', name: '생일잔치', shortLabel: '생일잔치', target: 12, isDaily: false },
  { id: 'p_psy_4', category: '2. 사회심리재활', name: '원예치유', shortLabel: '원예치유', target: 110, isDaily: false },

  // 3. 교육재활
  { id: 'p_edu_1', category: '3. 교육재활', name: '문해(한글)교실', shortLabel: '문해(한글)<br>교실', target: 480, isDaily: false },
  { id: 'p_edu_2', category: '3. 교육재활', name: '노래교실', shortLabel: '노래교실', target: 480, isDaily: false },
  { id: 'p_edu_3', category: '3. 교육재활', name: '인지학습', shortLabel: '인지학습', target: 480, isDaily: false },
  { id: 'p_edu_4', category: '3. 교육재활', name: '사회적응교육', shortLabel: '사회적응<br>교육', target: 60, isDaily: false },
  { id: 'p_edu_5', category: '3. 교육재활', name: '안전교육', shortLabel: '안전교육', target: 80, isDaily: false },
  { id: 'p_edu_6', category: '3. 교육재활', name: '인권교육', shortLabel: '인권교육', target: 24, isDaily: false },

  // 4. 사회재활 (상단 10 + 하단 5)
  { id: 'p_soc_1', category: '4. 사회재활', name: '스마트(정보화)교실', shortLabel: '스마트<br>(정보화)<br>교실', target: 240, isDaily: false },
  { id: 'p_soc_2', category: '4. 사회재활', name: '슐런교실', shortLabel: '슐런교실', target: 300, isDaily: false },
  { id: 'p_soc_3', category: '4. 사회재활', name: '한궁교실', shortLabel: '한궁교실', target: 480, isDaily: false },
  { id: 'p_soc_4', category: '4. 사회재활', name: '자조모임', shortLabel: '자조모임', target: 240, isDaily: false },
  { id: 'p_soc_5', category: '4. 사회재활', name: '문화체험활동', shortLabel: '문화체험<br>활동', target: 96, isDaily: false },
  { id: 'p_soc_6', category: '4. 사회재활', name: '캘리그라피', shortLabel: '캘리그라피', target: 240, isDaily: false },
  { id: 'p_soc_7', category: '4. 사회재활', name: '종이접기', shortLabel: '종이접기', target: 240, isDaily: false },
  { id: 'p_soc_8', category: '4. 사회재활', name: '건강댄스', shortLabel: '건강댄스', target: 120, isDaily: false },
  { id: 'p_soc_9', category: '4. 사회재활', name: '다도교실', shortLabel: '다도교실', target: 120, isDaily: false },
  { id: 'p_soc_10', category: '4. 사회재활', name: '나들이', shortLabel: '나들이', target: 36, isDaily: false },
  { id: 'p_soc_11', category: '4. 사회재활', name: '명절행사', shortLabel: '명절행사', target: 40, isDaily: false },
  { id: 'p_soc_12', category: '4. 사회재활', name: '여가소통모임', shortLabel: '여가소통<br>모임', target: 24, isDaily: false },
  { id: 'p_soc_13', category: '4. 사회재활', name: '절기·기념행사', shortLabel: '절기·기념<br>행사', target: 12, isDaily: false },
  { id: 'p_soc_14', category: '4. 사회재활', name: '요리활동', shortLabel: '요리활동', target: 144, isDaily: false },
  { id: 'p_soc_15', category: '4. 사회재활', name: '공예활동', shortLabel: '공예활동', target: 144, isDaily: false },

  // 5. 일상생활지원
  { id: 'p_life_1', category: '5. 일상생활지원', name: '급식', shortLabel: '급식', target: 2760, isDaily: true },
  { id: 'p_life_2', category: '5. 일상생활지원', name: '간식', shortLabel: '간식', target: 144, isDaily: true },
  { id: 'p_life_3', category: '5. 일상생활지원', name: '생활(물품)지원', shortLabel: '생활(물품)<br>지원', target: 576, isDaily: false },
  { id: 'p_life_4', category: '5. 일상생활지원', name: '이미용서비스', shortLabel: '이미용<br>서비스', target: 80, isDaily: false },
  { id: 'p_life_5', category: '5. 일상생활지원', name: '일상돌봄지원', shortLabel: '일상돌봄<br>지원', target: 0, isDaily: false },
  { id: 'p_life_6', category: '5. 일상생활지원', name: '이동지원', shortLabel: '이동지원', target: 0, isDaily: false },
  { id: 'p_life_7', category: '5. 일상생활지원', name: '경조사/병문안/가정방문', shortLabel: '경조사/<br>병문안/<br>가정방문', target: 0, isDaily: false },

  // 6. 지역사회자원개발
  { id: 'p_com_1', category: '6. 지역사회자원개발', name: '지역사회자원연계', shortLabel: '지역사회<br>자원연계', target: 96, isDaily: false },
  { id: 'p_com_2', category: '6. 지역사회자원개발', name: '송년행사', shortLabel: '송년행사', target: 30, isDaily: false },
  { id: 'p_com_3', category: '6. 지역사회자원개발', name: '봉사·후원자 (활동)', shortLabel: '활동', target: 0, isDaily: false },
  { id: 'p_com_4', category: '6. 지역사회자원개발', name: '봉사·후원자 (모집)', shortLabel: '모집', target: 0, isDaily: false },
  { id: 'p_com_5', category: '6. 지역사회자원개발', name: '봉사·후원자 (관리)', shortLabel: '관리', target: 90, isDaily: false },

  // 7. 홍보
  { id: 'p_pr_1', category: '7. 홍보', name: '소식지', shortLabel: '소식지', target: 400, isDaily: false },
  { id: 'p_pr_2', category: '7. 홍보', name: '대외홍보', shortLabel: '대외홍보', target: 0, isDaily: false },

  // 8. 연구개발
  { id: 'p_rd_1', category: '8. 연구개발', name: '교육/연수', shortLabel: '교육/연수', target: 0, isDaily: false },
  { id: 'p_rd_2', category: '8. 연구개발', name: '회의', shortLabel: '회의', target: 0, isDaily: false },
  { id: 'p_rd_3', category: '8. 연구개발', name: '실습지도', shortLabel: '실습지도', target: 0, isDaily: false }
];

const FIXED_DOC_IDS = new Set(DEFAULT_PROGRAMS.map(p => p.id));
const LEGACY_PROGRAM_NAME_MAP = {
  '봉사후원_활동': '봉사·후원자 (활동)',
  '봉사후원_모집': '봉사·후원자 (모집)',
  '봉사후원_관리': '봉사·후원자 (관리)',
  '자원봉사/후원자': '봉사·후원자 (활동)',
  '경조사/병원안내/가정방문': '경조사/병문안/가정방문'
};
const VALID_MEMBER_STATUSES = new Set(['ACTIVE', 'WAITING', 'DISCHARGED']);
const VALID_ATT_SYMBOLS = new Set(['', '○', '√', 'X']);
const SAFE_ID_REGEX = /^[A-Za-z0-9_-]{1,40}$/;
const DATE_YMD_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const UNSAFE_JSON_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

const MAX_BACKUP_BYTES = 5 * 1024 * 1024;   // 5 MB max JSON upload
const BATCH_CHUNK_SIZE = 15;                // Stay safely below per-batch rule limits

const STORAGE_KEYS = {
  prefix: 'dw_sample_',
  demoInitialized: 'dw_sample_demo_init_v1',
  demoTeachers: 'dw_sample_demo_teachers_v1',
  demoInviteStatus: 'dw_sample_demo_invite_v1',
  demoGateFlag: 'dw_sample_gate_v1',
  sessionMeta: 'dw_sample_session_meta_v1',
  authSyncPing: 'dw_sample_auth_sync_ping_v1',
  members: 'dw_sample_members_v1',
  archivedMembers: 'dw_sample_archivedMembers_v1',
  categories: 'dw_sample_categories_v1',
  programs: 'dw_sample_programs_v1',
  attendanceMap: 'dw_sample_attendanceMap_v1',
  attendanceMeta: 'dw_sample_attendanceMeta_v1',
  activityMap: 'dw_sample_activityMap_v1',
  showPrintDate: 'dw_sample_showPrintDate_v1',
  printTargetDoc: 'dw_sample_printTargetDoc_v1',
  journalWriters: 'dw_sample_journalWriters_v1',
  journalWritersConfigured: 'dw_sample_journalWritersCfg_v1',
  journalMap: 'dw_sample_journalMap_v1'
};

// ----------------------------------------------------------------------------
// 2. STATE STORE
// ----------------------------------------------------------------------------
const state = {
  isDemoMode: false,
  currentDate: '',
  currentTab: 1,
  currentMgmtSubTab: 'members',
  memberFilter: 'ALL',
  isBulkMemberMode: false,
  isBulkDirty: false,
  programCategoryFilter: 'ALL',
  programSearchQuery: '',
  showPrintDate: true,
  printTargetDoc: 'daily',

  members: JSON.parse(JSON.stringify(DEFAULT_MEMBERS)),
  archivedMembers: [],
  categories: DEFAULT_CATEGORIES.slice(),
  programs: JSON.parse(JSON.stringify(DEFAULT_PROGRAMS)),

  // Saved/committed records keyed by YYYY-MM-DD
  attendanceMap: {},
  attendanceMeta: {},
  activityMap: {},

  // Operations journal state
  journalWriters: [],
  journalWritersConfigured: false,
  journalMap: {},
  draftJournal: {},
  dirtyJournalDates: new Set(),
  lastJournalSaveErrorDate: '',

  // In-memory unedited or locally modified draft keyed by YYYY-MM-DD until saved
  draftAttendance: {},
  draftActivity: {},
  dirtyDates: new Set(),
  lastSaveErrorDate: '',

  // Authenticated state (in-memory only; server-verified via Firebase Auth + Firestore)
  teachersMap: {},
  inviteMetaStatus: '',
  currentTeacher: null,
  rememberCurrentSession: false,

  // Cloud state
  isFirebaseReady: false,
  isCloudHydrated: false,
  firebaseAuth: null,
  firestoreDb: null,
  authUnsubscriber: null,
  authScopedUnsubscribers: [],
  workspaceUnsubscribers: [],
  authBroadcastChannel: null
};

// ----------------------------------------------------------------------------
// 3. KST DATE, CRYPTO, VALIDATION, ESCAPE & TOAST UTILITIES
// ----------------------------------------------------------------------------
function getTodayKST() {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());
  } catch (_) {
    const now = new Date();
    const kst = new Date(now.getTime() + (now.getTimezoneOffset() + 540) * 60000);
    return formatLocalYMD(kst);
  }
}

function formatLocalYMD(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function shiftDateYMD(ymd, deltaDays) {
  const parts = String(ymd || getTodayKST()).split('-').map(Number);
  const dt = new Date(parts[0], parts[1] - 1, parts[2] + deltaDays);
  return formatLocalYMD(dt);
}

function isValidCalendarYMD(ymd) {
  if (typeof ymd !== 'string' || !DATE_YMD_REGEX.test(ymd)) return false;
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && (dt.getUTCMonth() + 1) === m && dt.getUTCDate() === d;
}

function formatKoreanWeekday(ymd) {
  const parts = String(ymd || '').split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return '';
  const dt = new Date(parts[0], parts[1] - 1, parts[2]);
  const names = ['일', '월', '화', '수', '목', '금', '토'];
  return `(${names[dt.getDay()]})`;
}

function formatKoreanFullDate(ymd) {
  const parts = String(ymd || '').split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return ymd || '';
  return `${parts[0]}년 ${parts[1]}월 ${parts[2]}일 ${formatKoreanWeekday(ymd)}`;
}

function formatTimeKST(dateObj = new Date()) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Seoul',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(dateObj);
  } catch (_) {
    const kst = new Date(dateObj.getTime() + (dateObj.getTimezoneOffset() + 540) * 60000);
    const h = String(kst.getHours()).padStart(2, '0');
    const m = String(kst.getMinutes()).padStart(2, '0');
    const s = String(kst.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatSafeProgramLabel(prog, fallbackText = '') {
  const raw = prog ? (prog.shortLabel || prog.name || fallbackText) : fallbackText;
  return String(raw)
    .split(/<br\s*\/?>/i)
    .map(part => escapeHtml(part))
    .join('<br>');
}

function randomHex(byteCount = 6) {
  if (window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint8Array(byteCount);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(16).slice(2, 2 + byteCount * 2).padEnd(byteCount * 2, '0');
}

function makeId(prefix) {
  const cleanPrefix = String(prefix || 'id').replace(/[^A-Za-z0-9_-]/g, '');
  return `${cleanPrefix}_${Date.now().toString(36)}_${randomHex(5)}`;
}

function showToast(message, variant = 'info', action = null) {
  const region = document.getElementById('toastRegion');
  if (!region) return;
  while (region.children.length >= 3) {
    region.firstElementChild.remove();
  }
  const item = document.createElement('div');
  item.className = `toast-item${variant === 'success' ? ' is-success' : variant === 'error' ? ' is-error' : ''}`;

  const msgSpan = document.createElement('span');
  msgSpan.textContent = message;
  item.appendChild(msgSpan);

  let timer = null;
  const removeToast = () => {
    if (timer) clearTimeout(timer);
    item.remove();
  };

  if (action && action.label && typeof action.onClick === 'function') {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toast-action-btn';
    btn.textContent = action.label;
    btn.addEventListener('click', () => {
      removeToast();
      action.onClick();
    });
    item.appendChild(btn);
  }

  region.appendChild(item);
  const baseMs = action ? 8000 : (variant === 'error' ? 6500 : 3000);
  timer = setTimeout(removeToast, baseMs);
  const pauseTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  const resumeTimer = () => {
    if (!timer && item.isConnected) {
      timer = setTimeout(removeToast, action ? 4000 : 2500);
    }
  };
  item.addEventListener('mouseenter', pauseTimer);
  item.addEventListener('focusin', pauseTimer);
  item.addEventListener('mouseleave', resumeTimer);
  item.addEventListener('focusout', resumeTimer);
}

let activeConfirmResolver = null;
let lastDialogTriggerEl = null;

function rememberDialogTrigger(dlg) {
  if (!dlg || dlg.open) return;
  const active = document.activeElement;
  if (active instanceof HTMLElement && !dlg.contains(active)) {
    lastDialogTriggerEl = active;
  }
}

function restoreDialogFocus() {
  if (document.querySelector('dialog[open]')) return;
  const target = lastDialogTriggerEl;
  lastDialogTriggerEl = null;
  if (target && target.isConnected && target.offsetParent !== null) {
    target.focus();
  }
}

function askConfirmDialog({
  title = '확인',
  message = '',
  confirmLabel = '확인',
  altLabel = '',
  cancelLabel = '취소',
  danger = false,
  hideCancel = false
} = {}) {
  const dlg = document.getElementById('confirmDialog');
  if (!dlg || typeof dlg.showModal !== 'function') {
    return Promise.resolve(hideCancel ? (alert(message), true) : confirm(message));
  }

  rememberDialogTrigger(dlg);

  if (activeConfirmResolver) {
    activeConfirmResolver(false);
    activeConfirmResolver = null;
  }

  const titleEl = document.getElementById('confirmDlgTitle');
  const msgEl = document.getElementById('confirmDlgMessage');
  const okBtn = document.getElementById('confirmDlgOkBtn');
  const altBtn = document.getElementById('confirmDlgAltBtn');
  const cancelBtn = document.getElementById('confirmDlgCancelBtn');

  if (titleEl) {
    titleEl.textContent = title;
    titleEl.classList.toggle('danger-title', Boolean(danger));
  }
  if (msgEl) msgEl.textContent = message;
  if (okBtn) {
    okBtn.textContent = confirmLabel;
    okBtn.classList.toggle('btn-danger', Boolean(danger));
    okBtn.classList.toggle('btn-primary', !danger);
  }
  if (altBtn) {
    altBtn.textContent = altLabel;
    altBtn.classList.toggle('hidden', !altLabel);
  }
  if (cancelBtn) {
    cancelBtn.textContent = cancelLabel;
    cancelBtn.classList.toggle('hidden', Boolean(hideCancel));
  }

  return new Promise(resolve => {
    activeConfirmResolver = resolve;
    if (dlg.open) dlg.close();
    dlg.showModal();
    setTimeout(() => okBtn?.focus(), 0);
  });
}

function settleConfirmDialog(result) {
  const dlg = document.getElementById('confirmDialog');
  if (dlg && dlg.open) dlg.close();
  if (activeConfirmResolver) {
    const fn = activeConfirmResolver;
    activeConfirmResolver = null;
    fn(result === 'alt' ? 'alt' : Boolean(result));
  }
  restoreDialogFocus();
}

function formatFriendlyError(err, fallbackMsg = '요청을 처리하는 중 문제가 발생했습니다.') {
  const code = err?.code || '';
  if (code === 'permission-denied') {
    return '실행 권한이 없거나 세션이 만료되었습니다. 관리자 권한 또는 로그인 상태를 확인해 주세요.';
  }
  if (code === 'unavailable' || code === 'deadline-exceeded' || code === 'auth/network-request-failed') {
    return '클라우드 서버와 연결이 원활하지 않습니다. 인터넷 연결을 확인한 뒤 다시 시도해 주세요.';
  }
  if (code === 'not-found') {
    return '대상 기록을 찾을 수 없습니다. 새로고침 후 다시 확인해 주세요.';
  }
  if (err && typeof err.message === 'string' && /[가-힣]/.test(err.message)) {
    return err.message;
  }
  return fallbackMsg;
}

function isCurrentAdmin() {
  return Boolean(state.currentTeacher && state.currentTeacher.role === 'admin');
}

// Pure UTF-8 SHA-256 for domain-separated slot keys and invite proof
function sha256Hex(message) {
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  const bytes = new TextEncoder().encode(String(message));
  const bitLen = bytes.length * 8;
  const paddedLen = Math.ceil((bytes.length + 9) / 64) * 64;
  const padded = new Uint8Array(paddedLen);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLen - 8, Math.floor(bitLen / 0x100000000), false);
  view.setUint32(paddedLen - 4, bitLen >>> 0, false);

  const H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  const W = new Uint32Array(64);
  const rotr = (n, x) => (x >>> n) | (x << (32 - n));

  for (let i = 0; i < paddedLen; i += 64) {
    for (let t = 0; t < 16; t++) W[t] = view.getUint32(i + t * 4, false);
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(7, W[t - 15]) ^ rotr(18, W[t - 15]) ^ (W[t - 15] >>> 3);
      const s1 = rotr(17, W[t - 2]) ^ rotr(19, W[t - 2]) ^ (W[t - 2] >>> 10);
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let t = 0; t < 64; t++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ ((~e) & g);
      const temp1 = (h + S1 + ch + K[t] + W[t]) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + temp1) >>> 0;
      d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
    }
    H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
  }
  return H.map(v => v.toString(16).padStart(8, '0')).join('');
}

function normalizeTeacherName(name) {
  return String(name || '').trim().replace(/\s+/g, '').toLowerCase();
}

function hashLoginSlotKey(name) {
  return sha256Hex(`dw-sample-login-slot-v1:${normalizeTeacherName(name)}`);
}

function hashInviteProof(invite) {
  return sha256Hex(`dw-sample-invite-proof-v2:${String(invite || '').trim()}`);
}

function buildSafeInviteStatus(invite) {
  const len = String(invite || '').trim().length;
  return len > 0 ? `설정됨 (보안 보호 · ${len}자)` : '설정됨 (보안 보호)';
}

function authEmailFromId(authId) {
  const safe = String(authId || '').replace(/[^A-Za-z0-9_-]/g, '');
  const proj = String(window.FIREBASE_CONFIG?.projectId || 'welfare-sample').replace(/[^A-Za-z0-9-]/g, '') || 'welfare-sample';
  return `${safe}@auth.${proj}.web.app`;
}

// ----------------------------------------------------------------------------
// 4. SCHEMA NORMALIZERS & SHARED-PC STORAGE HYGIENE
// ----------------------------------------------------------------------------
function sanitizeSafeId(val, prefix) {
  const s = String(val ?? '').trim();
  return SAFE_ID_REGEX.test(s) ? s : makeId(prefix);
}

function sanitizeSafeDateStr(val) {
  const s = String(val ?? '').trim();
  return isValidCalendarYMD(s) ? s : '';
}

function normalizeMemberRecord(raw, fallbackNo = 1) {
  const m = (raw && typeof raw === 'object' && !Array.isArray(raw)) ? raw : {};
  const parsedNo = Number.parseInt(m.no, 10);
  const no = Number.isInteger(parsedNo) && parsedNo >= 1 && parsedNo <= 64
    ? parsedNo
    : fallbackNo;
  const parsedAge = Number.parseInt(m.age, 10);
  const age = Number.isInteger(parsedAge) && parsedAge >= 1 && parsedAge <= 120
    ? parsedAge
    : '';
  const status = VALID_MEMBER_STATUSES.has(m.status) ? m.status : 'WAITING';

  return {
    id: sanitizeSafeId(m.id, 'm'),
    no,
    name: String(m.name ?? '').trim().slice(0, 20),
    age,
    status,
    joinDate: sanitizeSafeDateStr(m.joinDate),
    waitingDate: sanitizeSafeDateStr(m.waitingDate),
    leaveDate: sanitizeSafeDateStr(m.leaveDate)
  };
}

function normalizeMemberList(list, fillSlots = false) {
  const src = Array.isArray(list) ? list.slice(0, 64) : [];
  const normalized = src.map((m, idx) => normalizeMemberRecord(m, idx + 1));
  if (!fillSlots) return normalized;
  while (normalized.length < 16) {
    const slotNo = normalized.length + 1;
    normalized.push(normalizeMemberRecord({ id: `m${slotNo}`, no: slotNo, status: 'WAITING' }, slotNo));
  }
  return normalized;
}

function normalizeCategoryList(rawCats, rawPrograms = []) {
  const result = DEFAULT_CATEGORIES.slice();
  const seen = new Set(result);
  const appendUnique = (val) => {
    const clean = String(val ?? '').trim().slice(0, 30);
    if (!clean || seen.has(clean) || result.length >= 30) return;
    seen.add(clean);
    result.push(clean);
  };
  if (Array.isArray(rawCats)) {
    rawCats.forEach(appendUnique);
  }
  if (Array.isArray(rawPrograms)) {
    rawPrograms.forEach(p => {
      if (p && typeof p === 'object' && p.category) appendUnique(p.category);
    });
  }
  return result;
}

function migrateProgramList(list, validCategories = state.categories) {
  if (!Array.isArray(list)) return JSON.parse(JSON.stringify(DEFAULT_PROGRAMS));
  const cats = Array.isArray(validCategories) && validCategories.length > 0 ? validCategories : DEFAULT_CATEGORIES;
  return list.slice(0, 200).map(raw => {
    const p = (raw && typeof raw === 'object' && !Array.isArray(raw)) ? raw : {};
    const safeId = sanitizeSafeId(p.id, 'prog');
    const def = DEFAULT_PROGRAMS.find(d => d.id === safeId);
    let name = String(p.name ?? (def ? def.name : '')).trim().slice(0, 40);
    let shortLabel = String(p.shortLabel ?? (def ? def.shortLabel : name)).slice(0, 60);
    if (LEGACY_PROGRAM_NAME_MAP[name]) {
      name = LEGACY_PROGRAM_NAME_MAP[name];
      if (def && def.shortLabel) shortLabel = def.shortLabel;
    }
    if (safeId === 'p_life_7' && name === '경조사/병문안/가정방문') {
      shortLabel = '경조사/<br>병문안/<br>가정방문';
    }
    const parsedTarget = Number.parseInt(p.target, 10);
    const rawCat = String(p.category ?? '').trim().slice(0, 30);
    return {
      id: safeId,
      category: cats.includes(rawCat) ? rawCat : (def ? def.category : DEFAULT_CATEGORIES[0]),
      name,
      shortLabel,
      target: Number.isInteger(parsedTarget) && parsedTarget > 0 ? parsedTarget : 0,
      isDaily: Boolean(p.isDaily)
    };
  }).filter(p => p.name.length > 0);
}

function migrateActivityRows(rows, programCatalog = state.programs, validCategories = state.categories) {
  if (!Array.isArray(rows)) return [];
  const catalog = Array.isArray(programCatalog) ? programCatalog : state.programs;
  const cats = Array.isArray(validCategories) && validCategories.length > 0 ? validCategories : DEFAULT_CATEGORIES;
  return rows.slice(0, 100).map(raw => {
    const r = (raw && typeof raw === 'object' && !Array.isArray(raw)) ? raw : {};
    let programId = r.programId && SAFE_ID_REGEX.test(String(r.programId)) ? String(r.programId) : '';
    const rawCat = String(r.category ?? '').trim().slice(0, 30);
    const category = cats.includes(rawCat) ? rawCat : rawCat;
    const rawName = String(r.name ?? '').trim().slice(0, 40);
    const name = LEGACY_PROGRAM_NAME_MAP[rawName] || rawName;
    if (!programId && name) {
      const found = catalog.find(p => p.name === name && (!category || p.category === category));
      if (found) programId = found.id;
    }
    const parsedCount = Number.parseInt(r.count, 10);
    const parsedMembers = Number.parseInt(r.members, 10);
    return {
      id: sanitizeSafeId(r.id, 'act'),
      programId,
      category,
      name,
      count: Number.isInteger(parsedCount) && parsedCount >= 0 ? parsedCount : 0,
      members: Number.isInteger(parsedMembers) && parsedMembers >= 0 ? parsedMembers : 0,
      autoMembers: typeof r.autoMembers === 'boolean'
        ? r.autoMembers
        : Boolean(programId && catalog.find(p => p.id === programId)?.isDaily)
    };
  });
}

function normalizeJournalWritersList(list) {
  if (!Array.isArray(list)) return [];
  return list.slice(0, 30).map(raw => {
    const w = (raw && typeof raw === 'object' && !Array.isArray(raw)) ? raw : {};
    const name = String(w.name || '').trim().slice(0, 20);
    if (!name) return null;
    const uid = w.uid && SAFE_ID_REGEX.test(String(w.uid)) ? String(w.uid) : '';
    return {
      id: sanitizeSafeId(w.id, 'jw'),
      uid,
      name,
      active: w.active !== false
    };
  }).filter(Boolean);
}

function normalizeJournalDoc(raw, date) {
  const j = (raw && typeof raw === 'object' && !Array.isArray(raw)) ? raw : {};
  const rawTasks = Array.isArray(j.staffTasks) ? j.staffTasks.slice(0, 20) : [];
  const staffTasks = rawTasks.map(item => {
    const t = (item && typeof item === 'object' && !Array.isArray(item)) ? item : {};
    return {
      id: sanitizeSafeId(t.id, 'jw'),
      name: String(t.name || '').trim().slice(0, 20),
      content: String(t.content || '').slice(0, 3000)
    };
  });
  const parsedVms = Number.parseInt(j.vmsCount, 10);
  const vmsCount = j.vmsCount === '' || j.vmsCount === null || j.vmsCount === undefined
    ? ''
    : (Number.isInteger(parsedVms) && parsedVms >= 0 ? String(Math.min(999, parsedVms)) : '');

  return {
    date: isValidCalendarYMD(date) ? date : String(j.date || ''),
    safetyCheck: Boolean(j.safetyCheck),
    envCheck: Boolean(j.envCheck),
    absentees: String(j.absentees || '').slice(0, 120),
    absentReason: String(j.absentReason || '').slice(0, 200),
    amPrograms: String(j.amPrograms || '').slice(0, 160),
    amStaff: String(j.amStaff || '').slice(0, 120),
    amDetail: String(j.amDetail || '').slice(0, 1500),
    pmPrograms: String(j.pmPrograms || '').slice(0, 160),
    pmStaff: String(j.pmStaff || '').slice(0, 120),
    pmDetail: String(j.pmDetail || '').slice(0, 1500),
    residentNotes: String(j.residentNotes || '').slice(0, 1200),
    staffTasks,
    sponsorItems: String(j.sponsorItems || '').slice(0, 400),
    etcNotes: String(j.etcNotes || '').slice(0, 400),
    kitchenVolunteer: String(j.kitchenVolunteer || '').slice(0, 80),
    vmsCount,
    updatedBy: String(j.updatedBy || '').slice(0, 30),
    updatedAtText: String(j.updatedAtText || '').slice(0, 30)
  };
}

function saveLocalCache(force = false) {
  if (!state.currentTeacher && !force) return;
  try {
    localStorage.setItem(STORAGE_KEYS.members, JSON.stringify(state.members));
    localStorage.setItem(STORAGE_KEYS.archivedMembers, JSON.stringify(state.archivedMembers));
    localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(state.categories));
    localStorage.setItem(STORAGE_KEYS.programs, JSON.stringify(state.programs));
    localStorage.setItem(STORAGE_KEYS.attendanceMap, JSON.stringify(state.attendanceMap));
    localStorage.setItem(STORAGE_KEYS.attendanceMeta, JSON.stringify(state.attendanceMeta));
    localStorage.setItem(STORAGE_KEYS.activityMap, JSON.stringify(state.activityMap));
    localStorage.setItem(STORAGE_KEYS.showPrintDate, JSON.stringify(state.showPrintDate));
    localStorage.setItem(STORAGE_KEYS.printTargetDoc, state.printTargetDoc || 'daily');
    localStorage.setItem(STORAGE_KEYS.journalWriters, JSON.stringify(state.journalWriters));
    localStorage.setItem(STORAGE_KEYS.journalMap, JSON.stringify(state.journalMap));
    if (state.isDemoMode) {
      localStorage.setItem(STORAGE_KEYS.journalWritersConfigured, state.journalWritersConfigured ? '1' : '0');
      localStorage.setItem(STORAGE_KEYS.demoTeachers, JSON.stringify(state.teachersMap));
      localStorage.setItem(STORAGE_KEYS.demoInviteStatus, state.inviteMetaStatus || '샘플 설정됨 (보안 보호 · 4자)');
      localStorage.setItem(STORAGE_KEYS.demoInitialized, '1');
    }
  } catch (err) {
    console.warn('Local cache save warning:', err);
  }
}

function clearAppStorageKeys(storage, preserveKeys = []) {
  const preserve = new Set(preserveKeys);
  try {
    const keysToRemove = [];
    for (let i = 0; i < storage.length; i++) {
      const k = storage.key(i);
      if (k && k.startsWith(STORAGE_KEYS.prefix) && !preserve.has(k)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => storage.removeItem(k));
  } catch (_) {}
}

function clearWorkspaceDom() {
  const ids = [
    'attendanceGrid',
    'activityTableBody',
    'printAttendanceContainer',
    'printMainGridContainer',
    'journalStaffInputsContainer',
    'journalPaperDoc',
    'memberMgmtTableBody',
    'programMgmtTableBody',
    'teacherMgmtTableBody'
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  const disp = document.getElementById('currentTeacherDisplay');
  if (disp) {
    disp.textContent = '-';
    disp.title = '';
  }
  const hintEl = document.getElementById('currentInviteCodeHint');
  if (hintEl) hintEl.textContent = '-';
}

function purgeAllLocalWorkspaceData() {
  clearAppStorageKeys(localStorage);
  clearAppStorageKeys(sessionStorage);

  state.members = JSON.parse(JSON.stringify(DEFAULT_MEMBERS));
  state.archivedMembers = [];
  state.categories = DEFAULT_CATEGORIES.slice();
  state.programs = JSON.parse(JSON.stringify(DEFAULT_PROGRAMS));
  state.attendanceMap = {};
  state.attendanceMeta = {};
  state.activityMap = {};
  state.journalWriters = [];
  state.journalWritersConfigured = false;
  state.journalMap = {};
  state.draftJournal = {};
  state.dirtyJournalDates.clear();
  state.lastJournalSaveErrorDate = '';
  state.draftAttendance = {};
  state.draftActivity = {};
  state.dirtyDates.clear();
  state.lastSaveErrorDate = '';
  state.teachersMap = {};
  state.inviteMetaStatus = '';
  state.currentTeacher = null;
  state.rememberCurrentSession = false;
  state.isBulkMemberMode = false;
  state.isBulkDirty = false;
  state.programCategoryFilter = 'ALL';
  state.programSearchQuery = '';
  state.isCloudHydrated = false;
  state.showPrintDate = true;
  state.printTargetDoc = 'daily';

  clearWorkspaceDom();
}

function detachAuthScopedListeners() {
  state.authScopedUnsubscribers.forEach(u => { try { u(); } catch (_) {} });
  state.authScopedUnsubscribers = [];
  state.workspaceUnsubscribers.forEach(u => { try { u(); } catch (_) {} });
  state.workspaceUnsubscribers = [];
}

function persistSessionMeta(uid, remember) {
  localStorage.removeItem(STORAGE_KEYS.sessionMeta);
  sessionStorage.removeItem(STORAGE_KEYS.sessionMeta);
  state.rememberCurrentSession = Boolean(remember);

  if (remember) {
    localStorage.setItem(STORAGE_KEYS.sessionMeta, JSON.stringify({
      uid,
      remember: true
    }));
  } else {
    sessionStorage.setItem(STORAGE_KEYS.sessionMeta, JSON.stringify({
      uid,
      remember: false
    }));
  }
}

function broadcastSessionSync(type, uid = '') {
  const payload = { type, uid, ts: Date.now() };
  try {
    if (state.authBroadcastChannel) {
      state.authBroadcastChannel.postMessage(payload);
    }
  } catch (_) {}
  try {
    localStorage.setItem(STORAGE_KEYS.authSyncPing, JSON.stringify(payload));
    if (type === 'logout') {
      localStorage.removeItem(STORAGE_KEYS.authSyncPing);
    }
  } catch (_) {}
}

function initCrossTabSessionSync() {
  if ('BroadcastChannel' in window) {
    try {
      state.authBroadcastChannel = new BroadcastChannel('dw_sample_auth_sync_v1');
      state.authBroadcastChannel.addEventListener('message', (ev) => {
        handleCrossTabSyncPayload(ev?.data);
      });
    } catch (_) {}
  }

  window.addEventListener('storage', (ev) => {
    if (ev.key === STORAGE_KEYS.authSyncPing && ev.newValue) {
      try {
        handleCrossTabSyncPayload(JSON.parse(ev.newValue));
      } catch (_) {}
    } else if (ev.key === STORAGE_KEYS.sessionMeta && !ev.newValue && state.currentTeacher) {
      handleCrossTabSyncPayload({ type: 'logout' });
    }
  });
}

function handleCrossTabSyncPayload(payload) {
  if (!payload || !state.currentTeacher) return;
  if (state.isDemoMode) {
    if (payload.type === 'logout' || (payload.type === 'switch' && payload.uid !== state.currentTeacher.uid)) {
      state.draftAttendance = {};
      state.draftActivity = {};
      state.dirtyDates.clear();
      state.lastSaveErrorDate = '';
      state.draftJournal = {};
      state.dirtyJournalDates.clear();
      state.lastJournalSaveErrorDate = '';
      state.isBulkMemberMode = false;
      state.isBulkDirty = false;
      if (payload.type === 'switch' && payload.uid) {
        loadDemoStateFromStorageOrSeed();
        enterDemoSession(payload.uid);
      } else {
        state.currentTeacher = null;
        clearWorkspaceDom();
        showAuthGateView('demo');
      }
    }
    return;
  }
  if (payload.type === 'logout' || (payload.type === 'switch' && payload.uid !== state.currentTeacher.uid)) {
    detachAuthScopedListeners();
    purgeAllLocalWorkspaceData();
    if (state.firebaseAuth && state.firebaseAuth.currentUser) {
      state.firebaseAuth.signOut().catch(() => {});
    }
    showAuthGateView('standard');
  }
}

// ----------------------------------------------------------------------------
// 5. FIREBASE INIT, SERVER-ENFORCED AUTH & WORKSPACE HYDRATION
// ----------------------------------------------------------------------------
function updateSyncBadge(mode, label) {
  const pill = document.getElementById('syncBadge');
  const text = document.getElementById('syncStatusText');
  if (!pill || !text) return;

  pill.classList.remove('is-online', 'is-offline', 'is-error');
  if (mode === 'online') {
    pill.classList.add('is-online');
    text.innerText = label || '실시간 연결';
  } else if (mode === 'error') {
    pill.classList.add('is-error');
    text.innerText = label || '보안 규칙 확인 필요';
  } else {
    pill.classList.add('is-offline');
    text.innerText = label || '오프라인 상태';
  }
}

function hasUnsavedDayChanges(date = state.currentDate) {
  return Boolean(date && state.dirtyDates.has(date));
}

function pruneCleanDrafts() {
  Object.keys(state.draftAttendance).forEach(d => {
    if (!state.dirtyDates.has(d)) delete state.draftAttendance[d];
  });
  Object.keys(state.draftActivity).forEach(d => {
    if (!state.dirtyDates.has(d)) delete state.draftActivity[d];
  });
  Object.keys(state.draftJournal).forEach(d => {
    if (!state.dirtyJournalDates.has(d)) delete state.draftJournal[d];
  });
}

function beginDayEdit(date) {
  if (!state.dirtyDates.has(date)) {
    state.draftAttendance[date] = JSON.parse(JSON.stringify(
      state.attendanceMap[date] || state.draftAttendance[date] || buildDefaultDayAttendance(date)
    ));
    state.draftActivity[date] = JSON.parse(JSON.stringify(
      state.activityMap[date] || state.draftActivity[date] || buildDefaultActivityRows(date)
    ));
    state.dirtyDates.add(date);
  }
  if (state.lastSaveErrorDate === date) state.lastSaveErrorDate = '';
  return {
    dayAtt: state.draftAttendance[date],
    rows: state.draftActivity[date]
  };
}

function discardDayDraft(date) {
  delete state.draftAttendance[date];
  delete state.draftActivity[date];
  state.dirtyDates.delete(date);
  if (state.lastSaveErrorDate === date) state.lastSaveErrorDate = '';
}

function updateSaveIndicator(message, isError = false, kind = null) {
  const el = document.getElementById('saveStatusIndicator');
  if (el) {
    el.textContent = message;
    el.classList.toggle('is-error', Boolean(isError));
  }

  const resolvedKind = kind || (isError || state.lastSaveErrorDate === state.currentDate
    ? 'error'
    : (hasUnsavedDayChanges(state.currentDate)
      ? 'dirty'
      : (isDateSaved(state.currentDate) ? 'saved' : 'draft')));
  const topPill = document.getElementById('topSaveStatePill');
  const saveBtn = document.getElementById('manualSaveBtn');
  const saveBtnText = document.getElementById('manualSaveBtnText');
  const mobileSaveBtn = document.getElementById('mobileManualSaveBtn');
  const mobileState = document.getElementById('mobileSaveStateText');

  if (topPill) {
    topPill.classList.remove('is-draft', 'is-warn', 'is-saved', 'is-error');
    if (resolvedKind === 'error') {
      topPill.classList.add('is-error');
      topPill.textContent = '저장 실패';
    } else if (resolvedKind === 'dirty') {
      topPill.classList.add('is-warn');
      topPill.textContent = '수정됨 · 저장 필요';
    } else if (resolvedKind === 'saved') {
      topPill.classList.add('is-saved');
      topPill.textContent = '저장 완료 ✓';
    } else {
      topPill.classList.add('is-draft');
      topPill.textContent = '미저장';
    }
  }
  if (saveBtn) {
    saveBtn.classList.remove('btn-primary', 'btn-secondary', 'btn-subtle', 'btn-danger', 'btn-success');
    if (resolvedKind === 'error') {
      saveBtn.classList.add('btn-danger');
      if (saveBtnText) saveBtnText.textContent = '다시 저장';
    } else if (resolvedKind === 'saved') {
      saveBtn.classList.add('btn-subtle');
      if (saveBtnText) saveBtnText.textContent = '다시 저장';
    } else {
      saveBtn.classList.add('btn-primary');
      if (saveBtnText) saveBtnText.textContent = '당일 기록 저장';
    }
  }
  if (mobileSaveBtn) {
    mobileSaveBtn.classList.remove('btn-primary', 'btn-secondary', 'btn-subtle', 'btn-danger', 'btn-success');
    if (resolvedKind === 'error') {
      mobileSaveBtn.classList.add('btn-danger');
      mobileSaveBtn.textContent = '다시 저장';
    } else if (resolvedKind === 'saved') {
      mobileSaveBtn.classList.add('btn-subtle');
      mobileSaveBtn.textContent = '다시 저장';
    } else {
      mobileSaveBtn.classList.add('btn-primary');
      mobileSaveBtn.textContent = '당일 기록 저장';
    }
  }
  if (mobileState) {
    mobileState.classList.remove('is-saved', 'is-error');
    if (resolvedKind === 'error') {
      mobileState.classList.add('is-error');
      mobileState.textContent = '저장 실패 · 다시 저장 필요';
    } else if (resolvedKind === 'dirty') {
      mobileState.textContent = '저장 필요';
    } else if (resolvedKind === 'saved') {
      mobileState.classList.add('is-saved');
      mobileState.textContent = message;
    } else {
      mobileState.textContent = '미저장';
    }
  }
}

function retryAuthConnection() {
  if (typeof firebase === 'undefined' || typeof firebase.auth !== 'function') {
    window.location.reload();
    return;
  }
  initFirebaseAndAuth();
}

function showAuthGateView(mode) {
  const authLoading = document.getElementById('authLoadingState');
  const connErr = document.getElementById('authConnectionError');
  const demoPanel = document.getElementById('authDemoPanel');
  const initForm = document.getElementById('authInitForm');
  const stdView = document.getElementById('authStandardView');

  document.getElementById('appShell')?.classList.add('hidden');
  document.getElementById('authGate')?.classList.remove('hidden');

  if (authLoading) authLoading.classList.toggle('hidden', mode !== 'loading');
  if (connErr) connErr.classList.toggle('hidden', mode !== 'offline-error');
  if (demoPanel) demoPanel.classList.toggle('hidden', mode !== 'demo');
  if (initForm) initForm.classList.toggle('hidden', mode !== 'init');
  if (stdView) stdView.classList.toggle('hidden', mode !== 'standard');
}

function getProvisioningApp() {
  const name = 'sampleProvisioner';
  const existing = firebase.apps.find(a => a.name === name);
  if (existing) return existing;
  return firebase.initializeApp(window.FIREBASE_CONFIG, name);
}

function isSampleDemoConfig(cfg) {
  return Boolean(!cfg || cfg.mode === 'sample' || !cfg.apiKey || cfg.apiKey === 'YOUR_API_KEY');
}

function buildInitialSampleDataset(today) {
  const currentYear = today.slice(0, 4);
  const joinBase = shiftDateYMD(today, -120);
  const waitDate = shiftDateYMD(today, -14);
  const archJoinDate = shiftDateYMD(today, -200);
  const archLeaveDate = shiftDateYMD(today, -35);

  const activeSpecs = [
    ['김복동', 74], ['이정숙', 71], ['박영수', 76], ['최순자', 69],
    ['정민호', 73], ['강옥분', 78], ['조성철', 67], ['윤영희', 72],
    ['장기석', 75], ['임미자', 70], ['한상훈', 68], ['오영순', 77]
  ];

  const members = Array.from({ length: 16 }, (_, idx) => {
    const no = idx + 1;
    if (idx < activeSpecs.length) {
      return {
        id: `m${no}`,
        no,
        name: activeSpecs[idx][0],
        age: activeSpecs[idx][1],
        status: 'ACTIVE',
        joinDate: joinBase,
        waitingDate: '',
        leaveDate: ''
      };
    }
    if (idx === 12) {
      return {
        id: 'm13',
        no: 13,
        name: '송현우',
        age: 71,
        status: 'WAITING',
        joinDate: '',
        waitingDate: waitDate,
        leaveDate: ''
      };
    }
    return {
      id: `m${no}`,
      no,
      name: '',
      age: '',
      status: 'WAITING',
      joinDate: '',
      waitingDate: '',
      leaveDate: ''
    };
  });

  const archivedMembers = [
    {
      id: 'm_arch_1',
      no: 14,
      name: '배철수',
      age: 79,
      status: 'DISCHARGED',
      joinDate: archJoinDate,
      waitingDate: '',
      leaveDate: archLeaveDate
    }
  ];

  const teachersMap = {
    demo_admin: {
      uid: 'demo_admin',
      id: 'demo_admin',
      name: '김복지',
      nameHash: hashLoginSlotKey('김복지'),
      authId: 'demo_admin',
      role: 'admin',
      createdAt: joinBase,
      lastLoginAt: `${today} 09:00:00`
    },
    demo_staff_1: {
      uid: 'demo_staff_1',
      id: 'demo_staff_1',
      name: '이돌봄',
      nameHash: hashLoginSlotKey('이돌봄'),
      authId: 'demo_staff_1',
      role: 'teacher',
      createdAt: joinBase,
      lastLoginAt: `${today} 08:50:00`
    },
    demo_staff_2: {
      uid: 'demo_staff_2',
      id: 'demo_staff_2',
      name: '박상담',
      nameHash: hashLoginSlotKey('박상담'),
      authId: 'demo_staff_2',
      role: 'teacher',
      createdAt: joinBase,
      lastLoginAt: `${today} 08:55:00`
    }
  };

  const journalWriters = [
    { id: 'jw_demo_staff_1', uid: 'demo_staff_1', name: '이돌봄', active: true },
    { id: 'jw_demo_staff_2', uid: 'demo_staff_2', name: '박상담', active: true },
    { id: 'jw_demo_admin', uid: 'demo_admin', name: '김복지', active: false }
  ];

  const programs = JSON.parse(JSON.stringify(DEFAULT_PROGRAMS));
  const progById = new Map(programs.map(p => [p.id, p]));
  const makeActRow = (idPrefix, seq, progId, count, membersCnt, autoMembers = true) => {
    const prog = progById.get(progId);
    return {
      id: `act_${idPrefix}_${seq}`,
      programId: prog ? prog.id : progId,
      category: prog ? prog.category : '',
      name: prog ? prog.name : '',
      count,
      members: membersCnt,
      autoMembers
    };
  };

  const makeAttRecords = (overrides = {}) => {
    const recs = {};
    for (let i = 1; i <= 12; i++) {
      const mId = `m${i}`;
      recs[mId] = overrides[mId] || { am: '○', pm: '○' };
    }
    return recs;
  };

  const attendanceMap = {};
  const attendanceMeta = {};
  const activityMap = {};

  const d2 = shiftDateYMD(today, -2);
  if (d2.slice(0, 4) === currentYear) {
    attendanceMap[d2] = makeAttRecords();
    attendanceMeta[d2] = { updatedBy: '이돌봄', updatedAtText: '17:30:00' };
    activityMap[d2] = [
      makeActRow('d2', 1, 'p_med_1', 1, 12, true),
      makeActRow('d2', 2, 'p_med_2', 1, 12, true),
      makeActRow('d2', 3, 'p_psy_2', 1, 12, true),
      makeActRow('d2', 4, 'p_edu_3', 1, 12, true),
      makeActRow('d2', 5, 'p_life_1', 1, 12, true),
      makeActRow('d2', 6, 'p_life_2', 1, 12, true),
      makeActRow('d2', 7, 'p_life_6', 2, 12, false)
    ];
  }

  const d1 = shiftDateYMD(today, -1);
  if (d1.slice(0, 4) === currentYear) {
    attendanceMap[d1] = makeAttRecords({ m12: { am: 'X', pm: 'X' } });
    attendanceMeta[d1] = { updatedBy: '박상담', updatedAtText: '17:20:00' };
    activityMap[d1] = [
      makeActRow('d1', 1, 'p_med_1', 1, 11, true),
      makeActRow('d1', 2, 'p_med_2', 1, 11, true),
      makeActRow('d1', 3, 'p_soc_3', 1, 11, true),
      makeActRow('d1', 4, 'p_psy_1', 2, 2, false),
      makeActRow('d1', 5, 'p_life_1', 1, 11, true),
      makeActRow('d1', 6, 'p_life_2', 1, 11, true),
      makeActRow('d1', 7, 'p_life_6', 2, 11, false)
    ];
  }

  attendanceMap[today] = makeAttRecords({
    m10: { am: '√', pm: '√' },
    m11: { am: 'X', pm: 'X' }
  });
  attendanceMeta[today] = { updatedBy: '김복지', updatedAtText: '16:40:00' };
  activityMap[today] = [
    makeActRow('today', 1, 'p_med_1', 1, 10, true),
    makeActRow('today', 2, 'p_med_2', 1, 10, true),
    makeActRow('today', 3, 'p_edu_2', 1, 10, true),
    makeActRow('today', 4, 'p_soc_14', 1, 10, true),
    makeActRow('today', 5, 'p_soc_7', 1, 10, true),
    makeActRow('today', 6, 'p_life_1', 1, 10, true),
    makeActRow('today', 7, 'p_life_2', 1, 10, true),
    makeActRow('today', 8, 'p_life_6', 2, 10, false)
  ];

  const journalMap = {
    [today]: normalizeJournalDoc({
      date: today,
      safetyCheck: true,
      envCheck: true,
      absentees: '한상훈',
      absentReason: '병원 정기 진료 (보호자 사전 연락)',
      amPrograms: '건강체크, 노래교실',
      amStaff: '이돌봄, 봉사자 1명',
      amDetail: '등원 이용인 체온·혈압 측정 및 컨디션 확인 후 계절 애창곡 노래교실 진행 (참여도 양호).',
      pmPrograms: '요리활동, 종이접기',
      pmStaff: '박상담, 외부강사 1명',
      pmDetail: '소근육 발달을 돕는 계절 간식 만들기(요리활동) 및 종이접기 작품 완성 후 소감 나누기 진행.',
      residentNotes: '임미자 이용인 비대면 안부 확인 완료(특이사항 없음). 오영순 이용인 복약 시간 안내 완료.',
      staffTasks: [
        { id: 'jw_demo_staff_1', name: '이돌봄', content: '오전 등·하원 차량 동승 안전지도, 건강체크 기록, 비대면 돌봄 대상자 안부 전화 실시.' },
        { id: 'jw_demo_staff_2', name: '박상담', content: '오후 요리활동 재료 준비 및 진행 보조, 월간 프로그램 출석부 및 운영일지 정리.' }
      ],
      sponsorItems: '지역 후원처 제철 과일 1박스',
      etcNotes: '다음 주 화요일 소방 대피 모의훈련 안내 가정통신문 발송 예정',
      kitchenVolunteer: '조리실 봉사자 2명',
      vmsCount: '3',
      updatedBy: '김복지',
      updatedAtText: '16:45:00'
    }, today)
  };

  return {
    members,
    archivedMembers,
    categories: DEFAULT_CATEGORIES.slice(),
    programs,
    attendanceMap,
    attendanceMeta,
    activityMap,
    journalWriters,
    journalWritersConfigured: true,
    journalMap,
    teachersMap,
    inviteMetaStatus: '샘플 설정됨 (보안 보호 · 4자)'
  };
}

function seedInitialSampleDataset() {
  const sample = buildInitialSampleDataset(getTodayKST());
  state.members = sample.members;
  state.archivedMembers = sample.archivedMembers;
  state.categories = sample.categories;
  state.programs = sample.programs;
  state.attendanceMap = sample.attendanceMap;
  state.attendanceMeta = sample.attendanceMeta;
  state.activityMap = sample.activityMap;
  state.journalWriters = sample.journalWriters;
  state.journalWritersConfigured = sample.journalWritersConfigured;
  state.journalMap = sample.journalMap;
  state.teachersMap = sample.teachersMap;
  state.inviteMetaStatus = sample.inviteMetaStatus;
  state.showPrintDate = true;
  state.printTargetDoc = 'daily';
  saveLocalCache(true);
}

function loadDemoStateFromStorageOrSeed() {
  if (localStorage.getItem(STORAGE_KEYS.demoInitialized) !== '1') {
    seedInitialSampleDataset();
    return;
  }

  try {
    const safeParse = (key, fallback) => {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw, (k, v) => (UNSAFE_JSON_KEYS.has(k) ? undefined : v));
    };

    const rawMembers = safeParse(STORAGE_KEYS.members, null);
    const rawPrograms = safeParse(STORAGE_KEYS.programs, null);
    if (!Array.isArray(rawMembers) || !Array.isArray(rawPrograms) || rawPrograms.length === 0) {
      seedInitialSampleDataset();
      return;
    }

    const rawCategories = safeParse(STORAGE_KEYS.categories, DEFAULT_CATEGORIES);
    state.members = normalizeMemberList(rawMembers, true);
    state.archivedMembers = normalizeMemberList(safeParse(STORAGE_KEYS.archivedMembers, []), false);
    state.categories = normalizeCategoryList(rawCategories, rawPrograms);
    state.programs = migrateProgramList(rawPrograms, state.categories);

    const rawAtt = safeParse(STORAGE_KEYS.attendanceMap, {});
    const nextAtt = {};
    if (rawAtt && typeof rawAtt === 'object' && !Array.isArray(rawAtt)) {
      Object.entries(rawAtt).forEach(([d, recs]) => {
        if (!UNSAFE_JSON_KEYS.has(d) && isValidCalendarYMD(d) && recs && typeof recs === 'object' && !Array.isArray(recs)) {
          nextAtt[d] = recs;
        }
      });
    }
    state.attendanceMap = nextAtt;

    const rawMeta = safeParse(STORAGE_KEYS.attendanceMeta, {});
    const nextMeta = {};
    if (rawMeta && typeof rawMeta === 'object' && !Array.isArray(rawMeta)) {
      Object.entries(rawMeta).forEach(([d, meta]) => {
        if (!UNSAFE_JSON_KEYS.has(d) && isValidCalendarYMD(d) && meta && typeof meta === 'object') {
          nextMeta[d] = {
            updatedBy: String(meta.updatedBy || '').slice(0, 30),
            updatedAtText: String(meta.updatedAtText || '').slice(0, 30)
          };
        }
      });
    }
    state.attendanceMeta = nextMeta;

    const rawAct = safeParse(STORAGE_KEYS.activityMap, {});
    const nextAct = {};
    if (rawAct && typeof rawAct === 'object' && !Array.isArray(rawAct)) {
      Object.entries(rawAct).forEach(([d, rows]) => {
        if (!UNSAFE_JSON_KEYS.has(d) && isValidCalendarYMD(d) && Array.isArray(rows)) {
          nextAct[d] = migrateActivityRows(rows, state.programs, state.categories);
        }
      });
    }
    state.activityMap = nextAct;

    state.journalWriters = normalizeJournalWritersList(safeParse(STORAGE_KEYS.journalWriters, []));
    state.journalWritersConfigured = localStorage.getItem(STORAGE_KEYS.journalWritersConfigured) !== '0';

    const rawJournals = safeParse(STORAGE_KEYS.journalMap, {});
    const nextJournals = {};
    if (rawJournals && typeof rawJournals === 'object' && !Array.isArray(rawJournals)) {
      Object.entries(rawJournals).forEach(([d, jDoc]) => {
        if (!UNSAFE_JSON_KEYS.has(d) && isValidCalendarYMD(d)) {
          nextJournals[d] = normalizeJournalDoc(jDoc, d);
        }
      });
    }
    state.journalMap = nextJournals;

    const rawTeachers = safeParse(STORAGE_KEYS.demoTeachers, null);
    const nextTeachers = {};
    if (rawTeachers && typeof rawTeachers === 'object' && !Array.isArray(rawTeachers)) {
      Object.entries(rawTeachers).forEach(([uid, t]) => {
        if (UNSAFE_JSON_KEYS.has(uid) || !t || typeof t !== 'object') return;
        const cleanName = String(t.name || '').trim().slice(0, 20);
        if (!cleanName) return;
        nextTeachers[uid] = {
          uid,
          id: uid,
          name: cleanName,
          nameHash: String(t.nameHash || hashLoginSlotKey(cleanName)),
          authId: String(t.authId || uid),
          role: t.role === 'admin' ? 'admin' : 'teacher',
          createdAt: String(t.createdAt || ''),
          lastLoginAt: String(t.lastLoginAt || '')
        };
      });
    }
    if (Object.keys(nextTeachers).length === 0) {
      state.teachersMap = buildInitialSampleDataset(getTodayKST()).teachersMap;
    } else {
      state.teachersMap = nextTeachers;
    }

    state.inviteMetaStatus = localStorage.getItem(STORAGE_KEYS.demoInviteStatus) || '샘플 설정됨 (보안 보호 · 4자)';
    state.showPrintDate = safeParse(STORAGE_KEYS.showPrintDate, true) !== false;
    const savedMode = localStorage.getItem(STORAGE_KEYS.printTargetDoc);
    state.printTargetDoc = savedMode === 'journal' || savedMode === 'both' ? savedMode : 'daily';
  } catch (err) {
    console.warn('Demo local restore fallback to seed:', err);
    seedInitialSampleDataset();
  }
}

async function enterDemoSession(preferredUid = 'demo_admin') {
  loadDemoStateFromStorageOrSeed();
  const list = getTeacherList();
  const teacher = state.teachersMap[preferredUid]
    || state.teachersMap.demo_admin
    || list.find(t => t.role === 'admin')
    || list[0];
  if (!teacher) {
    seedInitialSampleDataset();
    return enterDemoSession('demo_admin');
  }

  const nowFull = `${getTodayKST()} ${formatTimeKST()}`;
  state.teachersMap[teacher.uid].lastLoginAt = nowFull;
  state.currentTeacher = {
    uid: teacher.uid,
    id: teacher.uid,
    name: teacher.name,
    nameHash: teacher.nameHash || hashLoginSlotKey(teacher.name),
    authId: teacher.authId || teacher.uid,
    role: teacher.role === 'admin' ? 'admin' : 'teacher'
  };

  sessionStorage.removeItem(STORAGE_KEYS.demoGateFlag);
  persistSessionMeta(teacher.uid, true);
  saveLocalCache();
  applyRolePermissions();
  document.getElementById('authGate')?.classList.add('hidden');
  document.getElementById('appShell')?.classList.remove('hidden');

  await enterWorkspace();
}

function initSampleDemoMode() {
  state.isDemoMode = true;
  state.isFirebaseReady = false;
  state.isCloudHydrated = false;
  loadDemoStateFromStorageOrSeed();

  if (sessionStorage.getItem(STORAGE_KEYS.demoGateFlag) === '1') {
    showAuthGateView('demo');
    return;
  }

  let savedUid = 'demo_admin';
  try {
    const rawMeta = localStorage.getItem(STORAGE_KEYS.sessionMeta) || sessionStorage.getItem(STORAGE_KEYS.sessionMeta);
    if (rawMeta) {
      const parsed = JSON.parse(rawMeta);
      if (parsed && typeof parsed.uid === 'string' && state.teachersMap[parsed.uid]) {
        savedUid = parsed.uid;
      }
    }
  } catch (_) {}

  enterDemoSession(savedUid);
}

async function resetSampleDemoData() {
  if (!state.isDemoMode) return;
  const ok = await askConfirmDialog({
    title: '샘플 데이터 초기화',
    message: '체험 중 입력·수정하신 모든 내용을 지우고, 초기 샘플 예시 데이터(이용인·출결·활동·운영일지)로 되돌리시겠습니까?',
    confirmLabel: '초기 샘플로 복원',
    danger: true
  });
  if (!ok) return;

  const prevUid = state.currentTeacher?.uid || 'demo_admin';
  const wasInWorkspace = Boolean(state.currentTeacher);

  clearAppStorageKeys(localStorage);
  clearAppStorageKeys(sessionStorage);

  state.draftAttendance = {};
  state.draftActivity = {};
  state.dirtyDates.clear();
  state.lastSaveErrorDate = '';
  state.draftJournal = {};
  state.dirtyJournalDates.clear();
  state.lastJournalSaveErrorDate = '';
  state.isBulkMemberMode = false;
  state.isBulkDirty = false;
  state.programCategoryFilter = 'ALL';
  state.programSearchQuery = '';
  state.memberFilter = 'ALL';

  seedInitialSampleDataset();

  if (wasInWorkspace) {
    const targetUid = state.teachersMap[prevUid] ? prevUid : 'demo_admin';
    await enterDemoSession(targetUid);
  } else {
    sessionStorage.setItem(STORAGE_KEYS.demoGateFlag, '1');
    showAuthGateView('demo');
  }
  showToast('초기 샘플 예시 데이터로 복원되었습니다.', 'success');
}

async function initFirebaseAndAuth() {
  const cfg = window.FIREBASE_CONFIG;
  if (isSampleDemoConfig(cfg)) {
    initSampleDemoMode();
    return;
  }
  showAuthGateView('loading');

  if (typeof firebase === 'undefined' || typeof firebase.auth !== 'function') {
    state.isFirebaseReady = false;
    state.isCloudHydrated = false;
    updateSyncBadge('offline', 'Firebase 미연결');
    showAuthGateView('offline-error');
    return;
  }

  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(cfg);
    }
    state.firebaseAuth = firebase.auth();
    state.firestoreDb = firebase.firestore();
    state.isFirebaseReady = true;

    if (state.authUnsubscriber) {
      try { state.authUnsubscriber(); } catch (_) {}
    }

    let authQueue = Promise.resolve();
    state.authUnsubscriber = state.firebaseAuth.onAuthStateChanged((user) => {
      authQueue = authQueue
        .then(() => handleAuthStateChanged(user))
        .catch(err => console.error('Auth state handler error:', err));
    });
  } catch (err) {
    console.error('Firebase init failed:', err);
    state.isFirebaseReady = false;
    state.isCloudHydrated = false;
    updateSyncBadge('error', '클라우드 초기화 오류');
    showAuthGateView('offline-error');
  }
}

async function handleAuthStateChanged(user) {
  const db = state.firestoreDb;
  if (!db) {
    showAuthGateView('offline-error');
    return;
  }

  if (!user) {
    const hadSession = Boolean(state.currentTeacher);
    detachAuthScopedListeners();
    if (hadSession) {
      purgeAllLocalWorkspaceData();
    } else {
      clearAppStorageKeys(localStorage);
      clearAppStorageKeys(sessionStorage);
      clearWorkspaceDom();
    }

    try {
      const bootstrapSnap = await db.collection('settings').doc('bootstrap').get({ source: 'server' });
      showAuthGateView(bootstrapSnap.exists ? 'standard' : 'init');
    } catch (err) {
      console.error('Bootstrap check failed:', err);
      showAuthGateView('offline-error');
    }
    return;
  }

  if (!localStorage.getItem(STORAGE_KEYS.sessionMeta) && !sessionStorage.getItem(STORAGE_KEYS.sessionMeta)) {
    persistSessionMeta(user.uid, true);
  }

  // Server-authoritative check that teacher record exists and was not deleted
  try {
    const teacherSnap = await db.collection('teachers').doc(user.uid).get({ source: 'server' });
    if (!teacherSnap.exists) {
      detachAuthScopedListeners();
      purgeAllLocalWorkspaceData();
      try { await state.firebaseAuth.signOut(); } catch (_) {}
      showAuthGateView('standard');
      showAuthError('authLoginError', '계정 정보가 삭제되었거나 접근 권한이 없습니다. 다시 로그인해 주세요.');
      return;
    }

    const tData = teacherSnap.data() || {};
    state.currentTeacher = {
      uid: user.uid,
      id: user.uid,
      name: String(tData.name || '선생님'),
      nameHash: String(tData.nameHash || ''),
      authId: String(tData.authId || ''),
      role: tData.role === 'admin' ? 'admin' : 'teacher'
    };

    attachAuthScopedListeners(user.uid);
    applyRolePermissions();
    document.getElementById('authGate')?.classList.add('hidden');
    document.getElementById('appShell')?.classList.remove('hidden');

    await enterWorkspace();
  } catch (err) {
    console.error('Teacher profile verification failed:', err);
    detachAuthScopedListeners();
    if (err && err.code === 'permission-denied') {
      purgeAllLocalWorkspaceData();
      try { await state.firebaseAuth.signOut(); } catch (_) {}
      showAuthGateView('standard');
      showAuthError('authLoginError', '권한이 확인되지 않아 로그아웃되었습니다.');
    } else {
      updateSyncBadge('offline', '서버 확인 실패');
      showAuthGateView('offline-error');
    }
  }
}

function attachAuthScopedListeners(currentUid) {
  const db = state.firestoreDb;
  if (!db) return;

  detachAuthScopedListeners();

  state.authScopedUnsubscribers.push(
    db.collection('teachers').onSnapshot(snapshot => {
      const nextMap = {};
      snapshot.forEach(doc => {
        const d = doc.data() || {};
        nextMap[doc.id] = {
          uid: doc.id,
          id: doc.id,
          name: String(d.name || ''),
          nameHash: String(d.nameHash || ''),
          authId: String(d.authId || ''),
          role: d.role === 'admin' ? 'admin' : 'teacher',
          createdAt: String(d.createdAt || ''),
          lastLoginAt: String(d.lastLoginAt || '')
        };
      });
      state.teachersMap = nextMap;

      if (state.currentTeacher) {
        const latest = nextMap[currentUid];
        if (!latest || (state.currentTeacher.authId && latest.authId && latest.authId !== state.currentTeacher.authId)) {
          showToast('계정이 변경되거나 삭제되어 보안을 위해 로그아웃됩니다.', 'error');
          logoutTeacher(true);
          return;
        }
        state.currentTeacher.role = latest.role;
        state.currentTeacher.name = latest.name;
        applyRolePermissions();
        if (state.currentTab === 3 && state.currentMgmtSubTab === 'accounts') {
          renderAccountMgmtPanel();
        } else if (state.currentTab === 4 && !state.journalWritersConfigured && !state.dirtyJournalDates.has(state.currentDate)) {
          pruneCleanDrafts();
          renderJournalView();
        }
      }
    }, err => handleFirestoreError('teachers', err))
  );

  state.authScopedUnsubscribers.push(
    db.collection('settings').doc('invite_meta').onSnapshot(doc => {
      const d = doc.exists ? (doc.data() || {}) : {};
      const statusTxt = String(d.statusText || '설정됨 (보안 보호)');
      const updatedAt = d.updatedAt ? ` · 변경 ${String(d.updatedAt)}` : '';
      state.inviteMetaStatus = `${statusTxt}${updatedAt}`;
      if (state.currentTab === 3 && state.currentMgmtSubTab === 'accounts') {
        const hintEl = document.getElementById('currentInviteCodeHint');
        if (hintEl) hintEl.textContent = state.inviteMetaStatus;
      }
    }, err => handleFirestoreError('settings/invite_meta', err))
  );
}

function handleFirestoreError(scope, err) {
  console.error(`Firestore error (${scope}):`, err);
  if (err && err.code === 'permission-denied') {
    updateSyncBadge('error', 'Firestore 권한 오류');
  } else {
    updateSyncBadge('offline', '연결 일시 끊김');
  }
}

// ----------------------------------------------------------------------------
// 6. TEACHER AUTHENTICATION HANDLERS (Firebase Auth + Server Invite Proof)
// ----------------------------------------------------------------------------
function getTeacherList() {
  return Object.values(state.teachersMap || {})
    .filter(t => t && t.uid && t.name)
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
}

function switchAuthMode(mode) {
  const isLogin = mode === 'login';
  const loginTab = document.getElementById('authTabLogin');
  const regTab = document.getElementById('authTabRegister');
  const loginForm = document.getElementById('authLoginForm');
  const regForm = document.getElementById('authRegisterForm');

  loginTab?.classList.toggle('is-active', isLogin);
  loginTab?.setAttribute('aria-selected', String(isLogin));
  loginTab?.setAttribute('tabindex', isLogin ? '0' : '-1');
  regTab?.classList.toggle('is-active', !isLogin);
  regTab?.setAttribute('aria-selected', String(!isLogin));
  regTab?.setAttribute('tabindex', !isLogin ? '0' : '-1');

  loginForm?.classList.toggle('hidden', !isLogin);
  regForm?.classList.toggle('hidden', isLogin);
  showAuthError('authLoginError', '');
  showAuthError('authRegisterError', '');
}

function showAuthError(elId, msg) {
  const el = document.getElementById(elId);
  if (!el) return;
  if (!msg) {
    el.textContent = '';
    el.classList.add('hidden');
  } else {
    el.textContent = msg;
    el.classList.remove('hidden');
  }
}

function formatFirebaseAuthError(err, fallbackMsg) {
  const code = err?.code || '';
  if (
    code === 'auth/wrong-password' ||
    code === 'auth/user-not-found' ||
    code === 'auth/invalid-credential' ||
    code === 'auth/invalid-login-credentials'
  ) {
    return '성함 또는 비밀번호가 올바르지 않습니다.';
  }
  if (code === 'auth/weak-password') {
    return '비밀번호는 6자 이상으로 설정해 주세요.';
  }
  if (code === 'auth/too-many-requests') {
    return '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.';
  }
  if (code === 'auth/network-request-failed' || code === 'unavailable') {
    return '인터넷 연결을 확인한 뒤 다시 시도해 주세요.';
  }
  return fallbackMsg || '처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.';
}

async function setPrimaryAuthPersistence(remember) {
  const persistence = remember
    ? firebase.auth.Auth.Persistence.LOCAL
    : firebase.auth.Auth.Persistence.SESSION;
  await state.firebaseAuth.setPersistence(persistence);
}

async function handleInitialSetup(event) {
  event.preventDefault();
  showAuthError('authInitError', '');
  if (!state.isFirebaseReady || !state.firestoreDb || !state.firebaseAuth) {
    showAuthError('authInitError', '클라우드 서버와 연결된 상태에서만 초기 설정을 진행할 수 있습니다.');
    return;
  }

  const name = document.getElementById('initName').value.trim();
  const pw = document.getElementById('initPassword').value;
  const pw2 = document.getElementById('initPasswordConfirm').value;
  const invite = document.getElementById('initInviteCode').value.trim();
  const remember = Boolean(document.getElementById('initRememberMe').checked);

  if (!name || name.length > 20) { showAuthError('authInitError', '선생님 성함을 1~20자로 입력해 주세요.'); return; }
  if (pw.length < 6) { showAuthError('authInitError', '개인 비밀번호는 6자 이상으로 설정해 주세요.'); return; }
  if (pw !== pw2) { showAuthError('authInitError', '비밀번호 확인이 일치하지 않습니다.'); return; }
  if (invite.length < 4 || invite.length > 12) { showAuthError('authInitError', '기관 가입 코드는 4~12자로 설정해 주세요.'); return; }

  const btn = document.getElementById('authInitSubmitBtn');
  if (btn) btn.disabled = true;

  let provUser = null;
  let provAuth = null;
  try {
    const bootSnap = await state.firestoreDb.collection('settings').doc('bootstrap').get({ source: 'server' });
    if (bootSnap.exists) {
      showAuthGateView('standard');
      showAuthError('authLoginError', '이미 다른 관리자가 초기 설정을 마쳤습니다. 로그인하거나 계정을 만들어 주세요.');
      return;
    }

    const provApp = getProvisioningApp();
    provAuth = provApp.auth();
    const provDb = provApp.firestore();
    await provAuth.setPersistence(firebase.auth.Auth.Persistence.NONE);

    const authId = makeId('acct');
    const synthEmail = authEmailFromId(authId);
    const cred = await provAuth.createUserWithEmailAndPassword(synthEmail, pw);
    provUser = cred.user;

    const uid = provUser.uid;
    const nowDate = getTodayKST();
    const nowFull = `${nowDate} ${formatTimeKST()}`;
    const nameHash = hashLoginSlotKey(name);
    const inviteProof = hashInviteProof(invite);

    const batch = provDb.batch();
    batch.set(provDb.collection('settings').doc('bootstrap'), {
      initialized: true,
      createdAt: nowFull
    });
    batch.set(provDb.collection('settings').doc('invite_secret'), {
      inviteProof,
      updatedAt: nowFull
    });
    batch.set(provDb.collection('settings').doc('invite_meta'), {
      statusText: buildSafeInviteStatus(invite),
      updatedAt: nowFull
    });
    batch.set(provDb.collection('teachers').doc(uid), {
      uid,
      name,
      nameHash,
      authId,
      role: 'admin',
      createdAt: nowDate,
      lastLoginAt: nowFull
    });
    batch.set(provDb.collection('login_slots').doc(nameHash), {
      uid,
      authId,
      updatedAt: nowFull
    });
    await batch.commit();

    provUser = null; // committed cleanly
    await provAuth.signOut();

    document.getElementById('initPassword').value = '';
    document.getElementById('initPasswordConfirm').value = '';
    document.getElementById('initInviteCode').value = '';

    await setPrimaryAuthPersistence(remember);
    persistSessionMeta(uid, remember);
    broadcastSessionSync('switch', uid);
    await state.firebaseAuth.signInWithEmailAndPassword(synthEmail, pw);
  } catch (err) {
    if (provUser) {
      try { await provUser.delete(); } catch (_) {}
    }
    if (provAuth) {
      try { await provAuth.signOut(); } catch (_) {}
    }
    showAuthError('authInitError', formatFirebaseAuthError(err, '초기 관리자 계정 생성에 실패했습니다.'));
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function handleTeacherLogin(event) {
  event.preventDefault();
  showAuthError('authLoginError', '');
  if (!state.isFirebaseReady || !state.firestoreDb || !state.firebaseAuth) {
    showAuthError('authLoginError', '클라우드 인증 서버에 연결할 수 없습니다.');
    return;
  }

  const name = document.getElementById('loginName').value.trim();
  const pw = document.getElementById('loginPassword').value;
  const remember = Boolean(document.getElementById('loginRememberMe').checked);

  if (!name || !pw) {
    showAuthError('authLoginError', '성함과 비밀번호를 모두 입력해 주세요.');
    return;
  }

  const btn = document.getElementById('authLoginSubmitBtn');
  if (btn) btn.disabled = true;

  try {
    const nameHash = hashLoginSlotKey(name);
    const slotSnap = await state.firestoreDb.collection('login_slots').doc(nameHash).get({ source: 'server' });
    if (!slotSnap.exists) {
      showAuthError('authLoginError', '성함 또는 비밀번호가 올바르지 않습니다.');
      return;
    }

    const slot = slotSnap.data() || {};
    if (!slot.authId || !slot.uid) {
      showAuthError('authLoginError', '성함 또는 비밀번호가 올바르지 않습니다.');
      return;
    }

    await setPrimaryAuthPersistence(remember);
    persistSessionMeta(slot.uid, remember);
    broadcastSessionSync('switch', slot.uid);

    const cred = await state.firebaseAuth.signInWithEmailAndPassword(authEmailFromId(slot.authId), pw);
    document.getElementById('loginPassword').value = '';

    const nowFull = `${getTodayKST()} ${formatTimeKST()}`;
    state.firestoreDb.collection('teachers').doc(cred.user.uid).update({
      lastLoginAt: nowFull
    }).catch(() => {});
  } catch (err) {
    clearAppStorageKeys(sessionStorage);
    localStorage.removeItem(STORAGE_KEYS.sessionMeta);
    showAuthError('authLoginError', formatFirebaseAuthError(err, '로그인에 실패했습니다.'));
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function handleTeacherRegister(event) {
  event.preventDefault();
  showAuthError('authRegisterError', '');
  if (!state.isFirebaseReady || !state.firestoreDb || !state.firebaseAuth) {
    showAuthError('authRegisterError', '클라우드 인증 서버에 연결할 수 없습니다.');
    return;
  }

  const invite = document.getElementById('regInviteCode').value.trim();
  const name = document.getElementById('regName').value.trim();
  const pw = document.getElementById('regPassword').value;
  const pw2 = document.getElementById('regPasswordConfirm').value;
  const remember = Boolean(document.getElementById('regRememberMe').checked);

  if (!invite || invite.length < 4) { showAuthError('authRegisterError', '기관 가입 코드를 4자 이상 입력해 주세요.'); return; }
  if (!name || name.length > 20) { showAuthError('authRegisterError', '본인 성함을 1~20자로 입력해 주세요.'); return; }
  if (pw.length < 6) { showAuthError('authRegisterError', '비밀번호는 6자 이상으로 설정해 주세요.'); return; }
  if (pw !== pw2) { showAuthError('authRegisterError', '비밀번호 확인이 일치하지 않습니다.'); return; }

  const btn = document.getElementById('authRegisterSubmitBtn');
  if (btn) btn.disabled = true;

  let provUser = null;
  let provAuth = null;
  try {
    const nameHash = hashLoginSlotKey(name);
    const existingSlot = await state.firestoreDb.collection('login_slots').doc(nameHash).get({ source: 'server' });
    if (existingSlot.exists) {
      showAuthError('authRegisterError', '이미 등록된 성함입니다. 로그인 탭을 이용하거나 관리자 선생님께 초기화를 요청해 주세요.');
      return;
    }

    const provApp = getProvisioningApp();
    provAuth = provApp.auth();
    const provDb = provApp.firestore();
    await provAuth.setPersistence(firebase.auth.Auth.Persistence.NONE);

    const authId = makeId('acct');
    const synthEmail = authEmailFromId(authId);
    const cred = await provAuth.createUserWithEmailAndPassword(synthEmail, pw);
    provUser = cred.user;

    const uid = provUser.uid;
    const nowDate = getTodayKST();
    const nowFull = `${nowDate} ${formatTimeKST()}`;

    const batch = provDb.batch();
    batch.set(provDb.collection('invite_claims').doc(uid), {
      inviteProof: hashInviteProof(invite),
      createdAt: nowFull
    });
    batch.set(provDb.collection('teachers').doc(uid), {
      uid,
      name,
      nameHash,
      authId,
      role: 'teacher',
      createdAt: nowDate,
      lastLoginAt: nowFull
    });
    batch.set(provDb.collection('login_slots').doc(nameHash), {
      uid,
      authId,
      updatedAt: nowFull
    });
    await batch.commit();

    provUser = null;
    await provAuth.signOut();

    document.getElementById('regInviteCode').value = '';
    document.getElementById('regPassword').value = '';
    document.getElementById('regPasswordConfirm').value = '';

    await setPrimaryAuthPersistence(remember);
    persistSessionMeta(uid, remember);
    broadcastSessionSync('switch', uid);
    await state.firebaseAuth.signInWithEmailAndPassword(synthEmail, pw);
  } catch (err) {
    if (provUser) {
      try { await provUser.delete(); } catch (_) {}
    }
    if (provAuth) {
      try { await provAuth.signOut(); } catch (_) {}
    }
    if (err && err.code === 'permission-denied') {
      showAuthError('authRegisterError', '기관 가입 코드가 일치하지 않습니다. 관리자 선생님께 정확한 가입 코드를 확인해 주세요.');
      document.getElementById('regInviteCode')?.focus();
    } else {
      showAuthError('authRegisterError', formatFirebaseAuthError(err, '계정 생성에 실패했습니다.'));
    }
  } finally {
    if (btn) btn.disabled = false;
  }
}

function applyRolePermissions() {
  const admin = isCurrentAdmin();
  const disp = document.getElementById('currentTeacherDisplay');
  if (disp && state.currentTeacher) {
    disp.textContent = `${state.currentTeacher.name} 선생님`;
    disp.title = admin ? '관리자 권한 계정' : '일반 선생님 계정';
  }
  document.getElementById('headerResetDemoBtn')?.classList.toggle('hidden', !state.isDemoMode);
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.textContent = state.isDemoMode ? '권한 전환' : '로그아웃';

  const restoreLabel = document.getElementById('restoreBackupBtnLabel');
  const backupInp = document.getElementById('backupFileInput');
  const resetBtn = document.getElementById('newYearResetBtn');
  const restoreRow = document.getElementById('restoreBackupRow');
  const resetRow = document.getElementById('newYearResetRow');
  const inviteForm = document.getElementById('inviteCodeForm');
  const inviteNotice = document.getElementById('inviteAdminOnlyNotice');
  const inviteInp = document.getElementById('newInviteCodeInput');
  const inviteBtn = document.getElementById('updateInviteCodeBtn');

  if (restoreLabel) {
    restoreLabel.classList.toggle('is-disabled', !admin);
    restoreLabel.setAttribute('aria-disabled', String(!admin));
  }
  if (backupInp) backupInp.disabled = !admin;
  if (resetBtn) resetBtn.disabled = !admin;
  if (restoreRow) restoreRow.classList.toggle('hidden', !admin);
  if (resetRow) resetRow.classList.toggle('hidden', !admin);
  const subBackupBtn = document.getElementById('subBtn_backup');
  const backupHeading = document.getElementById('mgmtBackupHeading');
  if (subBackupBtn) subBackupBtn.textContent = admin ? '데이터 백업 · 신년 초기화' : '데이터 백업';
  if (backupHeading) backupHeading.textContent = admin ? '데이터 백업 복원 · 신년 초기화' : '데이터 백업 보관';
  if (inviteInp) inviteInp.disabled = !admin;
  if (inviteBtn) inviteBtn.disabled = !admin;
  if (inviteForm) inviteForm.classList.toggle('hidden', !admin);
  if (inviteNotice) inviteNotice.classList.toggle('hidden', admin);

  syncDeleteDayButtons(state.currentDate);
  syncJournalDeleteButton(state.currentDate);
}

async function logoutTeacher(silent = false) {
  if (state.isDemoMode) {
    if (!silent) {
      const hasUnsaved = state.dirtyDates.size > 0 || state.dirtyJournalDates.size > 0 || needsBulkDiscardConfirm();
      const ok = await askConfirmDialog(hasUnsaved
        ? {
            title: '권한 전환 확인',
            message: '저장되지 않은 작성 내용이 있습니다.\n저장하지 않고 권한 전환 화면으로 이동하시겠습니까?',
            confirmLabel: '저장 안 하고 전환',
            danger: true
          }
        : {
            title: '권한 전환 확인',
            message: '샘플 역할 선택 화면(관리자/담당자 전환)으로 이동하시겠습니까?',
            confirmLabel: '권한 전환'
          });
      if (!ok) return;
    }

    state.draftAttendance = {};
    state.draftActivity = {};
    state.dirtyDates.clear();
    state.lastSaveErrorDate = '';
    state.draftJournal = {};
    state.dirtyJournalDates.clear();
    state.lastJournalSaveErrorDate = '';
    state.isBulkMemberMode = false;
    state.isBulkDirty = false;
    state.currentTeacher = null;
    clearWorkspaceDom();
    sessionStorage.setItem(STORAGE_KEYS.demoGateFlag, '1');
    broadcastSessionSync('logout');
    showAuthGateView('demo');
    return;
  }

  if (!silent) {
    const hasUnsaved = state.dirtyDates.size > 0 || state.dirtyJournalDates.size > 0 || needsBulkDiscardConfirm();
    const ok = await askConfirmDialog(hasUnsaved
      ? {
          title: '로그아웃 확인',
          message: '저장되지 않은 작성 내용이 있습니다.\n저장하지 않고 로그아웃하시겠습니까?',
          confirmLabel: '저장 안 하고 로그아웃',
          danger: true
        }
      : {
          title: '로그아웃 확인',
          message: '로그아웃하고 선생님 로그인 화면으로 돌아가시겠습니까?',
          confirmLabel: '로그아웃'
        });
    if (!ok) return;
  }

  detachAuthScopedListeners();
  purgeAllLocalWorkspaceData();
  broadcastSessionSync('logout');

  if (state.firebaseAuth) {
    try {
      await state.firebaseAuth.signOut();
    } catch (_) {}
  }

  const loginRem = document.getElementById('loginRememberMe');
  if (loginRem) loginRem.checked = false;
  showAuthGateView('standard');
}

// ----------------------------------------------------------------------------
// 7. RACE-FREE WORKSPACE HYDRATION & REALTIME SYNC
// ----------------------------------------------------------------------------
async function enterWorkspace() {
  if (!state.currentTeacher) return;
  state.currentDate = getTodayKST();
  try {
    const savedMode = localStorage.getItem(STORAGE_KEYS.printTargetDoc);
    if (savedMode === 'daily' || savedMode === 'journal' || savedMode === 'both') {
      state.printTargetDoc = savedMode;
    }
  } catch (_) {}

  if (state.isFirebaseReady && state.firestoreDb) {
    await hydrateAllFromCloud();
    if (!state.currentTeacher) return;
    attachWorkspaceListeners();
  } else if (state.isDemoMode) {
    state.isCloudHydrated = false;
    updateSyncBadge('online', '샘플 체험 모드');
  } else {
    state.isCloudHydrated = false;
    updateSyncBadge('offline', '오프라인 상태');
  }

  onDateChanged(state.currentDate);
  switchTab(1);
}

async function hydrateAllFromCloud() {
  const db = state.firestoreDb;
  const getFresh = (ref) => ref.get({ source: 'server' });
  try {
    const [memSnap, progSnap, attSnap, actSnap, jSettingsSnap, journalsSnap] = await Promise.all([
      getFresh(db.collection('settings').doc('members')),
      getFresh(db.collection('settings').doc('programs')),
      getFresh(db.collection('attendances')),
      getFresh(db.collection('activities')),
      getFresh(db.collection('settings').doc('journal')),
      getFresh(db.collection('journals'))
    ]);

    if (!state.currentTeacher) return;
    const seedOps = [];

    if (memSnap.exists && Array.isArray(memSnap.data()?.list) && memSnap.data().list.length > 0) {
      const mData = memSnap.data();
      state.members = normalizeMemberList(mData.list, true);
      state.archivedMembers = normalizeMemberList(mData.archived || [], false);
    } else {
      state.members = JSON.parse(JSON.stringify(DEFAULT_MEMBERS));
      state.archivedMembers = [];
      seedOps.push(db.collection('settings').doc('members').set({
        list: state.members,
        archived: state.archivedMembers
      }));
    }

    if (progSnap.exists && Array.isArray(progSnap.data()?.list) && progSnap.data().list.length > 0) {
      const pData = progSnap.data();
      state.categories = normalizeCategoryList(pData.categories, pData.list);
      state.programs = migrateProgramList(pData.list, state.categories);
    } else {
      state.categories = DEFAULT_CATEGORIES.slice();
      state.programs = JSON.parse(JSON.stringify(DEFAULT_PROGRAMS));
      seedOps.push(db.collection('settings').doc('programs').set({
        list: state.programs,
        categories: state.categories
      }));
    }

    const nextAttMap = {};
    const nextAttMeta = {};
    attSnap.forEach(doc => {
      if (!isValidCalendarYMD(doc.id)) return;
      const d = doc.data() || {};
      if (d.records && typeof d.records === 'object' && !Array.isArray(d.records)) {
        nextAttMap[doc.id] = d.records;
      }
      nextAttMeta[doc.id] = {
        updatedBy: String(d.updatedBy || ''),
        updatedAtText: String(d.updatedAtText || '')
      };
    });
    state.attendanceMap = nextAttMap;
    state.attendanceMeta = nextAttMeta;

    const nextActMap = {};
    actSnap.forEach(doc => {
      if (!isValidCalendarYMD(doc.id)) return;
      const d = doc.data() || {};
      if (Array.isArray(d.rows)) {
        nextActMap[doc.id] = migrateActivityRows(d.rows, state.programs, state.categories);
      }
    });
    state.activityMap = nextActMap;

    if (jSettingsSnap.exists && Array.isArray(jSettingsSnap.data()?.writers)) {
      state.journalWriters = normalizeJournalWritersList(jSettingsSnap.data().writers);
      state.journalWritersConfigured = true;
    } else {
      state.journalWriters = [];
      state.journalWritersConfigured = false;
    }

    const nextJournalMap = {};
    journalsSnap.forEach(doc => {
      if (!isValidCalendarYMD(doc.id)) return;
      nextJournalMap[doc.id] = normalizeJournalDoc(doc.data(), doc.id);
    });
    state.journalMap = nextJournalMap;

    if (seedOps.length > 0) {
      await Promise.all(seedOps);
    }

    if (!state.currentTeacher) return;
    state.isCloudHydrated = true;
    saveLocalCache();
    updateSyncBadge('online', '실시간 연결');
  } catch (err) {
    state.isCloudHydrated = false;
    handleFirestoreError('hydrateAll', err);
  }
}

function attachWorkspaceListeners() {
  const db = state.firestoreDb;
  if (!db) return;

  state.workspaceUnsubscribers.forEach(u => { try { u(); } catch (_) {} });
  state.workspaceUnsubscribers = [];

  state.workspaceUnsubscribers.push(
    db.collection('attendances').onSnapshot(snapshot => {
      updateSyncBadge('online', '실시간 연결');
      let currentChanged = false;
      snapshot.docChanges().forEach(change => {
        const date = change.doc.id;
        if (!isValidCalendarYMD(date)) return;
        if (change.type === 'removed') {
          delete state.attendanceMap[date];
          delete state.attendanceMeta[date];
          if (!state.dirtyDates.has(date)) delete state.draftAttendance[date];
        } else {
          const data = change.doc.data() || {};
          if (data.records && typeof data.records === 'object' && !Array.isArray(data.records)) {
            state.attendanceMap[date] = data.records;
          }
          state.attendanceMeta[date] = {
            updatedBy: String(data.updatedBy || ''),
            updatedAtText: String(data.updatedAtText || '')
          };
          if (!state.dirtyDates.has(date)) delete state.draftAttendance[date];
        }
        if (date === state.currentDate) currentChanged = true;
      });
      saveLocalCache();
      if (currentChanged && !state.dirtyDates.has(state.currentDate)) {
        if (state.currentTab === 1) {
          renderAttendanceGrid();
          syncSaveIndicatorForDate(state.currentDate);
        }
        if (state.currentTab === 2) renderUnifiedPrintView();
      } else if (state.currentTab === 2) {
        renderUnifiedPrintView();
      }
      if (currentChanged && state.currentTab === 4 && !state.dirtyJournalDates.has(state.currentDate) && !state.journalMap[state.currentDate]) {
        renderJournalView();
      }
    }, err => handleFirestoreError('attendances', err))
  );

  state.workspaceUnsubscribers.push(
    db.collection('activities').onSnapshot(snapshot => {
      updateSyncBadge('online', '실시간 연결');
      let currentChanged = false;
      snapshot.docChanges().forEach(change => {
        const date = change.doc.id;
        if (!isValidCalendarYMD(date)) return;
        if (change.type === 'removed') {
          delete state.activityMap[date];
          if (!state.dirtyDates.has(date)) delete state.draftActivity[date];
        } else {
          const data = change.doc.data() || {};
          if (Array.isArray(data.rows)) {
            state.activityMap[date] = migrateActivityRows(data.rows, state.programs, state.categories);
          }
          if (!state.dirtyDates.has(date)) delete state.draftActivity[date];
        }
        if (date === state.currentDate) currentChanged = true;
      });
      saveLocalCache();
      if (currentChanged && !state.dirtyDates.has(state.currentDate) && state.currentTab === 1) {
        renderActivityRows(false);
        syncSaveIndicatorForDate(state.currentDate);
      } else if (state.currentTab === 2) {
        renderUnifiedPrintView();
      } else if (currentChanged && state.currentTab === 4) {
        renderJournalProgramWarnings();
      }
    }, err => handleFirestoreError('activities', err))
  );

  state.workspaceUnsubscribers.push(
    db.collection('settings').doc('members').onSnapshot(doc => {
      if (!doc.exists) return;
      const d = doc.data() || {};
      if (Array.isArray(d.list)) {
        state.members = normalizeMemberList(d.list, true);
        state.archivedMembers = normalizeMemberList(d.archived || [], false);
        pruneCleanDrafts();
        saveLocalCache();
        if (state.currentTab === 1) renderAttendanceGrid();
        if (state.currentTab === 2) renderUnifiedPrintView();
        if (state.currentTab === 3 && state.currentMgmtSubTab === 'members') renderMemberMgmtTable();
      }
    }, err => handleFirestoreError('settings/members', err))
  );

  state.workspaceUnsubscribers.push(
    db.collection('settings').doc('programs').onSnapshot(doc => {
      if (!doc.exists) return;
      const pData = doc.data() || {};
      const list = pData.list;
      if (Array.isArray(list)) {
        state.categories = normalizeCategoryList(pData.categories, list);
        state.programs = migrateProgramList(list, state.categories);
        if (state.programCategoryFilter !== 'ALL' && !state.categories.includes(state.programCategoryFilter)) {
          state.programCategoryFilter = 'ALL';
        }
        pruneCleanDrafts();
        saveLocalCache();
        if (state.currentTab === 1) renderActivityRows(true);
        if (state.currentTab === 2) renderUnifiedPrintView();
        if (state.currentTab === 3 && state.currentMgmtSubTab === 'programs') {
          renderProgramCategoryFilterStrip();
          renderProgramMgmtTable();
        }
        if (state.currentTab === 4) {
          populateJournalProgramPickers();
          renderJournalProgramWarnings();
        }
      }
    }, err => handleFirestoreError('settings/programs', err))
  );

  state.workspaceUnsubscribers.push(
    db.collection('settings').doc('journal').onSnapshot(doc => {
      if (!doc.exists) return;
      const d = doc.data() || {};
      if (Array.isArray(d.writers)) {
        state.journalWriters = normalizeJournalWritersList(d.writers);
        state.journalWritersConfigured = true;
        pruneCleanDrafts();
        saveLocalCache();
        if (state.currentTab === 4 && !state.dirtyJournalDates.has(state.currentDate)) {
          renderJournalView();
        }
        if (state.currentTab === 2 && !state.dirtyJournalDates.has(state.currentDate)) {
          renderUnifiedPrintView();
        }
      }
    }, err => handleFirestoreError('settings/journal', err))
  );

  state.workspaceUnsubscribers.push(
    db.collection('journals').onSnapshot(snapshot => {
      updateSyncBadge('online', '실시간 연결');
      let currentChanged = false;
      snapshot.docChanges().forEach(change => {
        const date = change.doc.id;
        if (!isValidCalendarYMD(date)) return;
        if (change.type === 'removed') {
          delete state.journalMap[date];
          if (!state.dirtyJournalDates.has(date)) delete state.draftJournal[date];
        } else {
          state.journalMap[date] = normalizeJournalDoc(change.doc.data(), date);
          if (!state.dirtyJournalDates.has(date)) delete state.draftJournal[date];
        }
        if (date === state.currentDate) currentChanged = true;
      });
      saveLocalCache();
      if (currentChanged && !state.dirtyJournalDates.has(state.currentDate)) {
        if (state.currentTab === 4) renderJournalView();
        if (state.currentTab === 2) renderUnifiedPrintView();
      }
    }, err => handleFirestoreError('journals', err))
  );
}

// ----------------------------------------------------------------------------
// 8. MEMBER & 16-SLOT HISTORICAL ATTENDANCE LOGIC (With Archive Recycling)
// ----------------------------------------------------------------------------
function isMemberVisibleOnDate(member, date) {
  if (!member || !member.name) return false;
  if (member.status === 'WAITING') return false;
  if (member.joinDate && member.joinDate > date) return false;
  if (member.status === 'DISCHARGED' && member.leaveDate && member.leaveDate <= date) return false;
  return true;
}

function getAllMembersPool() {
  return [...state.members, ...state.archivedMembers];
}

function getVisibleMembersOnDate(date) {
  return getAllMembersPool().filter(m => isMemberVisibleOnDate(m, date));
}

function getActiveSlotMemberOnDate(slotNo, date) {
  const candidates = getAllMembersPool().filter(m => m.no === slotNo && isMemberVisibleOnDate(m, date));
  if (candidates.length === 0) return null;
  if (candidates.length === 1) return candidates[0];
  return candidates.sort((a, b) => String(b.joinDate || '').localeCompare(String(a.joinDate || '')))[0];
}

function buildDefaultDayAttendance(date) {
  const records = {};
  getVisibleMembersOnDate(date).forEach(m => {
    records[m.id] = { am: '○', pm: '○' };
  });
  return records;
}

function getEffectiveAttendance(date) {
  if (state.dirtyDates.has(date) && state.draftAttendance[date]) {
    return state.draftAttendance[date];
  }
  if (state.attendanceMap[date]) return state.attendanceMap[date];
  if (!state.draftAttendance[date]) {
    state.draftAttendance[date] = buildDefaultDayAttendance(date);
  }
  return state.draftAttendance[date];
}

function computeAttendanceCounts(date, records) {
  let attend = 0;
  let remote = 0;
  let absent = 0;

  getVisibleMembersOnDate(date).forEach(m => {
    const rec = records[m.id] || { am: '', pm: '' };
    if (rec.am === '○' || rec.pm === '○') attend++;
    else if (rec.am === '√' || rec.pm === '√') remote++;
    else if (rec.am === 'X' || rec.pm === 'X') absent++;
  });

  return { attend, remote, absent };
}

function getEffectiveActivityRows(date) {
  if (state.dirtyDates.has(date) && state.draftActivity[date]) {
    return state.draftActivity[date];
  }
  if (state.activityMap[date]) return state.activityMap[date];
  if (!state.draftActivity[date]) {
    state.draftActivity[date] = buildDefaultActivityRows(date);
  }
  return state.draftActivity[date];
}

function buildDefaultActivityRows(date) {
  const dayAtt = getEffectiveAttendance(date);
  const { attend } = computeAttendanceCounts(date, dayAtt);
  const rows = [];

  state.programs.filter(p => p.isDaily).forEach(p => {
    rows.push({
      id: makeId('act'),
      programId: p.id,
      category: p.category,
      name: p.name,
      count: 1,
      members: attend,
      autoMembers: true
    });
  });

  while (rows.length < 8) {
    rows.push({
      id: makeId('act'),
      programId: '',
      category: '',
      name: '',
      count: 1,
      members: attend,
      autoMembers: true
    });
  }
  return rows;
}

function renderAttendanceGrid() {
  const grid = document.getElementById('attendanceGrid');
  if (!grid) return;

  const date = state.currentDate;
  const dayAtt = getEffectiveAttendance(date);
  const { attend, remote, absent } = computeAttendanceCounts(date, dayAtt);

  document.getElementById('statAttendCount').textContent = attend;
  document.getElementById('statRemoteCount').textContent = remote;
  document.getElementById('statAbsentCount').textContent = absent;
  const mobileSum = document.getElementById('mobileAttendSummary');
  if (mobileSum) mobileSum.textContent = `등원 ${attend} · 비대면 ${remote} · 결석 ${absent}`;

  const hasAnyMember = state.members.some(m => Boolean(m && m.name)) || getVisibleMembersOnDate(date).length > 0;
  document.getElementById('emptyRosterBanner')?.classList.toggle('hidden', hasAnyMember);
  document.getElementById('attBatchActions')?.classList.toggle('hidden', !hasAnyMember);
  document.getElementById('actHeaderActions')?.classList.toggle('hidden', !hasAnyMember);
  const topSaveBtn = document.getElementById('manualSaveBtn');
  if (topSaveBtn) topSaveBtn.disabled = !hasAnyMember;
  grid.classList.toggle('hidden', !hasAnyMember);
  document.getElementById('activityBodyWrap')?.classList.toggle('hidden', !hasAnyMember);
  document.getElementById('emptyActivityNotice')?.classList.toggle('hidden', hasAnyMember);
  document.getElementById('mobileSaveBar')?.classList.toggle('hidden', !hasAnyMember);

  // Render exact 1..16 vertical grid with clickable empty slots and accessible ARIA labels
  const slotsCount = Math.max(16, state.members.length);
  const groupSize = Math.ceil(slotsCount / 4);
  const valAriaText = { '○': '등원(○)', '√': '비대면 돌봄(√)', 'X': '결석(X)' };
  let html = '';

  for (let g = 0; g < 4; g++) {
    html += `<div class="att-col-group">`;
    for (let idx = g * groupSize; idx < Math.min((g + 1) * groupSize, slotsCount); idx++) {
      const slotNo = idx + 1;
      const activeMember = getActiveSlotMemberOnDate(slotNo, date);
      const slotOccupant = state.members[idx];

      if (!activeMember) {
        if (slotOccupant && slotOccupant.name && slotOccupant.status === 'WAITING' && (!slotOccupant.waitingDate || slotOccupant.waitingDate <= date)) {
          html += `
            <div class="att-row is-empty">
              <span class="att-no tnum">${slotNo}</span>
              <div class="att-meta-col">
                <span class="att-name">${escapeHtml(slotOccupant.name)}</span>
                ${slotOccupant.age ? `<span class="att-age tnum">(${escapeHtml(slotOccupant.age)}세)</span>` : ''}
              </div>
              <span class="att-waiting-badge">대기중</span>
            </div>
          `;
        } else {
          const blankId = escapeHtml(slotOccupant?.id || `m${slotNo}`);
          html += `
            <button type="button" class="att-row is-empty att-empty-slot-btn" data-action="att-register-slot" data-member-id="${blankId}" aria-label="${slotNo}번 빈 슬롯 이용인 등록">
              <span class="att-no tnum">${slotNo}</span>
              <span class="att-name att-name-blank">빈 슬롯</span>
              <span class="att-blank-badge">+ 등록</span>
            </button>
          `;
        }
        continue;
      }

      const rec = dayAtt[activeMember.id] || { am: '○', pm: '○' };
      const safeId = escapeHtml(activeMember.id);
      const safeName = escapeHtml(activeMember.name);
      const makeSeg = (period, val) => {
        const activeClass = rec[period] === val ? 'is-active' : '';
        const periodKo = period === 'am' ? '오전' : '오후';
        return `<button type="button" class="seg-btn ${activeClass}" data-action="att-seg" data-member-id="${safeId}" data-period="${period}" data-val="${val}" aria-pressed="${rec[period] === val}" aria-label="${safeName} ${periodKo} ${valAriaText[val] || val}">${val}</button>`;
      };
      let mixedTallyHtml = '';
      if (rec.am !== rec.pm) {
        if (rec.am === '○' || rec.pm === '○') {
          mixedTallyHtml = `<span class="att-tally-tag is-ok">집계: 등원</span>`;
        } else if (rec.am === '√' || rec.pm === '√') {
          mixedTallyHtml = `<span class="att-tally-tag is-remote">집계: 비대면</span>`;
        }
      }

      html += `
        <div class="att-row">
          <span class="att-no tnum">${slotNo}</span>
          <button type="button" class="att-name-btn" data-action="att-cycle" data-member-id="${safeId}" aria-label="${safeName} 오전·오후 종일 출결 일괄 전환" title="클릭 시 종일 상태 순환 (○ 등원 → √ 비대면 → X 결석)">
            <span class="att-name-row">
              <span class="att-name">${safeName}</span>
              <span class="att-cycle-hint" aria-hidden="true">종일⇄</span>
            </span>
            <span class="att-sub-row">${activeMember.age ? `<span class="att-age tnum">(${escapeHtml(activeMember.age)}세)</span>` : ''}${mixedTallyHtml}</span>
          </button>
          <div class="att-periods">
            <div class="att-period-line">
              <span class="att-period-label">오전</span>
              <div class="seg-group" role="group" aria-label="${safeName} 오전 출결">
                ${makeSeg('am', '○')}${makeSeg('am', '√')}${makeSeg('am', 'X')}
              </div>
            </div>
            <div class="att-period-line">
              <span class="att-period-label">오후</span>
              <div class="seg-group" role="group" aria-label="${safeName} 오후 출결">
                ${makeSeg('pm', '○')}${makeSeg('pm', '√')}${makeSeg('pm', 'X')}
              </div>
            </div>
          </div>
        </div>
      `;
    }
    html += `</div>`;
  }

  grid.innerHTML = html;
}

function setMemberPeriodAtt(memberId, period, value) {
  if (!state.currentTeacher || !['am', 'pm'].includes(period) || !VALID_ATT_SYMBOLS.has(value)) return;
  const date = state.currentDate;
  const currentDayAtt = getEffectiveAttendance(date);
  const prevRec = {
    am: currentDayAtt[memberId]?.am || '○',
    pm: currentDayAtt[memberId]?.pm || '○'
  };
  if (prevRec[period] === value) return;

  const { dayAtt } = beginDayEdit(date);
  if (!dayAtt[memberId]) dayAtt[memberId] = { am: '', pm: '' };
  dayAtt[memberId][period] = value;

  applyRoutineMemberSync(date, dayAtt);
  renderAttendanceGrid();
  renderActivityRows(false);
  syncSaveIndicatorForDate(date);
}

function cycleMemberFullDayAtt(memberId) {
  if (!state.currentTeacher) return;
  const date = state.currentDate;
  const { dayAtt } = beginDayEdit(date);
  const prevRec = {
    am: dayAtt[memberId]?.am || '○',
    pm: dayAtt[memberId]?.pm || '○'
  };
  const order = ['○', '√', 'X'];
  const next = order[(order.indexOf(prevRec.am) + 1) % order.length];
  dayAtt[memberId] = { am: next, pm: next };

  applyRoutineMemberSync(date, dayAtt);
  renderAttendanceGrid();
  renderActivityRows(false);
  syncSaveIndicatorForDate(date);
}

function markAllAttendance(symbol) {
  if (!state.currentTeacher || !VALID_ATT_SYMBOLS.has(symbol)) return;
  const date = state.currentDate;
  const visible = getVisibleMembersOnDate(date);
  if (visible.length === 0) {
    showToast('출결을 변경할 등록된 이용인이 없습니다.', 'info');
    return;
  }

  const { dayAtt } = beginDayEdit(date);
  visible.forEach(m => {
    dayAtt[m.id] = { am: symbol, pm: symbol };
  });

  applyRoutineMemberSync(date, dayAtt);
  renderAttendanceGrid();
  renderActivityRows(false);
  syncSaveIndicatorForDate(date);
}

function applyRoutineMemberSync(date, dayAtt) {
  const { attend } = computeAttendanceCounts(date, dayAtt);
  const rows = getEffectiveActivityRows(date);
  let updatedAny = false;

  rows.forEach(r => {
    if (r.autoMembers && r.members !== attend) {
      r.members = attend;
      updatedAny = true;
    }
  });
  return updatedAny;
}

// ----------------------------------------------------------------------------
// 9. TAB 1 ACTIVITY TABLE (Focus-Preserving Patch & Delegated Events)
// ----------------------------------------------------------------------------
function buildCategoryOptionsHtml(selectedCategory) {
  let html = `<option value="">-- 대분류 선택 --</option>`;
  state.categories.forEach(c => {
    const sel = selectedCategory === c ? 'selected' : '';
    html += `<option value="${escapeHtml(c)}" ${sel}>${escapeHtml(c)}</option>`;
  });
  return html;
}

function buildProgramOptionsHtml(category, selectedProgId, fallbackName) {
  if (!category) return `<option value="">-- 먼저 대분류 선택 --</option>`;
  let html = `<option value="">-- 프로그램 선택 --</option>`;
  state.programs
    .filter(p => p.category === category)
    .forEach(p => {
      const sel = (selectedProgId && p.id === selectedProgId) || (!selectedProgId && fallbackName === p.name)
        ? 'selected'
        : '';
      html += `<option value="${escapeHtml(p.id)}" ${sel}>${escapeHtml(p.name)}</option>`;
    });
  return html;
}

function renderActivityRows(forceRebuild = true) {
  const tbody = document.getElementById('activityTableBody');
  if (!tbody) return;

  const date = state.currentDate;
  const rows = getEffectiveActivityRows(date);
  const existingTrs = Array.from(tbody.querySelectorAll('tr[data-row-id]'));

  const canPatchInPlace = !forceRebuild &&
    existingTrs.length === rows.length &&
    existingTrs.every((tr, idx) => tr.dataset.rowId === rows[idx].id);

  if (canPatchInPlace) {
    const activeEl = document.activeElement;
    rows.forEach((row, idx) => {
      const tr = existingTrs[idx];
      const isUnassigned = !row.programId && !row.name;
      tr.classList.toggle('is-unassigned', isUnassigned);
      const catSel = tr.querySelector('select[data-field="category"]');
      const progSel = tr.querySelector('select[data-field="program"]');
      const countInp = tr.querySelector('input[data-field="count"]');
      const memInp = tr.querySelector('input[data-field="members"]');
      const autoBtn = tr.querySelector('[data-field="autoMembers"]');

      if (catSel && activeEl !== catSel && catSel.value !== (row.category || '')) {
        catSel.value = row.category || '';
        if (progSel) progSel.innerHTML = buildProgramOptionsHtml(row.category, row.programId, row.name);
      }
      if (progSel) {
        progSel.disabled = !row.category;
        if (activeEl !== progSel && progSel.value !== (row.programId || '')) {
          progSel.value = row.programId || '';
        }
      }
      if (countInp) {
        countInp.disabled = isUnassigned;
        countInp.placeholder = isUnassigned ? '-' : '';
        const targetCount = isUnassigned ? '' : String(row.count);
        if (activeEl !== countInp && String(countInp.value) !== targetCount) {
          countInp.value = targetCount;
        }
      }
      if (memInp) {
        memInp.disabled = isUnassigned;
        memInp.placeholder = isUnassigned ? '-' : '';
        const targetMem = isUnassigned ? '' : String(row.members);
        if (activeEl !== memInp && String(memInp.value) !== targetMem) {
          memInp.value = targetMem;
        }
      }
      tr.querySelectorAll('.step-btn').forEach(btn => {
        btn.disabled = isUnassigned;
      });
      if (autoBtn) {
        autoBtn.disabled = isUnassigned;
        autoBtn.classList.toggle('is-linked', Boolean(row.autoMembers));
        autoBtn.setAttribute('aria-pressed', String(Boolean(row.autoMembers)));
        autoBtn.textContent = row.autoMembers ? '연동' : '직접';
      }
    });
    return;
  }

  let html = '';
  rows.forEach((row, idx) => {
    const linkClass = row.autoMembers ? 'auto-link-btn is-linked' : 'auto-link-btn';
    const linkLabel = row.autoMembers ? '연동' : '직접';
    const safeRowId = escapeHtml(row.id);
    const safeCount = Math.max(0, parseInt(row.count, 10) || 0);
    const safeMembers = Math.max(0, parseInt(row.members, 10) || 0);
    const rowNo = idx + 1;
    const isUnassigned = !row.programId && !row.name;
    const unassignedCls = isUnassigned ? 'is-unassigned' : '';
    const disAttr = isUnassigned ? 'disabled' : '';
    const progDisAttr = row.category ? '' : 'disabled';
    const countValAttr = isUnassigned ? '' : String(safeCount);
    const membersValAttr = isUnassigned ? '' : String(safeMembers);
    const placeholderAttr = isUnassigned ? ' placeholder="-"' : '';

    html += `
      <tr data-row-id="${safeRowId}" class="${unassignedCls}">
        <td class="col-center tnum cell-seq-muted">${rowNo}</td>
        <td>
          <select data-field="category" class="field-select w-full" aria-label="${rowNo}행 대분류">
            ${buildCategoryOptionsHtml(row.category)}
          </select>
        </td>
        <td>
          <select data-field="program" class="field-select w-full" aria-label="${rowNo}행 프로그램" ${progDisAttr}>
            ${buildProgramOptionsHtml(row.category, row.programId, row.name)}
          </select>
        </td>
        <td class="col-center">
          <div class="stepper">
            <button type="button" class="step-btn" data-action="act-step" data-field="count" data-delta="-1" aria-label="${rowNo}행 실시횟수 감소" ${disAttr}>-</button>
            <input type="number" data-field="count" class="step-input tnum" min="0" value="${countValAttr}"${placeholderAttr} aria-label="${rowNo}행 실시횟수" ${disAttr}>
            <button type="button" class="step-btn" data-action="act-step" data-field="count" data-delta="1" aria-label="${rowNo}행 실시횟수 증가" ${disAttr}>+</button>
          </div>
        </td>
        <td class="col-center">
          <div class="member-cell-wrap">
            <div class="stepper">
              <button type="button" class="step-btn" data-action="act-step" data-field="members" data-delta="-1" aria-label="${rowNo}행 참석인원 감소" ${disAttr}>-</button>
              <input type="number" data-field="members" class="step-input tnum" min="0" value="${membersValAttr}"${placeholderAttr} aria-label="${rowNo}행 참석인원" ${disAttr}>
              <button type="button" class="step-btn" data-action="act-step" data-field="members" data-delta="1" aria-label="${rowNo}행 참석인원 증가" ${disAttr}>+</button>
            </div>
            <button type="button" data-field="autoMembers" data-action="act-toggle-auto" class="${linkClass}" aria-pressed="${Boolean(row.autoMembers)}" title="연동: 출결 등원 인원과 자동 맞춤 / 직접: 수동 입력값 유지" ${disAttr}>${linkLabel}</button>
          </div>
        </td>
        <td class="col-center">
          <button type="button" class="icon-trash-btn" data-action="act-delete" aria-label="${rowNo}행 삭제" title="행 삭제">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function onRowCategoryChange(rowId, newCategory) {
  const date = state.currentDate;
  const { rows } = beginDayEdit(date);
  const row = rows.find(r => r.id === rowId);
  if (!row) return;

  row.category = newCategory;
  row.programId = '';
  row.name = '';
  renderActivityRows(true);
  syncSaveIndicatorForDate(date);
}

function onRowProgramChange(rowId, progId) {
  const date = state.currentDate;
  const { rows } = beginDayEdit(date);
  const row = rows.find(r => r.id === rowId);
  if (!row) return;

  const wasUnassigned = !row.programId && !row.name;
  const prog = state.programs.find(p => p.id === progId);
  const isDuplicate = Boolean(prog && rows.some(r => r.id !== rowId && r.programId === prog.id));
  row.programId = prog ? prog.id : '';
  row.name = prog ? prog.name : '';
  if (prog) {
    row.category = prog.category;
    if (wasUnassigned) {
      if (!row.count || row.count <= 0) row.count = 1;
      if (row.autoMembers) {
        row.members = computeAttendanceCounts(date, getEffectiveAttendance(date)).attend;
      }
    }
  }
  renderActivityRows(false);
  if (isDuplicate) {
    showToast('이미 오늘 활동 목록에 있는 프로그램입니다. 한 행에 횟수를 합산하거나 별도 행으로 유지할 수 있습니다.', 'info');
  }
  syncSaveIndicatorForDate(date);
}

function stepRowField(rowId, field, delta) {
  const date = state.currentDate;
  const { rows } = beginDayEdit(date);
  const row = rows.find(r => r.id === rowId);
  if (!row) return;

  row[field] = Math.max(0, (parseInt(row[field], 10) || 0) + delta);
  if (field === 'members') row.autoMembers = false;

  renderActivityRows(false);
  syncSaveIndicatorForDate(date);
}

function setRowField(rowId, field, rawVal) {
  const date = state.currentDate;
  const { rows } = beginDayEdit(date);
  const row = rows.find(r => r.id === rowId);
  if (!row) return;

  row[field] = Math.max(0, parseInt(rawVal, 10) || 0);
  if (field === 'members') row.autoMembers = false;

  renderActivityRows(false);
  syncSaveIndicatorForDate(date);
}

function toggleRowAutoMembers(rowId) {
  const date = state.currentDate;
  const { rows } = beginDayEdit(date);
  const row = rows.find(r => r.id === rowId);
  if (!row) return;

  row.autoMembers = !row.autoMembers;
  if (row.autoMembers) {
    const { attend } = computeAttendanceCounts(date, getEffectiveAttendance(date));
    row.members = attend;
  }
  renderActivityRows(false);
  syncSaveIndicatorForDate(date);
}

function addActivityRow() {
  const date = state.currentDate;
  const { rows } = beginDayEdit(date);
  if (rows.length >= 100) {
    showToast('당일 활동 행은 최대 100개까지 입력할 수 있습니다.', 'error');
    return;
  }
  const { attend } = computeAttendanceCounts(date, getEffectiveAttendance(date));
  rows.push({
    id: makeId('act'),
    programId: '',
    category: '',
    name: '',
    count: 1,
    members: attend,
    autoMembers: true
  });
  renderActivityRows(true);
  syncSaveIndicatorForDate(date);
}

function deleteActivityRow(rowId) {
  const date = state.currentDate;
  const { rows } = beginDayEdit(date);
  const removeIdx = rows.findIndex(r => r.id === rowId);
  if (removeIdx === -1) return;
  const removedRow = { ...rows[removeIdx] };

  state.draftActivity[date] = rows.filter(r => r.id !== rowId);
  renderActivityRows(true);
  syncSaveIndicatorForDate(date);

  if (removedRow.name) {
    showToast(`'${removedRow.name}' 행이 삭제되었습니다.`, 'info', {
      label: '되돌리기',
      onClick: () => {
        if (!state.currentTeacher) return;
        const { rows: curRows } = beginDayEdit(date);
        const insertAt = Math.min(removeIdx, curRows.length);
        curRows.splice(insertAt, 0, removedRow);
        if (state.currentDate === date && state.currentTab === 1) {
          renderActivityRows(true);
          syncSaveIndicatorForDate(date);
        }
      }
    });
  }
}

async function resetRoutinesWithConfirm() {
  const date = state.currentDate;
  const currentRows = getEffectiveActivityRows(date);
  const hasCustom = currentRows.some(r => r.programId && !state.programs.find(p => p.id === r.programId)?.isDaily);
  if (hasCustom) {
    const ok = await askConfirmDialog({
      title: '기본 루틴 초기화',
      message: '현재 작성된 다른 프로그램 기록이 기본 루틴 8행으로 초기화됩니다. 계속하시겠습니까?',
      confirmLabel: '초기화',
      danger: true
    });
    if (!ok) return;
  }
  beginDayEdit(date);
  state.draftActivity[date] = buildDefaultActivityRows(date);
  renderActivityRows(true);
  syncSaveIndicatorForDate(date);
}

// ----------------------------------------------------------------------------
// 10. CLOUD SAVE OPERATIONS (Explicit Save + Dirty State Indicator)
// ----------------------------------------------------------------------------
async function saveBothDayDocsToCloud(date) {
  if (!state.currentTeacher || !isValidCalendarYMD(date)) return { ok: false, error: '유효하지 않은 세션입니다.' };
  const teacherName = state.currentTeacher.name || '선생님';
  const timeText = formatTimeKST();
  const attToSave = state.dirtyDates.has(date) && state.draftAttendance[date]
    ? state.draftAttendance[date]
    : (state.attendanceMap[date] || getEffectiveAttendance(date));
  const actToSave = state.dirtyDates.has(date) && state.draftActivity[date]
    ? state.draftActivity[date]
    : (state.activityMap[date] || getEffectiveActivityRows(date));

  if (state.isDemoMode) {
    state.attendanceMap[date] = JSON.parse(JSON.stringify(attToSave));
    state.activityMap[date] = JSON.parse(JSON.stringify(actToSave));
    state.attendanceMeta[date] = { updatedBy: teacherName, updatedAtText: timeText };
    discardDayDraft(date);
    saveLocalCache();
    syncDeleteDayButtons(date);
    updateSyncBadge('online', '샘플 체험 모드');
    updateSaveIndicator(`저장 완료 · ${teacherName} 선생님 (${timeText})`, false, 'saved');
    return { ok: true };
  }

  if (!state.isFirebaseReady || !state.firestoreDb) {
    state.lastSaveErrorDate = date;
    updateSaveIndicator('오프라인 상태 — 인터넷 연결 후 다시 저장해 주세요.', true, 'error');
    return { ok: false, error: '클라우드와 연결되어 있지 않습니다.' };
  }

  try {
    await Promise.all([
      state.firestoreDb.collection('attendances').doc(date).set({
        records: attToSave,
        updatedBy: teacherName,
        updatedAtText: timeText,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }),
      state.firestoreDb.collection('activities').doc(date).set({
        rows: actToSave.slice(0, 100),
        updatedBy: teacherName,
        updatedAtText: timeText,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      })
    ]);
    state.attendanceMap[date] = JSON.parse(JSON.stringify(attToSave));
    state.activityMap[date] = JSON.parse(JSON.stringify(actToSave));
    state.attendanceMeta[date] = { updatedBy: teacherName, updatedAtText: timeText };
    discardDayDraft(date);
    saveLocalCache();
    syncDeleteDayButtons(date);
    updateSyncBadge('online', '실시간 연결');
    updateSaveIndicator(`저장 완료 · ${teacherName} 선생님 (${timeText})`, false, 'saved');
    return { ok: true };
  } catch (err) {
    state.lastSaveErrorDate = date;
    handleFirestoreError('saveBothDayDocs', err);
    const msg = formatFriendlyError(err, '당일 기록 저장에 실패했습니다.');
    updateSaveIndicator('저장 실패 — 다시 시도해 주세요.', true, 'error');
    showToast(msg, 'error');
    return { ok: false, error: msg };
  }
}

async function manualSaveCurrentDay() {
  if (!state.currentTeacher) return;
  const btn = document.getElementById('manualSaveBtn');
  const btnText = document.getElementById('manualSaveBtnText');
  const mobBtn = document.getElementById('mobileManualSaveBtn');
  const date = state.currentDate;

  if (btn) btn.disabled = true;
  if (mobBtn) { mobBtn.disabled = true; mobBtn.textContent = '저장 중...'; }
  if (btnText) btnText.textContent = '저장 중...';

  const res = await saveBothDayDocsToCloud(date);

  if (btn) btn.disabled = false;
  if (mobBtn) mobBtn.disabled = false;
  syncSaveIndicatorForDate(date);
  if (res.ok) {
    showToast(`${formatKoreanFullDate(date)} 기록이 저장되었습니다.`, 'success');
  } else {
    showToast(res.error || '서버 저장에 실패했습니다. 연결을 확인한 뒤 다시 저장해 주세요.', 'error');
  }
}

async function saveMasterSettingsToCloud(which) {
  if (!state.currentTeacher) return { ok: false };
  pruneCleanDrafts();
  saveLocalCache();
  if (state.isDemoMode) {
    updateSyncBadge('online', '샘플 체험 모드');
    return { ok: true };
  }
  if (!state.isFirebaseReady || !state.firestoreDb) {
    showToast('오프라인 상태라 설정이 서버에 저장되지 않았습니다.', 'error');
    return { ok: false };
  }

  try {
    const writes = [];
    if (!which || which === 'members') {
      writes.push(state.firestoreDb.collection('settings').doc('members').set({
        list: state.members,
        archived: state.archivedMembers
      }));
    }
    if (!which || which === 'programs') {
      writes.push(state.firestoreDb.collection('settings').doc('programs').set({
        list: state.programs,
        categories: state.categories
      }));
    }
    await Promise.all(writes);
    updateSyncBadge('online', '실시간 연결');
    return { ok: true };
  } catch (err) {
    handleFirestoreError(`settings/${which || 'all'}`, err);
    showToast(formatFriendlyError(err, '설정 저장 중 오류가 발생했습니다.'), 'error');
    return { ok: false };
  }
}

function syncDeleteDayButtons(date = state.currentDate) {
  const saved = isDateSaved(date);
  const admin = isCurrentAdmin();
  const canDelete = Boolean(admin && saved);
  document.getElementById('deleteDayRecordBtn')?.classList.toggle('hidden', !canDelete);
  document.getElementById('holidayAdminHint')?.classList.toggle('hidden', !(saved && !admin));
  document.getElementById('printAdminFooter')?.classList.toggle('hidden', !canDelete);
  document.getElementById('printNonAdminHint')?.classList.toggle('hidden', !(saved && !admin));
}

async function deleteCurrentDayRecord() {
  if (!isCurrentAdmin()) {
    showToast('날짜별 기록 삭제(휴관 복원)는 관리자만 실행할 수 있습니다.', 'error');
    return;
  }
  const date = state.currentDate;
  if (!isDateSaved(date)) return;

  const ok = await askConfirmDialog({
    title: '당일 기록 삭제 (휴관 복원)',
    message: `${formatKoreanFullDate(date)}의 출결 및 활동 기록을 모두 삭제하고 미작성(휴관일) 상태로 되돌리시겠습니까?\n삭제된 날짜의 실적은 연간 누계에서 제외됩니다.`,
    confirmLabel: '기록 삭제',
    danger: true
  });
  if (!ok) return;

  try {
    if (state.isFirebaseReady && state.firestoreDb) {
      await Promise.all([
        state.firestoreDb.collection('attendances').doc(date).delete(),
        state.firestoreDb.collection('activities').doc(date).delete()
      ]);
    }
    delete state.attendanceMap[date];
    delete state.attendanceMeta[date];
    delete state.activityMap[date];
    discardDayDraft(date);
    saveLocalCache();

    syncDeleteDayButtons(date);
    if (state.currentTab === 1) {
      renderAttendanceGrid();
      renderActivityRows(true);
      syncSaveIndicatorForDate(date);
    } else if (state.currentTab === 2) {
      renderUnifiedPrintView();
    }
    showToast(`${formatKoreanFullDate(date)} 기록이 삭제되어 휴관일 상태로 복원되었습니다.`, 'success');
  } catch (err) {
    showToast(formatFriendlyError(err, '당일 기록 삭제 중 오류가 발생했습니다.'), 'error');
  }
}

function syncSaveIndicatorForDate(date) {
  syncDeleteDayButtons(date);
  const meta = state.attendanceMeta[date];
  if (state.lastSaveErrorDate === date) {
    updateSaveIndicator('저장 실패 — 다시 시도해 주세요.', true, 'error');
  } else if (hasUnsavedDayChanges(date)) {
    updateSaveIndicator('수정된 내용이 아직 저장되지 않았습니다.', false, 'dirty');
  } else if (state.attendanceMap[date] || state.activityMap[date]) {
    if (meta && meta.updatedBy) {
      updateSaveIndicator(`최근 저장: ${meta.updatedBy} 선생님 (${meta.updatedAtText || ''})`, false, 'saved');
    } else {
      updateSaveIndicator('저장된 기록', false, 'saved');
    }
  } else {
    updateSaveIndicator('저장 전', false, 'draft');
  }
}

// ----------------------------------------------------------------------------
// 11. TAB 2: 1:1 OFFICIAL A4 PAPER PRINT ENGINE (Committed Records Only + Print Date)
// ----------------------------------------------------------------------------
function isDateSaved(date) {
  return Boolean(state.attendanceMap[date] || state.activityMap[date]);
}

/** Builds a single-pass YTD and target-date program stats index for print aggregation. */
function buildProgramYtdIndex(targetDate) {
  const year = targetDate.slice(0, 4);
  const startOfYear = `${year}-01-01`;
  const byId = Object.create(null);
  const byFallbackName = Object.create(null);

  Object.keys(state.activityMap).forEach(d => {
    if (d < startOfYear || d > targetDate) return;
    const rows = state.activityMap[d] || [];
    rows.forEach(r => {
      const c = parseInt(r.count, 10) || 0;
      const m = parseInt(r.members, 10) || 0;
      if (r.programId) {
        const entry = byId[r.programId] || (byId[r.programId] = { todayCount: 0, todayMembers: 0, ytdCount: 0, ytdMembers: 0 });
        entry.ytdCount += c;
        entry.ytdMembers += m;
        if (d === targetDate) {
          entry.todayCount += c;
          entry.todayMembers += m;
        }
      } else if (r.name) {
        const entry = byFallbackName[r.name] || (byFallbackName[r.name] = { todayCount: 0, todayMembers: 0, ytdCount: 0, ytdMembers: 0 });
        entry.ytdCount += c;
        entry.ytdMembers += m;
        if (d === targetDate) {
          entry.todayCount += c;
          entry.todayMembers += m;
        }
      }
    });
  });

  return { byId, byFallbackName };
}

function calculateProgramYtdStats(programId, fallbackName, targetDate) {
  const year = targetDate.slice(0, 4);
  const startOfYear = `${year}-01-01`;

  let ytdCount = 0;
  let ytdMembers = 0;
  let todayCount = 0;
  let todayMembers = 0;

  Object.keys(state.activityMap).forEach(d => {
    if (d < startOfYear || d > targetDate) return;
    const rows = state.activityMap[d] || [];
    rows.forEach(r => {
      const matched = (r.programId && r.programId === programId) ||
        (!r.programId && fallbackName && r.name === fallbackName);
      if (matched) {
        const c = parseInt(r.count, 10) || 0;
        const m = parseInt(r.members, 10) || 0;
        ytdCount += c;
        ytdMembers += m;
        if (d === targetDate) {
          todayCount += c;
          todayMembers += m;
        }
      }
    });
  });

  return { todayCount, todayMembers, ytdCount, ytdMembers };
}

function calculateMemberCareYtdStats(targetDate) {
  const year = targetDate.slice(0, 4);
  const startOfYear = `${year}-01-01`;

  const res = {
    attend: { tc: 0, tm: 0, yc: 0, ym: 0 },
    remote: { tc: 0, tm: 0, yc: 0, ym: 0 },
    waiting: { tc: 0, tm: 0, yc: 0, ym: 0 },
    discharged: { tc: 0, tm: 0, yc: 0, ym: 0 },
    absent: { tc: 0, tm: 0, yc: 0, ym: 0 },
    fever: { tc: 0, tm: 0, yc: 0, ym: 0 }
  };

  Object.keys(state.attendanceMap).forEach(d => {
    if (d < startOfYear || d > targetDate) return;
    const dayAtt = state.attendanceMap[d] || {};
    const { attend, remote, absent } = computeAttendanceCounts(d, dayAtt);

    if (attend > 0) {
      res.attend.yc += 1;
      res.attend.ym += attend;
      res.fever.yc += 1;
      res.fever.ym += attend;
      if (d === targetDate) {
        res.attend.tc = 1; res.attend.tm = attend;
        res.fever.tc = 1; res.fever.tm = attend;
      }
    }
    if (remote > 0) {
      res.remote.yc += 1;
      res.remote.ym += remote;
      if (d === targetDate) { res.remote.tc = 1; res.remote.tm = remote; }
    }
    if (absent > 0) {
      res.absent.yc += 1;
      res.absent.ym += absent;
      if (d === targetDate) { res.absent.tc = 1; res.absent.tm = absent; }
    }
  });

  const waitByDate = {};
  const leaveByDate = {};
  getAllMembersPool().forEach(m => {
    if (!m.name) return;
    if (m.waitingDate && m.waitingDate >= startOfYear && m.waitingDate <= targetDate) {
      waitByDate[m.waitingDate] = (waitByDate[m.waitingDate] || 0) + 1;
    } else if (m.status === 'WAITING' && m.joinDate && m.joinDate >= startOfYear && m.joinDate <= targetDate) {
      waitByDate[m.joinDate] = (waitByDate[m.joinDate] || 0) + 1;
    }
    if (m.status === 'DISCHARGED' && m.leaveDate && m.leaveDate >= startOfYear && m.leaveDate <= targetDate) {
      leaveByDate[m.leaveDate] = (leaveByDate[m.leaveDate] || 0) + 1;
    }
  });

  Object.entries(waitByDate).forEach(([d, cnt]) => {
    res.waiting.yc += 1;
    res.waiting.ym += cnt;
    if (d === targetDate) { res.waiting.tc = 1; res.waiting.tm = cnt; }
  });

  Object.entries(leaveByDate).forEach(([d, cnt]) => {
    res.discharged.yc += 1;
    res.discharged.ym += cnt;
    if (d === targetDate) { res.discharged.tc = 1; res.discharged.tm = cnt; }
  });

  return res;
}

function renderSlashCell(todayVal, ytdVal) {
  const topHtml = todayVal > 0 ? `<span class="slash-top">${todayVal.toLocaleString()}</span>` : '';
  const bottomHtml = ytdVal > 0 ? `<span class="slash-bottom">${ytdVal.toLocaleString()}</span>` : '';

  return `<td class="slash-td"><div class="slash-box"><svg class="slash-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" stroke-width="0.8" vector-effect="non-scaling-stroke"/></svg>${topHtml}${bottomHtml}</div></td>`;
}

function getProgById(progId) {
  return state.programs.find(p => p.id === progId) || null;
}

function getTargetText(prog) {
  if (!prog || !prog.target || prog.target <= 0) return '';
  return Number(prog.target).toLocaleString();
}

function togglePrintDateDisplay(checked) {
  state.showPrintDate = Boolean(checked);
  saveLocalCache();
  const hdr = document.getElementById('printDateHeader');
  if (hdr) {
    hdr.classList.toggle('hidden', !state.showPrintDate);
  }
}

async function commitCurrentDayDefaultFromPrint() {
  const date = state.currentDate;
  const ok = await askConfirmDialog({
    title: '기본 기록 생성 확인',
    message: `${formatKoreanFullDate(date)} 날짜에 전원 등원(○) 및 매일 기본 루틴으로 기록을 생성하시겠습니까?\n(휴관일인 경우 생성하지 마세요.)`,
    confirmLabel: '기록 생성'
  });
  if (!ok) return;

  const res = await saveBothDayDocsToCloud(date);
  renderUnifiedPrintView();
  if (res.ok) {
    showToast(`${formatKoreanFullDate(date)} 기본 기록이 생성되었습니다.`, 'success');
  }
}

function renderPrintAttendanceTable() {
  const container = document.getElementById('printAttendanceContainer');
  if (!container) return;

  const date = state.currentDate;
  const saved = Boolean(state.attendanceMap[date]);
  const dayAtt = saved ? state.attendanceMap[date] : {};
  const slots = [];

  for (let slotNo = 1; slotNo <= 16; slotNo++) {
    const m = getActiveSlotMemberOnDate(slotNo, date);
    if (m) {
      slots.push({
        no: slotNo,
        name: m.name,
        age: m.age,
        rec: saved ? (dayAtt[m.id] || { am: '○', pm: '○' }) : { am: '', pm: '' }
      });
    } else {
      slots.push({ no: slotNo, name: '', age: '', rec: { am: '', pm: '' } });
    }
  }

  let html = `
    <table class="doc-table">
      <colgroup>
        ${'<col class="doc-att-col-no"><col class="doc-att-col-name"><col class="doc-att-col-p"><col class="doc-att-col-s">'.repeat(4)}
      </colgroup>
      <thead>
        <tr>
          <th scope="colgroup" colspan="16" class="doc-title-cell">이용인 출결사항(등원○/비대면 돌봄√)</th>
        </tr>
        <tr class="doc-head-band">
          ${'<th scope="col">번호</th><th scope="col">이름</th><th scope="colgroup" colspan="2">출석</th>'.repeat(4)}
        </tr>
      </thead>
      <tbody>
  `;

  for (let row = 0; row < 4; row++) {
    html += `<tr>`;
    for (let grp = 0; grp < 4; grp++) {
      const slot = slots[grp * 4 + row];
      const nameHtml = slot.name
        ? `${escapeHtml(slot.name)}${slot.age ? `<br>(${escapeHtml(slot.age)})` : ''}`
        : '';
      html += `
        <td rowspan="2" class="doc-cell-bold">${slot.no}</td>
        <td rowspan="2">${nameHtml}</td>
        <td class="doc-att-period">오전</td>
        <td class="doc-cell-bold">${escapeHtml(slot.rec.am || '')}</td>
      `;
    }
    html += `</tr><tr>`;
    for (let grp = 0; grp < 4; grp++) {
      const slot = slots[grp * 4 + row];
      html += `
        <td class="doc-att-period">오후</td>
        <td class="doc-cell-bold">${escapeHtml(slot.rec.pm || '')}</td>
      `;
    }
    html += `</tr>`;
  }

  html += `</tbody></table>`;
  container.innerHTML = html;
}

function renderPrintReport() {
  const date = state.currentDate;
  const saved = isDateSaved(date);

  const banner = document.getElementById('unrecordedDayBanner');
  if (banner) banner.classList.toggle('hidden', saved);
  syncDeleteDayButtons(date);

  const dateHeader = document.getElementById('printDateHeader');
  if (dateHeader) {
    dateHeader.textContent = formatKoreanFullDate(date);
    dateHeader.classList.toggle('hidden', !state.showPrintDate);
  }
  const chk = document.getElementById('printShowDateChk');
  if (chk) chk.checked = Boolean(state.showPrintDate);

  renderPrintAttendanceTable();
  const container = document.getElementById('printMainGridContainer');
  if (!container) return;

  const care = calculateMemberCareYtdStats(date);
  const ytdIndex = buildProgramYtdIndex(date);

  const statFor = (prog) => {
    if (!prog) return { todayCount: 0, todayMembers: 0, ytdCount: 0, ytdMembers: 0 };
    const byId = prog.id ? ytdIndex.byId[prog.id] : null;
    const byName = prog.name ? ytdIndex.byFallbackName[prog.name] : null;
    return {
      todayCount: (byId?.todayCount || 0) + (byName?.todayCount || 0),
      todayMembers: (byId?.todayMembers || 0) + (byName?.todayMembers || 0),
      ytdCount: (byId?.ytdCount || 0) + (byName?.ytdCount || 0),
      ytdMembers: (byId?.ytdMembers || 0) + (byName?.ytdMembers || 0)
    };
  };

  const medSlots = ['p_med_1', 'p_med_2', 'p_med_3', 'p_med_4'].map(getProgById);
  const psySlots = ['p_psy_1', 'p_psy_2', 'p_psy_3', 'p_psy_4'].map(getProgById);
  const eduSlots = ['p_edu_1', 'p_edu_2', 'p_edu_3', 'p_edu_4', 'p_edu_5', 'p_edu_6'].map(getProgById);

  // Rebalance 4. 사회재활: 10 wide columns in upper block, 5 columns in lower block (comfortable A4 fit)
  const socUpperSlots = [
    'p_soc_1', 'p_soc_2', 'p_soc_3', 'p_soc_4', 'p_soc_5',
    'p_soc_6', 'p_soc_7', 'p_soc_8', 'p_soc_9', 'p_soc_10'
  ].map(getProgById);

  const socLowerSlots = [
    'p_soc_11', 'p_soc_12', 'p_soc_13', 'p_soc_14', 'p_soc_15'
  ].map(getProgById);

  const lifeMeal = getProgById('p_life_1');
  const lifeSnack = getProgById('p_life_2');
  const lifeOthers = ['p_life_3', 'p_life_4', 'p_life_5', 'p_life_6', 'p_life_7'].map(getProgById);

  const comLink = getProgById('p_com_1');
  const comYear = getProgById('p_com_2');
  const comVolAct = getProgById('p_com_3');
  const comVolRec = getProgById('p_com_4');
  const comVolMgr = getProgById('p_com_5');

  const prNews = getProgById('p_pr_1');
  const prOut = getProgById('p_pr_2');
  const rdEdu = getProgById('p_rd_1');
  const rdMeet = getProgById('p_rd_2');
  const rdPrac = getProgById('p_rd_3');

  const labelColStyle = `<col class="doc-label-col">`;
  const renderBlockCols = (count) => `<colgroup>${labelColStyle}${'<col>'.repeat(count - 1)}</colgroup>`;

  // ---------------- BLOCK 1: 이용인관리 + 1. 의료재활 (11 cols balanced) ----------------
  const medStats = medSlots.map(statFor);
  const block1Html = `
    <table class="doc-table">
      ${renderBlockCols(11)}
      <thead>
        <tr class="doc-head-band">
          <th scope="colgroup" colspan="6">이용인관리</th>
          <th scope="colgroup" colspan="5">1. 의료재활</th>
        </tr>
        <tr class="doc-sub-head">
          <th scope="col">구분</th>
          <th scope="colgroup" colspan="2">이용인</th>
          <th scope="col" rowspan="2">대기</th>
          <th scope="col" rowspan="2">퇴소</th>
          <th scope="col" rowspan="2">휴원 외</th>
          <th scope="col" rowspan="2">발열확인</th>
          ${medSlots.map(p => `<th scope="col">${p ? formatSafeProgramLabel(p) : ''}</th>`).join('')}
        </tr>
        <tr class="doc-sub-head">
          <th scope="col">목표</th>
          <th scope="col">등원</th>
          <th scope="col">비대면 돌봄</th>
          ${medSlots.map(p => `<th scope="col" class="doc-target-cell">${getTargetText(p)}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" class="doc-label-col">실(회)</th>
          ${renderSlashCell(care.attend.tc, care.attend.yc)}
          ${renderSlashCell(care.remote.tc, care.remote.yc)}
          ${renderSlashCell(care.waiting.tc, care.waiting.yc)}
          ${renderSlashCell(care.discharged.tc, care.discharged.yc)}
          ${renderSlashCell(care.absent.tc, care.absent.yc)}
          ${renderSlashCell(care.fever.tc, care.fever.yc)}
          ${medStats.map(s => renderSlashCell(s.todayCount, s.ytdCount)).join('')}
        </tr>
        <tr>
          <th scope="row" class="doc-label-col">연인원</th>
          ${renderSlashCell(care.attend.tm, care.attend.ym)}
          ${renderSlashCell(care.remote.tm, care.remote.ym)}
          ${renderSlashCell(care.waiting.tm, care.waiting.ym)}
          ${renderSlashCell(care.discharged.tm, care.discharged.ym)}
          ${renderSlashCell(care.absent.tm, care.absent.ym)}
          ${renderSlashCell(care.fever.tm, care.fever.ym)}
          ${medStats.map(s => renderSlashCell(s.todayMembers, s.ytdMembers)).join('')}
        </tr>
      </tbody>
    </table>
  `;

  // ---------------- BLOCK 2: 2. 사회심리재활 + 3. 교육재활 (11 cols balanced) ----------------
  const psyStats = psySlots.map(statFor);
  const eduStats = eduSlots.map(statFor);
  const block2Html = `
    <table class="doc-table">
      ${renderBlockCols(11)}
      <thead>
        <tr class="doc-head-band">
          <th scope="colgroup" colspan="5">2. 사회심리재활</th>
          <th scope="colgroup" colspan="6">3. 교육재활</th>
        </tr>
        <tr class="doc-sub-head">
          <th scope="col">구분</th>
          ${psySlots.map(p => `<th scope="col">${p ? formatSafeProgramLabel(p) : ''}</th>`).join('')}
          ${eduSlots.map(p => `<th scope="col">${p ? formatSafeProgramLabel(p) : ''}</th>`).join('')}
        </tr>
        <tr class="doc-sub-head">
          <th scope="col">목표</th>
          ${psySlots.map(p => `<th scope="col" class="doc-target-cell">${getTargetText(p)}</th>`).join('')}
          ${eduSlots.map(p => `<th scope="col" class="doc-target-cell">${getTargetText(p)}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" class="doc-label-col">실(회)</th>
          ${psyStats.map(s => renderSlashCell(s.todayCount, s.ytdCount)).join('')}
          ${eduStats.map(s => renderSlashCell(s.todayCount, s.ytdCount)).join('')}
        </tr>
        <tr>
          <th scope="row" class="doc-label-col">연인원</th>
          ${psyStats.map(s => renderSlashCell(s.todayMembers, s.ytdMembers)).join('')}
          ${eduStats.map(s => renderSlashCell(s.todayMembers, s.ytdMembers)).join('')}
        </tr>
      </tbody>
    </table>
  `;

  // ---------------- BLOCK 3: 4. 사회재활 상단 (11 cols wide) ----------------
  const socUpperStats = socUpperSlots.map(statFor);
  const block3Html = `
    <table class="doc-table">
      ${renderBlockCols(11)}
      <thead>
        <tr class="doc-head-band">
          <th scope="colgroup" colspan="11">4. 사회재활 (주요 프로그램)</th>
        </tr>
        <tr class="doc-sub-head">
          <th scope="col">구분</th>
          ${socUpperSlots.map(p => `<th scope="col">${p ? formatSafeProgramLabel(p) : ''}</th>`).join('')}
        </tr>
        <tr class="doc-sub-head">
          <th scope="col">목표</th>
          ${socUpperSlots.map(p => `<th scope="col" class="doc-target-cell">${getTargetText(p)}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" class="doc-label-col">실(회)</th>
          ${socUpperStats.map(s => renderSlashCell(s.todayCount, s.ytdCount)).join('')}
        </tr>
        <tr>
          <th scope="row" class="doc-label-col">연인원</th>
          ${socUpperStats.map(s => renderSlashCell(s.todayMembers, s.ytdMembers)).join('')}
        </tr>
      </tbody>
    </table>
  `;

  // ---------------- BLOCK 4: 4. 사회재활 하단 + 5. 일상생활지원 (13 cols) ----------------
  const socLowerStats = socLowerSlots.map(statFor);
  const sMeal = statFor(lifeMeal);
  const sSnack = statFor(lifeSnack);
  const sLifeOthers = lifeOthers.map(statFor);

  const block4Html = `
    <table class="doc-table">
      ${renderBlockCols(13)}
      <thead>
        <tr class="doc-head-band">
          <th scope="colgroup" colspan="6">4. 사회재활 (계속)</th>
          <th scope="colgroup" colspan="7">5. 일상생활지원</th>
        </tr>
        <tr class="doc-sub-head">
          <th scope="col" rowspan="2">구분</th>
          ${socLowerSlots.map(p => `<th scope="col" rowspan="2">${p ? formatSafeProgramLabel(p) : ''}</th>`).join('')}
          <th scope="colgroup" colspan="2">급식지원</th>
          ${lifeOthers.map(p => `<th scope="col" rowspan="2">${p ? formatSafeProgramLabel(p) : ''}</th>`).join('')}
        </tr>
        <tr class="doc-sub-head">
          <th scope="col">${formatSafeProgramLabel(lifeMeal, '급식')}</th>
          <th scope="col">${formatSafeProgramLabel(lifeSnack, '간식')}</th>
        </tr>
        <tr class="doc-sub-head">
          <th scope="col">목표</th>
          ${socLowerSlots.map(p => `<th scope="col" class="doc-target-cell">${getTargetText(p)}</th>`).join('')}
          <th scope="col" class="doc-target-cell">${getTargetText(lifeMeal)}</th>
          <th scope="col" class="doc-target-cell">${getTargetText(lifeSnack)}</th>
          ${lifeOthers.map(p => `<th scope="col" class="doc-target-cell">${getTargetText(p)}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" class="doc-label-col">실(회)</th>
          ${socLowerStats.map(s => renderSlashCell(s.todayCount, s.ytdCount)).join('')}
          ${renderSlashCell(sMeal.todayCount, sMeal.ytdCount)}
          ${renderSlashCell(sSnack.todayCount, sSnack.ytdCount)}
          ${sLifeOthers.map(s => renderSlashCell(s.todayCount, s.ytdCount)).join('')}
        </tr>
        <tr>
          <th scope="row" class="doc-label-col">연인원</th>
          ${socLowerStats.map(s => renderSlashCell(s.todayMembers, s.ytdMembers)).join('')}
          ${renderSlashCell(sMeal.todayMembers, sMeal.ytdMembers)}
          ${renderSlashCell(sSnack.todayMembers, sSnack.ytdMembers)}
          ${sLifeOthers.map(s => renderSlashCell(s.todayMembers, s.ytdMembers)).join('')}
        </tr>
      </tbody>
    </table>
  `;

  // ---------------- BLOCK 5: 6. 지역사회자원개발 + 7. 홍보 + 8. 연구개발 (11 cols balanced) ----------------
  const sComLink = statFor(comLink);
  const sComYear = statFor(comYear);
  const sVolAct = statFor(comVolAct);
  const sVolRec = statFor(comVolRec);
  const sVolMgr = statFor(comVolMgr);
  const sPrNews = statFor(prNews);
  const sPrOut = statFor(prOut);
  const sRdEdu = statFor(rdEdu);
  const sRdMeet = statFor(rdMeet);
  const sRdPrac = statFor(rdPrac);

  const mgrLabel = comVolMgr && comVolMgr.target > 0
    ? `${formatSafeProgramLabel(comVolMgr, '관리')}(${Number(comVolMgr.target).toLocaleString()})`
    : formatSafeProgramLabel(comVolMgr, '관리');

  const noTargetMergedHeader = (prog, fallbackText) => {
    const label = formatSafeProgramLabel(prog, fallbackText);
    const t = getTargetText(prog);
    return t ? `<th scope="col" rowspan="2">${label}</th>` : `<th scope="col" rowspan="3">${label}</th>`;
  };

  const block5Html = `
    <table class="doc-table">
      ${renderBlockCols(11)}
      <thead>
        <tr class="doc-head-band">
          <th scope="colgroup" colspan="6">6. 지역사회자원개발</th>
          <th scope="colgroup" colspan="2">7. 홍보</th>
          <th scope="colgroup" colspan="3">8. 연구개발</th>
        </tr>
        <tr class="doc-sub-head">
          <th scope="col" rowspan="2">구 분</th>
          <th scope="col" rowspan="2">${formatSafeProgramLabel(comLink, '지역사회자원연계')}</th>
          <th scope="col" rowspan="2">${formatSafeProgramLabel(comYear, '송년행사')}</th>
          <th scope="colgroup" colspan="3">봉사 · 후원자</th>
          <th scope="col" rowspan="2">${formatSafeProgramLabel(prNews, '소식지')}</th>
          ${noTargetMergedHeader(prOut, '대외홍보')}
          ${noTargetMergedHeader(rdEdu, '교육/연수')}
          ${noTargetMergedHeader(rdMeet, '회의')}
          ${noTargetMergedHeader(rdPrac, '실습지도')}
        </tr>
        <tr class="doc-sub-head">
          <th scope="col">${formatSafeProgramLabel(comVolAct, '활동')}</th>
          <th scope="col">${formatSafeProgramLabel(comVolRec, '모집')}</th>
          <th scope="col">${mgrLabel}</th>
        </tr>
        <tr class="doc-sub-head">
          <th scope="col">목표</th>
          <th scope="col" class="doc-target-cell">${getTargetText(comLink)}</th>
          <th scope="col" class="doc-target-cell">${getTargetText(comYear)}</th>
          <th scope="col" class="doc-target-cell">${getTargetText(comVolAct)}</th>
          <th scope="col" class="doc-target-cell">${getTargetText(comVolRec)}</th>
          <th scope="col" class="doc-target-cell"></th>
          <th scope="col" class="doc-target-cell">${getTargetText(prNews)}</th>
          ${getTargetText(prOut) ? `<th scope="col" class="doc-target-cell">${getTargetText(prOut)}</th>` : ''}
          ${getTargetText(rdEdu) ? `<th scope="col" class="doc-target-cell">${getTargetText(rdEdu)}</th>` : ''}
          ${getTargetText(rdMeet) ? `<th scope="col" class="doc-target-cell">${getTargetText(rdMeet)}</th>` : ''}
          ${getTargetText(rdPrac) ? `<th scope="col" class="doc-target-cell">${getTargetText(rdPrac)}</th>` : ''}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row" class="doc-label-col">실(회)</th>
          ${renderSlashCell(sComLink.todayCount, sComLink.ytdCount)}
          ${renderSlashCell(sComYear.todayCount, sComYear.ytdCount)}
          ${renderSlashCell(sVolAct.todayCount, sVolAct.ytdCount)}
          ${renderSlashCell(sVolRec.todayCount, sVolRec.ytdCount)}
          ${renderSlashCell(sVolMgr.todayCount, sVolMgr.ytdCount)}
          ${renderSlashCell(sPrNews.todayCount, sPrNews.ytdCount)}
          ${renderSlashCell(sPrOut.todayCount, sPrOut.ytdCount)}
          ${renderSlashCell(sRdEdu.todayCount, sRdEdu.ytdCount)}
          ${renderSlashCell(sRdMeet.todayCount, sRdMeet.ytdCount)}
          ${renderSlashCell(sRdPrac.todayCount, sRdPrac.ytdCount)}
        </tr>
        <tr>
          <th scope="row" class="doc-label-col">연인원</th>
          ${renderSlashCell(sComLink.todayMembers, sComLink.ytdMembers)}
          ${renderSlashCell(sComYear.todayMembers, sComYear.ytdMembers)}
          ${renderSlashCell(sVolAct.todayMembers, sVolAct.ytdMembers)}
          ${renderSlashCell(sVolRec.todayMembers, sVolRec.ytdMembers)}
          ${renderSlashCell(sVolMgr.todayMembers, sVolMgr.ytdMembers)}
          ${renderSlashCell(sPrNews.todayMembers, sPrNews.ytdMembers)}
          ${renderSlashCell(sPrOut.todayMembers, sPrOut.ytdMembers)}
          ${renderSlashCell(sRdEdu.todayMembers, sRdEdu.ytdMembers)}
          ${renderSlashCell(sRdMeet.todayMembers, sRdMeet.ytdMembers)}
          ${renderSlashCell(sRdPrac.todayMembers, sRdPrac.ytdMembers)}
        </tr>
      </tbody>
    </table>
  `;

  // Any custom user-added programs & custom major categories appear cleanly in chunked dedicated overflow blocks
  const categoryOrder = new Map();
  state.categories.forEach((c, idx) => categoryOrder.set(c, idx));
  const overflowProgs = state.programs
    .filter(p => !FIXED_DOC_IDS.has(p.id))
    .slice()
    .sort((a, b) => {
      const ia = categoryOrder.has(a.category) ? categoryOrder.get(a.category) : 999;
      const ib = categoryOrder.has(b.category) ? categoryOrder.get(b.category) : 999;
      return ia - ib;
    });

  const extraBlocks = [];
  for (let i = 0; i < overflowProgs.length; i += 10) {
    extraBlocks.push(overflowProgs.slice(i, i + 10));
  }

  let overflowHtml = '';
  let prevChunkLastCategory = '';
  extraBlocks.forEach(chunk => {
    const oStats = chunk.map(statFor);
    const runs = [];
    chunk.forEach(p => {
      const cat = p.category || '기타';
      if (runs.length > 0 && runs[runs.length - 1].category === cat) {
        runs[runs.length - 1].count += 1;
      } else {
        runs.push({ category: cat, count: 1 });
      }
    });
    const bandHeadersHtml = runs.map((run, idx) => {
      const baseLabel = DEFAULT_CATEGORIES.includes(run.category)
        ? `${run.category} (추가)`
        : run.category;
      const label = idx === 0 && prevChunkLastCategory === run.category
        ? `${baseLabel} (계속)`
        : baseLabel;
      const span = idx === 0 ? run.count + 1 : run.count;
      return `<th scope="colgroup" colspan="${span}">${escapeHtml(label)}</th>`;
    }).join('');
    prevChunkLastCategory = chunk[chunk.length - 1]?.category || '';

    overflowHtml += `
      <table class="doc-table">
        ${renderBlockCols(chunk.length + 1)}
        <thead>
          <tr class="doc-head-band">${bandHeadersHtml}</tr>
          <tr class="doc-sub-head">
            <th scope="col">구분</th>
            ${chunk.map(p => `<th scope="col">${escapeHtml(p.name)}</th>`).join('')}
          </tr>
          <tr class="doc-sub-head">
            <th scope="col">목표</th>
            ${chunk.map(p => `<th scope="col" class="doc-target-cell">${getTargetText(p)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" class="doc-label-col">실(회)</th>
            ${oStats.map(s => renderSlashCell(s.todayCount, s.ytdCount)).join('')}
          </tr>
          <tr>
            <th scope="row" class="doc-label-col">연인원</th>
            ${oStats.map(s => renderSlashCell(s.todayMembers, s.ytdMembers)).join('')}
          </tr>
        </tbody>
      </table>
    `;
  });

  container.innerHTML = block1Html + block2Html + block3Html + block4Html + block5Html + overflowHtml;
  const paperDoc = document.getElementById('dailyPaperDoc') || document.querySelector('#tab2View .daily-paper-doc');
  if (paperDoc) {
    paperDoc.classList.toggle('is-compact-print', extraBlocks.length === 1);
    paperDoc.classList.toggle('is-ultra-compact-print', extraBlocks.length >= 2);
  }
  const overflowBanner = document.getElementById('printOverflowBanner');
  if (overflowBanner) {
    overflowBanner.classList.toggle('hidden', overflowProgs.length === 0);
    if (overflowProgs.length > 0) {
      const oTitle = document.getElementById('printOverflowTitle');
      const oDesc = document.getElementById('printOverflowDesc');
      if (oTitle) {
        oTitle.textContent = extraBlocks.length >= 2
          ? `추가 프로그램 ${overflowProgs.length}개(하단 ${extraBlocks.length}개 블록)가 포함되었습니다`
          : `추가 등록 프로그램 ${overflowProgs.length}개가 하단 블록에 포함되었습니다`;
      }
      if (oDesc) {
        if (extraBlocks.length === 1) {
          oDesc.textContent = '추가 등록된 대분류 및 프로그램까지 A4 1장 안에 들어오도록 인쇄 표 간격이 자동 맞춤 적용되었습니다.';
        } else if (extraBlocks.length === 2) {
          oDesc.textContent = '추가 블록이 2개라 초압축 모드가 자동 적용되어 A4 1장에 맞추어 출력됩니다.';
        } else {
          oDesc.textContent = '추가 등록 프로그램이 21개 이상이라 2장으로 나뉠 수 있습니다. 1장 출력을 원하시면 인쇄 창 [배율 → 맞춤]을 선택해 주세요.';
        }
      }
    }
  }
}

function setPrintTargetDoc(mode) {
  const validMode = mode === 'journal' || mode === 'both' ? mode : 'daily';
  state.printTargetDoc = validMode;
  try {
    if (state.currentTeacher) {
      localStorage.setItem(STORAGE_KEYS.printTargetDoc, validMode);
    }
  } catch (_) {}
  if (state.currentTab === 2) {
    document.body.dataset.printDoc = validMode;
    renderUnifiedPrintView();
  }
}

function renderUnifiedPrintView() {
  const mode = state.printTargetDoc === 'journal' || state.printTargetDoc === 'both'
    ? state.printTargetDoc
    : 'daily';
  document.body.dataset.printDoc = state.currentTab === 4 ? 'journal' : (state.currentTab === 2 ? mode : 'daily');

  document.querySelectorAll('#printDocModeGroup [data-print-mode]').forEach(btn => {
    const isMatch = btn.dataset.printMode === mode;
    btn.classList.toggle('is-active', isMatch);
    btn.setAttribute('aria-pressed', String(isMatch));
  });

  document.getElementById('printShowDateWrap')?.classList.toggle('hidden', mode === 'journal');
  const printBtnText = document.getElementById('printReportBtnText');
  if (printBtnText) {
    if (mode === 'journal') printBtnText.textContent = '운영일지 인쇄 / PDF';
    else if (mode === 'both') printBtnText.textContent = '두 서식 함께 인쇄 (2장)';
    else printBtnText.textContent = '일일기록지 인쇄 / PDF';
  }

  document.getElementById('unifiedDailyPrintSection')?.classList.toggle('hidden', mode === 'journal');
  document.getElementById('unifiedJournalPrintSection')?.classList.toggle('hidden', mode === 'daily');

  const date = state.currentDate;
  const unrecJournalBanner = document.getElementById('unrecordedJournalBanner');
  if (unrecJournalBanner) {
    unrecJournalBanner.classList.toggle('hidden', mode === 'daily' || isJournalSaved(date));
  }

  if (mode !== 'journal') {
    renderPrintReport();
  }
  if (mode !== 'daily') {
    renderJournalPrintPreview();
  }
}

async function requestUnifiedPrint(overrideMode = null) {
  if (!state.currentTeacher) return;
  const rawMode = overrideMode || state.printTargetDoc || 'daily';
  const mode = rawMode === 'journal' || rawMode === 'both' ? rawMode : 'daily';
  const date = state.currentDate;
  const hasAnyMember = state.members.some(m => Boolean(m && m.name)) || getVisibleMembersOnDate(date).length > 0;

  if (mode !== 'journal') {
    if (hasUnsavedDayChanges(date)) {
      const choice = await askConfirmDialog({
        title: '저장되지 않은 일일 활동 기록 인쇄 확인',
        message: `${formatKoreanFullDate(date)}의 수정한 출결·활동 내용이 아직 저장되지 않았습니다.\n저장한 뒤 인쇄할까요?`,
        confirmLabel: '저장 후 인쇄',
        altLabel: '저장 전 상태로 인쇄',
        cancelLabel: '취소'
      });
      if (choice === false) return;
      if (choice === true) {
        await manualSaveCurrentDay();
        if (state.lastSaveErrorDate === date) return;
      }
    } else if (!isDateSaved(date) && hasAnyMember) {
      const choice = await askConfirmDialog({
        title: '미확정 일일 활동 기록 인쇄 확인',
        message: `${formatKoreanFullDate(date)}은 아직 확정 저장되지 않은 날짜입니다.\n기본 출결(전원 등원)·루틴으로 먼저 확정 저장한 뒤 인쇄할까요?`,
        confirmLabel: '확정 저장 후 인쇄',
        altLabel: '빈칸(휴관일) 그대로 인쇄',
        cancelLabel: '취소'
      });
      if (choice === false) return;
      if (choice === true) {
        await manualSaveCurrentDay();
        if (state.lastSaveErrorDate === date) return;
      }
    }
  }

  if (mode !== 'daily' && hasUnsavedJournalChanges(date)) {
    const choice = await askConfirmDialog({
      title: '저장되지 않은 운영일지 인쇄 확인',
      message: `${formatKoreanFullDate(date)}의 수정한 운영일지 내용이 아직 저장되지 않았습니다.\n저장한 뒤 인쇄할까요?`,
      confirmLabel: '저장 후 인쇄',
      altLabel: '현재 입력대로 인쇄',
      cancelLabel: '취소'
    });
    if (choice === false) return;
    if (choice === true) {
      await manualSaveCurrentJournal();
      if (state.lastJournalSaveErrorDate === date) return;
    }
  }

  document.body.dataset.printDoc = mode;
  if (mode !== 'journal') renderPrintReport();
  if (mode !== 'daily') renderJournalPrintPreview();
  window.print();
}

async function requestPrintCurrentDay() {
  return requestUnifiedPrint('daily');
}

// ----------------------------------------------------------------------------
// 11B. TAB 4: 주간보호 운영일지 (Scanned Form Preview, Warnings & A4 Auto-Fit)
// ----------------------------------------------------------------------------
let journalWritersModalDraft = [];

function getEffectiveJournalWriters() {
  if (state.journalWritersConfigured && state.journalWriters.length > 0) {
    const hasLoadedTeachers = Object.keys(state.teachersMap || {}).length > 0;
    return state.journalWriters.filter(w => {
      if (!w.active || !w.name) return false;
      if (w.uid && hasLoadedTeachers && !state.teachersMap[w.uid]) return false;
      return true;
    });
  }
  const staff = getTeacherList().filter(t => t.role !== 'admin');
  if (staff.length > 0) {
    return staff.map(t => ({
      id: `jw_${t.uid}`,
      uid: t.uid,
      name: t.name,
      active: true
    }));
  }
  return [{ id: 'jw_default_1', uid: '', name: '', active: true }];
}

function getAbsenteeSummaryFromAttendance(date) {
  const dayAtt = getEffectiveAttendance(date);
  const absList = [];
  getVisibleMembersOnDate(date).forEach(m => {
    const rec = dayAtt[m.id];
    if (!rec) return;
    if (rec.am === 'X' && rec.pm === 'X') {
      absList.push(m.name);
    } else if (rec.am === 'X') {
      absList.push(`${m.name}(오전 결석)`);
    } else if (rec.pm === 'X') {
      absList.push(`${m.name}(오후 결석)`);
    }
  });
  return absList.join(', ').slice(0, 120);
}

function buildDefaultJournalDoc(date) {
  const writers = getEffectiveJournalWriters();
  const tasks = writers.map(w => ({ id: w.id || makeId('jw'), name: w.name, content: '' }));

  return normalizeJournalDoc({
    date,
    safetyCheck: false,
    envCheck: false,
    absentees: getAbsenteeSummaryFromAttendance(date),
    absentReason: '',
    amPrograms: '',
    amStaff: '',
    amDetail: '',
    pmPrograms: '',
    pmStaff: '',
    pmDetail: '',
    residentNotes: '',
    staffTasks: tasks,
    sponsorItems: '',
    etcNotes: '',
    kitchenVolunteer: '',
    vmsCount: ''
  }, date);
}

function getEffectiveJournalDoc(date) {
  if (state.dirtyJournalDates.has(date) && state.draftJournal[date]) {
    return state.draftJournal[date];
  }
  if (state.journalMap[date]) return state.journalMap[date];
  if (!state.draftJournal[date]) {
    state.draftJournal[date] = buildDefaultJournalDoc(date);
  }
  return state.draftJournal[date];
}

function isJournalSaved(date) {
  return Boolean(state.journalMap[date]);
}

function hasUnsavedJournalChanges(date = state.currentDate) {
  return Boolean(date && state.dirtyJournalDates.has(date));
}

function beginJournalEdit(date) {
  if (!state.dirtyJournalDates.has(date)) {
    const base = state.journalMap[date] || state.draftJournal[date] || buildDefaultJournalDoc(date);
    state.draftJournal[date] = JSON.parse(JSON.stringify(base));
    state.dirtyJournalDates.add(date);
  }
  if (state.lastJournalSaveErrorDate === date) state.lastJournalSaveErrorDate = '';
  return state.draftJournal[date];
}

function discardJournalDraft(date) {
  delete state.draftJournal[date];
  state.dirtyJournalDates.delete(date);
  if (state.lastJournalSaveErrorDate === date) state.lastJournalSaveErrorDate = '';
}

function pullAbsentFromAttendanceToJournal() {
  const date = state.currentDate;
  const summary = getAbsenteeSummaryFromAttendance(date);
  const doc = beginJournalEdit(date);
  doc.absentees = summary;
  const inp = document.getElementById('jAbsentees');
  if (inp) inp.value = summary;
  if (!summary) {
    showToast('출석부에 결석으로 표시된 이용인이 없습니다.', 'info');
  }
  renderJournalPrintPreview();
  syncJournalSaveIndicatorForDate(date);
}

function populateJournalProgramPickers() {
  const optsHtml = (() => {
    let html = `<option value="">+ 등록 프로그램 선택 추가</option>`;
    state.categories.forEach(cat => {
      const catProgs = state.programs.filter(p => p.category === cat);
      if (catProgs.length === 0) return;
      html += `<optgroup label="${escapeHtml(cat)}">`;
      catProgs.forEach(p => {
        html += `<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)}</option>`;
      });
      html += `</optgroup>`;
    });
    return html;
  })();

  ['jAmProgPicker', 'jPmProgPicker'].forEach(id => {
    const sel = document.getElementById(id);
    if (sel) {
      sel.innerHTML = optsHtml;
      sel.value = '';
    }
  });
}

function appendPickedProgramToField(period, progName) {
  if (!progName) return;
  const date = state.currentDate;
  const doc = beginJournalEdit(date);
  const field = period === 'am' ? 'amPrograms' : 'pmPrograms';
  const inputId = period === 'am' ? 'jAmPrograms' : 'jPmPrograms';
  const existing = String(doc[field] || '')
    .split(/[,，\n]+/)
    .map(s => s.trim())
    .filter(Boolean);
  if (!existing.includes(progName)) {
    existing.push(progName);
  }
  const nextVal = existing.join(', ').slice(0, 160);
  doc[field] = nextVal;
  const inp = document.getElementById(inputId);
  if (inp) inp.value = nextVal;
  renderJournalProgramWarnings();
  renderJournalPrintPreview();
  syncJournalSaveIndicatorForDate(date);
}

function evaluateJournalProgramWarnings(date, rawProgStr) {
  const tokens = String(rawProgStr || '')
    .split(/[,，\n]+/)
    .map(s => s.trim())
    .filter(Boolean);
  if (tokens.length === 0) return [];

  const masterNames = new Set(state.programs.map(p => p.name));
  const unknownMaster = tokens.filter(t => !masterNames.has(t));

  const hasDailyRecord = isDateSaved(date) || hasUnsavedDayChanges(date);
  const dailyRows = getEffectiveActivityRows(date).filter(r => (r.programId || r.name) && (parseInt(r.count, 10) || 0) > 0);
  const dailyNames = new Set(
    dailyRows.map(r => {
      if (r.programId) {
        const found = state.programs.find(p => p.id === r.programId);
        if (found) return found.name;
      }
      return r.name || '';
    }).filter(Boolean)
  );

  const warnings = [];
  if (unknownMaster.length > 0) {
    warnings.push(`전체 등록 프로그램 목록에 없는 이름: ${unknownMaster.join(', ')}`);
  }
  if (!hasDailyRecord) {
    warnings.push("당일 '일일 활동 기록'이 아직 작성·저장되지 않았습니다.");
  } else {
    const missingToday = tokens.filter(t => masterNames.has(t) && !dailyNames.has(t));
    if (missingToday.length > 0) {
      warnings.push(`당일 '일일 활동 기록'에 입력되지 않은 프로그램: ${missingToday.join(', ')}`);
    }
  }
  return warnings;
}

function renderJournalProgramWarnings() {
  const date = state.currentDate;
  const doc = getEffectiveJournalDoc(date);

  [
    { elId: 'jAmProgWarn', raw: doc.amPrograms },
    { elId: 'jPmProgWarn', raw: doc.pmPrograms }
  ].forEach(({ elId, raw }) => {
    const box = document.getElementById(elId);
    if (!box) return;
    const warnings = evaluateJournalProgramWarnings(date, raw);
    box.classList.toggle('hidden', warnings.length === 0);
    box.textContent = warnings.length > 0 ? `주의: ${warnings.join(' / ')}` : '';
  });
}

function estimateJournalLineUnits(text, charsPerLine = 42, minUnits = 1) {
  const raw = String(text || '').trim();
  if (!raw) return minUnits;
  let units = 0;
  raw.split('\n').forEach(line => {
    const len = line.trim().length;
    units += Math.max(1, Math.ceil(len / charsPerLine));
  });
  return Math.max(minUnits, units);
}

function toGrowClass(units, maxWeight = 10) {
  const clamped = Math.max(1, Math.min(maxWeight, Math.round(units)));
  return `j-grow-${clamped}`;
}

function fitJournalPaperToSinglePage() {
  const docEl = document.getElementById('journalPaperDoc');
  const overflowBanner = document.getElementById('journalOverflowBanner');
  if (!docEl) return;

  const appShell = document.getElementById('appShell');
  if (appShell && appShell.classList.contains('hidden')) return;

  const restoreFns = [];
  const tab2 = document.getElementById('tab2View');
  const secJ = document.getElementById('unifiedJournalPrintSection');
  [tab2, secJ].forEach(el => {
    if (el && el.classList.contains('hidden')) {
      el.classList.remove('hidden');
      restoreFns.push(() => el.classList.add('hidden'));
    }
  });

  let stillOverflow = false;
  try {
    if (docEl.offsetParent === null && window.matchMedia && !window.matchMedia('print').matches) {
      return;
    }
    for (let step = 0; step <= 5; step++) {
      docEl.classList.remove('fit-step-0', 'fit-step-1', 'fit-step-2', 'fit-step-3', 'fit-step-4', 'fit-step-5');
      docEl.classList.add(`fit-step-${step}`);
      const frame = docEl.querySelector('.journal-frame');
      const flexBody = docEl.querySelector('.j-flex-body');
      const boxes = Array.from(docEl.querySelectorAll('.j-fit-box'));
      const boxOverflows = boxes.some(b => b.scrollHeight > b.clientHeight + 2);
      const frameOverflows = Boolean(frame && frame.scrollHeight > frame.clientHeight + 2);
      const bodyOverflows = Boolean(flexBody && flexBody.scrollHeight > flexBody.clientHeight + 2);
      const docOverflows = docEl.clientHeight > 0 && (docEl.scrollHeight > docEl.clientHeight + 2);
      if (!boxOverflows && !frameOverflows && !bodyOverflows && !docOverflows) {
        stillOverflow = false;
        break;
      }
      stillOverflow = true;
    }
    if (overflowBanner) {
      overflowBanner.classList.toggle('hidden', !stillOverflow);
    }
  } finally {
    restoreFns.reverse().forEach(fn => fn());
  }
}

function renderJournalPrintPreview() {
  const docEl = document.getElementById('journalPaperDoc');
  if (!docEl) return;

  const date = state.currentDate;
  const doc = getEffectiveJournalDoc(date);
  const fullDateStr = formatKoreanFullDate(date);
  const safetyText = doc.safetyCheck ? '확인 (☑)' : '';
  const envText = doc.envCheck ? '확인 (☑)' : '';

  const formatPeriodHtml = (progStr, detailStr) => {
    const pClean = String(progStr || '').trim();
    const dClean = String(detailStr || '');
    const progHtml = pClean ? `<div class="j-prog-tag-line">[${escapeHtml(pClean)}]</div>` : '';
    return `${progHtml}${escapeHtml(dClean)}`;
  };

  const amUnits = estimateJournalLineUnits((doc.amPrograms ? doc.amPrograms + '\n' : '') + doc.amDetail, 34, 2);
  const pmUnits = estimateJournalLineUnits((doc.pmPrograms ? doc.pmPrograms + '\n' : '') + doc.pmDetail, 34, 2);
  const amGrow = toGrowClass(amUnits, 8);
  const pmGrow = toGrowClass(pmUnits, 8);

  const rawTasks = Array.isArray(doc.staffTasks) && doc.staffTasks.length > 0
    ? doc.staffTasks
    : [{ id: 'jw_empty', name: '', content: '' }];

  const staffUnitsList = rawTasks.map(t => estimateJournalLineUnits(t.content, 52, 2));
  const serviceTotal = Math.max(4, Math.min(8, Math.round((amUnits + pmUnits) / 2)));
  const staffSum = Math.max(6, Math.min(10, Math.round(staffUnitsList.reduce((a, b) => a + b, 0) * 0.7)));
  const serviceGrow = toGrowClass(serviceTotal, 8);
  const staffSectionGrow = toGrowClass(Math.max(serviceTotal + 1, staffSum), 10);

  const staffRowsHtml = rawTasks.map((t, idx) => {
    const rowGrow = toGrowClass(staffUnitsList[idx], 10);
    return `
      <div class="j-staff-item ${rowGrow}">
        <div class="j-staff-name-cell">${escapeHtml(t.name || '')}</div>
        <div class="j-staff-task-cell">
          <div class="j-fit-box">${escapeHtml(t.content || '')}</div>
        </div>
      </div>
    `;
  }).join('');

  const vmsNumStr = doc.vmsCount !== '' && doc.vmsCount !== undefined ? escapeHtml(String(doc.vmsCount)) : '';

  docEl.innerHTML = `
    <div class="journal-top-head">
      <h2 class="journal-doc-title">주간보호 운영일지</h2>
      <table class="journal-approval-table" aria-label="결재란">
        <tbody>
          <tr>
            <th scope="row" rowspan="2" class="journal-approval-vlabel">결<br>재</th>
            <th scope="col">담 당</th>
            <th scope="col">선 임</th>
            <th scope="col">센터장</th>
          </tr>
          <tr>
            <td class="journal-approval-stamp"></td>
            <td class="journal-approval-stamp"></td>
            <td class="journal-approval-stamp"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="journal-frame">
      <div class="j-row-fixed j-header-row-1">
        <div class="j-cell j-cell-label">일 자</div>
        <div class="j-cell j-cell-center tnum">${escapeHtml(fullDateStr)}</div>
        <div class="j-cell j-cell-label">안전점검</div>
        <div class="j-cell j-cell-center">${safetyText}</div>
        <div class="j-cell j-cell-label">환경점검</div>
        <div class="j-cell j-cell-center">${envText}</div>
      </div>

      <div class="j-row-fixed j-header-row-2">
        <div class="j-cell j-cell-label">결 석</div>
        <div class="j-cell j-cell-center">${escapeHtml(doc.absentees || '')}</div>
        <div class="j-cell j-cell-label">결석사유</div>
        <div class="j-cell">${escapeHtml(doc.absentReason || '')}</div>
      </div>

      <div class="j-row-fixed j-service-head">
        <div class="j-cell j-cell-label">서비스</div>
        <div class="j-cell j-cell-label">담당(지원/봉사)인력</div>
        <div class="j-cell j-cell-label">세부내용</div>
      </div>

      <div class="j-flex-body">
        <div class="j-service-split ${serviceGrow}">
          <div class="j-prog-vertical-label">프<br>로<br>그<br>램</div>
          <div class="j-ampm-rows">
            <div class="j-ampm-row ${amGrow}">
              <div class="j-period-cell">오전</div>
              <div class="j-staff-col-cell"><div class="j-fit-box">${escapeHtml(doc.amStaff || '')}</div></div>
              <div class="j-detail-col-cell"><div class="j-fit-box">${formatPeriodHtml(doc.amPrograms, doc.amDetail)}</div></div>
            </div>
            <div class="j-ampm-row ${pmGrow}">
              <div class="j-period-cell">오후</div>
              <div class="j-staff-col-cell"><div class="j-fit-box">${escapeHtml(doc.pmStaff || '')}</div></div>
              <div class="j-detail-col-cell"><div class="j-fit-box">${formatPeriodHtml(doc.pmPrograms, doc.pmDetail)}</div></div>
            </div>
          </div>
        </div>

        <div class="j-notes-row">
          <div class="j-cell j-cell-label">이용인<br>특이사항</div>
          <div class="j-notes-val">${escapeHtml(doc.residentNotes || '')}</div>
        </div>

        <div class="j-band-title">업무사항</div>

        <div class="j-staff-list ${staffSectionGrow}">
          ${staffRowsHtml}
        </div>
      </div>

      <div class="j-footer-grid">
        <div class="j-foot-sponsor-lbl">후원<br>물품 외</div>
        <div class="j-foot-sponsor-val">${escapeHtml(doc.sponsorItems || '')}</div>
        <div class="j-foot-etc-lbl">기 타<br>(전달사항 외)</div>
        <div class="j-foot-etc-val">${escapeHtml(doc.etcNotes || '')}</div>
        <div class="j-foot-kitchen-lbl">주방봉사</div>
        <div class="j-foot-kitchen-val">${escapeHtml(doc.kitchenVolunteer || '')}</div>
        <div class="j-foot-vms-lbl">VMS등록<br>봉사인원</div>
        <div class="j-foot-vms-val"><span>${vmsNumStr}</span><span>명</span></div>
      </div>
    </div>

    <div class="journal-facility-footer">종합사회복지관 · 주간보호시설</div>
  `;

  fitJournalPaperToSinglePage();
}

function renderJournalStaffInputs() {
  const container = document.getElementById('journalStaffInputsContainer');
  if (!container) return;

  const doc = getEffectiveJournalDoc(state.currentDate);
  const rows = Array.isArray(doc.staffTasks) ? doc.staffTasks : [];
  if (rows.length === 0) {
    container.innerHTML = `<p class="subtext-secondary">표시된 업무사항 작성자가 없습니다. <strong>[+ 당일 작성자 칸 추가]</strong> 또는 <strong>[업무사항 담당자 고정 명단 설정]</strong>을 이용해 주세요.</p>`;
    return;
  }

  container.innerHTML = rows.map((row, idx) => `
    <div class="journal-staff-row" data-jstaff-idx="${idx}">
      <div>
        <label class="sr-only" for="jStaffName_${idx}">작성자 ${idx + 1} 이름</label>
        <input id="jStaffName_${idx}" type="text" class="field-input" data-jstaff-field="name" data-jstaff-idx="${idx}" value="${escapeHtml(row.name || '')}" maxlength="20" placeholder="선생님 성함">
      </div>
      <div>
        <label class="sr-only" for="jStaffContent_${idx}">${escapeHtml(row.name || '담당자')} 업무사항</label>
        <textarea id="jStaffContent_${idx}" class="field-textarea" rows="3" data-jstaff-field="content" data-jstaff-idx="${idx}" maxlength="3000" placeholder="${escapeHtml(row.name || '사회복지사')} 선생님 당일 업무사항 입력">${escapeHtml(row.content || '')}</textarea>
      </div>
      <button type="button" class="icon-trash-btn" data-jstaff-action="remove" data-jstaff-idx="${idx}" aria-label="${escapeHtml(row.name || String(idx + 1))} 칸 삭제" title="이 날짜에서 칸 삭제">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        </svg>
      </button>
    </div>
  `).join('');
}

function renderJournalView() {
  const date = state.currentDate;
  // 미저장·미수정 기본 초안은 매번 새로 생성 (출석부 결석자·담당자 명단 변경을 즉시 반영)
  if (!state.dirtyJournalDates.has(date) && !state.journalMap[date]) {
    delete state.draftJournal[date];
  }
  const doc = getEffectiveJournalDoc(date);

  populateJournalProgramPickers();

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = Boolean(val);
    else el.value = val ?? '';
  };

  setVal('jSafetyCheck', doc.safetyCheck);
  setVal('jEnvCheck', doc.envCheck);
  setVal('jAbsentees', doc.absentees);
  setVal('jAbsentReason', doc.absentReason);
  setVal('jAmPrograms', doc.amPrograms);
  setVal('jAmStaff', doc.amStaff);
  setVal('jAmDetail', doc.amDetail);
  setVal('jPmPrograms', doc.pmPrograms);
  setVal('jPmStaff', doc.pmStaff);
  setVal('jPmDetail', doc.pmDetail);
  setVal('jResidentNotes', doc.residentNotes);
  setVal('jSponsorItems', doc.sponsorItems);
  setVal('jEtcNotes', doc.etcNotes);
  setVal('jKitchenVolunteer', doc.kitchenVolunteer);
  setVal('jVmsCount', doc.vmsCount);

  renderJournalStaffInputs();
  renderJournalProgramWarnings();
  renderJournalPrintPreview();
  syncJournalSaveIndicatorForDate(date);
}

function handleJournalStaticFieldEdit(target) {
  if (!state.currentTeacher || !target) return;
  const idMap = {
    jSafetyCheck: 'safetyCheck',
    jEnvCheck: 'envCheck',
    jAbsentees: 'absentees',
    jAbsentReason: 'absentReason',
    jAmPrograms: 'amPrograms',
    jAmStaff: 'amStaff',
    jAmDetail: 'amDetail',
    jPmPrograms: 'pmPrograms',
    jPmStaff: 'pmStaff',
    jPmDetail: 'pmDetail',
    jResidentNotes: 'residentNotes',
    jSponsorItems: 'sponsorItems',
    jEtcNotes: 'etcNotes',
    jKitchenVolunteer: 'kitchenVolunteer',
    jVmsCount: 'vmsCount'
  };
  const field = idMap[target.id];
  if (!field) return;

  const date = state.currentDate;
  const doc = beginJournalEdit(date);
  if (target.type === 'checkbox') {
    doc[field] = Boolean(target.checked);
  } else if (field === 'vmsCount') {
    const raw = String(target.value || '').trim();
    if (!raw) doc.vmsCount = '';
    else {
      const parsed = Math.max(0, Math.min(999, parseInt(raw, 10) || 0));
      doc.vmsCount = String(parsed);
    }
  } else {
    doc[field] = String(target.value || '');
  }

  if (field === 'amPrograms' || field === 'pmPrograms') {
    renderJournalProgramWarnings();
  }
  renderJournalPrintPreview();
  syncJournalSaveIndicatorForDate(date);
}

function addDayStaffRowToJournal() {
  const date = state.currentDate;
  const doc = beginJournalEdit(date);
  if (doc.staffTasks.length >= 20) {
    showToast('업무사항 칸은 하루 최대 20개까지 추가할 수 있습니다.', 'error');
    return;
  }
  const newIdx = doc.staffTasks.length;
  doc.staffTasks.push({ id: makeId('jw'), name: '', content: '' });
  renderJournalStaffInputs();
  renderJournalPrintPreview();
  syncJournalSaveIndicatorForDate(date);
  setTimeout(() => {
    document.getElementById(`jStaffName_${newIdx}`)?.focus();
  }, 0);
}

function syncJournalDeleteButton(date = state.currentDate) {
  const saved = isJournalSaved(date);
  const admin = isCurrentAdmin();
  const canDelete = Boolean(admin && saved);
  document.getElementById('deleteJournalDayBtn')?.classList.toggle('hidden', !canDelete);
  document.getElementById('journalDeleteAdminHint')?.classList.toggle('hidden', !(saved && !admin));
}

function syncJournalSaveIndicatorForDate(date = state.currentDate) {
  syncJournalDeleteButton(date);
  const pill = document.getElementById('journalSaveStatePill');
  const saveBtn = document.getElementById('saveJournalBtn');
  const saveText = document.getElementById('saveJournalBtnText');
  const footerInd = document.getElementById('journalSaveStatusIndicator');
  const meta = state.journalMap[date];

  let kind = 'draft';
  let footerMsg = '저장 전';
  if (state.lastJournalSaveErrorDate === date) {
    kind = 'error';
    footerMsg = '저장 실패 — 다시 시도해 주세요.';
  } else if (hasUnsavedJournalChanges(date)) {
    kind = 'dirty';
    footerMsg = '수정된 내용이 아직 저장되지 않았습니다.';
  } else if (isJournalSaved(date)) {
    kind = 'saved';
    footerMsg = meta?.updatedBy
      ? `최근 저장: ${meta.updatedBy} 선생님 (${meta.updatedAtText || ''})`
      : '저장된 운영일지';
  }

  if (footerInd) {
    footerInd.textContent = footerMsg;
    footerInd.classList.toggle('is-error', kind === 'error');
  }
  if (pill) {
    pill.classList.remove('is-draft', 'is-warn', 'is-saved', 'is-error');
    if (kind === 'error') {
      pill.classList.add('is-error');
      pill.textContent = '저장 실패';
    } else if (kind === 'dirty') {
      pill.classList.add('is-warn');
      pill.textContent = '수정됨 · 저장 필요';
    } else if (kind === 'saved') {
      pill.classList.add('is-saved');
      pill.textContent = '저장 완료 ✓';
    } else {
      pill.classList.add('is-draft');
      pill.textContent = '미저장';
    }
  }
  if (saveBtn) {
    saveBtn.classList.remove('btn-primary', 'btn-secondary', 'btn-subtle', 'btn-danger', 'btn-success');
    if (kind === 'error') {
      saveBtn.classList.add('btn-danger');
      if (saveText) saveText.textContent = '다시 저장';
    } else if (kind === 'saved') {
      saveBtn.classList.add('btn-subtle');
      if (saveText) saveText.textContent = '다시 저장';
    } else {
      saveBtn.classList.add('btn-primary');
      if (saveText) saveText.textContent = '운영일지 저장';
    }
  }
}

async function saveJournalToCloud(date) {
  if (!state.currentTeacher || !isValidCalendarYMD(date)) return { ok: false, error: '유효하지 않은 세션입니다.' };
  const teacherName = state.currentTeacher.name || '선생님';
  const timeText = formatTimeKST();
  const baseDoc = state.dirtyJournalDates.has(date) && state.draftJournal[date]
    ? state.draftJournal[date]
    : (state.journalMap[date] || getEffectiveJournalDoc(date));

  const payload = normalizeJournalDoc({
    ...baseDoc,
    updatedBy: teacherName,
    updatedAtText: timeText
  }, date);

  if (state.isDemoMode) {
    state.journalMap[date] = payload;
    discardJournalDraft(date);
    saveLocalCache();
    syncJournalSaveIndicatorForDate(date);
    updateSyncBadge('online', '샘플 체험 모드');
    return { ok: true };
  }

  if (!state.isFirebaseReady || !state.firestoreDb) {
    state.lastJournalSaveErrorDate = date;
    syncJournalSaveIndicatorForDate(date);
    return { ok: false, error: '클라우드와 연결되어 있지 않습니다.' };
  }

  try {
    await state.firestoreDb.collection('journals').doc(date).set({
      ...payload,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    state.journalMap[date] = payload;
    discardJournalDraft(date);
    saveLocalCache();
    syncJournalSaveIndicatorForDate(date);
    updateSyncBadge('online', '실시간 연결');
    return { ok: true };
  } catch (err) {
    state.lastJournalSaveErrorDate = date;
    handleFirestoreError('saveJournal', err);
    const msg = formatFriendlyError(err, '운영일지 저장에 실패했습니다.');
    syncJournalSaveIndicatorForDate(date);
    return { ok: false, error: msg };
  }
}

async function manualSaveCurrentJournal() {
  if (!state.currentTeacher) return;
  const date = state.currentDate;
  const btn = document.getElementById('saveJournalBtn');
  const btnText = document.getElementById('saveJournalBtnText');
  if (btn) btn.disabled = true;
  if (btnText) btnText.textContent = '저장 중...';

  const res = await saveJournalToCloud(date);

  if (btn) btn.disabled = false;
  syncJournalSaveIndicatorForDate(date);
  if (res.ok) {
    showToast(`${formatKoreanFullDate(date)} 운영일지가 저장되었습니다.`, 'success');
  } else {
    showToast(res.error || '운영일지 저장에 실패했습니다.', 'error');
  }
}

async function deleteCurrentJournalRecord() {
  if (!isCurrentAdmin()) {
    showToast('운영일지 삭제는 관리자만 실행할 수 있습니다.', 'error');
    return;
  }
  const date = state.currentDate;
  if (!isJournalSaved(date)) return;

  const ok = await askConfirmDialog({
    title: '운영일지 삭제 확인',
    message: `${formatKoreanFullDate(date)}에 저장된 운영일지를 삭제하시겠습니까?`,
    confirmLabel: '삭제',
    danger: true
  });
  if (!ok) return;

  try {
    if (state.isFirebaseReady && state.firestoreDb) {
      await state.firestoreDb.collection('journals').doc(date).delete();
    }
    delete state.journalMap[date];
    discardJournalDraft(date);
    saveLocalCache();
    if (state.currentTab === 4) {
      renderJournalView();
    }
    showToast(`${formatKoreanFullDate(date)} 운영일지가 삭제되었습니다.`, 'success');
  } catch (err) {
    showToast(formatFriendlyError(err, '운영일지 삭제 중 오류가 발생했습니다.'), 'error');
  }
}

async function requestPrintCurrentJournal() {
  return requestUnifiedPrint('journal');
}

function buildMergedWritersDraft() {
  const teachers = getTeacherList();
  const byUid = new Map();
  teachers.forEach(t => byUid.set(t.uid, t));

  const merged = [];
  const seenUids = new Set();

  if (state.journalWritersConfigured && state.journalWriters.length > 0) {
    state.journalWriters.forEach(w => {
      if (w.uid) {
        const t = byUid.get(w.uid);
        if (!t) return;
        seenUids.add(w.uid);
        merged.push({ id: w.id || `jw_${w.uid}`, uid: w.uid, name: t.name, role: t.role, active: Boolean(w.active) });
      } else if (w.name) {
        merged.push({ id: w.id || makeId('jw'), uid: '', name: w.name, role: 'custom', active: Boolean(w.active) });
      }
    });
  }

  teachers.forEach(t => {
    if (!seenUids.has(t.uid)) {
      merged.push({
        id: `jw_${t.uid}`,
        uid: t.uid,
        name: t.name,
        role: t.role,
        active: t.role !== 'admin'
      });
    }
  });

  return merged;
}

function renderJournalWritersModalList() {
  const listEl = document.getElementById('journalWritersList');
  if (!listEl) return;

  if (journalWritersModalDraft.length === 0) {
    listEl.innerHTML = `<div class="journal-writer-item"><span class="subtext-secondary">등록된 선생님이 없습니다. 아래에서 이름을 직접 추가하세요.</span></div>`;
    return;
  }

  listEl.innerHTML = journalWritersModalDraft.map((w, idx) => {
    const badge = w.role === 'admin' ? '관리자' : (w.role === 'custom' ? '직접추가' : '선생님');
    const delBtn = w.uid === ''
      ? `<button type="button" class="btn btn-danger-outline btn-sm" data-jw-action="delete" data-jw-idx="${idx}">삭제</button>`
      : '';
    return `
      <div class="journal-writer-item">
        <label class="journal-writer-main">
          <input type="checkbox" data-jw-action="toggle" data-jw-idx="${idx}" ${w.active ? 'checked' : ''}>
          <span>${escapeHtml(w.name)}</span>
          <span class="status-pill is-waiting">${badge}</span>
        </label>
        <div class="journal-writer-actions">
          <button type="button" class="btn btn-subtle btn-sm" data-jw-action="up" data-jw-idx="${idx}" ${idx === 0 ? 'disabled' : ''} aria-label="${escapeHtml(w.name)} 위로 이동">↑</button>
          <button type="button" class="btn btn-subtle btn-sm" data-jw-action="down" data-jw-idx="${idx}" ${idx === journalWritersModalDraft.length - 1 ? 'disabled' : ''} aria-label="${escapeHtml(w.name)} 아래로 이동">↓</button>
          ${delBtn}
        </div>
      </div>
    `;
  }).join('');
}

function openJournalWritersDialog() {
  const dlg = document.getElementById('journalWritersDialog');
  if (!dlg) return;
  showAuthError('journalWritersError', '');
  const addInp = document.getElementById('newCustomWriterInput');
  if (addInp) addInp.value = '';
  journalWritersModalDraft = buildMergedWritersDraft();
  renderJournalWritersModalList();
  rememberDialogTrigger(dlg);
  dlg.showModal();
}

function addCustomJournalWriter() {
  const inp = document.getElementById('newCustomWriterInput');
  const name = (inp?.value || '').trim().slice(0, 20);
  if (!name) {
    inp?.focus();
    return;
  }
  if (journalWritersModalDraft.length >= 30) {
    showAuthError('journalWritersError', '고정 담당자는 최대 30명까지 등록할 수 있습니다.');
    return;
  }
  journalWritersModalDraft.push({
    id: makeId('jw'),
    uid: '',
    name,
    role: 'custom',
    active: true
  });
  if (inp) inp.value = '';
  showAuthError('journalWritersError', '');
  renderJournalWritersModalList();
}

async function submitJournalWritersDialog(event) {
  event.preventDefault();
  showAuthError('journalWritersError', '');
  const cleanWriters = normalizeJournalWritersList(journalWritersModalDraft);

  try {
    if (state.isFirebaseReady && state.firestoreDb) {
      await state.firestoreDb.collection('settings').doc('journal').set({
        writers: cleanWriters,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
    state.journalWriters = cleanWriters;
    state.journalWritersConfigured = true;
    pruneCleanDrafts();
    saveLocalCache();
    closeDialog('journalWritersDialog');
    if (state.currentTab === 4) {
      renderJournalView();
    }
    showToast('운영일지 업무사항 담당자 명단이 저장되었습니다.', 'success');
  } catch (err) {
    showAuthError('journalWritersError', formatFriendlyError(err, '담당자 명단 저장 중 오류가 발생했습니다.'));
  }
}

// ----------------------------------------------------------------------------
// 12. TAB 3: MEMBERS, PROGRAMS, BACKUP & TEACHER ACCOUNTS (Delegated Events)
// ----------------------------------------------------------------------------
function openMemberMgmtTab() {
  switchTab(3, () => switchMgmtSubTab('members'));
}

function needsBulkDiscardConfirm() {
  return Boolean(state.isBulkMemberMode && state.isBulkDirty);
}

function switchMgmtSubTab(sub) {
  if (sub !== 'members' && needsBulkDiscardConfirm()) {
    askConfirmDialog({
      title: '명단 일괄 입력 취소 확인',
      message: '일괄 입력 중인 내용이 저장되지 않았습니다. 저장하지 않고 다른 관리 화면으로 이동하시겠습니까?',
      confirmLabel: '이동',
      cancelLabel: '계속 입력',
      danger: true
    }).then(ok => {
      if (!ok) return;
      state.isBulkMemberMode = false;
      state.isBulkDirty = false;
      switchMgmtSubTab(sub);
    });
    return false;
  }

  state.currentMgmtSubTab = sub;
  if (sub !== 'members') {
    state.isBulkMemberMode = false;
    state.isBulkDirty = false;
  }
  ['members', 'programs', 'backup', 'accounts'].forEach(key => {
    document.getElementById(`subPanel_${key}`)?.classList.toggle('hidden', key !== sub);
    const btn = document.getElementById(`subBtn_${key}`);
    if (btn) {
      const isMatch = key === sub;
      btn.classList.toggle('is-active', isMatch);
      btn.setAttribute('aria-selected', String(isMatch));
      btn.setAttribute('tabindex', isMatch ? '0' : '-1');
    }
  });

  if (sub === 'members') renderMemberMgmtTable();
  if (sub === 'programs') {
    renderProgramCategoryFilterStrip();
    renderProgramMgmtTable();
  }
  if (sub === 'backup') applyRolePermissions();
  if (sub === 'accounts') {
    applyRolePermissions();
    renderAccountMgmtPanel();
  }
  return true;
}

function setMemberFilter(filter) {
  state.memberFilter = filter;
  document.querySelectorAll('#memberFilterStrip .filter-btn').forEach(btn => {
    const isMatch = btn.dataset.filter === filter;
    btn.classList.toggle('is-active', isMatch);
    btn.setAttribute('aria-pressed', String(isMatch));
  });
  renderMemberMgmtTable();
}

function openBulkMemberMode() {
  if (state.currentTab !== 3) {
    switchTab(3, () => openBulkMemberMode());
    return;
  }
  if (state.currentMgmtSubTab !== 'members') {
    switchMgmtSubTab('members');
  }
  setMemberFilter('ALL');
  state.isBulkMemberMode = true;
  state.isBulkDirty = false;
  renderMemberMgmtTable();
  setTimeout(() => {
    const firstBlank = Array.from(document.querySelectorAll('#memberMgmtTableBody .bulk-name-input'))
      .find(inp => !inp.value.trim()) || document.querySelector('#memberMgmtTableBody .bulk-name-input');
    firstBlank?.focus({ preventScroll: true });
  }, 0);
}

function cancelBulkMemberMode() {
  if (needsBulkDiscardConfirm()) {
    askConfirmDialog({
      title: '명단 일괄 입력 취소 확인',
      message: '일괄 입력 중인 내용이 저장되지 않았습니다. 변경 사항을 버리고 나가시겠습니까?',
      confirmLabel: '변경 사항 버리기',
      cancelLabel: '계속 입력',
      danger: true
    }).then(ok => {
      if (!ok) return;
      state.isBulkMemberMode = false;
      state.isBulkDirty = false;
      renderMemberMgmtTable();
    });
    return;
  }
  state.isBulkMemberMode = false;
  state.isBulkDirty = false;
  renderMemberMgmtTable();
}

async function saveBulkMemberMode() {
  const rows = Array.from(document.querySelectorAll('#memberMgmtTableBody tr[data-bulk-idx]'));
  if (rows.length === 0) {
    state.isBulkMemberMode = false;
    state.isBulkDirty = false;
    renderMemberMgmtTable();
    return;
  }

  let clearedExistingCount = 0;
  const nextMembers = state.members.map(m => ({ ...m }));

  for (const tr of rows) {
    const idx = Number(tr.dataset.bulkIdx);
    const existing = nextMembers[idx];
    if (!existing) continue;

    const rawName = (tr.querySelector('[data-bulk-field="name"]')?.value || '').trim().slice(0, 20);
    const rawAge = parseInt(tr.querySelector('[data-bulk-field="age"]')?.value || '', 10);
    const age = Number.isInteger(rawAge) && rawAge >= 1 && rawAge <= 120 ? rawAge : '';
    const rawStatus = tr.querySelector('[data-bulk-field="status"]')?.value || 'ACTIVE';
    const enteredJoin = sanitizeSafeDateStr(tr.querySelector('[data-bulk-field="joinDate"]')?.value);

    if (!rawName || rawStatus === 'BLANK') {
      if (existing.name) clearedExistingCount++;
      nextMembers[idx] = normalizeMemberRecord({
        id: existing.id || `m${idx + 1}`,
        no: idx + 1,
        name: '',
        age: '',
        status: 'WAITING',
        joinDate: '',
        waitingDate: '',
        leaveDate: ''
      }, idx + 1);
    } else {
      const status = rawStatus === 'WAITING' ? 'WAITING' : 'ACTIVE';
      const effectiveJoin = enteredJoin || (status === 'WAITING' ? (existing.joinDate || '') : (existing.joinDate || state.currentDate));
      nextMembers[idx] = normalizeMemberRecord({
        id: existing.name ? existing.id : (existing.id || `m${idx + 1}`),
        no: idx + 1,
        name: rawName,
        age,
        status,
        joinDate: effectiveJoin,
        waitingDate: status === 'WAITING' ? (existing.waitingDate || enteredJoin || state.currentDate) : (existing.waitingDate || ''),
        leaveDate: ''
      }, idx + 1);
    }
  }

  if (clearedExistingCount > 0) {
    const ok = await askConfirmDialog({
      title: '빈 슬롯 변경 확인',
      message: `기존에 등록되어 있던 이용인 ${clearedExistingCount}명의 성함이 비워졌습니다. 빈 슬롯으로 변경하여 저장하시겠습니까?`,
      confirmLabel: '저장',
      danger: true
    });
    if (!ok) return;
  }

  state.members = nextMembers;
  state.isBulkMemberMode = false;
  state.isBulkDirty = false;
  renderMemberMgmtTable();
  renderAttendanceGrid();
  const res = await saveMasterSettingsToCloud('members');
  if (res.ok) {
    showToast('1~16번 이용인 명단이 일괄 저장되었습니다.', 'success');
  }
}

function findMemberByIdAny(memberId) {
  return state.members.find(m => m.id === memberId) || state.archivedMembers.find(m => m.id === memberId) || null;
}

function renderMemberMgmtTable() {
  const tbody = document.getElementById('memberMgmtTableBody');
  if (!tbody) return;

  const tbl = document.getElementById('memberMgmtTable');
  if (tbl) tbl.classList.toggle('is-bulk-mode', Boolean(state.isBulkMemberMode));

  const summaryBadge = document.getElementById('memberRosterSummary');
  if (summaryBadge) {
    const activeCount = state.members.filter(m => m && m.name && m.status === 'ACTIVE').length;
    const waitCount = state.members.filter(m => m && m.name && m.status === 'WAITING').length;
    const blankCount = state.members.filter(m => !m || !m.name).length;
    const historyCount = state.archivedMembers.length + state.members.filter(m => m && m.name && m.status === 'DISCHARGED').length;
    summaryBadge.textContent = `이용중 ${activeCount} · 대기 ${waitCount} · 빈 슬롯 ${blankCount} · 퇴소이력 ${historyCount}`;
  }

  const bulkBar = document.getElementById('bulkMemberActionBar');
  const filterStrip = document.getElementById('memberFilterStrip');
  const toggleBtn = document.getElementById('toggleBulkMemberBtn');
  const addBtn = document.getElementById('addMemberBtn');

  if (bulkBar) bulkBar.classList.toggle('hidden', !state.isBulkMemberMode);
  if (filterStrip) filterStrip.classList.toggle('hidden', state.isBulkMemberMode);
  if (addBtn) addBtn.classList.toggle('hidden', state.isBulkMemberMode);
  if (toggleBtn) {
    toggleBtn.classList.toggle('hidden', Boolean(state.isBulkMemberMode));
    toggleBtn.textContent = '1~16번 명단 일괄 입력';
    toggleBtn.setAttribute('aria-pressed', String(Boolean(state.isBulkMemberMode)));
  }

  if (state.isBulkMemberMode) {
    let bulkHtml = '';
    for (let idx = 0; idx < 16; idx++) {
      const m = state.members[idx] || normalizeMemberRecord({ id: `m${idx + 1}`, no: idx + 1, status: 'WAITING' }, idx + 1);
      const isExistingDischarged = Boolean(m.name && m.status === 'DISCHARGED');
      if (isExistingDischarged) {
        bulkHtml += `
          <tr>
            <td class="col-center tnum cell-seq-muted" data-label="번호">${idx + 1}</td>
            <td class="cell-strong" data-label="성명">${escapeHtml(m.name)}</td>
            <td class="col-center tnum" data-label="연령">${m.age ? escapeHtml(String(m.age)) + '세' : '-'}</td>
            <td class="col-center" data-label="상태"><span class="status-pill is-discharged">퇴소 (유지)</span></td>
            <td class="col-center tnum" data-label="등록일">${escapeHtml(m.joinDate || '-')}</td>
            <td class="col-center tnum cell-danger col-mem-leave" data-label="퇴소일">${escapeHtml(m.leaveDate || '-')}</td>
            <td class="col-center col-mem-act"><span class="cell-note-muted">퇴소 슬롯 보존</span></td>
          </tr>
        `;
        continue;
      }

      const selStatus = m.name ? (m.status === 'WAITING' ? 'WAITING' : 'ACTIVE') : 'BLANK';
      const joinVal = (m.name && m.status === 'ACTIVE')
        ? (m.joinDate || state.currentDate || getTodayKST())
        : (m.joinDate || '');
      bulkHtml += `
        <tr data-bulk-idx="${idx}" data-orig-named="${m.name ? '1' : '0'}">
          <td class="col-center tnum cell-seq-muted" data-label="번호">${idx + 1}</td>
          <td data-label="성명">
            <input type="text" class="bulk-input bulk-name-input w-full" data-bulk-field="name" data-slot-idx="${idx}" value="${escapeHtml(m.name || '')}" maxlength="20" placeholder="${idx + 1}번 성함 입력 (미입력 시 빈 슬롯)" aria-label="${idx + 1}번 성함">
          </td>
          <td class="col-center" data-label="연령">
            <input type="number" class="bulk-input bulk-age-input tnum" data-bulk-field="age" data-slot-idx="${idx}" value="${escapeHtml(String(m.age ?? ''))}" min="1" max="120" placeholder="세" aria-label="${idx + 1}번 연령">
          </td>
          <td class="col-center" data-label="상태">
            <select class="bulk-select" data-bulk-field="status" data-slot-idx="${idx}" aria-label="${idx + 1}번 상태">
              <option value="BLANK" ${selStatus === 'BLANK' ? 'selected' : ''}>미배정 (빈 슬롯)</option>
              <option value="ACTIVE" ${selStatus === 'ACTIVE' ? 'selected' : ''}>이용중</option>
              <option value="WAITING" ${selStatus === 'WAITING' ? 'selected' : ''}>대기</option>
            </select>
          </td>
          <td class="col-center" data-label="등록일">
            <input type="date" class="bulk-input tnum" data-bulk-field="joinDate" data-slot-idx="${idx}" value="${escapeHtml(joinVal)}" aria-label="${idx + 1}번 등록일">
          </td>
          <td class="col-center tnum col-mem-leave" data-label="퇴소일">-</td>
          <td class="col-center col-mem-act"><span class="cell-note-muted">-</span></td>
        </tr>
      `;
    }
    tbody.innerHTML = bulkHtml;
    return;
  }

  const currentRows = state.members.map(m => ({ ...m, isArchived: false }));
  const archivedRows = state.archivedMembers.map(m => ({ ...m, isArchived: true }));
  const combined = [...currentRows, ...archivedRows];

  const filtered = combined.filter(m => {
    if (state.memberFilter === 'ALL') return true;
    if (state.memberFilter === 'WAITING') return m.status === 'WAITING' && Boolean(m.name);
    return m.status === state.memberFilter;
  });

  let html = '';
  filtered.forEach(m => {
    const safeId = escapeHtml(m.id);
    const slotCellHtml = m.isArchived
      ? `<span class="history-no-tag" title="과거 ${escapeHtml(String(m.no ?? '-'))}번 슬롯 퇴소자">이력</span>`
      : escapeHtml(String(m.no ?? ''));
    let statusBadge = `<span class="status-pill is-blank">미배정</span>`;
    if (m.status === 'DISCHARGED') {
      statusBadge = `<span class="status-pill is-discharged">${m.isArchived ? '퇴소 이력' : '퇴소 (슬롯보류)'}</span>`;
    } else if (m.name && m.status === 'ACTIVE') {
      statusBadge = `<span class="status-pill is-active">이용중</span>`;
    } else if (m.name && m.status === 'WAITING') {
      statusBadge = `<span class="status-pill is-waiting">대기</span>`;
    }

    const actions = [];
    if (m.name) {
      actions.push(`<button type="button" class="btn btn-subtle btn-sm" data-action="member-edit" data-member-id="${safeId}">수정</button>`);
      if (m.status === 'WAITING') {
        actions.push(`<button type="button" class="btn btn-primary btn-sm" data-action="member-activate" data-member-id="${safeId}">이용중 전환</button>`);
      } else if (m.status === 'ACTIVE') {
        actions.push(`<button type="button" class="btn btn-danger-outline btn-sm" data-action="member-discharge" data-member-id="${safeId}">퇴소</button>`);
      } else if (m.status === 'DISCHARGED') {
        actions.push(`<button type="button" class="btn btn-secondary btn-sm" data-action="member-reactivate" data-member-id="${safeId}">복귀</button>`);
      }
    } else {
      actions.push(`<button type="button" class="btn btn-secondary btn-sm" data-action="member-edit" data-member-id="${safeId}">등록</button>`);
    }

    html += `
      <tr>
        <td class="col-center tnum cell-seq-muted" data-label="번호">${slotCellHtml}</td>
        <td class="cell-strong" data-label="성명">${m.name ? escapeHtml(m.name) : '<span class="cell-empty-name">빈 슬롯</span>'}</td>
        <td class="col-center tnum" data-label="연령">${m.age ? escapeHtml(String(m.age)) + '세' : '-'}</td>
        <td class="col-center" data-label="상태">${statusBadge}</td>
        <td class="col-center tnum" data-label="등록일">${escapeHtml(m.joinDate || '-')}</td>
        <td class="col-center tnum cell-danger" data-label="퇴소일">${escapeHtml(m.leaveDate || '-')}</td>
        <td class="col-center td-actions"><div class="sheet-actions actions-center">${actions.join('')}</div></td>
      </tr>
    `;
  });

  tbody.innerHTML = html || `<tr><td colspan="7" class="col-center table-empty-cell">해당 상태의 이용인이 없습니다.</td></tr>`;
}

function syncMemberLeaveDateGroup() {
  const statusVal = document.getElementById('memberEditStatus')?.value;
  document.getElementById('memberLeaveDateGroup')?.classList.toggle('hidden', statusVal !== 'DISCHARGED');
}

function openMemberDialog(memberId) {
  const dlg = document.getElementById('memberDialog');
  const title = document.getElementById('memberDlgTitle');
  const idInput = document.getElementById('memberEditId');
  const nameInput = document.getElementById('memberEditName');
  const ageInput = document.getElementById('memberEditAge');
  const statusSelect = document.getElementById('memberEditStatus');
  const joinInput = document.getElementById('memberEditJoinDate');
  const leaveInput = document.getElementById('memberEditLeaveDate');
  const saveNextBtn = document.getElementById('memberSaveNextBtn');
  const summaryEl = document.getElementById('memberSlotSummary');
  if (summaryEl) {
    const namedCount = state.members.filter(m => Boolean(m && m.name)).length;
    const openNos = state.members.filter(m => m && !m.name).map(m => `${m.no}번`);
    if (openNos.length > 0) {
      const preview = openNos.slice(0, 4).join(', ') + (openNos.length > 4 ? ` 외 ${openNos.length - 4}곳` : '');
      summaryEl.textContent = `현재 등록 ${namedCount}명 · 빈 슬롯 ${openNos.length}개 (${preview})`;
    } else {
      summaryEl.textContent = `현재 등록 ${namedCount}명 · 1~16번 기본 슬롯이 모두 사용 중입니다 (저장 시 추가 슬롯 배정)`;
    }
  }

  showAuthError('memberDlgError', '');

  let isBlankSlotMode = false;
  if (memberId) {
    const m = findMemberByIdAny(memberId);
    if (!m) return;
    isBlankSlotMode = !m.name;
    title.textContent = `${m.no}번 슬롯 ${m.name ? '정보 수정' : '이용인 등록'}`;
    idInput.value = m.id;
    nameInput.value = m.name || '';
    ageInput.value = m.age || '';
    statusSelect.value = m.name ? (m.status || 'ACTIVE') : 'ACTIVE';
    joinInput.value = m.joinDate || state.currentDate;
    leaveInput.value = m.leaveDate || '';
  } else {
    isBlankSlotMode = true;
    title.textContent = '신규 이용인 등록';
    idInput.value = '';
    nameInput.value = '';
    ageInput.value = '';
    statusSelect.value = 'ACTIVE';
    joinInput.value = state.currentDate;
    leaveInput.value = '';
  }

  syncMemberLeaveDateGroup();
  const hasMoreSlots = state.members.some(m => (!m.name && m.id !== memberId) || m.status === 'DISCHARGED');
  if (saveNextBtn) saveNextBtn.classList.toggle('hidden', !(isBlankSlotMode && hasMoreSlots));

  rememberDialogTrigger(dlg);
  if (!dlg.open) dlg.showModal();
  setTimeout(() => nameInput?.focus(), 0);
}

async function submitMemberDialog(event, saveAndNext = false) {
  if (event) event.preventDefault();
  showAuthError('memberDlgError', '');

  const id = document.getElementById('memberEditId').value;
  const name = document.getElementById('memberEditName').value.trim().slice(0, 20);
  const parsedAge = parseInt(document.getElementById('memberEditAge').value, 10);
  const age = Number.isInteger(parsedAge) && parsedAge >= 1 && parsedAge <= 120 ? parsedAge : '';
  const rawStatus = document.getElementById('memberEditStatus').value;
  const status = VALID_MEMBER_STATUSES.has(rawStatus) ? rawStatus : 'ACTIVE';
  const joinDate = sanitizeSafeDateStr(document.getElementById('memberEditJoinDate').value) || state.currentDate;
  const leaveDate = status === 'DISCHARGED'
    ? (sanitizeSafeDateStr(document.getElementById('memberEditLeaveDate').value) || state.currentDate)
    : '';

  if (!name) {
    showAuthError('memberDlgError', '이용인 성명을 입력해 주세요.');
    document.getElementById('memberEditName')?.focus();
    return;
  }

  if (id) {
    const existing = findMemberByIdAny(id);
    if (!existing) return;

    if (existing.name && existing.status !== 'DISCHARGED' && status === 'DISCHARGED') {
      const ok = await askConfirmDialog({
        title: '이용인 퇴소 처리 확인',
        message: `'${name}' 님을 퇴소(${leaveDate}) 상태로 변경하시겠습니까?\n과거 출결 이력은 그대로 보존됩니다.`,
        confirmLabel: '퇴소 처리',
        danger: true
      });
      if (!ok) return;
    }

    const archIdx = state.archivedMembers.findIndex(x => x.id === id);
    if (archIdx !== -1 && status !== 'DISCHARGED') {
      const targetIdx = state.members.findIndex(m => !m.name || m.status === 'DISCHARGED');
      if (targetIdx === -1) {
        showAuthError('memberDlgError', '빈 슬롯 또는 퇴소 슬롯이 없어 복귀할 수 없습니다.');
        return;
      }
      if (state.members[targetIdx].name && state.members[targetIdx].status === 'DISCHARGED') {
        state.archivedMembers.push({ ...state.members[targetIdx] });
      }
      state.archivedMembers.splice(archIdx, 1);
      state.members[targetIdx] = normalizeMemberRecord({
        ...existing,
        no: state.members[targetIdx].no,
        name,
        age,
        status,
        joinDate,
        waitingDate: status === 'WAITING' ? (existing.waitingDate || joinDate) : (existing.waitingDate || ''),
        leaveDate: ''
      }, state.members[targetIdx].no);
    } else {
      existing.name = name;
      existing.age = age;
      existing.status = status;
      existing.joinDate = joinDate;
      existing.leaveDate = leaveDate;
      if (status === 'WAITING' && !existing.waitingDate) {
        existing.waitingDate = joinDate;
      }
    }
  } else {
    const blankIdx = state.members.findIndex(m => !m.name);
    if (blankIdx !== -1) {
      const slotNo = state.members[blankIdx].no;
      state.members[blankIdx] = normalizeMemberRecord({
        id: makeId('m'),
        no: slotNo,
        name,
        age,
        status,
        joinDate,
        waitingDate: status === 'WAITING' ? joinDate : '',
        leaveDate
      }, slotNo);
    } else {
      const dischargedIdx = state.members.findIndex(m => m.status === 'DISCHARGED');
      if (dischargedIdx !== -1) {
        const former = state.members[dischargedIdx];
        state.archivedMembers.push({ ...former });
        state.members[dischargedIdx] = normalizeMemberRecord({
          id: makeId('m'),
          no: former.no,
          name,
          age,
          status,
          joinDate,
          waitingDate: status === 'WAITING' ? joinDate : '',
          leaveDate
        }, former.no);
      } else {
        showAuthError('memberDlgError', '정원 16명 슬롯이 모두 이용중 또는 대기중입니다. 기존 이용인을 퇴소 처리한 뒤 등록해 주세요.');
        return;
      }
    }
  }

  renderMemberMgmtTable();
  renderAttendanceGrid();
  const res = await saveMasterSettingsToCloud('members');
  if (res.ok) {
    showToast(`'${name}' 이용인 정보가 저장되었습니다.`, 'success');
  }

  if (saveAndNext) {
    const nextBlank = state.members.find(m => !m.name);
    if (nextBlank) {
      openMemberDialog(nextBlank.id);
      return;
    }
    if (state.members.some(m => m.status === 'DISCHARGED')) {
      openMemberDialog(null);
      return;
    }
  }
  closeDialog('memberDialog');
}

async function activateWaitingMember(memberId) {
  const m = state.members.find(x => x.id === memberId);
  if (!m) return;
  const ok = await askConfirmDialog({
    title: '이용중 상태 전환',
    message: `'${m.name}' 님을 '이용중' 상태로 전환하시겠습니까?`,
    confirmLabel: '이용중 전환'
  });
  if (!ok) return;
  m.status = 'ACTIVE';
  m.joinDate = state.currentDate;
  m.leaveDate = '';
  renderMemberMgmtTable();
  renderAttendanceGrid();
  const res = await saveMasterSettingsToCloud('members');
  if (res.ok) showToast(`'${m.name}' 님이 이용중으로 전환되었습니다.`, 'success');
}

async function reactivateMember(memberId) {
  const inSlot = state.members.find(x => x.id === memberId);
  if (inSlot) {
    const ok = await askConfirmDialog({
      title: '이용인 복귀 확인',
      message: `'${inSlot.name}' 님을 다시 '이용중'으로 복귀하시겠습니까?`,
      confirmLabel: '복귀'
    });
    if (!ok) return;
    inSlot.status = 'ACTIVE';
    inSlot.leaveDate = '';
  } else {
    const archIdx = state.archivedMembers.findIndex(x => x.id === memberId);
    if (archIdx === -1) return;
    const former = state.archivedMembers[archIdx];
    const targetIdx = state.members.findIndex(m => !m.name || m.status === 'DISCHARGED');
    if (targetIdx === -1) {
      showToast('빈 슬롯 또는 퇴소 슬롯이 없어 복귀할 수 없습니다. 정원 16명 중 자리를 먼저 비워주세요.', 'error');
      return;
    }
    const ok = await askConfirmDialog({
      title: '이력 보관 이용인 복귀',
      message: `이력 보관 중인 '${former.name}' 님을 ${state.members[targetIdx].no}번 슬롯으로 복귀하시겠습니까?`,
      confirmLabel: '복귀'
    });
    if (!ok) return;
    if (state.members[targetIdx].name && state.members[targetIdx].status === 'DISCHARGED') {
      state.archivedMembers.push({ ...state.members[targetIdx] });
    }
    state.archivedMembers.splice(archIdx, 1);
    state.members[targetIdx] = normalizeMemberRecord({
      ...former,
      no: state.members[targetIdx].no,
      status: 'ACTIVE',
      leaveDate: ''
    }, state.members[targetIdx].no);
  }
  renderMemberMgmtTable();
  renderAttendanceGrid();
  const res = await saveMasterSettingsToCloud('members');
  if (res.ok) showToast('이용인 복귀 처리가 완료되었습니다.', 'success');
}

async function quickDischarge(memberId) {
  const m = state.members.find(x => x.id === memberId);
  if (!m) return;
  const ok = await askConfirmDialog({
    title: '이용인 퇴소 처리',
    message: `'${m.name}' 님을 오늘(${state.currentDate})자로 퇴소 처리하시겠습니까?\n과거 출결 이력은 그대로 보존됩니다.`,
    confirmLabel: '퇴소 처리',
    danger: true
  });
  if (!ok) return;
  m.status = 'DISCHARGED';
  m.leaveDate = state.currentDate;
  renderMemberMgmtTable();
  renderAttendanceGrid();
  const res = await saveMasterSettingsToCloud('members');
  if (res.ok) showToast(`'${m.name}' 님이 퇴소 처리되었습니다.`);
}

// Program Master Management (With Category Filter, Search & Official Slot Guard)
function renderProgramCategoryFilterStrip() {
  const strip = document.getElementById('programCategoryFilterStrip');
  if (!strip) return;
  const cats = ['ALL', ...state.categories];
  strip.innerHTML = cats.map(c => {
    const isMatch = state.programCategoryFilter === c;
    const active = isMatch ? 'is-active' : '';
    const label = c === 'ALL' ? '전체' : c;
    return `<button type="button" class="filter-btn ${active}" data-prog-cat="${escapeHtml(c)}" aria-pressed="${isMatch}">${escapeHtml(label)}</button>`;
  }).join('');
}

function renderProgramMgmtTable() {
  const tbody = document.getElementById('programMgmtTableBody');
  if (!tbody) return;

  const q = state.programSearchQuery.trim().toLowerCase();
  const filtered = state.programs.filter(p => {
    if (state.programCategoryFilter !== 'ALL' && p.category !== state.programCategoryFilter) return false;
    if (q && !p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
    return true;
  });

  const countEl = document.getElementById('programFilterCount');
  if (countEl) {
    countEl.textContent = `표시 중 ${filtered.length}개 / 전체 ${state.programs.length}개`;
  }

  const showCatHeaders = state.programCategoryFilter === 'ALL' && !q;
  let lastCat = '';
  let html = '';
  filtered.forEach(p => {
    const safeId = escapeHtml(p.id);
    const safeTarget = Math.max(0, parseInt(p.target, 10) || 0);
    const isFixed = FIXED_DOC_IDS.has(p.id);
    const delControl = isFixed
      ? `<span class="cell-note-muted" title="A4 공문서 기본 양식 항목입니다">기본서식</span>`
      : `<button type="button" class="btn btn-danger-outline btn-sm" data-action="prog-delete" data-prog-id="${safeId}">삭제</button>`;

    if (showCatHeaders && p.category !== lastCat) {
      lastCat = p.category;
      html += `<tr class="prog-cat-group-row"><th scope="colgroup" colspan="5">${escapeHtml(p.category)}</th></tr>`;
    }

    html += `
      <tr>
        <td class="cell-cat-label" data-label="대분류">${escapeHtml(p.category)}</td>
        <td class="cell-strong" data-label="프로그램명">${escapeHtml(p.name)}</td>
        <td class="col-center" data-label="연간 목표 (회)">
          <input type="number" class="field-input tnum prog-target-input" min="0" value="${safeTarget}" data-action="prog-target" data-prog-id="${safeId}" aria-label="${escapeHtml(p.name)} 목표">
        </td>
        <td class="col-center" data-label="매일 자동등록">
          <label class="cell-check-hit">
            <input type="checkbox" class="prog-daily-chk" ${p.isDaily ? 'checked' : ''} data-action="prog-daily" data-prog-id="${safeId}" aria-label="${escapeHtml(p.name)} 매일 등록">
          </label>
        </td>
        <td class="col-center td-actions">
          <div class="sheet-actions actions-center">
            <button type="button" class="btn btn-subtle btn-sm" data-action="prog-edit" data-prog-id="${safeId}">수정</button>
            ${delControl}
          </div>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html || `<tr><td colspan="5" class="col-center table-empty-cell">조건에 맞는 프로그램이 없습니다.</td></tr>`;
}

function openProgramDialog(progId) {
  const dlg = document.getElementById('programDialog');
  const title = document.getElementById('programDlgTitle');
  const catSel = document.getElementById('programEditCategory');
  const idInp = document.getElementById('programEditId');
  const nameInp = document.getElementById('programEditName');
  const targetInp = document.getElementById('programEditTarget');
  const dailyChk = document.getElementById('programEditIsDaily');

  showAuthError('programDlgError', '');
  catSel.innerHTML = state.categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('');

  if (progId) {
    const p = state.programs.find(x => x.id === progId);
    if (!p) return;
    title.textContent = '프로그램 수정';
    idInp.value = p.id;
    catSel.value = p.category;
    nameInp.value = p.name;
    targetInp.value = p.target || 0;
    dailyChk.checked = Boolean(p.isDaily);
  } else {
    title.textContent = '새 프로그램 추가';
    idInp.value = '';
    nameInp.value = '';
    targetInp.value = 0;
    dailyChk.checked = false;
  }
  rememberDialogTrigger(dlg);
  dlg.showModal();
  setTimeout(() => nameInp?.focus(), 0);
}

async function submitProgramDialog(event) {
  event.preventDefault();
  showAuthError('programDlgError', '');

  const id = document.getElementById('programEditId').value;
  const category = document.getElementById('programEditCategory').value;
  const name = document.getElementById('programEditName').value.trim().slice(0, 40);
  const rawTarget = (document.getElementById('programEditTarget').value || '').trim();
  const parsedTarget = rawTarget === '' ? 0 : Number(rawTarget);
  const isDaily = document.getElementById('programEditIsDaily').checked;

  if (!name) {
    showAuthError('programDlgError', '프로그램명을 입력해 주세요.');
    document.getElementById('programEditName')?.focus();
    return;
  }
  if (!Number.isInteger(parsedTarget) || parsedTarget < 0) {
    showAuthError('programDlgError', '연간 목표 횟수는 0 이상의 정수로 입력해 주세요.');
    document.getElementById('programEditTarget')?.focus();
    return;
  }
  const target = parsedTarget;

  if (id) {
    const p = state.programs.find(x => x.id === id);
    if (p) {
      const oldName = p.name;
      p.category = state.categories.includes(category) ? category : p.category;
      p.name = name;
      if (!FIXED_DOC_IDS.has(p.id) || oldName !== name) {
        p.shortLabel = name;
      }
      p.target = target;
      p.isDaily = isDaily;
    }
  } else {
    if (state.programs.length >= 200) {
      showAuthError('programDlgError', '프로그램은 최대 200개까지 등록할 수 있습니다.');
      return;
    }
    state.programs.push({
      id: makeId('prog'),
      category: state.categories.includes(category) ? category : DEFAULT_CATEGORIES[0],
      name,
      shortLabel: name,
      target,
      isDaily
    });
  }

  closeDialog('programDialog');
  renderProgramMgmtTable();
  const res = await saveMasterSettingsToCloud('programs');
  if (res.ok) showToast(`'${name}' 프로그램이 저장되었습니다.`, 'success');
}

async function updateProgramTarget(progId, val) {
  const p = state.programs.find(x => x.id === progId);
  if (!p) return;
  p.target = Math.max(0, parseInt(val, 10) || 0);
  const res = await saveMasterSettingsToCloud('programs');
  if (res.ok) showToast(`'${p.name}' 목표치가 수정되었습니다.`, 'success');
}

async function toggleProgramDaily(progId, checked) {
  const p = state.programs.find(x => x.id === progId);
  if (!p) return;
  p.isDaily = Boolean(checked);
  const res = await saveMasterSettingsToCloud('programs');
  if (res && res.ok) {
    showToast(`'${p.name}' 매일 자동등록이 ${p.isDaily ? '설정' : '해제'}되었습니다.`, 'success');
  }
}

async function deleteProgram(progId) {
  const p = state.programs.find(x => x.id === progId);
  if (!p) return;
  if (FIXED_DOC_IDS.has(p.id)) {
    showToast('기본 공문서 양식 항목은 인쇄 표 유지를 위해 삭제할 수 없습니다.', 'error');
    return;
  }
  const ok = await askConfirmDialog({
    title: '추가 프로그램 삭제',
    message: `'${p.name}' 프로그램을 삭제하시겠습니까?`,
    confirmLabel: '삭제',
    danger: true
  });
  if (!ok) return;
  state.programs = state.programs.filter(x => x.id !== progId);
  renderProgramMgmtTable();
  const res = await saveMasterSettingsToCloud('programs');
  if (res.ok) showToast(`'${p.name}' 프로그램이 삭제되었습니다.`);
}

// Program Major Category Management (Fixed 1..8 + Custom Appendable Categories)
let categoryModalDraft = [];

function openCategoryMgmtDialog() {
  const dlg = document.getElementById('categoryMgmtDialog');
  if (!dlg) return;
  showAuthError('categoryDlgError', '');
  const addInp = document.getElementById('newCategoryNameInput');
  if (addInp) addInp.value = '';
  categoryModalDraft = state.categories.map((name, idx) => ({
    origName: name,
    name,
    fixed: idx < DEFAULT_CATEGORIES.length || DEFAULT_CATEGORIES.includes(name)
  }));
  renderCategoryMgmtModalList();
  rememberDialogTrigger(dlg);
  dlg.showModal();
  setTimeout(() => addInp?.focus(), 0);
}

function renderCategoryMgmtModalList() {
  const listEl = document.getElementById('categoryMgmtList');
  if (!listEl) return;

  listEl.innerHTML = categoryModalDraft.map((item, idx) => {
    if (item.fixed) {
      return `
        <div class="journal-writer-item">
          <span class="journal-writer-main">
            <span>${escapeHtml(item.name)}</span>
          </span>
          <span class="status-pill is-blank">기본 고정</span>
        </div>
      `;
    }
    return `
      <div class="journal-writer-item" data-cat-row="${idx}">
        <input type="text" class="field-input category-edit-inline-input" data-cat-action="rename" data-cat-idx="${idx}" value="${escapeHtml(item.name)}" maxlength="30" aria-label="대분류명 수정">
        <div class="journal-writer-actions">
          <button type="button" class="btn btn-subtle btn-sm" data-cat-action="up" data-cat-idx="${idx}" ${idx <= DEFAULT_CATEGORIES.length ? 'disabled' : ''} aria-label="${escapeHtml(item.name)} 위로 이동">↑</button>
          <button type="button" class="btn btn-subtle btn-sm" data-cat-action="down" data-cat-idx="${idx}" ${idx === categoryModalDraft.length - 1 ? 'disabled' : ''} aria-label="${escapeHtml(item.name)} 아래로 이동">↓</button>
          <button type="button" class="btn btn-danger-outline btn-sm" data-cat-action="delete" data-cat-idx="${idx}">삭제</button>
        </div>
      </div>
    `;
  }).join('');
}

function addCustomCategoryToDraft() {
  const inp = document.getElementById('newCategoryNameInput');
  const rawName = (inp?.value || '').trim().slice(0, 30);
  if (!rawName) {
    inp?.focus();
    return;
  }
  if (categoryModalDraft.length >= 30) {
    showAuthError('categoryDlgError', '대분류는 기본 8개를 포함해 최대 30개까지 등록할 수 있습니다.');
    return;
  }
  const key = rawName.toLowerCase();
  if (categoryModalDraft.some(item => item.name.trim().toLowerCase() === key)) {
    showAuthError('categoryDlgError', `'${rawName}' 대분류가 이미 존재합니다.`);
    inp?.focus();
    return;
  }
  categoryModalDraft.push({
    origName: null,
    name: rawName,
    fixed: false
  });
  if (inp) inp.value = '';
  showAuthError('categoryDlgError', '');
  renderCategoryMgmtModalList();
}

async function submitCategoryDialog(event) {
  event.preventDefault();
  showAuthError('categoryDlgError', '');

  const seen = new Set();
  const nextCategories = [];
  const renameMap = new Map();

  for (let i = 0; i < categoryModalDraft.length; i++) {
    const item = categoryModalDraft[i];
    const cleanName = String(item.fixed ? item.origName : item.name).trim().slice(0, 30);
    if (!cleanName) {
      showAuthError('categoryDlgError', '빈 대분류 이름은 사용할 수 없습니다. 내용을 입력하거나 삭제해 주세요.');
      return;
    }
    const lowerKey = cleanName.toLowerCase();
    if (seen.has(lowerKey)) {
      showAuthError('categoryDlgError', `중복되는 대분류 이름이 있습니다: ${cleanName}`);
      return;
    }
    seen.add(lowerKey);
    nextCategories.push(cleanName);
    if (!item.fixed && item.origName && item.origName !== cleanName) {
      renameMap.set(item.origName, cleanName);
    }
  }

  state.categories = normalizeCategoryList(nextCategories, []);

  const changedActDates = [];
  if (renameMap.size > 0) {
    state.programs.forEach(p => {
      if (renameMap.has(p.category)) p.category = renameMap.get(p.category);
    });
    if (renameMap.has(state.programCategoryFilter)) {
      state.programCategoryFilter = renameMap.get(state.programCategoryFilter);
    }
    Object.keys(state.activityMap).forEach(d => {
      let rowChanged = false;
      state.activityMap[d].forEach(r => {
        if (renameMap.has(r.category)) {
          r.category = renameMap.get(r.category);
          rowChanged = true;
        }
      });
      if (rowChanged) changedActDates.push(d);
    });
    Object.keys(state.draftActivity).forEach(d => {
      state.draftActivity[d].forEach(r => {
        if (renameMap.has(r.category)) r.category = renameMap.get(r.category);
      });
    });
  }

  if (state.programCategoryFilter !== 'ALL' && !state.categories.includes(state.programCategoryFilter)) {
    state.programCategoryFilter = 'ALL';
  }

  const res = await saveMasterSettingsToCloud('programs');
  if (res.ok && changedActDates.length > 0 && state.isFirebaseReady && state.firestoreDb) {
    const db = state.firestoreDb;
    const writes = changedActDates.map(d => ({
      ref: db.collection('activities').doc(d),
      data: {
        rows: state.activityMap[d].slice(0, 100),
        updatedBy: state.currentTeacher?.name || '대분류변경',
        updatedAtText: formatTimeKST()
      }
    }));
    try { await batchWriteEntries(db, writes); } catch (_) {}
  }

  closeDialog('categoryMgmtDialog');
  renderProgramCategoryFilterStrip();
  renderProgramMgmtTable();
  if (state.currentTab === 1) renderActivityRows(true);
  if (state.currentTab === 4) populateJournalProgramPickers();
  if (state.currentTab === 2) renderUnifiedPrintView();
  if (res.ok) showToast('프로그램 대분류 목록이 저장되었습니다.', 'success');
}

// Teacher Account Management (Firebase Auth + Server-Enforced Roles)
function renderAccountMgmtPanel() {
  const hintEl = document.getElementById('currentInviteCodeHint');
  if (hintEl) {
    hintEl.textContent = state.inviteMetaStatus || '설정됨 (보안 보호)';
  }

  const tbody = document.getElementById('teacherMgmtTableBody');
  if (!tbody) return;

  const admin = isCurrentAdmin();
  const teachers = getTeacherList();
  let html = '';

  teachers.forEach(t => {
    const safeUid = escapeHtml(t.uid);
    const isSelf = state.currentTeacher && t.uid === state.currentTeacher.uid;
    const roleLabel = t.role === 'admin' ? '관리자' : '선생님';
    const actions = [];

    if (isSelf) {
      actions.push(`<button type="button" class="btn btn-subtle btn-sm" data-action="teacher-reset-pw" data-teacher-id="${safeUid}">내 비밀번호 변경</button>`);
    } else if (admin) {
      actions.push(`<button type="button" class="btn btn-subtle btn-sm" data-action="teacher-reset-pw" data-teacher-id="${safeUid}">비밀번호 재발급</button>`);
      actions.push(`<button type="button" class="btn btn-secondary btn-sm" data-action="teacher-toggle-role" data-teacher-id="${safeUid}">${t.role === 'admin' ? '일반 전환' : '관리자 지정'}</button>`);
      actions.push(`<button type="button" class="btn btn-danger-outline btn-sm" data-action="teacher-delete" data-teacher-id="${safeUid}">삭제</button>`);
    }

    html += `
      <tr>
        <td class="cell-strong" data-label="성함">${escapeHtml(t.name)}${isSelf ? ' <span class="self-tag">(본인)</span>' : ''}</td>
        <td class="col-center" data-label="구분"><span class="status-pill ${t.role === 'admin' ? 'is-active' : 'is-waiting'}">${roleLabel}</span></td>
        <td class="col-center tnum td-nowrap" data-label="등록일">${escapeHtml(t.createdAt || '-')}</td>
        <td class="col-center tnum td-nowrap col-t-login" data-label="최근 접속">${escapeHtml(t.lastLoginAt || '-')}</td>
        <td class="col-center td-actions"><div class="sheet-actions actions-center">${actions.join('') || '<span class="cell-note-muted">관리자 권한 필요</span>'}</div></td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

async function handleUpdateInviteCode(event) {
  event.preventDefault();
  if (!isCurrentAdmin()) {
    showToast('기관 가입 코드는 관리자 선생님만 변경할 수 있습니다.', 'error');
    return;
  }
  const inp = document.getElementById('newInviteCodeInput');
  const nextCode = inp.value.trim();
  if (nextCode.length < 4 || nextCode.length > 12) {
    showToast('가입 코드는 4~12자로 입력해 주세요.', 'error');
    inp?.focus();
    return;
  }
  if (state.isDemoMode) {
    const ok = await askConfirmDialog({
      title: '기관 가입 코드 변경 확인',
      message: `기관 가입 코드를 '${nextCode}'(으)로 변경하시겠습니까?\n(샘플 체험 모드에서는 상태 표시만 업데이트됩니다.)`,
      confirmLabel: '가입 코드 변경'
    });
    if (!ok) return;
    const nowFull = `${getTodayKST()} ${formatTimeKST()}`;
    state.inviteMetaStatus = `${buildSafeInviteStatus(nextCode)} · 변경 ${nowFull}`;
    inp.value = '';
    saveLocalCache();
    renderAccountMgmtPanel();
    showToast('샘플 모드: 기관 가입 코드 상태가 변경되었습니다.', 'success');
    return;
  }
  if (!state.isFirebaseReady || !state.firestoreDb) return;

  const ok = await askConfirmDialog({
    title: '기관 가입 코드 변경 확인',
    message: `기관 가입 코드를 '${nextCode}'(으)로 변경하시겠습니까?\n기존 로그인 선생님 계정은 유지되며, 새 가입자부터 변경된 코드가 적용됩니다.`,
    confirmLabel: '가입 코드 변경'
  });
  if (!ok) return;

  const nowFull = `${getTodayKST()} ${formatTimeKST()}`;
  const statusText = buildSafeInviteStatus(nextCode);

  try {
    const db = state.firestoreDb;
    const batch = db.batch();
    batch.update(db.collection('settings').doc('invite_secret'), {
      inviteProof: hashInviteProof(nextCode),
      updatedAt: nowFull
    });
    batch.update(db.collection('settings').doc('invite_meta'), {
      statusText,
      updatedAt: nowFull
    });
    await batch.commit();

    state.inviteMetaStatus = statusText;
    inp.value = '';
    renderAccountMgmtPanel();
    showToast('기관 가입 코드가 안전하게 변경되었습니다.', 'success');
  } catch (err) {
    showToast(formatFriendlyError(err, '가입 코드 변경 중 오류가 발생했습니다.'), 'error');
  }
}

function openResetMyPwDialog() {
  if (!state.currentTeacher) return;
  openResetTeacherPwDialog(state.currentTeacher.uid);
}

function openResetTeacherPwDialog(teacherUid) {
  const t = state.teachersMap[teacherUid];
  if (!t) return;
  const isSelf = state.currentTeacher && state.currentTeacher.uid === teacherUid;
  if (!isSelf && !isCurrentAdmin()) {
    showToast('다른 선생님의 비밀번호는 관리자만 재설정할 수 있습니다.', 'error');
    return;
  }

  document.getElementById('resetPwTeacherId').value = teacherUid;
  const mirrorUser = document.getElementById('resetPwUsernameMirror');
  if (mirrorUser) mirrorUser.value = t.name || '';
  const curGroup = document.getElementById('resetPwCurrentGroup');
  const curInp = document.getElementById('resetPwCurrentInput');
  const newInp = document.getElementById('resetPwNewInput');
  const errBox = document.getElementById('resetPwError');

  if (errBox) {
    errBox.textContent = '';
    errBox.classList.add('hidden');
  }
  if (curInp) {
    curInp.value = '';
    curInp.required = Boolean(isSelf);
  }
  if (curGroup) curGroup.classList.toggle('hidden', !isSelf);
  if (newInp) newInp.value = '';

  document.getElementById('resetPwTeacherLabel').textContent = isSelf
    ? '보안을 위해 현재 사용 중인 비밀번호와 새 비밀번호(6자 이상)를 입력해 주세요.'
    : `'${t.name}' 선생님의 새 임시 비밀번호를 입력해 주세요. (변경 즉시 해당 계정의 기존 로그인은 만료됩니다.)`;

  const resetDlg = document.getElementById('resetTeacherPwDialog');
  rememberDialogTrigger(resetDlg);
  resetDlg.showModal();
  setTimeout(() => (isSelf ? curInp : newInp)?.focus(), 0);
}

async function submitResetTeacherPassword(event) {
  event.preventDefault();
  const teacherUid = document.getElementById('resetPwTeacherId').value;
  const currentPw = document.getElementById('resetPwCurrentInput').value;
  const newPw = document.getElementById('resetPwNewInput').value;
  const t = state.teachersMap[teacherUid];
  const isSelf = state.currentTeacher && state.currentTeacher.uid === teacherUid;

  showAuthError('resetPwError', '');
  if (!t) return;
  if (!isSelf && !isCurrentAdmin()) {
    showAuthError('resetPwError', '권한이 없습니다.');
    return;
  }
  if (newPw.length < 6) {
    showAuthError('resetPwError', '새 비밀번호는 6자 이상이어야 합니다.');
    return;
  }

  const submitBtn = document.getElementById('resetPwSubmitBtn');
  if (submitBtn) submitBtn.disabled = true;

  let provAuth = null;
  let newProvUser = null;
  try {
    if (state.isDemoMode) {
      if (isSelf && !currentPw) {
        showAuthError('resetPwError', '현재 비밀번호를 입력해 주세요.');
        return;
      }
      document.getElementById('resetPwCurrentInput').value = '';
      document.getElementById('resetPwNewInput').value = '';
      closeDialog('resetTeacherPwDialog');
      showToast(`샘플 모드: '${t.name}' 선생님의 비밀번호 변경이 시뮬레이션되었습니다.`, 'success');
      return;
    }
    if (isSelf) {
      if (!currentPw) {
        showAuthError('resetPwError', '현재 비밀번호를 입력해 주세요.');
        return;
      }
      const user = state.firebaseAuth.currentUser;
      if (!user || !user.email) {
        showAuthError('resetPwError', '현재 인증 세션을 확인할 수 없습니다.');
        return;
      }
      const cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPw);
      await user.reauthenticateWithCredential(cred);
      await user.updatePassword(newPw);
    } else {
      // Admin password re-issuance without Cloud Functions:
      // Provision a new Auth UID on an isolated secondary app and atomically swap login_slots + teachers.
      const provApp = getProvisioningApp();
      provAuth = provApp.auth();
      await provAuth.setPersistence(firebase.auth.Auth.Persistence.NONE);

      const newAuthId = makeId('acct');
      const cred = await provAuth.createUserWithEmailAndPassword(authEmailFromId(newAuthId), newPw);
      newProvUser = cred.user;
      const newUid = newProvUser.uid;
      await provAuth.signOut();

      const db = state.firestoreDb;
      const nowDate = getTodayKST();
      const nowFull = `${nowDate} ${formatTimeKST()}`;
      const nameHash = t.nameHash || hashLoginSlotKey(t.name);

      const batch = db.batch();
      batch.delete(db.collection('teachers').doc(teacherUid));
      batch.delete(db.collection('invite_claims').doc(teacherUid));
      batch.set(db.collection('teachers').doc(newUid), {
        uid: newUid,
        name: t.name,
        nameHash,
        authId: newAuthId,
        role: t.role === 'admin' ? 'admin' : 'teacher',
        createdAt: t.createdAt || nowDate,
        lastLoginAt: t.lastLoginAt || ''
      });
      batch.set(db.collection('login_slots').doc(nameHash), {
        uid: newUid,
        authId: newAuthId,
        updatedAt: nowFull
      });
      let migratedWriters = null;
      if (state.journalWritersConfigured && state.journalWriters.some(w => w.uid === teacherUid)) {
        migratedWriters = normalizeJournalWritersList(state.journalWriters.map(w => (
          w.uid === teacherUid
            ? { ...w, id: w.id === `jw_${teacherUid}` ? `jw_${newUid}` : w.id, uid: newUid }
            : w
        )));
        batch.set(db.collection('settings').doc('journal'), {
          writers: migratedWriters,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
      await batch.commit();
      if (migratedWriters) {
        state.journalWriters = migratedWriters;
        pruneCleanDrafts();
        saveLocalCache();
      }
      newProvUser = null;
    }

    document.getElementById('resetPwCurrentInput').value = '';
    document.getElementById('resetPwNewInput').value = '';
    closeDialog('resetTeacherPwDialog');
    showToast(`'${t.name}' 선생님의 비밀번호가 안전하게 변경되었습니다.`, 'success');
  } catch (err) {
    if (newProvUser) {
      try { await newProvUser.delete(); } catch (_) {}
    }
    if (provAuth) {
      try { await provAuth.signOut(); } catch (_) {}
    }
    if (isSelf && (err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential')) {
      showAuthError('resetPwError', '현재 비밀번호가 올바르지 않습니다.');
    } else {
      showAuthError('resetPwError', formatFirebaseAuthError(err, '비밀번호 변경에 실패했습니다.'));
    }
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

async function toggleTeacherRole(teacherUid) {
  if (!isCurrentAdmin()) {
    showToast('권한 변경은 관리자만 가능합니다.', 'error');
    return;
  }
  const t = state.teachersMap[teacherUid];
  if (!t) return;
  if (state.currentTeacher && t.uid === state.currentTeacher.uid) {
    showToast('본인의 관리자 권한은 직접 해제할 수 없습니다.', 'error');
    return;
  }

  if (t.role === 'admin') {
    const adminCount = getTeacherList().filter(x => x.role === 'admin').length;
    if (adminCount <= 1) {
      showToast('최소 1명의 관리자는 유지되어야 합니다.', 'error');
      return;
    }
  }

  const nextRole = t.role === 'admin' ? 'teacher' : 'admin';
  const nextLabel = nextRole === 'admin' ? '관리자' : '일반 선생님';
  const ok = await askConfirmDialog({
    title: '선생님 권한 변경',
    message: `'${t.name}' 선생님을 '${nextLabel}' 권한으로 변경하시겠습니까?`,
    confirmLabel: '변경 적용',
    danger: false
  });
  if (!ok) return;

  try {
    if (state.isDemoMode) {
      state.teachersMap[teacherUid].role = nextRole;
      saveLocalCache();
      renderAccountMgmtPanel();
      showToast(`'${t.name}' 선생님이 '${nextLabel}' 권한으로 변경되었습니다.`, 'success');
      return;
    }
    await state.firestoreDb.collection('teachers').doc(teacherUid).update({ role: nextRole });
    showToast(`'${t.name}' 선생님이 '${nextLabel}' 권한으로 변경되었습니다.`, 'success');
  } catch (err) {
    showToast(formatFriendlyError(err, '권한 변경 중 오류가 발생했습니다.'), 'error');
  }
}

async function deleteTeacherAccount(teacherUid) {
  if (!isCurrentAdmin()) {
    showToast('계정 삭제는 관리자만 가능합니다.', 'error');
    return;
  }
  const t = state.teachersMap[teacherUid];
  if (!t) return;
  if (state.currentTeacher && t.uid === state.currentTeacher.uid) {
    showToast('현재 로그인된 본인 계정은 삭제할 수 없습니다.', 'error');
    return;
  }
  if (getTeacherList().length <= 1) {
    showToast('최소 1명의 선생님 계정은 유지되어야 합니다.', 'error');
    return;
  }
  const ok = await askConfirmDialog({
    title: '선생님 계정 삭제',
    message: `'${t.name}' 선생님 계정을 삭제하시겠습니까?\n작성해 둔 과거 기록은 그대로 유지됩니다.`,
    confirmLabel: '계정 삭제',
    danger: true
  });
  if (!ok) return;

  try {
    if (state.isDemoMode) {
      delete state.teachersMap[teacherUid];
      if (state.journalWritersConfigured && state.journalWriters.some(w => w.uid === teacherUid)) {
        state.journalWriters = normalizeJournalWritersList(state.journalWriters.filter(w => w.uid !== teacherUid));
        pruneCleanDrafts();
        if (state.currentTab === 4 && !state.dirtyJournalDates.has(state.currentDate)) {
          renderJournalView();
        }
      }
      saveLocalCache();
      renderAccountMgmtPanel();
      showToast(`'${t.name}' 선생님 계정이 삭제되었습니다.`);
      return;
    }
    const db = state.firestoreDb;
    const nameHash = t.nameHash || hashLoginSlotKey(t.name);
    const batch = db.batch();
    batch.delete(db.collection('teachers').doc(teacherUid));
    batch.delete(db.collection('invite_claims').doc(teacherUid));
    batch.delete(db.collection('login_slots').doc(nameHash));
    let remainingWriters = null;
    if (state.journalWritersConfigured && state.journalWriters.some(w => w.uid === teacherUid)) {
      remainingWriters = normalizeJournalWritersList(state.journalWriters.filter(w => w.uid !== teacherUid));
      batch.set(db.collection('settings').doc('journal'), {
        writers: remainingWriters,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
    await batch.commit();
    if (remainingWriters) {
      state.journalWriters = remainingWriters;
      pruneCleanDrafts();
      saveLocalCache();
      if (state.currentTab === 4 && !state.dirtyJournalDates.has(state.currentDate)) {
        renderJournalView();
      }
    }
    showToast(`'${t.name}' 선생님 계정이 삭제되었습니다.`);
  } catch (err) {
    showToast(formatFriendlyError(err, '계정 삭제 중 오류가 발생했습니다.'), 'error');
  }
}

// ----------------------------------------------------------------------------
// 13. BACKUP / RESTORE & NEW YEAR RESET (Schema-Validated, Chunked & Admin-Guarded)
// ----------------------------------------------------------------------------
async function batchDeleteCollection(db, collectionName, keepDocIds = null) {
  const snap = await db.collection(collectionName).get();
  if (snap.empty) return;
  const docs = keepDocIds
    ? snap.docs.filter(doc => !keepDocIds.has(doc.id))
    : snap.docs;
  for (let i = 0; i < docs.length; i += BATCH_CHUNK_SIZE) {
    const batch = db.batch();
    docs.slice(i, i + BATCH_CHUNK_SIZE).forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }
}

async function batchWriteEntries(db, entries) {
  for (let i = 0; i < entries.length; i += BATCH_CHUNK_SIZE) {
    const batch = db.batch();
    entries.slice(i, i + BATCH_CHUNK_SIZE).forEach(({ ref, data }) => batch.set(ref, data));
    await batch.commit();
  }
}

function downloadBackupFile(customPrefix) {
  saveLocalCache();
  const dateStr = getTodayKST().replace(/-/g, '');
  const prefix = customPrefix || `사회복지시설_데이터백업_${dateStr}`;
  const exportData = {
    exportedAt: `${getTodayKST()} ${formatTimeKST()} KST`,
    version: '2.4',
    facilityName: '종합사회복지관 · 주간보호시설 (샘플)',
    members: state.members,
    archivedMembers: state.archivedMembers,
    categories: state.categories,
    programs: state.programs,
    attendanceMap: state.attendanceMap,
    attendanceMeta: state.attendanceMeta,
    activityMap: state.activityMap,
    journalWriters: state.journalWriters,
    journalWritersConfigured: Boolean(state.journalWritersConfigured),
    journalMap: state.journalMap
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${prefix}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  showToast('백업 JSON 파일 다운로드를 시작합니다.', 'success');
}

function validateAndNormalizeBackupPayload(imported) {
  if (!imported || typeof imported !== 'object' || Array.isArray(imported)) {
    throw new Error('올바른 JSON 객체 구조가 아닙니다.');
  }
  if (!Array.isArray(imported.members) || imported.members.length === 0 || imported.members.length > 64) {
    throw new Error('이용인 명단(members) 형식이 올바르지 않습니다.');
  }
  if (!Array.isArray(imported.programs) || imported.programs.length === 0 || imported.programs.length > 200) {
    throw new Error('프로그램 목록(programs) 형식이 올바르지 않습니다.');
  }
  if (imported.archivedMembers !== undefined && (!Array.isArray(imported.archivedMembers) || imported.archivedMembers.length > 300)) {
    throw new Error('퇴소 이력 명단(archivedMembers) 형식이 올바르지 않습니다.');
  }

  if (imported.categories !== undefined && (!Array.isArray(imported.categories) || imported.categories.length > 30)) {
    throw new Error('프로그램 대분류(categories) 형식이 올바르지 않습니다.');
  }

  const members = normalizeMemberList(imported.members, true);
  const archivedMembers = normalizeMemberList(imported.archivedMembers || [], false);
  const categories = normalizeCategoryList(imported.categories, imported.programs);
  const programs = migrateProgramList(imported.programs, categories);
  if (programs.length === 0) {
    throw new Error('유효한 프로그램 항목이 1개 이상 필요합니다.');
  }

  const attendanceMap = {};
  const rawAtt = imported.attendanceMap || {};
  if (typeof rawAtt !== 'object' || Array.isArray(rawAtt)) {
    throw new Error('출결 기록(attendanceMap) 형식이 올바르지 않습니다.');
  }
  for (const [dateKey, records] of Object.entries(rawAtt)) {
    if (UNSAFE_JSON_KEYS.has(dateKey) || !isValidCalendarYMD(dateKey)) {
      throw new Error(`잘못된 날짜 키가 포함되어 있습니다: ${dateKey}`);
    }
    if (!records || typeof records !== 'object' || Array.isArray(records)) {
      throw new Error(`${dateKey} 출결 데이터 형식이 올바르지 않습니다.`);
    }
    const entries = Object.entries(records);
    if (entries.length > 64) {
      throw new Error(`${dateKey} 출결 항목 수가 허용 범위(64명)를 초과했습니다.`);
    }
    const cleanRecs = {};
    for (const [mId, rec] of entries) {
      if (UNSAFE_JSON_KEYS.has(mId) || !SAFE_ID_REGEX.test(mId)) {
        throw new Error(`잘못된 이용인 식별자가 포함되어 있습니다: ${mId}`);
      }
      const am = VALID_ATT_SYMBOLS.has(rec?.am) ? rec.am : '';
      const pm = VALID_ATT_SYMBOLS.has(rec?.pm) ? rec.pm : '';
      cleanRecs[mId] = { am, pm };
    }
    attendanceMap[dateKey] = cleanRecs;
  }

  const attendanceMeta = {};
  const rawMeta = imported.attendanceMeta || {};
  if (typeof rawMeta !== 'object' || Array.isArray(rawMeta)) {
    throw new Error('출결 메타데이터(attendanceMeta) 형식이 올바르지 않습니다.');
  }
  for (const [dateKey, meta] of Object.entries(rawMeta)) {
    if (UNSAFE_JSON_KEYS.has(dateKey) || !isValidCalendarYMD(dateKey)) continue;
    attendanceMeta[dateKey] = {
      updatedBy: String(meta?.updatedBy || '').slice(0, 30),
      updatedAtText: String(meta?.updatedAtText || '').slice(0, 30)
    };
  }

  const activityMap = {};
  const rawAct = imported.activityMap || {};
  if (typeof rawAct !== 'object' || Array.isArray(rawAct)) {
    throw new Error('활동 기록(activityMap) 형식이 올바르지 않습니다.');
  }
  for (const [dateKey, rows] of Object.entries(rawAct)) {
    if (UNSAFE_JSON_KEYS.has(dateKey) || !isValidCalendarYMD(dateKey)) {
      throw new Error(`활동 기록에 잘못된 날짜 키가 포함되어 있습니다: ${dateKey}`);
    }
    if (!Array.isArray(rows) || rows.length > 100) {
      throw new Error(`${dateKey} 활동 행 수(최대 100행) 또는 형식이 올바르지 않습니다.`);
    }
    activityMap[dateKey] = migrateActivityRows(rows, programs, categories);
  }

  let journalWriters = [];
  let journalWritersConfigured = false;
  if (imported.journalWriters !== undefined) {
    if (!Array.isArray(imported.journalWriters) || imported.journalWriters.length > 30) {
      throw new Error('운영일지 담당자 설정(journalWriters) 형식이 올바르지 않습니다.');
    }
    journalWriters = normalizeJournalWritersList(imported.journalWriters);
    journalWritersConfigured = Boolean(imported.journalWritersConfigured || journalWriters.length > 0);
  }

  const journalMap = {};
  if (imported.journalMap !== undefined) {
    if (!imported.journalMap || typeof imported.journalMap !== 'object' || Array.isArray(imported.journalMap)) {
      throw new Error('운영일지(journalMap) 형식이 올바르지 않습니다.');
    }
    for (const [dateKey, jDoc] of Object.entries(imported.journalMap)) {
      if (UNSAFE_JSON_KEYS.has(dateKey) || !isValidCalendarYMD(dateKey)) {
        throw new Error(`운영일지에 잘못된 날짜 키가 포함되어 있습니다: ${dateKey}`);
      }
      journalMap[dateKey] = normalizeJournalDoc(jDoc, dateKey);
    }
  }

  return {
    members,
    archivedMembers,
    categories,
    programs,
    attendanceMap,
    attendanceMeta,
    activityMap,
    hasJournalWriters: imported.journalWriters !== undefined,
    journalWriters,
    journalWritersConfigured,
    hasJournalMap: imported.journalMap !== undefined,
    journalMap
  };
}

async function restoreBackupFile(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;

  if (!isCurrentAdmin()) {
    showToast('전체 데이터 복원은 관리자 선생님만 실행할 수 있습니다.', 'error');
    return;
  }
  if (file.size > MAX_BACKUP_BYTES) {
    await askConfirmDialog({
      title: '백업 파일 복원 불가',
      message: '백업 파일 용량이 허용 크기(5MB)를 초과합니다. 올바른 사회복지시설 백업 JSON 파일인지 확인해 주세요.',
      confirmLabel: '확인',
      hideCancel: true
    });
    return;
  }

  try {
    const text = await file.text();
    const rawImported = JSON.parse(text, (key, value) => {
      if (UNSAFE_JSON_KEYS.has(key)) return undefined;
      return value;
    });
    const validated = validateAndNormalizeBackupPayload(rawImported);

    const ok = await askConfirmDialog({
      title: '백업 파일 전체 복원',
      message: '선택한 백업 파일로 로컬과 클라우드의 모든 출결·활동·운영일지·설정 데이터를 복원하시겠습니까?\n현재 클라우드 기록이 선택한 백업 데이터로 대체됩니다.',
      confirmLabel: '복원 실행',
      danger: true
    });
    if (!ok) return;

    if (state.isFirebaseReady && state.firestoreDb) {
      const db = state.firestoreDb;
      const writes = [
        { ref: db.collection('settings').doc('members'), data: { list: validated.members, archived: validated.archivedMembers } },
        { ref: db.collection('settings').doc('programs'), data: { list: validated.programs, categories: validated.categories } }
      ];
      if (validated.hasJournalWriters) {
        writes.push({
          ref: db.collection('settings').doc('journal'),
          data: { writers: validated.journalWriters, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }
        });
      }
      Object.keys(validated.attendanceMap).forEach(d => {
        writes.push({
          ref: db.collection('attendances').doc(d),
          data: {
            records: validated.attendanceMap[d],
            updatedBy: validated.attendanceMeta[d]?.updatedBy || state.currentTeacher?.name || '백업복원',
            updatedAtText: validated.attendanceMeta[d]?.updatedAtText || formatTimeKST()
          }
        });
      });
      Object.keys(validated.activityMap).forEach(d => {
        writes.push({
          ref: db.collection('activities').doc(d),
          data: {
            rows: validated.activityMap[d],
            updatedBy: state.currentTeacher?.name || '백업복원',
            updatedAtText: formatTimeKST()
          }
        });
      });
      Object.keys(validated.journalMap).forEach(d => {
        writes.push({
          ref: db.collection('journals').doc(d),
          data: {
            ...validated.journalMap[d],
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
          }
        });
      });

      // Upsert validated documents FIRST, then prune stale dates outside backup
      await batchWriteEntries(db, writes);
      await batchDeleteCollection(db, 'attendances', new Set(Object.keys(validated.attendanceMap)));
      await batchDeleteCollection(db, 'activities', new Set(Object.keys(validated.activityMap)));
      // Legacy (v2.2 이하) 백업에는 운영일지가 없으므로 기존 운영일지를 삭제하지 않고 보존
      if (validated.hasJournalMap) {
        await batchDeleteCollection(db, 'journals', new Set(Object.keys(validated.journalMap)));
      }
    }

    state.members = validated.members;
    state.archivedMembers = validated.archivedMembers;
    state.categories = validated.categories;
    state.programs = validated.programs;
    if (state.programCategoryFilter !== 'ALL' && !state.categories.includes(state.programCategoryFilter)) {
      state.programCategoryFilter = 'ALL';
    }
    state.attendanceMap = validated.attendanceMap;
    state.attendanceMeta = validated.attendanceMeta;
    state.activityMap = validated.activityMap;
    if (validated.hasJournalWriters) {
      state.journalWriters = validated.journalWriters;
      state.journalWritersConfigured = validated.journalWritersConfigured;
    }
    if (validated.hasJournalMap) {
      state.journalMap = validated.journalMap;
    }
    state.draftJournal = {};
    state.dirtyJournalDates.clear();
    state.lastJournalSaveErrorDate = '';
    state.draftAttendance = {};
    state.draftActivity = {};
    state.dirtyDates.clear();
    state.lastSaveErrorDate = '';
    state.isBulkMemberMode = false;
    saveLocalCache();

    renderAttendanceGrid();
    renderActivityRows(true);
    renderJournalView();
    if (state.currentTab === 2) renderUnifiedPrintView();
    renderMemberMgmtTable();
    renderProgramCategoryFilterStrip();
    renderProgramMgmtTable();
    showToast(
      state.isDemoMode
        ? '백업 파일이 샘플 로컬 저장소에 복원되었습니다.'
        : '백업 파일이 검증 후 클라우드와 로컬에 모두 복원되었습니다.',
      'success'
    );
  } catch (err) {
    await askConfirmDialog({
      title: '백업 파일 복원 불가',
      message: formatFriendlyError(err, '백업 파일 형식이 올바르지 않아 복원할 수 없습니다.'),
      confirmLabel: '확인',
      hideCancel: true
    });
  }
}

function openNewYearResetDialog() {
  if (!isCurrentAdmin()) {
    showToast('신년 데이터 초기화는 관리자 선생님만 실행할 수 있습니다.', 'error');
    return;
  }
  const dlg = document.getElementById('newYearResetDialog');
  const inp = document.getElementById('newYearConfirmInput');
  const summaryEl = document.getElementById('newYearRecordSummary');
  if (inp) inp.value = '';
  if (summaryEl) {
    const attDays = Object.keys(state.attendanceMap).length;
    const actDays = Object.keys(state.activityMap).length;
    const journalDays = Object.keys(state.journalMap).length;
    summaryEl.textContent = `현재 저장된 출결 ${attDays}일 · 활동 ${actDays}일 · 운영일지 ${journalDays}일 기록이 초기화 대상입니다.`;
  }
  showAuthError('newYearDlgError', '');
  rememberDialogTrigger(dlg);
  dlg.showModal();
  setTimeout(() => inp?.focus(), 0);
}

async function submitNewYearReset(event) {
  event.preventDefault();
  showAuthError('newYearDlgError', '');
  if (!isCurrentAdmin()) {
    showAuthError('newYearDlgError', '관리자 권한이 필요합니다.');
    return;
  }
  const confirmInp = document.getElementById('newYearConfirmInput');
  const confirmStr = confirmInp.value.trim();
  if (confirmStr !== '신년초기화') {
    showAuthError('newYearDlgError', "확인 문구 '신년초기화'를 정확히 입력해 주세요.");
    confirmInp?.focus();
    return;
  }

  const submitBtn = document.getElementById('newYearResetSubmitBtn');
  if (submitBtn) {
    if (submitBtn.disabled) return;
    submitBtn.disabled = true;
    submitBtn.dataset.origLabel = submitBtn.textContent;
    submitBtn.textContent = '초기화 진행 중...';
  }

  try {
    const prevYear = Number(getTodayKST().slice(0, 4)) - 1;
    downloadBackupFile(`사회복지시설_${prevYear}년도_최종마감백업_${getTodayKST().replace(/-/g, '')}`);
    await new Promise(r => setTimeout(r, 600));

    if (state.isFirebaseReady && state.firestoreDb) {
      await batchDeleteCollection(state.firestoreDb, 'attendances');
      await batchDeleteCollection(state.firestoreDb, 'activities');
      await batchDeleteCollection(state.firestoreDb, 'journals');
    }

    state.attendanceMap = {};
    state.attendanceMeta = {};
    state.activityMap = {};
    state.journalMap = {};
    state.draftJournal = {};
    state.dirtyJournalDates.clear();
    state.lastJournalSaveErrorDate = '';
    state.draftAttendance = {};
    state.draftActivity = {};
    state.dirtyDates.clear();
    state.lastSaveErrorDate = '';
    saveLocalCache();

    closeDialog('newYearResetDialog');
    onDateChanged(getTodayKST());
    showToast('신년 초기화 완료! 직전 연도 백업이 저장되었습니다.', 'success');
  } catch (err) {
    showAuthError('newYearDlgError', formatFriendlyError(err, '클라우드 데이터 초기화 중 오류가 발생했습니다.'));
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.origLabel || '백업 다운로드 후 전체 기록 초기화';
    }
  }
}

// ----------------------------------------------------------------------------
// 14. NAVIGATION, DATE CONTROLS, DELEGATED EVENTS & PRINT PREPARATION
// ----------------------------------------------------------------------------
async function promptUnsavedDayResolution(date) {
  const choice = await askConfirmDialog({
    title: '저장되지 않은 기록 안내',
    message: `${formatKoreanFullDate(date)}에 수정한 출결·활동 내용이 아직 저장되지 않았습니다.\n저장하고 이동하시겠습니까?`,
    confirmLabel: '저장 후 이동',
    altLabel: '저장하지 않고 이동',
    cancelLabel: '취소'
  });
  if (choice === true) {
    const res = await saveBothDayDocsToCloud(date);
    if (!res.ok) {
      showToast(res.error || '저장에 실패하여 이동하지 않았습니다.', 'error');
      return false;
    }
    return true;
  }
  if (choice === 'alt') {
    discardDayDraft(date);
    return true;
  }
  return false;
}

async function promptUnsavedJournalResolution(date) {
  const choice = await askConfirmDialog({
    title: '저장되지 않은 운영일지 안내',
    message: `${formatKoreanFullDate(date)}의 운영일지 수정 내용이 아직 저장되지 않았습니다.\n저장하고 이동하시겠습니까?`,
    confirmLabel: '저장 후 이동',
    altLabel: '저장하지 않고 이동',
    cancelLabel: '취소'
  });
  if (choice === true) {
    const res = await saveJournalToCloud(date);
    if (!res.ok) {
      showToast(res.error || '운영일지 저장에 실패하여 이동하지 않았습니다.', 'error');
      return false;
    }
    return true;
  }
  if (choice === 'alt') {
    discardJournalDraft(date);
    return true;
  }
  return false;
}

function switchTab(tabNum, afterSwitch = null) {
  if (state.currentTab === 1 && tabNum !== 1 && hasUnsavedDayChanges(state.currentDate)) {
    promptUnsavedDayResolution(state.currentDate).then(ok => {
      if (ok) switchTab(tabNum, afterSwitch);
    });
    return false;
  }
  if (state.currentTab === 4 && tabNum !== 4 && hasUnsavedJournalChanges(state.currentDate)) {
    promptUnsavedJournalResolution(state.currentDate).then(ok => {
      if (ok) switchTab(tabNum, afterSwitch);
    });
    return false;
  }
  if (tabNum !== 3 && needsBulkDiscardConfirm()) {
    askConfirmDialog({
      title: '명단 일괄 입력 취소 확인',
      message: '일괄 입력 중인 내용이 저장되지 않았습니다. 저장하지 않고 다른 탭으로 이동하시겠습니까?',
      confirmLabel: '이동',
      cancelLabel: '계속 입력',
      danger: true
    }).then(ok => {
      if (!ok) return;
      state.isBulkMemberMode = false;
      state.isBulkDirty = false;
      switchTab(tabNum, afterSwitch);
    });
    return false;
  }

  state.currentTab = tabNum;
  document.body.dataset.printDoc = tabNum === 4 ? 'journal' : (tabNum === 2 ? state.printTargetDoc : 'daily');
  if (tabNum !== 3) {
    state.isBulkMemberMode = false;
    state.isBulkDirty = false;
  }
  [1, 4, 2, 3].forEach(n => {
    document.getElementById(`tab${n}View`)?.classList.toggle('hidden', n !== tabNum);
    const navBtn = document.getElementById(`navTab${n}`);
    if (navBtn) {
      const isMatch = n === tabNum;
      navBtn.classList.toggle('is-active', isMatch);
      navBtn.setAttribute('aria-selected', String(isMatch));
      navBtn.setAttribute('tabindex', isMatch ? '0' : '-1');
    }
  });

  if (tabNum === 1) {
    renderAttendanceGrid();
    renderActivityRows(true);
    syncSaveIndicatorForDate(state.currentDate);
  } else if (tabNum === 2) {
    renderUnifiedPrintView();
  } else if (tabNum === 4) {
    renderJournalView();
  } else if (tabNum === 3) {
    switchMgmtSubTab(state.currentMgmtSubTab || 'members');
  }
  if (typeof afterSwitch === 'function') afterSwitch();
  return true;
}

function onDateChanged(newDate) {
  if (!newDate || !isValidCalendarYMD(newDate)) return;
  if (newDate !== state.currentDate && hasUnsavedDayChanges(state.currentDate)) {
    const inp1 = document.getElementById('currentDateInput');
    const inp2 = document.getElementById('printDateInput');
    const inpJ = document.getElementById('journalDateInput');
    if (inp1) inp1.value = state.currentDate;
    if (inp2) inp2.value = state.currentDate;
    if (inpJ) inpJ.value = state.currentDate;
    promptUnsavedDayResolution(state.currentDate).then(ok => {
      if (ok) onDateChanged(newDate);
    });
    return;
  }
  if (newDate !== state.currentDate && hasUnsavedJournalChanges(state.currentDate)) {
    const inp1 = document.getElementById('currentDateInput');
    const inp2 = document.getElementById('printDateInput');
    const inpJ = document.getElementById('journalDateInput');
    if (inp1) inp1.value = state.currentDate;
    if (inp2) inp2.value = state.currentDate;
    if (inpJ) inpJ.value = state.currentDate;
    promptUnsavedJournalResolution(state.currentDate).then(ok => {
      if (ok) onDateChanged(newDate);
    });
    return;
  }
  state.currentDate = newDate;

  const wd = formatKoreanWeekday(newDate);
  const inp1 = document.getElementById('currentDateInput');
  const inp2 = document.getElementById('printDateInput');
  const inpJ = document.getElementById('journalDateInput');
  const wd1 = document.getElementById('currentDateWeekday');
  const wd2 = document.getElementById('printDateWeekday');
  const wdJ = document.getElementById('journalDateWeekday');
  const disp = document.getElementById('currentDateDisplay');
  const jDisp = document.getElementById('journalDateDisplay');

  if (inp1) inp1.value = newDate;
  if (inp2) inp2.value = newDate;
  if (inpJ) inpJ.value = newDate;
  if (wd1) wd1.textContent = wd;
  if (wd2) wd2.textContent = wd;
  if (wdJ) wdJ.textContent = wd;
  if (disp) disp.textContent = `선택일자: ${newDate} ${wd}`;
  if (jDisp) jDisp.textContent = `선택일자: ${newDate} ${wd}`;

  const today = getTodayKST();
  const isFuture = newDate > today;
  const isToday = newDate === today;
  document.getElementById('futureDateBadge')?.classList.toggle('hidden', !isFuture);
  document.getElementById('printFutureDateBadge')?.classList.toggle('hidden', !isFuture);
  document.getElementById('journalFutureDateBadge')?.classList.toggle('hidden', !isFuture);
  document.querySelectorAll('[data-action="go-today"]').forEach(btn => {
    btn.disabled = isToday;
  });

  if (state.currentTab === 1) {
    renderAttendanceGrid();
    renderActivityRows(true);
    syncSaveIndicatorForDate(newDate);
  } else if (state.currentTab === 2) {
    renderUnifiedPrintView();
  } else if (state.currentTab === 4) {
    renderJournalView();
  }
}

function changeDate(deltaDays) {
  onDateChanged(shiftDateYMD(state.currentDate || getTodayKST(), deltaDays));
}

function goToToday() {
  onDateChanged(getTodayKST());
}

function closeDialog(dialogId) {
  const dlg = document.getElementById(dialogId);
  if (dlg && dlg.open) dlg.close();
  restoreDialogFocus();
}

function bindStaticUiEvents() {
  // Auth & Sample Demo Controls
  document.getElementById('retryAuthConnectBtn')?.addEventListener('click', retryAuthConnection);
  document.getElementById('startDemoAdminBtn')?.addEventListener('click', () => enterDemoSession('demo_admin'));
  document.getElementById('startDemoStaffBtn')?.addEventListener('click', () => enterDemoSession('demo_staff_1'));
  document.getElementById('demoGateResetBtn')?.addEventListener('click', resetSampleDemoData);
  document.getElementById('authInitForm')?.addEventListener('submit', handleInitialSetup);
  document.getElementById('authLoginForm')?.addEventListener('submit', handleTeacherLogin);
  document.getElementById('authRegisterForm')?.addEventListener('submit', handleTeacherRegister);
  document.querySelectorAll('[data-auth-mode]').forEach(btn => {
    btn.addEventListener('click', () => switchAuthMode(btn.dataset.authMode));
  });

  // Top Nav, Header Actions, Logout & WAI-ARIA Tablist Keyboard Support
  document.querySelectorAll('[data-nav-tab]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(Number(btn.dataset.navTab)));
  });
  document.getElementById('headerResetDemoBtn')?.addEventListener('click', resetSampleDemoData);
  document.getElementById('headerChangePwBtn')?.addEventListener('click', openResetMyPwDialog);
  document.getElementById('logoutBtn')?.addEventListener('click', () => logoutTeacher(false));
  document.querySelectorAll('[role="tablist"]').forEach(tablist => {
    tablist.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      const tabs = Array.from(tablist.querySelectorAll('[role="tab"]')).filter(el => !el.disabled && !el.closest('.hidden'));
      if (tabs.length < 2) return;
      const curIdx = tabs.indexOf(document.activeElement);
      if (curIdx === -1) return;
      e.preventDefault();
      let nextIdx = curIdx;
      if (e.key === 'ArrowRight') nextIdx = (curIdx + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') nextIdx = (curIdx - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') nextIdx = 0;
      else if (e.key === 'End') nextIdx = tabs.length - 1;
      tabs[nextIdx].focus();
      tabs[nextIdx].click();
    });
  });

  // Shared Date Toolbars (Tab 1 & Tab 2)
  document.querySelectorAll('[data-date-delta]').forEach(btn => {
    btn.addEventListener('click', () => changeDate(Number(btn.dataset.dateDelta)));
  });
  document.querySelectorAll('[data-action="go-today"]').forEach(btn => {
    btn.disabled = (state.currentDate || getTodayKST()) === getTodayKST();
    btn.addEventListener('click', goToToday);
  });
  document.getElementById('currentDateInput')?.addEventListener('change', e => onDateChanged(e.target.value));
  document.getElementById('printDateInput')?.addEventListener('change', e => onDateChanged(e.target.value));
  document.getElementById('journalDateInput')?.addEventListener('change', e => onDateChanged(e.target.value));

  // Tab 1 Buttons & Empty Onboarding Actions
  document.getElementById('startBulkMemberBtn')?.addEventListener('click', () => openBulkMemberMode());
  document.getElementById('addFirstMemberDirectBtn')?.addEventListener('click', () => {
    const firstSlot = state.members.find(m => m && !m.name) || state.members[0];
    openMemberDialog(firstSlot ? firstSlot.id : null);
  });
  document.getElementById('goBackupRestoreBtn')?.addEventListener('click', () => {
    switchTab(3, () => switchMgmtSubTab('backup'));
  });
  document.getElementById('markAllAttendBtn')?.addEventListener('click', () => markAllAttendance('○'));
  document.getElementById('deleteDayRecordBtn')?.addEventListener('click', deleteCurrentDayRecord);
  document.getElementById('manualSaveBtn')?.addEventListener('click', manualSaveCurrentDay);
  document.getElementById('mobileManualSaveBtn')?.addEventListener('click', manualSaveCurrentDay);
  document.getElementById('openMemberMgmtBtn')?.addEventListener('click', openMemberMgmtTab);
  document.getElementById('addActivityRowBtn')?.addEventListener('click', addActivityRow);
  document.getElementById('resetRoutinesBtn')?.addEventListener('click', resetRoutinesWithConfirm);

  // Tab 2 Controls (Unified Print Hub)
  document.querySelectorAll('#printDocModeGroup [data-print-mode]').forEach(btn => {
    btn.addEventListener('click', () => setPrintTargetDoc(btn.dataset.printMode));
  });
  document.getElementById('printShowDateChk')?.addEventListener('change', e => togglePrintDateDisplay(e.target.checked));
  document.getElementById('togglePrintZoomFitBtn')?.addEventListener('click', () => {
    const dailyShell = document.getElementById('paperPreviewShell');
    const journalShell = document.getElementById('journalPreviewShell');
    const btn = document.getElementById('togglePrintZoomFitBtn');
    if ((!dailyShell && !journalShell) || !btn) return;
    const isFit = !(dailyShell || journalShell).classList.contains('is-fit-mobile');
    dailyShell?.classList.toggle('is-fit-mobile', isFit);
    journalShell?.classList.toggle('is-fit-mobile', isFit);
    btn.setAttribute('aria-pressed', String(isFit));
    btn.textContent = isFit ? '원본 크기로 보기' : '화면 너비에 맞추기';
  });
  document.getElementById('printReportBtn')?.addEventListener('click', () => requestUnifiedPrint());
  document.getElementById('commitDefaultPrintBtn')?.addEventListener('click', commitCurrentDayDefaultFromPrint);
  document.getElementById('deleteDayRecordPrintBtn')?.addEventListener('click', deleteCurrentDayRecord);
  document.getElementById('goWriteJournalFromPrintBtn')?.addEventListener('click', () => switchTab(4));

  // Tab 4 Buttons & Inputs (주간보호 운영일지 작성 전용)
  document.getElementById('saveJournalBtn')?.addEventListener('click', manualSaveCurrentJournal);
  document.getElementById('pullAbsentFromAttBtn')?.addEventListener('click', pullAbsentFromAttendanceToJournal);
  document.getElementById('addDayStaffRowBtn')?.addEventListener('click', addDayStaffRowToJournal);
  document.getElementById('deleteJournalDayBtn')?.addEventListener('click', deleteCurrentJournalRecord);
  document.getElementById('openJournalWritersBtn')?.addEventListener('click', openJournalWritersDialog);
  document.getElementById('openJournalWritersFromAcctBtn')?.addEventListener('click', openJournalWritersDialog);
  document.getElementById('jAmProgPicker')?.addEventListener('change', (e) => {
    appendPickedProgramToField('am', e.target.value);
    e.target.value = '';
  });
  document.getElementById('jPmProgPicker')?.addEventListener('change', (e) => {
    appendPickedProgramToField('pm', e.target.value);
    e.target.value = '';
  });
  ['jSafetyCheck', 'jEnvCheck'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', (e) => handleJournalStaticFieldEdit(e.target));
  });
  [
    'jAbsentees', 'jAbsentReason', 'jAmPrograms', 'jAmStaff', 'jAmDetail',
    'jPmPrograms', 'jPmStaff', 'jPmDetail', 'jResidentNotes',
    'jSponsorItems', 'jEtcNotes', 'jKitchenVolunteer', 'jVmsCount'
  ].forEach(id => {
    document.getElementById(id)?.addEventListener('input', (e) => handleJournalStaticFieldEdit(e.target));
  });

  // Password & Invite Code Visibility Toggles
  document.querySelectorAll('[data-toggle-pw]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.togglePw;
      const input = targetId ? document.getElementById(targetId) : null;
      if (!input) return;
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      btn.textContent = isHidden ? '숨김' : '표시';
      btn.setAttribute('aria-pressed', String(isHidden));
      const baseLabel = btn.dataset.pwLabel || (btn.getAttribute('aria-label') || '비밀번호').replace(/\s*(표시|숨김)$/, '');
      btn.dataset.pwLabel = baseLabel;
      btn.setAttribute('aria-label', `${baseLabel} ${isHidden ? '숨김' : '표시'}`);
    });
  });

  // Tab 3 Sub-Navigation, Filters, Bulk Entry & Admin Controls
  document.querySelectorAll('[data-mgmt-sub]').forEach(btn => {
    btn.addEventListener('click', () => switchMgmtSubTab(btn.dataset.mgmtSub));
  });
  document.getElementById('backToTab1FromMembersBtn')?.addEventListener('click', () => switchTab(1));
  document.getElementById('toggleBulkMemberBtn')?.addEventListener('click', () => {
    if (state.isBulkMemberMode) cancelBulkMemberMode();
    else openBulkMemberMode();
  });
  document.getElementById('cancelBulkMemberBtn')?.addEventListener('click', cancelBulkMemberMode);
  document.getElementById('saveBulkMemberBtn')?.addEventListener('click', saveBulkMemberMode);
  document.getElementById('addMemberBtn')?.addEventListener('click', () => openMemberDialog(null));
  document.querySelectorAll('#memberFilterStrip [data-filter]').forEach(btn => {
    btn.addEventListener('click', () => setMemberFilter(btn.dataset.filter));
  });
  document.getElementById('programCategoryFilterStrip')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-prog-cat]');
    if (!btn) return;
    state.programCategoryFilter = btn.dataset.progCat || 'ALL';
    renderProgramCategoryFilterStrip();
    renderProgramMgmtTable();
  });
  document.getElementById('programSearchInput')?.addEventListener('input', (e) => {
    state.programSearchQuery = e.target.value || '';
    renderProgramMgmtTable();
  });
  document.getElementById('openCategoryMgmtBtn')?.addEventListener('click', openCategoryMgmtDialog);
  document.getElementById('addProgramBtn')?.addEventListener('click', () => openProgramDialog(null));
  document.getElementById('downloadBackupBtn')?.addEventListener('click', () => downloadBackupFile());
  document.getElementById('backupFileInput')?.addEventListener('change', restoreBackupFile);
  document.getElementById('newYearResetBtn')?.addEventListener('click', openNewYearResetDialog);
  document.getElementById('inviteCodeForm')?.addEventListener('submit', handleUpdateInviteCode);

  // Dialog Forms, Dynamic Fields & Confirm Dialog
  document.getElementById('memberEditStatus')?.addEventListener('change', syncMemberLeaveDateGroup);
  document.getElementById('memberSaveNextBtn')?.addEventListener('click', () => submitMemberDialog(null, true));
  document.getElementById('memberDialogForm')?.addEventListener('submit', (e) => submitMemberDialog(e, false));
  document.getElementById('programDialogForm')?.addEventListener('submit', submitProgramDialog);
  document.getElementById('categoryDialogForm')?.addEventListener('submit', submitCategoryDialog);
  document.getElementById('addCustomCategoryBtn')?.addEventListener('click', addCustomCategoryToDraft);
  document.getElementById('newCategoryNameInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomCategoryToDraft();
    }
  });
  document.getElementById('resetTeacherPwForm')?.addEventListener('submit', submitResetTeacherPassword);
  document.getElementById('newYearResetForm')?.addEventListener('submit', submitNewYearReset);
  document.getElementById('journalWritersForm')?.addEventListener('submit', submitJournalWritersDialog);
  document.getElementById('addCustomWriterBtn')?.addEventListener('click', addCustomJournalWriter);
  document.getElementById('newCustomWriterInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomJournalWriter();
    }
  });
  document.getElementById('confirmDlgOkBtn')?.addEventListener('click', () => settleConfirmDialog(true));
  document.getElementById('confirmDlgAltBtn')?.addEventListener('click', () => settleConfirmDialog('alt'));
  document.getElementById('confirmDlgCancelBtn')?.addEventListener('click', () => settleConfirmDialog(false));
  document.getElementById('confirmDlgCloseBtn')?.addEventListener('click', () => settleConfirmDialog(false));
  document.getElementById('confirmDialog')?.addEventListener('cancel', (e) => {
    e.preventDefault();
    settleConfirmDialog(false);
  });
  document.querySelectorAll('[data-close-dialog]').forEach(btn => {
    btn.addEventListener('click', () => closeDialog(btn.dataset.closeDialog));
  });
  document.querySelectorAll('dialog.app-dialog').forEach(dlg => {
    dlg.addEventListener('close', restoreDialogFocus);
  });

  // Delegated Listener 1: Attendance Grid
  document.getElementById('attendanceGrid')?.addEventListener('click', (e) => {
    const segBtn = e.target.closest('[data-action="att-seg"]');
    if (segBtn) {
      setMemberPeriodAtt(segBtn.dataset.memberId, segBtn.dataset.period, segBtn.dataset.val);
      return;
    }
    const cycleBtn = e.target.closest('[data-action="att-cycle"]');
    if (cycleBtn) {
      cycleMemberFullDayAtt(cycleBtn.dataset.memberId);
      return;
    }
    const regBtn = e.target.closest('[data-action="att-register-slot"]');
    if (regBtn) {
      openMemberDialog(regBtn.dataset.memberId);
    }
  });

  // Delegated Listener 2: Activity Table (click + change)
  const actBody = document.getElementById('activityTableBody');
  actBody?.addEventListener('click', (e) => {
    const tr = e.target.closest('tr[data-row-id]');
    if (!tr) return;
    const rowId = tr.dataset.rowId;
    const stepBtn = e.target.closest('[data-action="act-step"]');
    if (stepBtn) {
      stepRowField(rowId, stepBtn.dataset.field, Number(stepBtn.dataset.delta));
      return;
    }
    if (e.target.closest('[data-action="act-toggle-auto"]')) {
      toggleRowAutoMembers(rowId);
      return;
    }
    if (e.target.closest('[data-action="act-delete"]')) {
      deleteActivityRow(rowId);
    }
  });
  actBody?.addEventListener('change', (e) => {
    const tr = e.target.closest('tr[data-row-id]');
    if (!tr) return;
    const rowId = tr.dataset.rowId;
    const field = e.target.dataset.field;
    if (field === 'category') {
      onRowCategoryChange(rowId, e.target.value);
    } else if (field === 'program') {
      onRowProgramChange(rowId, e.target.value);
    } else if (field === 'count' || field === 'members') {
      setRowField(rowId, field, e.target.value);
    }
  });

  // Delegated Listener 3: Member Mgmt Table (actions + Enter advance in bulk mode)
  const memberBody = document.getElementById('memberMgmtTableBody');
  memberBody?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const memberId = btn.dataset.memberId;
    if (btn.dataset.action === 'member-edit') openMemberDialog(memberId);
    else if (btn.dataset.action === 'member-activate') activateWaitingMember(memberId);
    else if (btn.dataset.action === 'member-discharge') quickDischarge(memberId);
    else if (btn.dataset.action === 'member-reactivate') reactivateMember(memberId);
  });
  memberBody?.addEventListener('input', (e) => {
    if (state.isBulkMemberMode && e.target.closest('[data-bulk-field]')) {
      state.isBulkDirty = true;
    }
    const nameInp = e.target.closest('[data-bulk-field="name"]');
    if (!nameInp) return;
    const tr = nameInp.closest('tr[data-bulk-idx]');
    const joinInp = tr?.querySelector('[data-bulk-field="joinDate"]');
    const statusSel = tr?.querySelector('[data-bulk-field="status"]');
    const hasName = Boolean(nameInp.value.trim());
    if (statusSel) {
      if (hasName && statusSel.value === 'BLANK') {
        statusSel.value = 'ACTIVE';
      } else if (!hasName && tr?.dataset.origNamed !== '1') {
        statusSel.value = 'BLANK';
      }
    }
    if (!joinInp) return;
    if (hasName && !joinInp.value && (!statusSel || statusSel.value === 'ACTIVE')) {
      joinInp.value = state.currentDate || getTodayKST();
    } else if (!hasName && tr?.dataset.origNamed !== '1') {
      joinInp.value = '';
    }
  });
  memberBody?.addEventListener('change', (e) => {
    if (!state.isBulkMemberMode) return;
    const bulkEl = e.target.closest('[data-bulk-field]');
    if (!bulkEl) return;
    state.isBulkDirty = true;
    if (bulkEl.dataset.bulkField === 'status') {
      const tr = bulkEl.closest('tr[data-bulk-idx]');
      const joinInp = tr?.querySelector('[data-bulk-field="joinDate"]');
      const nameVal = (tr?.querySelector('[data-bulk-field="name"]')?.value || '').trim();
      if (joinInp && bulkEl.value === 'ACTIVE' && nameVal && !joinInp.value) {
        joinInp.value = state.currentDate || getTodayKST();
      }
    }
  });
  memberBody?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const bulkFieldEl = e.target.closest('[data-bulk-field]');
    if (!bulkFieldEl) return;
    const fieldName = bulkFieldEl.dataset.bulkField;
    e.preventDefault();
    const fields = Array.from(memberBody.querySelectorAll('[data-bulk-field]')).filter(el => el.dataset.bulkField === fieldName);
    const idx = fields.indexOf(bulkFieldEl);
    if (idx >= 0 && idx + 1 < fields.length) {
      fields[idx + 1].focus();
      if (typeof fields[idx + 1].select === 'function') fields[idx + 1].select();
    } else {
      document.getElementById('saveBulkMemberBtn')?.focus();
    }
  });

  // Delegated Listener 4: Program Mgmt Table (click + change)
  const progBody = document.getElementById('programMgmtTableBody');
  progBody?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const progId = btn.dataset.progId;
    if (btn.dataset.action === 'prog-edit') openProgramDialog(progId);
    else if (btn.dataset.action === 'prog-delete') deleteProgram(progId);
  });
  progBody?.addEventListener('change', (e) => {
    const action = e.target.dataset.action;
    const progId = e.target.dataset.progId;
    if (action === 'prog-target') updateProgramTarget(progId, e.target.value);
    else if (action === 'prog-daily') toggleProgramDaily(progId, e.target.checked);
  });

  // Delegated Listener 5: Teacher Accounts Table
  document.getElementById('teacherMgmtTableBody')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const teacherId = btn.dataset.teacherId;
    if (btn.dataset.action === 'teacher-reset-pw') openResetTeacherPwDialog(teacherId);
    else if (btn.dataset.action === 'teacher-toggle-role') toggleTeacherRole(teacherId);
    else if (btn.dataset.action === 'teacher-delete') deleteTeacherAccount(teacherId);
  });

  // Delegated Listener 6: Journal Dynamic Staff Tasks
  const jStaffContainer = document.getElementById('journalStaffInputsContainer');
  jStaffContainer?.addEventListener('input', (e) => {
    const fieldEl = e.target.closest('[data-jstaff-field]');
    if (!fieldEl || !state.currentTeacher) return;
    const idx = Number(fieldEl.dataset.jstaffIdx);
    const field = fieldEl.dataset.jstaffField;
    const date = state.currentDate;
    const doc = beginJournalEdit(date);
    if (!doc.staffTasks[idx]) return;
    if (field === 'name') {
      doc.staffTasks[idx].name = String(fieldEl.value || '').slice(0, 20);
    } else if (field === 'content') {
      doc.staffTasks[idx].content = String(fieldEl.value || '').slice(0, 3000);
    }
    renderJournalPrintPreview();
    syncJournalSaveIndicatorForDate(date);
  });
  jStaffContainer?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-jstaff-action="remove"]');
    if (!btn || !state.currentTeacher) return;
    const idx = Number(btn.dataset.jstaffIdx);
    const date = state.currentDate;
    const doc = beginJournalEdit(date);
    if (idx < 0 || idx >= doc.staffTasks.length) return;
    doc.staffTasks.splice(idx, 1);
    renderJournalStaffInputs();
    renderJournalPrintPreview();
    syncJournalSaveIndicatorForDate(date);
  });

  // Delegated Listener 7: Journal Fixed Writers Config List
  const jWritersList = document.getElementById('journalWritersList');
  jWritersList?.addEventListener('change', (e) => {
    const chk = e.target.closest('[data-jw-action="toggle"]');
    if (!chk) return;
    const idx = Number(chk.dataset.jwIdx);
    if (journalWritersModalDraft[idx]) {
      journalWritersModalDraft[idx].active = Boolean(chk.checked);
    }
  });
  jWritersList?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-jw-action]');
    if (!btn) return;
    const act = btn.dataset.jwAction;
    if (act === 'toggle') return;
    const idx = Number(btn.dataset.jwIdx);
    if (act === 'up' && idx > 0 && idx < journalWritersModalDraft.length) {
      const tmp = journalWritersModalDraft[idx - 1];
      journalWritersModalDraft[idx - 1] = journalWritersModalDraft[idx];
      journalWritersModalDraft[idx] = tmp;
      renderJournalWritersModalList();
    } else if (act === 'down' && idx >= 0 && idx < journalWritersModalDraft.length - 1) {
      const tmp = journalWritersModalDraft[idx + 1];
      journalWritersModalDraft[idx + 1] = journalWritersModalDraft[idx];
      journalWritersModalDraft[idx] = tmp;
      renderJournalWritersModalList();
    } else if (act === 'delete' && idx >= 0 && idx < journalWritersModalDraft.length && journalWritersModalDraft[idx].uid === '') {
      journalWritersModalDraft.splice(idx, 1);
      renderJournalWritersModalList();
    }
  });

  // Delegated Listener 8: Category Management Modal List
  const catList = document.getElementById('categoryMgmtList');
  catList?.addEventListener('input', (e) => {
    const inp = e.target.closest('[data-cat-action="rename"]');
    if (!inp) return;
    const idx = Number(inp.dataset.catIdx);
    if (categoryModalDraft[idx] && !categoryModalDraft[idx].fixed) {
      categoryModalDraft[idx].name = String(inp.value || '').slice(0, 30);
    }
  });
  catList?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-cat-action]');
    if (!btn) return;
    const act = btn.dataset.catAction;
    const idx = Number(btn.dataset.catIdx);
    const item = categoryModalDraft[idx];
    if (!item || item.fixed) return;
    if (act === 'up' && idx > DEFAULT_CATEGORIES.length) {
      const tmp = categoryModalDraft[idx - 1];
      categoryModalDraft[idx - 1] = item;
      categoryModalDraft[idx] = tmp;
      renderCategoryMgmtModalList();
    } else if (act === 'down' && idx < categoryModalDraft.length - 1) {
      const tmp = categoryModalDraft[idx + 1];
      categoryModalDraft[idx + 1] = item;
      categoryModalDraft[idx] = tmp;
      renderCategoryMgmtModalList();
    } else if (act === 'delete') {
      const targets = new Set([item.name.trim(), item.origName].filter(Boolean));
      const usedCount = state.programs.filter(p => targets.has(p.category)).length;
      if (usedCount > 0) {
        showAuthError('categoryDlgError', `'${item.name}' 대분류에 등록된 프로그램이 ${usedCount}개 있습니다. 먼저 해당 프로그램을 다른 대분류로 옮기거나 삭제해 주세요.`);
        return;
      }
      showAuthError('categoryDlgError', '');
      categoryModalDraft.splice(idx, 1);
      renderCategoryMgmtModalList();
    }
  });
}

// ----------------------------------------------------------------------------
// 15. BOOTSTRAP, PRINT HOOK, KEYBOARD SHORTCUTS & SERVICE WORKER
// ----------------------------------------------------------------------------
window.addEventListener('beforeprint', () => {
  if (!state.currentTeacher) return;
  const docMode = state.currentTab === 1
    ? 'daily'
    : (state.currentTab === 4 ? 'journal' : (state.printTargetDoc || 'daily'));
  document.body.dataset.printDoc = docMode;
  if (docMode !== 'journal') renderPrintReport();
  if (docMode !== 'daily') renderJournalPrintPreview();
});

window.addEventListener('beforeunload', (e) => {
  if (state.currentTeacher && (state.dirtyDates.size > 0 || state.dirtyJournalDates.size > 0 || needsBulkDiscardConfirm())) {
    e.preventDefault();
    e.returnValue = '';
  }
});

window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
    if (state.currentTeacher) {
      if (state.currentTab === 4) {
        if (hasUnsavedJournalChanges(state.currentDate)) {
          e.preventDefault();
          requestUnifiedPrint('journal');
        }
      } else if (state.currentTab === 1) {
        if (hasUnsavedDayChanges(state.currentDate) || !isDateSaved(state.currentDate)) {
          e.preventDefault();
          requestUnifiedPrint('daily');
        }
      } else {
        const mode = state.printTargetDoc === 'journal' || state.printTargetDoc === 'both'
          ? state.printTargetDoc
          : 'daily';
        const needsDailyPrompt = mode !== 'journal' && (hasUnsavedDayChanges(state.currentDate) || !isDateSaved(state.currentDate));
        const needsJournalPrompt = mode !== 'daily' && hasUnsavedJournalChanges(state.currentDate);
        if (needsDailyPrompt || needsJournalPrompt) {
          e.preventDefault();
          requestUnifiedPrint(mode);
        }
      }
    }
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    if (state.currentTeacher) {
      if (state.currentTab === 1) {
        e.preventDefault();
        manualSaveCurrentDay();
      } else if (state.currentTab === 4) {
        e.preventDefault();
        manualSaveCurrentJournal();
      }
    }
    return;
  }
  if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    if (state.currentTeacher && (state.currentTab === 1 || state.currentTab === 2 || state.currentTab === 4) && !document.querySelector('dialog[open]')) {
      const tag = e.target && e.target.tagName;
      if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') {
        e.preventDefault();
        changeDate(e.key === 'ArrowLeft' ? -1 : 1);
      }
    }
  }
});

window.addEventListener('DOMContentLoaded', () => {
  state.currentDate = getTodayKST();
  state.isDemoMode = isSampleDemoConfig(window.FIREBASE_CONFIG);

  if (!state.isDemoMode) {
    clearAppStorageKeys(localStorage, [STORAGE_KEYS.sessionMeta]);
    clearAppStorageKeys(sessionStorage, [STORAGE_KEYS.sessionMeta]);
  }

  initCrossTabSessionSync();
  bindStaticUiEvents();

  if (state.isDemoMode) {
    initSampleDemoMode();
  } else {
    initFirebaseAndAuth();
  }

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('ServiceWorker registration warning:', err);
    });
  }
});
