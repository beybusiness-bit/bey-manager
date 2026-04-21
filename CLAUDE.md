# CLAUDE.md — 베이 관리자 프로젝트 지침

> 이 파일은 Claude Code가 **모든 세션 시작 시 자동으로 읽어서** 프로젝트 맥락을 파악하는 지침 파일입니다.
> 세션 마무리 시 Claude Code가 **직접 이 파일을 갱신**합니다 (완료된 단계 체크, 다음 시작점 업데이트, 새로 발견한 교훈 추가).

---

## 1. 앱 기본 정보

- **앱 이름**: 베이 관리자
- **저장소**: (GitHub 리포 URL을 여기 채워넣을 것)
- **배포 URL**: (GitHub Pages URL을 여기 채워넣을 것)

### AUTH 상수 (현재 코드에 반영된 값)

```javascript
const AUTH = {
  GOOGLE_CLIENT_ID: '27055656717-5e6n898lk22dhjf5mn82hk7q1q25u8vm.apps.googleusercontent.com',
  SHEET_ID: '1cMy2OVO69IfAqIahlyrJNCQUZDuqo1e_3ZM9BomkOXI',
  USER_EMAIL: 'baekeun0@gmail.com',  // ⚠️ 향후 ALLOWED_EMAILS 배열로 리팩토링 예정 (15단계 이후)
};
```

**향후 리팩토링 후 목표 구조:**
```javascript
const AUTH = {
  GOOGLE_CLIENT_ID: '27055656717-5e6n898lk22dhjf5mn82hk7q1q25u8vm.apps.googleusercontent.com',
  SHEET_ID: '1cMy2OVO69IfAqIahlyrJNCQUZDuqo1e_3ZM9BomkOXI',
  ALLOWED_EMAILS: ['baekeun0@gmail.com'],  // 추가 계정은 여기에만 넣으면 됨
};
// 검증 로직: if (!AUTH.ALLOWED_EMAILS.includes(payload.email)) { ... }
```

### 이관 메모
- 프로젝트는 **웹 Claude에서 시작 → v2.1 마감 후 Claude Code로 이관**
- 이관 이전의 웹 지침(`project-instructions.md`)은 참고용으로 보관. **Claude Code에서는 이 CLAUDE.md가 단일 소스 오브 트루스(SSOT)**

---

## 2. 앱 아키텍처 요약

- **앱 성격**: 베이님의 일상·업무·습관을 통합 관리하는 **개인용 슈퍼앱**
- **UI 구조**: 사이드바 메뉴 (홈 대시보드, 일상, 업무, 습관, 레시피, 금전, 아이디어, 할일, 설정)
- **로그인**: Google OAuth 2.0 (JWT 토큰 기반, 이메일 화이트리스트 검증)
- **사용자 역할**: 단일 사용자 (현재 베이님 전용, 추후 확장 가능)
- **데이터 저장소**: 
  - 현재: `localStorage` (로컬만 유지)
  - 향후: Google Sheets (SHEET_ID 지정된 시트로 이관 예정)
- **외부 연동 예정**: 
  - 시리 단축어 API 엔드포인트 (음성 명령 연동)
  - 노션 가이드 문서 (Phase 4)
- **기존 도구 마이그레이션 대상**: 
  - 일상 시간표 CSV (급히_대충_스프레드_시트가_필요할_때_-_260321_시간표.csv)
  - 노션 습관 관리 페이지
  - 노션 업무 시간 기록 페이지
  - 노션 레시피 페이지

### 파일 구조

```
bey-manager/
├── CLAUDE.md                    # Claude Code용 프로젝트 지침 (이 파일)
├── bey-manager.html             # 메인 앱 (단일 파일, 현재 ~4021줄)
├── README.md                    # GitHub 리포 소개 (선택)
└── docs/
    ├── guide.md                 # 사용 가이드 (Phase 4에서 생성)
    └── screenshots/             # 가이드용 이미지
```

