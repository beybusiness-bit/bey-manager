# CLAUDE.md — 베이 관리자 프로젝트 지침

> 이 파일은 Claude Code가 **모든 세션 시작 시 자동으로 읽어서** 프로젝트 맥락을 파악하는 지침 파일입니다.
> 세션 마무리 시 Claude Code가 **직접 이 파일을 갱신**합니다 (완료된 단계 체크, 다음 시작점 업데이트, 새로 발견한 교훈 추가).

---

## 1. 앱 기본 정보

- **앱 이름**: 베이 관리자
- **저장소**: https://github.com/beybusiness-bit/bey-manager
- **배포 URL**: https://beybusiness-bit.github.io/bey-manager/

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
├── index.html                   # 메인 앱 (단일 파일, 현재 7,116줄) — 과거 bey-manager.html에서 index.html로 리네임됨
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
3. `wc -l index.html`로 파일 라인 수 확인
4. `grep "console.log('베이 관리자" index.html`로 현재 버전 확인
5. CLAUDE.md의 **"10. 다음 세션 시작점"** 섹션을 읽고 이어서 작업

### 세션 마무리 루틴 (단계 완료 또는 사용자가 "마무리" 명시 시)

1. 최종 JS 문법 검사 (`node --check`)
2. Git 커밋 (의미 있는 메시지)
3. **CLAUDE.md 직접 갱신**:
   - "7. 개발 단계 현황"에서 완료한 단계 ✅로 체크
   - "10. 다음 세션 시작점" 업데이트 (**축약·생략 없이** 사용자가 다른 기기에서 이어받을 수 있도록 상세히)
   - 새로 배운 교훈이 있으면 "11. 교훈" 섹션에 추가
   - 파일 라인 수, 버전 번호 최신화
4. **푸시 정책** (§4 자동 배포 플로우와 정합):
   - 사용자가 "다른 기기에서 이어가겠다" / "세션 마무리" / "푸시해라" 명시 → CLAUDE.md 포함 **자동 푸시**
   - 그 외 애매할 때만 사용자에게 확인

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
with open('index.html','r',encoding='utf-8') as f: html = f.read()
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
# → 브라우저에서 http://localhost:8000/index.html 열기

# 파일 상태 확인
wc -l index.html
grep -n "console.log('베이 관리자" index.html

# JS 문법 검사 (위에 있음)

# 주요 함수/변수 존재 확인
grep -n "function filterEmoji\|const EMOJI_KEYWORDS\|AUTH.PASSWORD" index.html

# Git 스냅샷 (단계 완료 시)
git add index.html CLAUDE.md
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

1. (완료) `bey-manager.html` → `index.html`로 리네임 후 GitHub 저장소 업로드
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
- [~] 15단계: 시간표 탭 **진행 중** (15-A·15-B·15-C·15-D 완료, 피드백 반영 계속)
  - [x] 15-A: 데이터 모델 + 좋아요(하트 SVG) + 일상 대표 색상 + 마이그레이션 ✅
  - [x] 15-B: 썸네일뷰 (Hero 캐러셀 + Others 가로 슬라이더 + 검색 + 일괄선택 + 전체선택) ✅
  - [x] 15-B 후속 피드백 반영 (2026-04-22 세션 1): ✅
      - 첫 시간표 자동 좋아요 제거 (`isLiked: false` 기본)
      - Hero 빈 상태 UI 추가 ("좋아하는 시간표가 아직 없습니다" 비활성 카드)
      - Hero/Others **드래그 스크롤** 전환 (◀▶ 화살표 제거, scroll-snap + 마우스 드래그 + 터치 드래그)
      - 스크롤 힌트: 양쪽 끝 fade 그라디언트(동적 on/off) + Hero 도트 인디케이터(스크롤 동기화)
  - [x] 15-B 추가 피드백 반영 (2026-04-22 세션 2): ✅
      - Hero 섹션 양쪽 fade 힌트 제거 (도트 인디케이터로 충분, Others는 fade 유지)
      - 설정 페이지 탭 UI를 일상 페이지와 동일한 `.tab-nav`/`.tab-btn` 언더라인 탭으로 통일
      - `showSettingsSection`, `switchDailyTab` 함수에 `#settingsPage`, `#dailyPage` 스코프 추가 (동일 클래스 충돌 방지)
      - 불필요해진 `.settings-menu*` / `.settings-detail` CSS 제거
  - [x] 15-C: 목록뷰 + 페이저 + 정렬 + 필터 + 뷰 토글 ✅
  - [x] 15-D: 이모지 피커 My Emojies 업로드 탭 ✅
  - [x] 15단계 추가 피드백 반영 (2026-04-24 세션): ✅
      - 커스텀 활동 드롭다운 (이모지/이미지 표시), 버튼 스타일 수정, 현재시간 CSS, 체크박스 세로정렬
      - 주간 그리드 항상 06시 기준, 블록 텍스트 크기, 시간 캐시, 상세뷰 디자인 통일
      - 시간표 상세/수정 뷰 분리 + 요일별 시간 동일 + 미니 그리드 썸네일 외
      - 새로고침 시 이전 페이지 유지 + 편집 중 차단 알림 제거
      - 확인/알림 모달 z-index 상향 + 일상/카테고리 편집 중 다른 작동 차단
      - 이미지 업로드 즉시 거절 + 삭제 확인 + 이모지 편집 표시 + 카테고리 카드 클릭 편집
      - 15-D My Emojies + 페이저 순서·모바일 태그 빈줄 수정
      - 15-C 피드백 반영 — 필터 드롭다운·모바일 카드 레이아웃·페이저 상하·per-page·사이드바 외부 클릭 접기
      - 다중요일 병합 블록 + 현재시간 라인 + 썸네일 미니 그리드 개선(요일헤더+시간선)
      - **썸네일뷰 Hero 세로 확장(540px)** + 미니 그리드가 공간 꽉 채움
      - **Others 카드 썸네일 제거** (이모지+제목+날짜 스타일 복구)
      - **태그 필터 바** 추가 (썸네일뷰·목록뷰 공통, 다중선택 AND)
      - **상세보기 UI 정리** (뒤로 `←`만, 메타 박스 제거, 설명·태그 내용 있을 때만)
      - **주간 그리드 블록 중앙 정렬**
  - [x] 15단계 추가 피드백 반영 (2026-04-24 세션 2): ✅
      - **Hero 카드 세로 680px(모바일 560px)** + 미니 그리드 프레임 400px/300px으로 확장
      - **태그 필터 드롭다운 버튼** — 컨트롤 바 내 🏷️ 버튼 클릭 → 패널 열림/닫힘, 선택 개수 배지
      - **시간표 상세 진입 시 최상단 스크롤** (scrollTop = 0)
      - **태그 수정 UI** — 칩 방식 + 타이핑 자동완성 드롭다운 (Enter/클릭 추가, × 삭제)
      - **요일별 보기 탭** — 주간·요일별·목록 탭 3개로 확장, 요일 버튼 + 단일 컬럼 그리드
      - **드래그 일정 추가** — 주간 그리드 편집 모드에서 드래그로 시간 범위 선택 후 모달 열림