**파일 분할은 현재 안 함.** 이유: Google OAuth가 file:// 프로토콜에서 CORS 문제로 실패한 전례 있음. 단일 HTML은 CORS 이슈 자체를 회피함.
→ **분할 타이밍**: 시간표 기능 다 들어가서 6000줄 이상 되면 재검토. 그때는 로컬 서버(`python3 -m http.server`)를 상시 띄워서 개발하는 것 전제.

---

## 3. 세션 운영 원칙

### 세션 시작 루틴 (Claude Code가 세션 시작 시 반드시 수행)

1. **CLAUDE.md 읽기** (자동으로 시스템 프롬프트에 포함됨)
2. `git log -5 --oneline`으로 최근 커밋 확인
3. `wc -l bey-manager.html`로 파일 라인 수 확인
4. `grep "console.log('베이 관리자" bey-manager.html`로 현재 버전 확인
5. CLAUDE.md의 **"10. 다음 세션 시작점"** 섹션을 읽고 이어서 작업

### 세션 마무리 루틴 (단계 완료 또는 사용자가 "마무리" 명시 시)

1. 최종 JS 문법 검사 (`node --check`)
2. Git 커밋 (의미 있는 메시지)
3. **CLAUDE.md 직접 갱신**:
   - "7. 개발 단계 현황"에서 완료한 단계 ✅로 체크
   - "10. 다음 세션 시작점" 업데이트
   - 새로 배운 교훈이 있으면 "11. 교훈" 섹션에 추가
   - 파일 라인 수, 버전 번호 최신화
4. 푸시는 수행하지 않음 (베이님이 판단해서 직접 push)

### 단계 완료 자동 판단 금지

**코드가 완료됐다고 해서 단계 완료로 간주하고 마무리 루틴을 돌리지 말 것.**
- 반드시 사용자의 **실제 테스트 + 피드백 + "다음으로 넘어가자" / "마무리하자"** 등 명시적 전환 의사를 확인한 후에만 마무리 루틴 수행
- 이전 웹 Claude 대화에서 이 실수로 혼남 😅 (v2.1 마감 때)

---

## 4. Phase 2 — 개발 진행 프로토콜

### 코드 작업 원칙

```javascript
// ① today() — 반드시 로컬 날짜 기준 (toISOString() UTC 방식 금지)
const today = () => {
  const d = new Date();
  return d.getFullYear() + '-'
    + String(d.getMonth() + 1).padStart(2, '0') + '-'
    + String(d.getDate()).padStart(2, '0');
};
```

### 절대 금지 사항

- `<script>` 안에 백틱 중첩 (`\`<div>${ \`...\` }</div>\``)
- `<script>` 안에 `&`, `<`, `>`, `"` 직접 삽입 (HTML 이스케이프 파싱 문제)
- `innerHTML` null 체크 생략 (`getElementById()` 결과가 null일 수 있음)
- `toISOString()` UTC 날짜 사용 (시차 문제)
- HTML 속성 내 `\'` (백슬래시 이스케이프) → **반드시 `&apos;` 사용**
- **Python 스크립트로 라인 번호 기반 파일 수정** (인덱스 꼬임 사고 전례 있음)

### 수정 방식

- **기본**: Claude Code의 `Edit` 도구 사용 (웹의 `str_replace`에 해당)
- **큰 블록 교체**: `Edit`로 안 되면 Python 스크립트를 쓰되, **반드시 유일 문자열 매칭 기반**으로 작성:
  ```python
  # 안전한 패턴
  assert content.count(start_anchor) == 1
  start_idx = content.index(start_anchor)
  end_idx = content.index(end_anchor) + len(end_anchor)
  new_content = content[:start_idx] + new_block + content[end_idx:]
  ```