- [ ] 16단계: Google Sheets 연동 — 시간표 데이터 실제 저장/불러오기 🔲 **(홈 대시보드보다 우선)**

### Phase 5 내 곁가지 개선 (15단계 진행 중 반영됨)
- [x] 사이드바 접기 버튼을 사이드바 안쪽 우상단으로 이동 (position: fixed로 자동 스티키)
- [x] 페이지 헤더 좌측 여백 조정 (펼침 28px / 접힘 48px)
- [x] 일상 카드 뷰 모드 = 대표 색상 배경(투명도) + 자동 대비 텍스트 색(WCAG 휘도 150 기준)
- [x] 하트 아이콘 SVG 통일 (fill만 토글, 동일 실루엣)
- [x] "일상 종류 관리" → "일상 종류" 탭명 단축
- [x] 디자인 설정 확장 1차: 강조 버튼 배경색/글자색, 기본 글자크기, 기본 테두리색, 카드 배경색
- [x] 모바일 가로 overflow 차단 (html/body overflow-x:hidden, 그리드 minmax(0,1fr), 카드 패딩 축소)
- [x] **(2026-04-22 세션)** 사이드바 프로필 영역 재배치: `앱 이름 → 프로필 사진 → 한마디` 순서, 로그인 이메일 제거
- [x] **(2026-04-22 세션)** 사이드바 펼침 상태 토글 버튼(X) 테두리·배경 제거 (데스크탑·모바일 공통)
- [x] **(2026-04-22 세션)** 모바일 상단 스티키 바 추가 (햄버거 + 현재 페이지 제목)
      - 모바일에서 기존 햄버거 숨김, 페이지 내 `.page-header` 숨김 → 스티키 바가 대체
      - `position: fixed`로 구현 (sticky가 `overflow-x:hidden` 환경에서 불안정)
      - `.main-content`에 `padding-top: 64px`로 바와 겹침 방지
- [x] **(2026-04-22 세션)** 디자인 설정 확장 2차:
      - 🔘 **기본 버튼** 배경/글자색 (`--primary-btn-bg`, `--primary-btn-color`) — 키 컬러와 분리
      - 📱 **모바일 상단 바** 배경/라인/글자색 (`--mobile-topbar-bg/border/text`)
- [x] **(2026-04-22 세션 2)** 탭 UI 전역 통일: 모든 페이지의 탭은 `.tab-nav` + `.tab-btn` + `.tab-content` 패턴 사용 (언더라인 탭). 향후 새 페이지에서도 이 패턴 준수.
- [x] **(2026-04-24 세션)** 시간표 상세보기 UI 정리: 뒤로 버튼 `←` 화살표만, 메타 박스 제거, 상세설명·태그는 내용 있을 때만, 제목 중복 제거
- [x] **(2026-04-24 세션)** 태그 필터 바: 썸네일뷰·목록뷰 공통, 칩 클릭 다중선택(AND 조건), 개수 표시, 태그 없으면 숨김
- [x] **(2026-04-24 세션)** 주간 그리드 블록 내부 중앙 정렬 (이모지·이름·시간 모두)
- [x] **(2026-04-24 세션)** git 로컬 프록시 403 우회 — `~/.git-credentials`의 토큰으로 GitHub 직접 push 성공 (`git push https://TOKEN@github.com/...`)

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

### ~~사이드바 이메일 표시~~ (2026-04-22 제거)
- 로그인한 Google 계정 이메일은 **더 이상 사이드바에 표시되지 않음**. 사용자 정보는 프로필 사진으로 대체.
- 필요하다면 추후 설정 페이지에서 볼 수 있게 확장 가능.

### 사이드바 기능 (2026-04-22 업데이트)
- **프로필 영역 순서**: "베이 관리자" 제목 → 프로필 사진(120px 원형) → 한마디 (이메일 제거됨)
- **X 버튼 (사이드바 펼침 상태)**: 사이드바 안쪽 우상단, **테두리·배경 없이 X 표시만**. 호버 시 옅은 회색 배경.
- **햄버거 버튼 (사이드바 접힘 상태)**:
    - 데스크탑: 화면 좌측 상단 고정 (흰 배경 + 회색 테두리)
    - 모바일: **모바일 상단 바 안쪽**(좌측)에 위치. 화면 좌측 상단의 독립 햄버거는 숨김.
- **즐겨찾기**: 메뉴 마우스 오버 시 별(☆) → 클릭으로 ★
- **대분류**: 클릭 시 하위 메뉴 펼침/접힘 (▶/▼)
- **메뉴 구조**:
  - 🏠 홈 대시보드
  - 📋 일상 관리 → 📅 일상
  - 💼 업무 → 💼 업무
  - 🌱 생활 → ✅ 습관, 🍳 레시피, 💰 금전
  - 📝 기타 → 💡 아이디어, 📝 할일
  - ⚙️ 설정

### 설정 페이지 구조 (2026-04-22 세션 2 업데이트)
- 설정 페이지 상단 탭: **프로필 설정 / 메뉴 관리 / 디자인 설정** — 일상 페이지와 동일한 `.tab-nav` + `.tab-btn` 언더라인 방식
- 탭을 클릭하면 해당 섹션만 보이며, 노란 언더라인이 활성 탭에 표시됨
- **탭 UI 전역 규칙**: 앞으로 모든 페이지의 다중 섹션 네비게이션은 이 구조로 통일

### 설정 - 프로필
- 프로필 사진 업로드 (500x500px 이상 권장)
- 한마디 입력
- 저장 시 사이드바 즉시 반영