- **금지**: 라인 번호 기반 치환 (`sed -i '123s/.../.../'` 같은 것)
- **Edit 실패 시** (`String to replace not found`):
  - old_str에 오타/공백/줄바꿈 불일치 가능성 매우 높음
  - `Read` 도구로 실제 내용 재확인 후 정확히 복사해서 재시도
  - 여러 줄 포함 시 앞뒤 컨텍스트 줄이고 필요 부분만 정확히 매칭

### 매 작업 후 필수 체크

```bash
# JS 문법 검사 (매 Edit 후 실행 권장)
python3 -c "
import re
with open('bey-manager.html','r',encoding='utf-8') as f: html = f.read()
m = re.findall(r'<script(?![^>]*src=)[^>]*>(.*?)</script>', html, re.DOTALL)
open('/tmp/check.js','w',encoding='utf-8').write('\n'.join(m))
" && node --check /tmp/check.js && echo "✅ 문법 OK"
```

### UI 디자인 원칙

- **페이저 스타일**: `.pagination`, `.pg-btn` (flex, gap:6px, mono 폰트)
- **반응형**: 모바일 최적화 우선, 데스크톱도 지원
- **컬러 시스템** (CSS 변수, 디자인 설정에서 모두 변경 가능):
  - 키컬러: `--primary-yellow` (#ffde59)
  - 보조: `--primary-pink` (#ffaade), `--primary-green` (#c1ff72)
  - 사이드바 배경: `--bg-side` (#fafafa)
- **폰트**: 기본 `'Noto Sans KR'`, Mono는 `'DM Mono'`
- **사이드바 폭**: `--nav-width` (기본 220px, 180~300px 조정 가능)
- **버튼 모서리**: `--button-radius` (기본 8px, 4~20px 조정 가능)

### 자주 쓰는 커맨드

```bash
# 로컬 개발 서버 (Google 로그인 테스트용, CORS 회피)
python3 -m http.server 8000
# → 브라우저에서 http://localhost:8000/bey-manager.html 열기

# 파일 상태 확인
wc -l bey-manager.html
grep -n "console.log('베이 관리자" bey-manager.html

# JS 문법 검사 (위에 있음)

# 주요 함수/변수 존재 확인
grep -n "function filterEmoji\|const EMOJI_KEYWORDS\|AUTH.PASSWORD" bey-manager.html

# Git 스냅샷 (단계 완료 시)
git add bey-manager.html CLAUDE.md
git commit -m "feat: 15단계 시간표 썸네일뷰"
```

### Git 워크플로우

- **단계 시작 시**: `git status`로 깨끗한 상태 확인
- **단계 중간**: 주요 분기점마다 커밋 (예: "feat: 시간표 카드 HTML", "feat: 시간표 렌더링 로직")
- **단계 완료**: CLAUDE.md 갱신 + 최종 커밋
- **브랜치**: 단일 개발자라 메인에 직접 커밋 OK
- **커밋 메시지 컨벤션**: 
  - `feat:` 새 기능
  - `fix:` 버그 수정
  - `refactor:` 기능 변경 없는 구조 개선
  - `docs:` 문서/주석 변경 (CLAUDE.md 포함)
  - `chore:` 기타 (배포 설정 등)

### 자동 배포(패치 → 푸시) 플로우 — 기본 동작

Claude Code는 사용자의 수정 요청을 처리할 때 아래 순서를 **기본값**으로 수행한다:

1. 사용자가 수정 요청
2. Claude가 파일 수정
3. JS 문법 검증 (`node --check`)
4. **자동으로 `git add` + `git commit` + `git push origin main`**
5. 사용자에게 "✅ 푸시 완료. GitHub Pages 반영에 약 1분 정도. 브라우저에서 **하드 리프레시**(Cmd+Shift+R) 후 확인하세요." 안내

이 플로우로 사용자는 로컬 폴더를 직접 만지지 않고 배포된 URL에서 바로 모바일·데스크톱 테스트를 할 수 있다.

### 자동 푸시를 보류해야 할 상황 (Claude가 먼저 제안)

아래 상황에서는 **자동 푸시 전에 사용자에게 먼저 물어본다**:

- **WIP(Work In Progress)**: 여러 단계로 쪼개진 작업의 중간 상태로, 당장 배포되면 UI가 깨지거나 동작이 어색할 때
- **테스트 안 된 큰 변경**: 로그인·OAuth·데이터 마이그레이션처럼 실패 시 파급효과가 큰 변경인데 Claude가 로컬에서 충분히 검증할 수 없는 경우
- **디자인 실험용 임시 코드**: 나중에 되돌릴 가능성이 높은 탐색적 변경
- **민감 정보가 포함될 가능성이 있는 변경**: 실수로 키·토큰이 섞였을 수 있는 diff

이런 경우에는 "이건 푸시 보류하고 로컬에서 먼저 테스트하는 게 나을 것 같은데요. 괜찮으시겠어요?" 라고 먼저 확인한다.

### 로컬 개발/테스트 워크플로우

- **Chrome 개발자 도구 활용**:
  - Console 탭에서 상태 확인: `localStorage`, `currentUser`, `activities`, `categories`, `designSettings`
  - Application → Local Storage에서 저장된 키 확인/삭제
- **localStorage 초기화** (디버그용):
  ```javascript
  // 콘솔에서 실행
  localStorage.clear(); sessionStorage.clear(); location.reload();
  ```
- **시크릿 모드 테스트**: 실제 첫 로그인 플로우 확인 시 (기존 세션 안 섞임)
- **반응형 테스트**: Chrome DevTools의 Device Toolbar (Ctrl+Shift+M) — 모바일 가로 375px, 세로 667px 기준

### 자주 하는 실수 체크리스트 (배포 전 확인)

- [ ] `console.log` 디버그 코드 남아있지 않은지
- [ ] `AUTH.GOOGLE_CLIENT_ID`가 placeholder가 아닌 실제 값인지
- [ ] 버전 로그(`console.log('베이 관리자 v...')`) 업데이트됐는지
- [ ] 모바일 뷰(375px)에서 레이아웃 깨지지 않는지
- [ ] Google Identity Services 스크립트(`accounts.google.com/gsi/client`) 태그 존재하는지
- [ ] 로그인 → 로그아웃 → 재로그인 플로우 작동하는지
- [ ] localStorage 초기 상태(신규 사용자 시나리오)에서 앱 정상 로드되는지

### 디버깅 팁

```javascript
// 콘솔에서 상태 스냅샷
console.table({
  user: currentUser,
  activities: activities.length,
  categories: categories.length,
  design: designSettings
});

// localStorage 내용 전체 덤프
Object.keys(localStorage).forEach(k => console.log(k, '→', localStorage.getItem(k)));

// 특정 키만
console.log(JSON.parse(localStorage.getItem('designSettings')));
```

---

## 5. Phase 3 — 배포 프로토콜

1. `bey-manager.html` → `index.html`로 이름 바꿔서 GitHub 저장소 업로드 (또는 리포에서 `index.html`로 링크)
2. GitHub → Settings → Pages → Branch: `main` → Save
3. Google Cloud Console 설정 (✅ Client ID는 이미 발급 완료):
   - 승인된 자바스크립트 원본: GitHub Pages URL 추가
   - 승인된 리디렉션 URI: GitHub Pages URL 추가
4. 배포 후 실제 URL에서 로그인 테스트

### 빠른 테스트 경로
- **UI 확인만**: `python3 -m http.server 8000` → http://localhost:8000
- **OAuth 포함 전체**: netlify.com/drop에 파일 드래그 → 임시 URL로 테스트
- **최종**: GitHub Pages 배포

---

## 6. Phase 4 — 가이드 문서 작성 프로토콜

배포 완료 후 사용자가 요청하면, 아래 프롬프트 틀을 완성해서 **노션 MCP로 가이드 문서 작성**:

```
지금까지 이 프로젝트에서 개발한 앱의 사용 가이드를 노션에 작성해줘.
노션 MCP로 바로 작성. 작성할 노션 페이지 URL: [URL]

앱 이름: 베이 관리자
접속 URL: [GitHub Pages URL]
로그인: Google OAuth 2.0
데이터 저장: Google Sheets (ID: 1cMy2OVO69IfAqIahlyrJNCQUZDuqo1e_3ZM9BomkOXI)

주요 기능 (사이드바 순서): [구현된 메뉴 전체]
주요 워크플로우: [반복 업무 흐름]

개발 과정에서 수집된 가이드 참고 내용:
[아래 "9. 가이드 문서 참고 내용 누적" 섹션 전체 삽입]

문서 요건:
- 대상: 베이님 본인 (기술 배경 있음)
- 구성: 시작하기 → 메뉴별 기능 → 주요 워크플로우 → 시리 단축어 설정 → FAQ
- 각 섹션에 "📸 이미지 추가 위치: [캡처할 화면]" 안내 포함
```

---

## 7. 개발 단계 현황

### Phase 1: 기본 구조 및 로그인
- [x] 1단계: 웹앱 뼈대 + Google OAuth 로그인 HTML ✅

### Phase 2: 사이드바 및 UI 개선
- [x] 2단계: 사이드바 레이아웃 대폭 개선 ✅

### Phase 3: 일상 관리 기능
- [x] 3단계: 일상 종류 관리 탭 (이모지 시스템 포함) ✅
- [ ] 4단계: 시간표 탭 - 썸네일뷰 기본 구조 🔲 **← 다음 작업 (15단계로 통칭)**
- [ ] 5단계: 시간표 탭 - 테이블뷰 + 페이저 🔲
- [ ] 6단계: 시간표 상세 화면 (주별/일별 뷰) 🔲
- [ ] 7단계: 시간표 추가/수정 화면 🔲
- [ ] 8단계: 시간표 통계 사이드바 🔲
- [ ] 9단계: 시간표 검색/필터/정렬 기능 🔲
- [ ] 10단계: 모바일 최적화 + 현재 시간 표시 🔲

### Phase 4: 설정 페이지
- [x] 11단계: 설정 페이지 개편 ✅
  - 프로필 설정 (사진, 한마디)
  - 메뉴 관리
  - 디자인 설정 (색상, 폰트, 사이드바 폭, 버튼 모서리)
  - 계정 설정 제거 (v2.1에서 완료)

### Phase 5: v2.0~v2.1 완성 작업
- [x] 12단계: Google OAuth JavaScript 연동 ✅
- [x] 13단계: 이모지 시스템 대폭 확장 (450+ 이모지, AND 검색, 🐶 동물 카테고리 포함) ✅
- [x] 14단계: 설정 페이지 개편 (계정 설정 제거, 디자인 설정 추가) ✅
- [ ] 15단계: 시간표 탭 - 썸네일뷰 기본 구조 🔲 **← 다음 작업**
- [ ] 16단계: 홈 대시보드 위젯 🔲

### Phase 6: 리팩토링 (후순위)
- [ ] R1단계: `USER_EMAIL` → `ALLOWED_EMAILS` 배열로 리팩토링 🔲 (15단계 이후)
- [ ] R2단계: localStorage → Google Sheets 연동 🔲
- [ ] R3단계: 파일 분할 검토 (6000줄 초과 시) 🔲

---

## 8. DB 구조 (Sheets 시트 구성)

> 현재는 모두 localStorage에만 저장. 추후 Sheets로 이관 예정.
> 아래 헤더는 localStorage 키와 Sheets 헤더를 동시에 설계한 것.

### 시트1: 카테고리
- 헤더: `id, emoji, name, active, createdAt`

### 시트2: 일상종류
- 헤더: `id, categoryId, emoji, name, active, createdAt`

### 시트3: 시간표
- 헤더: `id, title, tags, isPrimary, createdAt, updatedAt`

### 시트4: 시간표_일정
- 헤더: `id, scheduleId, activityId, weekdays, startTime, endTime, createdAt`
- `weekdays`: "MON,TUE,WED" 같은 CSV 형태 (또는 JSON 배열 스트링)
- `startTime`, `endTime`: "HH:MM" 24시간 포맷

### 시트5: 사용자설정
- 헤더: `key, value`
- 초기 키 목록:
  - `googleEmail` | (OAuth 로그인 시 저장)
  - `googleName` | (OAuth 로그인 시 저장)
  - `googlePicture` | (OAuth 프로필 사진 URL)
  - `profilePhoto` | (사용자 업로드 사진 - base64)
  - `profileQuote` | 오늘도 화이팅! ✨
  - `primaryColor` | #ffde59
  - `sidebarBg` | #fafafa
  - `fontFamily` | 'Noto Sans KR', sans-serif
  - `navWidth` | 220
  - `buttonRadius` | 8

### localStorage → Sheets 데이터 마이그레이션 전략 (향후)

1. 먼저 Sheets API 헬퍼 함수 (`fetchSheetData`, `appendSheetData`) 완성
2. 앱 로드 시 **Sheets 우선 → 실패 시 localStorage 폴백** 패턴
3. 저장 시 **Sheets + localStorage 동시 기록** (이중화 기간)
4. 안정화되면 localStorage는 캐시 용도로만 사용 (오프라인 지원)
5. 기존 localStorage 데이터 일괄 업로드 마이그레이션 버튼 (설정 페이지에 임시로 만들고 이관 완료 후 제거)

---

## 9. 가이드 문서 참고 내용 누적

### 로그인 기능 (Google OAuth)
- **Google 계정으로만 로그인** 가능 (비밀번호 방식 폐기)
- **이메일 화이트리스트**: 현재 `baekeun0@gmail.com` 단일 (추후 배열 확장 예정)
- JWT 토큰에서 사용자 정보(email, name, picture) 자동 추출
- **세션 유지**: sessionStorage 사용 (브라우저 탭 종료 시 초기화)
- **로그아웃**: 사이드바 하단 버튼 → 확인 모달 → `google.accounts.id.disableAutoSelect()` 호출 → 세션 초기화
- **GSI 스크립트 로드 대기**: 비동기 로드 실패 대비 200ms 간격 재시도 로직 있음

### 프로필 사진 표시 우선순위
1. 사용자가 직접 업로드한 사진 (설정 > 프로필 설정)
2. Google 계정의 프로필 사진 (OAuth 로그인 시 자동 연동)
3. 기본 이모지 👤

업로드하지 않아도 Google 프로필 사진이 자동 표시. 업로드하면 업로드본이 우선.

### 사이드바 이메일 표시
- 로그인한 Google 계정 이메일이 사이드바 프로필 영역 하단에 자동 표시
- 긴 이메일은 줄바꿈 (`word-break: break-all`)

### 사이드바 기능
- **프로필 영역 순서**: "베이 관리자" 제목 → 프로필 사진(120px 원형) → 한마디 → 이메일
- **X 버튼**: 사이드바 우측 상단 (사이드바 닫기)
- **햄버거 버튼**: 화면 좌측 상단 고정
- **즐겨찾기**: 메뉴 마우스 오버 시 별(☆) → 클릭으로 ★
- **대분류**: 클릭 시 하위 메뉴 펼침/접힘 (▶/▼)
- **메뉴 구조**:
  - 🏠 홈 대시보드
  - 📋 일상 관리 → 📅 일상
  - 💼 업무 → 💼 업무
  - 🌱 생활 → ✅ 습관, 🍳 레시피, 💰 금전
  - 📝 기타 → 💡 아이디어, 📝 할일
  - ⚙️ 설정

### 설정 - 프로필
- 프로필 사진 업로드 (500x500px 이상 권장)
- 한마디 입력
- 저장 시 사이드바 즉시 반영

### 설정 - 디자인 (v2.1 신규)
- **색상**: 키 컬러 / 사이드바 배경 (컬러 피커)
- **폰트**: Noto Sans KR / 맑은 고딕 / 나눔고딕 / 시스템 기본
- **사이드바 폭**: 180~300px (4px 단위)
- **버튼 모서리**: 4~20px (1px 단위)
- 실시간 미리보기 + localStorage 자동 저장 + 기본값 초기화
- CSS 변수 기반이라 전 페이지 즉시 반영

### 설정 - 메뉴 관리
- 대분류와 하위 메뉴의 이모지/이름/slug 수정, ↑/↓ 순서 변경
- 변경 즉시 사이드바 반영
- "메뉴 추가와 페이지 내용 변경은 클로드와 상의하세요" 안내

### 일상 종류 관리
- 섹션 순서: 일상 종류 → 카테고리
- 인라인 추가 방식 (카드 즉시 생성 → 편집)
- 이모지 클릭 → 이모지 피커 모달
- 엔터: 저장, ESC: 취소
- 카테고리 삭제 시 관련 일상 종류는 삭제 안 되고 **미지정** 상태로
- 카테고리 필터: 전체 / 미지정 / 특정 카테고리

### 이모지 피커 (v2.1 + 동물)
- **카테고리 17개**: 표정, 마음, 손, 업무, 생활, **동물**, 음식, 운동, 취미, 학습, 자연, 교통, 시간, 엔터, 도구, 기호 등
- **키워드 매핑**: 450+ 이모지에 한글/영어 다중 키워드
- **검색 로직**:
  - 공백 구분 다단어 AND 검색 ("웃음 happy" → 둘 다 매칭)
  - 이모지 문자 자체 매칭 (이모지 붙여넣기 가능)
  - 카테고리명 폴백 매칭
- `EMOJI_KEYWORDS`는 전역 상수 (호출 시마다 재생성 X, 성능 개선됨)

### 공통 모달 시스템
- 브라우저 기본 `alert()`, `confirm()`, `prompt()` 사용 안 함
- 커스텀 모달만 사용:
  - 확인 모달 (`confirmModal`): 로그아웃, 삭제, 초기화
  - 알림 모달 (`alertModal`): 성공/오류 메시지
  - 이모지 피커 모달

### UX 주의사항
- **날짜**: 반드시 로컬 타임존 사용 (`toISOString()` 금지)
- **삭제 작업**: 반드시 확인 모달 띄우기
- **인라인 편집**: 엔터=저장, ESC=취소 패턴 일관되게
- **저장 피드백**: 조용히 저장 (설정 변경) vs 알림 모달 (명시적 저장 버튼) 구분
- **빈 상태 UI**: "아직 없습니다" 메시지 + 추가 버튼 강조

### 입력 규칙
- 이모지 입력: 이모지 피커 모달 필수 (직접 타이핑 불가하게 readonly)
- 이름 입력: 빈값 허용 안 함 (trim 후 비어있으면 저장 막기)
- 색상 코드: 대문자/소문자 모두 수용, 내부적으로 소문자 저장

---

## 10. 다음 세션 시작점

### 🎯 이어서 할 작업: **15단계 - 시간표 탭 썸네일뷰 기본 구조**

**목표**: 현재 `dailyScheduleTab`의 "시간표 기능을 개발 중입니다" 플레이스홀더를 실제 시간표 목록 UI로 교체

**세부 작업**:
1. `dailyScheduleTab` 플레이스홀더 제거
2. "**새 시간표 만들기**" 버튼 상단 배치
3. 시간표 목록을 **카드 그리드** 형태로 표시:
   - 각 카드: 제목, 일정 개수, 태그, 생성일
   - `isPrimary: true`인 시간표에 "주요" 뱃지 강조
   - 카드 클릭 시 상세 화면으로 (17단계에서 구현, 지금은 일단 placeholder)
4. `schedules = []`, `scheduleItems = []` 상태 변수 추가
5. `loadSchedules()`, `saveSchedules()` localStorage 헬퍼
6. `renderScheduleThumbnails()` 렌더링 함수
7. `initializeApp()`에서 시간표 로드 추가
8. 빈 상태 UI (시간표 하나도 없을 때)

**디자인 참고**:
- 일상 종류 카드(`.activity-card`) 스타일 참고
- 카테고리 카드(`.category-card`) 스타일 참고
- 그리드: `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))`

**DB 구조 (재확인)**:
- 시트3(시간표): `id, title, tags, isPrimary, createdAt, updatedAt`
- 시트4(시간표_일정): `id, scheduleId, activityId, weekdays, startTime, endTime, createdAt`
- 지금은 localStorage에 `schedules`, `scheduleItems` 키로 저장

**세션 시작 시 확인 사항**:
- 현재 파일 라인 수: ~4021줄
- 현재 버전: v2.1 (+ 🐶 동물 카테고리 추가)
- `dailyScheduleTab`의 현재 상태는 단순 플레이스홀더 텍스트 (HTML만 있음)

**진행 방식**:
1. 기존 `dailyScheduleTab` HTML 위치 `Read`로 확인
2. 단계별로 구현하고 사용자 확인 받으며 진행
3. 코드 완료됐다고 자동으로 단계 마무리 판단 금지 — 사용자 테스트 + "다음" 명시적 확인 후 이동
4. 매 Edit 후 문법 검사 실행

---

## 11. 교훈

### Python 라인 번호 기반 수정 절대 금지
- 초기 웹 대화에서 라인 번호 치환 시도 → 인덱스 꼬임으로 EMOJI_KEYWORDS가 HTML `<option>` 태그 영역에 삽입되는 사고
- 원본 파일 복구 후 전체 재진행 필요했음
- **기본은 `Edit` 도구**. Python을 쓰더라도 **유일 문자열 매칭 기반**만 허용

### Edit 실패 시 대처
- `String to replace not found` → old_str에 오타/공백/줄바꿈 불일치 가능성 매우 높음
- `Read`로 실제 파일 내용 재확인 후 정확히 복사 재시도
- 여러 줄 포함 시 앞뒤 컨텍스트 최소화

### 도구 호출 한도 의식 (웹 환경 교훈, Claude Code에서도 유효)
- 큰 작업 여러 개를 한 세션에서 시도하면 중간에 한도 도달 가능
- 단계 하나씩 끝내고 사용자 확인 받은 뒤 이동
- 시작 전 남은 작업 규모를 먼저 밝히고 분할 제안

### 단계 완료 자동 판단 금지
- 코드 작업 완료 ≠ 단계 완료
- 반드시 **사용자 실제 테스트 + 피드백 + 명시적 전환 의사** 확인 후 마무리
- v2.1 대화에서 이 실수로 혼남

### 프로젝트 파일과 대화 상태 불일치 체크
- 웹에서는 프로젝트 업로드 파일이 옛 버전인 경우 있었음
- Claude Code는 파일 시스템 직접 읽으니 이슈 없지만, **세션 시작 시 버전 로그 + 파일 라인 수는 반드시 확인**

### 지침 내 실제 값 확인
- 지침에 실제 값(GOOGLE_CLIENT_ID 등)이 적혀 있으면 반드시 실제 값으로 코드 반영
- placeholder 남아있으면 안 됨
- 세션 시작 시 CLAUDE.md 전체 훑어볼 것

### Google OAuth + 파일 분할 호환성
- file:// 프로토콜 + 분할 JS 파일 = CORS 문제로 OAuth 실패
- 분할하려면 반드시 로컬 서버(`python3 -m http.server`) 전제
- 현재는 단일 HTML 유지 (안전)

---

**마지막 업데이트**: Claude Code 이관 시점 (v2.1 + 🐶 동물 카테고리 추가 완료 상태)