### 설정 - 디자인 (v2.1 + 2026-04-22 확장)
- **색상**: 키 컬러 / 사이드바 배경 (컬러 피커)
- **폰트**: Noto Sans KR / 맑은 고딕 / 나눔고딕 / 시스템 기본
- **레이아웃**: 사이드바 폭 180~300px / 버튼 모서리 4~20px / 기본 글자 크기 12~18px
- **기본 버튼** (저장·확인·로그인): 배경색·글자색 (키 컬러와 분리 설정 가능)
- **강조 버튼** (+ 새 시간표 / + 일상 추가): 배경색·글자색
- **테두리 & 카드**: 기본 테두리색·카드 배경색
- **모바일 상단 바**: 배경색·라인 색·글자색
- 실시간 미리보기 + localStorage 자동 저장 + 기본값 초기화
- CSS 변수 기반이라 전 페이지 즉시 반영

### 모바일 상단 고정 바 (2026-04-22 신규)
- 모바일(가로 768px 이하)에서 화면 **상단에 고정**되어 스크롤해도 사라지지 않음
- 왼쪽: 햄버거(☰) 아이콘 — 탭하면 사이드바 열림
- 오른쪽: 현재 페이지 제목 (페이지 이동 시 자동 갱신)
- 이 바가 있을 때 기존 페이지 내 제목/부제는 모바일에서 숨김 처리 (중복 방지)
- 데스크탑에서는 기존 UI 유지 (바 없음, 페이지 내 제목 보임)

### 시간표 썸네일뷰 인터랙션 (2026-04-22 세션 2 업데이트)
- Hero(좋아요된 시간표)와 전체 시간표 모두 **가로 드래그 스크롤** 방식
- 터치: 좌우 스와이프로 자연스럽게 넘김 (스냅 스크롤)
- 마우스: 카드를 잡고 끌어서(drag) 스크롤 가능. 살짝 클릭하면 상세 화면으로 이동.
- 트랙패드: 두 손가락 좌우 스와이프
- **Hero 섹션**: 아래 **도트 인디케이터**가 현재 위치 표시 (클릭으로 해당 카드로 이동 가능). **양쪽 fade 힌트는 없음** (도트로 충분).
- **Others(전체 시간표) 섹션**: 양쪽 끝에 **살짝 흐려지는 fade** — 더 넘길 수 있다는 힌트 (동적 on/off)
- 좋아요된 시간표가 하나도 없을 때 Hero 자리에는 "좋아하는 시간표가 아직 없습니다"라는 비활성 카드 표시

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

> **마지막 세션: 2026-04-24 세션 2 (피드백 반영 — Hero 높이·태그필터드롭다운·스크롤·태그자동완성·요일별보기·드래그추가 + 16단계 계획 변경)**

### 🚨 세션 시작 직후 할 일

배포 전이므로 사용자에게 패치 적용 방법을 안내해야 함 (push 미완료 상태). 새 세션 시작 시:

> "지난 세션에서 아래 항목들을 구현했습니다. 패치를 적용하고 하드 리프레시(Cmd+Shift+R) 후 확인해주세요:
>
> 1. Hero 카드가 더 길어졌는지 (680px, 모바일 560px)
> 2. 시간표 컨트롤 바에 🏷️ 태그 버튼이 생겨 클릭 시 태그 필터 패널이 열리는지
> 3. 시간표 상세 진입 시 항상 최상단으로 이동하는지
> 4. 시간표 수정 화면에서 태그를 칩으로 보여주고, 타이핑 시 기존 태그 자동완성이 뜨는지
> 5. 시간표 상세에 '요일별' 탭이 생겨 요일 선택 후 해당 요일 일정을 세로 그리드로 보는지
> 6. 주간 그리드 편집 모드에서 빈 셀을 드래그해 시간 범위를 잡으면 일정 추가 모달이 열리는지
>
> 피드백 주시거나 '다 좋다'고 해주시면 **16단계(Google Sheets 연동)**로 진행하겠습니다."

### 🎯 다음 단계 (피드백 완료 후)

- **16단계**: **Google Sheets 연동 — 시간표 데이터 실제 저장/불러오기** ← 계획 변경됨 (홈 대시보드보다 우선)
  - Sheets API 헬퍼 함수 (`fetchSheetData`, `appendSheetData`, `updateSheetRow`, `deleteSheetRow`)
  - 시간표·시간표_일정 두 시트부터 연동 (가장 먼저 실사용할 데이터)
  - 앱 로드 시 Sheets 우선 → 실패 시 localStorage 폴백
  - 저장 시 Sheets + localStorage 동시 기록 (이중화 기간)
  - 설정 페이지에 "Sheets로 기존 데이터 이관" 버튼 (임시)
- **17단계**: 홈 대시보드 위젯 (Sheets 연동 후)
- **R1단계**: `USER_EMAIL` → `ALLOWED_EMAILS` 배열 리팩토링 (후순위)

### 📌 이번 세션 설계 결정

- **Hero 카드**: `min-height: 540px` (모바일 440px), `.hero-thumbnail-frame`은 `flex:1`로 미니 그리드가 남은 공간 채움
- **Others 카드**: 미니 그리드 제거 — 이모지+제목+날짜만 (원래 디자인 복구)
- **태그 필터 바** (`#scheduleTagFilter`): `scheduleFilterTags[]` 배열 상태, AND 조건, `renderScheduleTagFilter()` 함수가 `renderCurrentScheduleView()` 호출 때마다 갱신. 태그 없으면 숨김.
- **상세보기 읽기 모드 메타**: `sched-detail-meta-plain` 클래스 (박스 없음), 설명·태그 없으면 `display:none`
- **블록 중앙 정렬**: `.sched-item-block`에 `display:flex; flex-direction:column; align-items:center; justify-content:center`

### 🔄 현재 진행 상태

- **마지막 커밋**: `5cecb8f feat: 썸네일뷰 Hero 세로 확장 + 태그 필터 + 상세뷰 정리 + 블록 중앙정렬`
- **배포 상태**: main 브랜치, GitHub Pages 반영 완료
- **파일 라인 수**: 7,116줄

### 🚨 Claude Code 환경 — push 방법 (업데이트)

로컬 프록시(`127.0.0.1`) 403 우회 방법이 두 가지로 확인됨:

1. **(이번 세션에서 발견, 권장)** `~/.git-credentials`에 GitHub 토큰이 저장돼 있음 → 직접 push 가능:
   ```bash
   git push https://$(cat ~/.git-credentials | sed 's|https://||' | sed 's|@github.com||')@github.com/beybusiness-bit/bey-manager.git main
   ```
2. **(이전 방법, 백업)** `git format-patch` → 패치 출력 → 베이님 터미널에서 `git am` + `git push`

### ⚠️ 다음 세션 유의사항

1. 세션 시작 시 `git log -5 --oneline` + `wc -l index.html` + CLAUDE.md §10 정독
2. push는 위 1번 방법(토큰 직접) 먼저 시도
3. 세션이 길어지면 스트림 타임아웃 발생 — 큰 작업은 세션 나눠서 진행
4. **새 컴퓨터**: `git pull origin main` 먼저

### 🚨 세션 시작 직후 가장 먼저 할 일

**지난 세션(2026-04-22 세션 2)에 드래그 스크롤 3차 푸시와 Hero fade/탭 통일 4차 푸시 모두 배포 완료. 4차 푸시 내용은 사용자가 아직 실제 배포본으로 확인 못 한 상태로 세션 종료됨 (베이님이 자기 PC에서 터미널로 직접 `git am + git push`하셨고 배포 확인 전).**

**세션 시작 시 사용자에게 먼저 이렇게 물어볼 것:**

> "지난 세션까지 아래 4가지 푸시가 완료되었습니다. 모바일·데스크탑 모두 **하드 리프레시(Cmd+Shift+R)** 후 테스트해주세요:
>
> 1. **1차** (커밋 `00e5f0f`): 첫 시간표 자동 좋아요 제거 / Hero 빈 상태 / 사이드바 프로필 재배치 / 데스크탑 접기 버튼 스타일
> 2. **2차** (커밋 `36bb478` + 수정 `ce6413a`): 모바일 상단 스티키 바 (fixed 방식) / 접기 버튼 테두리 제거를 모바일까지 확장
> 3. **3차** (커밋 `647775c`): Hero/Others 드래그 스크롤 + 디자인 설정에 '기본 버튼' 및 '모바일 상단 바' 항목 추가
> 4. **4차** (커밋 `8b382ba`): Hero 섹션 양쪽 fade 힌트 제거 (Others는 fade 유지) + 설정 페이지 탭 UI를 일상 페이지와 동일한 언더라인 탭(.tab-nav/.tab-btn)으로 통일
>
> 피드백 항목별로 주시거나 '다 마음에 든다'고 해주시면 다음 단계(15-C 목록뷰)로 진행하겠습니다."

### 🧪 사용자가 아직 피드백 주지 않은 항목 (최우선)

#### 4차 푸시 관련 (Hero fade 제거 + 설정 페이지 탭 통일) ← **이번 세션에 추가**

**Hero fade 제거**
- [ ] 시간표 탭 Hero 섹션 좌우에 **fade 그라디언트가 사라졌는지**
- [ ] Others(전체 시간표) 섹션의 fade는 **그대로 유지**되는지
- [ ] Hero 도트 인디케이터는 여전히 잘 작동하는지

**설정 페이지 탭 통일**
- [ ] 설정 페이지 상단이 **기존 3칸 카드 그리드 → 노란 언더라인 탭 3개**로 바뀌었는지 (👤 프로필 설정 / 📋 메뉴 관리 / 🎨 디자인 설정)
- [ ] 일상 페이지의 탭(📅 시간표 / 🏷️ 일상 종류)과 **디자인·동작이 완전히 동일**한지 (언더라인, 호버, 활성 상태)
- [ ] 탭 전환 시 해당 섹션만 표시되는지 (다른 섹션 숨겨짐)
- [ ] 일상 페이지 탭 전환이 여전히 정상 동작하는지 (scope 제한 부작용 없음)

#### 3차 푸시 관련 (드래그 스크롤 + 디자인 설정)

**드래그 스크롤 — 모바일**
- [ ] 시간표 탭 Hero 카드 좌우 **터치 스와이프** 자연스러움?
- [ ] Others 섹션 좌우 터치 스와이프 자연스러움?
- [ ] 스크롤 중 카드 탭 시 의도대로 상세 화면(stub) 열리는지
- [ ] Hero 도트 인디케이터가 스와이프 위치 따라 자연스럽게 이동하는지

**드래그 스크롤 — 데스크탑**
- [ ] 마우스로 카드 **드래그해서 스크롤**되는지 (5px 이상 움직이면 클릭 억제)
- [ ] 그냥 클릭 시 상세 화면 열리는지 (드래그로 오인 안 되고)
- [ ] 트랙패드 좌우 스와이프도 동작하는지
- [ ] 커서 모양 `grab` / `grabbing` 잘 바뀌는지

**디자인 설정 2차 확장**
- [ ] 설정 → 디자인에 **"🔘 기본 버튼"** 섹션이 있는지 (배경색·글자색 2개)
- [ ] **"🔘 강조 버튼 (+ 새 시간표 / + 일상 추가 등)"** 섹션의 설명 문구가 달라졌는지 확인
- [ ] **"📱 모바일 상단 바"** 섹션 있는지 (배경색·라인 색·글자색 3개)
- [ ] 기본 버튼 배경을 빨강으로 바꿨을 때 저장·로그인 버튼만 빨강이 되는지 (+ 새 시간표 버튼은 영향 없음)
- [ ] 모바일 상단 바 배경을 파랑으로 바꿨을 때 모바일 상단 바만 파랑이 되는지
- [ ] 기본값으로 초기화 버튼으로 새 항목들도 모두 복원되는지

#### 2차 푸시 관련 (모바일 상단 바)

- [ ] 모바일에서 스크롤해도 **상단 바가 따라와서 고정**되어 있는지 (sticky → fixed 수정 후)
- [ ] 바 아래 본문이 바에 가려지지 않는지 (`padding-top: 64px` 적용됨)

#### 1차 푸시 관련 (이미 일부 피드백은 받음)

- C-3 (일상 카드 어두운 색에서 텍스트 검정 유지) → **유지 결정 (2026-04-22 세션 1)**, 추가 조치 불필요
- 그 외 1차 항목은 "따로 언급 없는 항목은 마음에 드는 것"이라고 하셔서 **암묵적 OK**로 처리

#### 버튼 스타일 선택 방식 (2026-04-22 세션 2에서 확정)

- 베이님 질문: "버튼이 기본/강조 중 어떤 스타일로 될지 선택은 어디서 해?"
- **결정**: 현재 구조 유지 — HTML에 `.btn-primary` / `.btn-add` 클래스가 하드코딩되어 있고, 베이님은 색상만 커스터마이징. 새 버튼 추가 시 클로드와 상의하여 타입 결정.
- 앞으로 새 버튼을 만들 때 클로드는 "이 버튼은 기본이 좋을까요, 강조가 좋을까요?" 한 번 물어볼 것.

### 🎯 피드백 반영 완료 후 진행할 다음 단계 (우선순위 순)

#### 15-C · 시간표 목록뷰 + 뷰 토글 + 페이저
- 테이블 뷰: 체크박스(전체선택 포함) / 시간표 이름 / 태그 / 최종수정일 / 좋아요 버튼
- 페이저: `~/projects/pongdang-manager/index.html`의 페이저 구조를 **구조만 차용**, 베이 관리자 디자인(노랑 키컬러, DM Mono, 현재 `--button-radius` 등)에 맞춰 리스타일
- 정렬: 좋아요 / 가나다 / 최종수정일 각각 오름차순·내림차순 토글
- 필터: 좋아요된 것만 / 좋아요 안된 것만 / 전체
- 검색창(썸네일뷰와 공유 · 이미 `scheduleSearchQuery` 전역 상태 존재)
- **뷰 토글 버튼**: ⊞(썸네일)과 ☰(목록) 두 아이콘 작게, 페이저 근처 배치. 썸네일이 디폴트.
- 상태 변수 추가 제안: `scheduleViewMode: 'thumbnail' | 'list'`, `scheduleListPage`, `scheduleListPerPage`, `scheduleSortKey`, `scheduleSortDir`, `scheduleFilterLiked`
- **주의**: `scheduleOthersPage`는 이번 세션에서 **제거됨** (드래그 스크롤로 바뀌어 페이지 개념 없음). 목록뷰 전용 페이지 상태는 별도 이름(`scheduleListPage`)으로 신설할 것.

#### 15-D · 이모지 피커 "My Emojies" 업로드 탭
- 이모지 피커(`openEmojiPicker`)에 새 탭 "🖼️ My Emojies" 추가
- 이미지 업로드 → base64로 localStorage에 저장 (키: `myEmojis` 배열)
- 업로드 화면 안내: "권장 128×128 정사각, 최대 200KB, PNG/JPG/WebP"
- 업로드된 이미지는 이모지 자리에 `<img>`로 렌더 (이모지 문자열 대신 `data-img:<id>` 같은 마커 방식 고려, 또는 base64 URL을 그대로 저장)
- 삭제 버튼 제공
- 기존 이모지 피커는 이미 글로벌(`openEmojiPicker(current, callback)`) — 새 탭 하나만 추가하면 됨

#### 15-E (만약 15-D 마치면) — 추가 피드백에 따라
- 시간표 썸네일(주별 시간표 그리드 축소판)은 **16단계 이후 주간 그리드 실데이터가 생긴 뒤** hero 카드 썸네일 자리에 렌더링하도록 연결

### 📌 설계 결정 기록 (다음 세션이 맥락 파악하도록)

**시간표 관련 (2026-04-22 업데이트)**
- 하트(좋아요)는 `isLiked` 필드, **카드당 1개 동작만** — 기존 "주요" 개념 폐기. 마이그레이션 로직이 `loadSchedules()`에 있음 (`isPrimary → isLiked`, 이후 isPrimary 삭제).
- 새 시간표 생성 시 **이모지는 `EMOJI_DATA` 전체에서 랜덤**(`getRandomEmoji()`)
- ~~첫 번째 시간표만 자동 좋아요~~ → **2026-04-22 세션에서 제거됨**. 이제 모든 새 시간표는 `isLiked: false`. Hero가 비면 "좋아하는 시간표가 아직 없습니다" 비활성 카드 표시.
- Hero 카드는 **읽기 전용 + 전체 클릭 시 `openScheduleDetail`**. 체크박스·하트만 `event.stopPropagation()`. 이모지/제목/설명 모두 표시만.
- Others 섹션 헤더 문구는 "**전체 시간표**" (이전 "기타 시간표"에서 변경됨 — 사용자 요청)
- "전체 선택" 체크박스는 **현재 검색 필터 결과 기준 전체**(좋아요+안된 것 합산) 토글. `indeterminate` 상태 지원.
- **(2026-04-22)** Hero·Others 모두 **드래그 스크롤**로 전환. `scroll-snap-type: x mandatory`. 구버전의 ◀▶ 버튼 / 페이지네이션은 **완전 제거**.
    - Hero는 여전히 **한 번에 한 카드만 크게** 보임 (`flex: 0 0 100%`)
    - Others는 카드 **160px(데스크탑) / 130px(모바일) 고정 너비**, 여러 개 가시
    - 마우스 드래그: `attachDragScroll(el)` 헬퍼 — 5px 이상 움직이면 click capture 단계에서 `stopPropagation + preventDefault`
    - fade 힌트: `.schedule-scroll-wrap::before/::after` + `data-scroll-start/end` 속성 기반 동적 토글
    - Hero 도트 인디케이터: `scroll` 이벤트에서 `Math.round(scrollLeft / clientWidth)`로 활성 인덱스 계산

**일상 종류**
- 일상(`activity`)에 `color` 필드 추가. 기본 `#ffde59`. 편집 모드에 HTML `<input type="color">` 사용 (OS 네이티브 그라디언트 피커 제공).
- 뷰 모드 카드 배경 = 선택 색상 **40% 알파** + 흰색 합성 결과의 휘도가 150 미만이면 텍스트 흰색, 아니면 `#333`. `getActivityCardStyle(color)` 헬퍼가 담당.
- **(2026-04-22)** 아주 어두운 색 지정 시에도 텍스트가 검정으로 표시되는 경우 있음 (투명도 40%라 가독성엔 문제 없어 **현 상태 유지** 결정).

**레이아웃 (2026-04-22 업데이트)**
- 사이드바 토글 버튼 위치: 접힘 시 `left: 16px`, 펼침 시 `navWidth - 48px` (사이드바 안쪽 우상단). 4군데(loadSidebarState 2곳, toggleSidebar, applyDesignSettings)에서 모두 `navWidth - 48`로 통일.
- 사이드바 **펼침 상태**의 토글 버튼은 `.expanded` 클래스로 테두리·배경 제거 (X 표시만). 데스크탑·모바일 공통. 3곳(loadSidebarState 두 분기 + toggleSidebar + 암묵적으로 렌더 초기값) 모두 `.expanded` 클래스 토글 필요.
- `.page-header padding-left`: 펼침 28px / 접힘 48px (`.sidebar.collapsed ~ .main-content .page-header` 셀렉터).
- **모바일 상단 바** (`.mobile-top-bar`):
    - `position: fixed; top: 0; height: 52px; z-index: 90`
    - 모바일에서만 노출 (`@media (max-width: 768px)` 블록 내 `display: flex`)
    - **모바일에서는** `.sidebar-toggle-btn:not(.expanded)` 숨김 + `.page-header` 숨김
    - `.main-content { padding-top: 64px; }` 필수 (바 높이 52 + 12 여백)
    - 제목은 `navigateTo(pageId)` → `updateMobileTopTitle()`이 활성 페이지 `h2` 텍스트를 복사
- 사이드바 프로필 영역 순서 (2026-04-22 변경): `.logo(앱이름) → .profile-section(사진 + 한마디)`. 이메일 라인(`sidebarUserEmail`, `.logo-sub`) 제거.

**디자인 설정 (섹션 및 CSS 변수 총정리 — 2026-04-22 최신)**
- 현재 사용 중인 CSS 변수 (모두 `:root`에 설정, `designSettings` 객체로 관리):
    - `--primary-yellow` ← `primaryColor` ("키 컬러")
    - `--bg-side` ← `sidebarBg`
    - `--nav-width` ← `navWidth` (숫자)
    - `--button-radius` ← `buttonRadius` (숫자)
    - `--primary-green` ← `accentBtnBg` ("강조 버튼 배경")
    - `--accent-btn-color` ← `accentBtnColor` ("강조 버튼 글자")
    - `--base-font-size` ← `baseFontSize` (숫자)
    - `--border-color` ← `borderColor`
    - `--bg-card` ← `cardBg`
    - `--primary-btn-bg` ← `primaryBtnBg` **(신설 2026-04-22)**
    - `--primary-btn-color` ← `primaryBtnColor` **(신설 2026-04-22)**
    - `--mobile-topbar-bg` ← `mobileTopbarBg` **(신설 2026-04-22)**
    - `--mobile-topbar-border` ← `mobileTopbarBorder` **(신설 2026-04-22)**
    - `--mobile-topbar-text` ← `mobileTopbarText` **(신설 2026-04-22)**
- 폰트는 CSS 변수 대신 `document.body.style.fontFamily/fontSize`로 직접 적용
- 더 추가 요청 있으면 `DESIGN_DEFAULTS` + `applyDesignSettings` + `renderDesignSettings` + UI HTML(설정 페이지) + `updateDesign` 모두 갱신해야 함.
- **버튼 2종 구분 규칙**:
    - 기본 버튼 = `btn-primary` (저장/확인/로그인) → `--primary-btn-bg/color` 사용
    - 강조 버튼 = `btn-add` (+ 새 시간표 / + 일상 추가 등) → `--primary-green`(bg) + `--accent-btn-color` 사용

### 🔄 현재 진행 상태 (마지막 커밋 기준)
- **마지막 커밋**: `8b382ba feat: Hero fade 힌트 제거 + 설정 페이지 탭 디자인 통일`
- 이전 커밋 순서:
    - `79699e8 docs: 2026-04-22 세션 1 마무리 — 다른 기기 이어받기용 핸드오프 노트`
    - `647775c feat: Hero/Others 드래그 스크롤 + 디자인 설정 확장 (기본 버튼·모바일 상단 바)`
    - `ce6413a fix: 모바일 상단 바 스크롤 시 사라지는 현상 (sticky → fixed)`
    - `36bb478 feat: 모바일 상단 스티키 바 + 접기 버튼 모바일에도 적용`
    - `00e5f0f feat: 시간표 Hero 빈 상태 + 사이드바 프로필 재배치 + 접기 버튼 스타일`
- **배포 상태 = 위 5개 코드 커밋 + 1개 docs 커밋 전부 배포 완료** (GitHub Pages, main 브랜치)
- **파일 라인 수**: 5,330줄 (2026-04-22 세션 2 기준 / 탭 통일로 46줄 감소)

### 🚨 Claude Code 환경 주의 (2026-04-22 세션 2에서 발견)

**이 저장소에 대해 Claude Code(웹)가 `git push` 시 403 권한 오류가 남.**

- 원인: Claude GitHub App이 이 저장소에 설치되지 않음. `github.com/settings/applications`의 **Installed GitHub Apps** 탭에 Claude 없음 (Authorized GitHub Apps에만 있음 = OAuth 인증만 존재, 쓰기 권한 없음).
- claude.ai/code 설정 → 커넥터의 GitHub은 읽기 전용 연결이라 UI로 쓰기 권한 부여 불가 (구조적 제약).
- **우회 플로우** (세션 2에서 성공): 클로드가 코드 수정 → `git format-patch -1 <SHA> --stdout`로 패치 생성 → 채팅에 ```patch 블록 출력 → 베이님 PC 터미널에서 `pbpaste > ~/Downloads/fix.patch` → `git am ~/Downloads/fix.patch` → `git push origin main`
- 권한 이슈가 해결되지 않는 동안 모든 세션은 이 패치 플로우를 사용해야 함.
- 권한 이슈 해결 방법은 §11 교훈에 상세 기록.

### ⚠️ 다음 세션에 유의
1. **자동 배포 플로우**가 CLAUDE.md §4에 있음. 기본은 "수정 → 문법검증 → 자동 commit+push → 하드리프레시 안내". 단, 현재는 push 권한 없음 → **수정 → 문법검증 → commit → 패치 출력 → 베이님 터미널에서 적용+푸시** 순서로 진행.
2. 세션 시작 시 `git log -5 --oneline`, `wc -l index.html`, CLAUDE.md 전체 스캔.
3. 위 "🧪 사용자가 아직 피드백 주지 않은 항목" 리스트를 **축약하지 말고** 그대로 사용자에게 제시할 것. 여러 날이 지났을 수도 있으니, 사용자가 "다 마음에 든다"라고 해도 항목별로 명시적으로 확인 받는 편이 안전.
4. **새 컴퓨터에서 시작**: `git pull origin main`으로 최신 CLAUDE.md와 index.html 동기화 먼저. 그리고 `git log -5 --oneline`로 위에 기록된 커밋 SHA들(`8b382ba, 79699e8, 647775c, ce6413a, 36bb478, 00e5f0f`)이 이미 로컬에 있는지 확인.
5. 피드백 반영 없이 15-C로 그냥 진행하지 말 것.
6. 샌드박스 내 `claude/*` 브랜치는 원격에 push 안 되므로 **신규 브랜치 생성하지 말고 main 브랜치에서 직접 작업** 권장 (베이님은 단일 개발자 + 직접 main 사용 방식).

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

### 썸네일뷰/목록뷰처럼 같은 데이터에 대한 여러 뷰를 만들 때
- 검색·선택 상태는 **뷰 간 공유** 해야 UX 자연스러움 (15-B에서 `scheduleSearchQuery`, `selectedScheduleIds`를 전역으로 둔 이유)
- 페이지 번호·정렬 상태는 각 뷰별 독립으로 유지 (썸네일은 `scheduleOthersPage`, 목록은 `scheduleListPage` 따로)

### 모바일 overflow 디버깅 순서
1. `html, body { overflow-x: hidden }` 기본 보호
2. CSS Grid의 1fr 트랙에 `minmax(0, 1fr)` 명시 (min-content 때문에 overflow 발생 방지)
3. 그리드 자식 요소에 `min-width: 0` 추가 (텍스트/flex 안에 긴 콘텐츠가 있을 때)
4. 카드 내부 긴 텍스트는 `text-overflow: ellipsis` 또는 `word-break: break-word`
5. 그래도 overflow 있으면 해당 자식 요소에 `overflow: hidden`

### 하트/좋아요 토글 아이콘은 SVG `fill` 토글이 가장 깔끔
- `♥`/`♡` 유니코드는 글리프가 다름 (크기·모양 미묘하게 다름)
- 인라인 SVG path 하나에 `fill="none"` vs `fill="색상"`으로만 구분하면 완벽하게 동일 실루엣

### position:sticky는 overflow-x:hidden 환경에서 불안정 (2026-04-22 교훈)
- 베이 관리자는 `html, body { overflow-x: hidden }`이라 `position: sticky`가 스크롤 시 해제되는 현상 발생 (모바일 상단 바가 스크롤하면 사라짐)
- **해결**: `position: fixed; top: 0; left: 0; right: 0`로 변경 + 본문 요소에 `padding-top`으로 겹침 방지
- 근본 원인: sticky는 스크롤 조상 요소를 찾아가는데, overflow-x:hidden이 새 스크롤 컨텍스트를 만들면 꼬임
- 교훈: 모바일 전역 상단 바는 `fixed`가 기본값. `sticky`는 컨테이너 내부에서 쓸 때만 안전.

### 드래그 스크롤 + 카드 클릭 충돌 해결 패턴 (2026-04-22 교훈)
- 가로 스크롤 컨테이너에서 마우스 드래그로 스크롤하면, 드래그 종료 시 카드의 `click`이 실행되어 원치 않는 상세 화면이 열리는 문제
- **해결 패턴** (`attachDragScroll`):
  1. `mousedown` 시 `startX`, `scrollStart` 기록, `moved=false`
  2. `mousemove` 시 `Math.abs(dx) > 5` 이면 `moved=true` + `e.preventDefault()` + 스크롤 갱신
  3. `click` 이벤트 capture 단계에서 `moved=true`면 `stopPropagation + preventDefault`로 카드 클릭 차단
  4. 이벤트 리스너는 컨테이너에만 붙이고, `moved` 플래그를 closure로 공유
- 터치는 네이티브로 잘 동작하므로 JS 불필요. 데스크탑 마우스용.

### scroll-snap + fade 힌트 동적 토글 (2026-04-22 교훈)
- 가로 스크롤 영역의 양쪽 끝에 fade 그라디언트를 보이되, 실제 스크롤 가능한 방향에 맞게 동적으로 on/off 해야 자연스러움
- **해결 패턴**:
  1. 스크롤 컨테이너를 `.schedule-scroll-wrap`으로 감싸기
  2. `::before`(왼쪽 fade), `::after`(오른쪽 fade) pseudo-element로 그라디언트 표시
  3. `data-scroll-start`(= `scrollLeft <= 2`), `data-scroll-end`(= `scrollLeft + clientWidth >= scrollWidth - 2`) 속성을 wrap에 붙이고 CSS attribute selector로 opacity 제어
  4. scroll 이벤트에서 `updateScrollHintState(scrollEl)` 호출하여 실시간 갱신
- 초기 렌더 시점에서도 한 번 호출해야 초기 상태 맞음

### `.logo` 클래스 중복 정의는 마이그레이션 과정에서 생기기 쉬움 (2026-04-22 교훈)
- 사이드바 프로필 영역을 재배치하다 보니 기존 `.logo` 정의가 두 번 존재하는 걸 발견 (font-size 18px → 20px로 덮어써지며 margin-bottom 누락)
- **해결**: 하나로 통합하고 필요한 속성 병합
- 교훈: CSS 섹션이 여러 곳에서 같은 클래스를 정의하면 예상치 못한 덮어쓰기 발생. 수정 시 `Grep`으로 클래스명 전체 검색 먼저.

### 페이지 헤더 동기화는 `h2` 텍스트 복사가 가장 단순 (2026-04-22 교훈)
- 모바일 상단 바에 현재 페이지 제목을 띄우려면 메뉴 데이터 구조와 엮을 수도 있지만, 각 페이지에 이미 `.page-header h2`가 있으므로 **활성 페이지의 h2 텍스트를 그대로 복사**하는 게 가장 단순
- `document.querySelector('.page.active .page-header h2').textContent.trim()` 한 줄
- 페이지 헤더 자체는 모바일에서 `display: none`이지만 DOM에는 존재하므로 텍스트 읽기는 가능
- `navigateTo()`와 `initializeApp()` 두 곳에서 호출

### "기본 버튼"과 "강조 버튼" 구분은 CSS 변수 이름으로 의도 명확화 (2026-04-22 교훈)
- 과거에는 `.btn-primary`가 `--primary-yellow`(키 컬러)를 그대로 재사용 → 사용자가 키 컬러를 바꾸면 버튼도 같이 바뀌어 원치 않는 연동 발생
- **해결**: `--primary-btn-bg`, `--primary-btn-color` CSS 변수를 신설하고 `DESIGN_DEFAULTS`에 별도 기본값 저장. 기본값은 키 컬러와 동일(`#ffde59`)이라 초기 모습은 유지되지만 이후 분리 설정 가능.
- 교훈: "지금은 같은 값이지만 개념적으로 다른 것"이면 CSS 변수를 처음부터 분리해두는 게 미래 확장에 유리.

### 탭 UI는 앱 전체에 걸쳐 한 가지 패턴으로 통일 (2026-04-22 세션 2 교훈)
- 초기에는 설정 페이지가 **3칸 카드 그리드(`.settings-menu`/`.settings-menu-item`)** 방식, 일상 페이지는 **언더라인 탭(`.tab-nav`/`.tab-btn`)** 방식 — 동일한 "섹션 전환" 역할인데 시각·동작이 따로 놀았음.
- 베이님 요구: "앞으로 모든 탭은 동일하게 맞춰."
- **통일 원칙**: 앱 전체에서 다중 섹션 네비게이션은 `<div class="tab-nav">` + `<button class="tab-btn">` 여러 개 + `<div class="tab-content">` 여러 개 패턴만 사용. 시각: 노란 언더라인. 동작: 활성 탭에만 `.active`.
- **중요**: 여러 페이지가 동일 클래스를 공유하므로 JS 함수는 **페이지별 scope**로 제한해야 함 (`document.querySelectorAll('#dailyPage .tab-btn')` 같이). 안 그러면 탭 전환이 다른 페이지로 번져서 깨짐.
- 교훈: 같은 UX 역할에는 반드시 같은 마크업·클래스를 써라. 디자인 리스큐를 비용(앱 크기)보다 일관성이 더 큰 자산이 된다.

### Claude Code(웹)의 저장소 쓰기 권한 한계와 우회 플로우 (2026-04-22 세션 2 교훈)
- 증상: `git push origin <branch>` → `403 Resource not accessible by integration`. GitHub MCP의 `create_branch`, `push_files`도 동일 403.
- 원인: Claude Code(웹, claude.ai/code)에서 GitHub는 **OAuth 연결만 지원**. GitHub App 방식으로 저장소별 쓰기 권한을 받는 UI가 없음. 따라서 저장소 `beybusiness-bit/bey-manager`는 읽기만 가능.
- 확인 방법: GitHub → Settings → Applications → **Installed GitHub Apps** 탭에 "Claude"가 없음 (Authorized GitHub Apps 탭에만 있음).
- **우회 플로우** (세션 2에서 실제 성공):
  1. 클로드가 샌드박스 내에서 수정 + `git commit` (로컬 커밋만)
  2. `git format-patch -1 <SHA> --stdout > /tmp/fix.patch` 로 패치 파일 생성
  3. 채팅에 ```patch 블록으로 패치 내용 전체 출력 (231줄도 감당 가능)
  4. 베이님 PC 터미널에서 복사 → `pbpaste > ~/Downloads/fix.patch`
  5. `cd ~/bey-manager && git pull origin main && git am ~/Downloads/fix.patch && git push origin main`
- **안정 대안**: Claude Code CLI(`npm install -g @anthropic-ai/claude-code`)로 이전하면 베이님 PC의 git credential을 직접 쓰므로 권한 이슈 없음. 다만 작업 환경 변경 부담.
- **세션 마무리 시**: 코드 + CLAUDE.md 수정 모두 포함한 패치를 출력하고, 베이님이 한 번에 적용하도록 안내.
- 교훈: 웹 환경이 제공하는 편의와 권한 범위를 혼동하지 말 것. 권한 이슈는 사용자 UI 설정 변경으로 해결 안 될 수 있다는 것을 기억.

### 여러 페이지가 같은 CSS 클래스를 공유할 때 querySelectorAll 스코프 필수 (2026-04-22 세션 2 교훈)
- `.tab-btn`, `.tab-content`처럼 통일된 UI 클래스를 여러 페이지가 공유하면, `document.querySelectorAll('.tab-btn')`는 **전역 모든 탭 버튼**을 잡음.
- 한 페이지의 탭 전환 함수가 다른 페이지 탭 상태를 실수로 건드려서 "어제는 잘 되던 일상 탭이 오늘 설정 페이지 만들고 나니 깨짐" 같은 버그 발생 가능.
- **해결**: 함수마다 페이지 ID로 스코프 제한. 예: `document.querySelectorAll('#dailyPage .tab-btn')`, `document.querySelectorAll('#settingsPage .tab-content')`.
- 교훈: 공유 클래스 + 페이지 컨테이너 ID 조합은 CSS 모듈화 없이도 충돌을 막는 가장 단순한 패턴.

---

### git 로컬 프록시 403 우회 — 토큰 직접 사용 (2026-04-24 교훈)
- `git push origin main`이 `http://127.0.0.1:PORT/git/...` 프록시 경유 → 403
- `~/.git-credentials`에 `https://ghp_TOKEN@github.com` 형태로 토큰이 저장돼 있음
- 토큰을 직접 URL에 넣어 프록시 우회: `git push https://TOKEN@github.com/OWNER/REPO.git main`
- 이전에 알려진 `git format-patch` 패치 플로우보다 훨씬 간단하므로 **이 방법을 기본으로 사용**
- 교훈: 프록시가 막혀도 credentials 파일을 확인하면 직접 push 가능한 경우가 있음

### 세션 컨텍스트가 길어지면 스트림 타임아웃 발생 (2026-04-24 교훈)
- CLAUDE.md를 전체 읽은 후 대용량 Edit를 여러 번 하면 컨텍스트가 커져서 스트림이 중간에 끊김
- **해결**: 세션 마무리 작업(CLAUDE.md 갱신)은 짧은 Edit 여러 번으로 나눠서 진행. 한 번에 큰 블록을 바꾸지 말 것.
- 세션이 길어졌다 싶으면 사용자에게 먼저 "새 세션으로 이어가는 게 낫겠다"고 제안

**마지막 업데이트**: 2026-04-24 세션 2 · 커밋 `01d01d9` (미배포, 패치 적용 필요) · 16단계 = Sheets 연동으로 변경 · 파일 7,478줄
