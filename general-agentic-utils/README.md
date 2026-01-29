# Agentic Utils

에이전트 세션 관리를 위한 스킬, 커맨드, 훅 모음입니다.

**참조**: [everything-claude-code](https://github.com/affaan-m/everything-claude-code)

## 디렉토리 구조

```
general-agentic-utils/
├── agents/
│   └── observer-agent.md          # 관찰 데이터 분석 에이전트
├── skills/
│   ├── memory-persistence/
│   │   └── SKILL.md
│   ├── strategic-compact/
│   │   └── SKILL.md
│   ├── continuous-learning/
│   │   ├── SKILL.md
│   │   └── config.json            # 학습 설정
│   ├── iterative-retrieval/
│   │   └── SKILL.md
│   └── verification-loop/
│       └── SKILL.md
├── commands/
│   ├── context-save.md
│   ├── context-restore.md
│   ├── instinct-status.md
│   ├── evolve.md
│   ├── learn.md
│   ├── verify.md
│   └── checkpoint.md
├── hooks/
│   ├── session-start.js
│   ├── session-end.js
│   ├── pre-compact.js
│   ├── strategic-compact.js
│   ├── observe.js
│   ├── analyze-observations.js
│   └── reset-strategic-state.js
├── lib/
│   └── utils.js
├── hooks.json
└── README.md
```

## 설치

### 방법 1: 전체 복사 (권장)

```bash
# 1. 디렉토리 복사
cp -r general-agentic-utils /path/to/your/project/

# 2. 필요한 디렉토리 생성
mkdir -p /path/to/your/project/.cursor/{tmp,instincts,evolved}

# 3. hooks.json 심볼릭 링크 또는 병합
# 옵션 A: 심볼릭 링크 (이 프로젝트 전용)
ln -s ../general-agentic-utils/hooks.json /path/to/your/project/.cursor/hooks.json

# 옵션 B: 기존 hooks.json에 병합 (아래 참조)
```

### 방법 2: hooks.json 병합

기존 `.cursor/hooks.json`이 있다면, 다음 내용을 병합하세요:

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [
      { "command": "node general-agentic-utils/hooks/session-start.js" },
      { "command": "node general-agentic-utils/hooks/reset-strategic-state.js" }
    ],
    "sessionEnd": [
      { "command": "node general-agentic-utils/hooks/session-end.js" },
      { "command": "node general-agentic-utils/hooks/analyze-observations.js" }
    ],
    "preCompact": [
      { "command": "node general-agentic-utils/hooks/pre-compact.js" }
    ],
    "preToolUse": [
      { "command": "node general-agentic-utils/hooks/observe.js pre" },
      { "command": "node general-agentic-utils/hooks/strategic-compact.js", "matcher": "Write|StrReplace|Edit" }
    ],
    "postToolUse": [
      { "command": "node general-agentic-utils/hooks/observe.js post" }
    ],
    "stop": [
      { "command": "node general-agentic-utils/hooks/session-end.js" }
    ]
  }
}
```

### 방법 3: 스킬만 사용

스킬만 사용하려면 `.cursor/skills/`에 복사:

```bash
# 스킬 디렉토리 복사
cp -r general-agentic-utils/skills/* /path/to/your/project/.cursor/skills/
```

### 설치 확인

1. Cursor Settings (Cmd+Shift+J) → Rules → Agent Decides 섹션에서 스킬 확인
2. 새 세션 시작 시 `[session-start]` 로그 확인
3. `/verify` 커맨드 실행으로 verification-loop 확인

### 필요한 디렉토리 구조

```bash
# 프로젝트 루트에서 실행
mkdir -p .cursor/tmp
mkdir -p .cursor/instincts/{code-style,testing,debugging,workflow,git}
mkdir -p .cursor/evolved/{agents,skills,commands}
```

### Node.js 요구사항

- Node.js 16.x 이상
- 추가 의존성 없음 (순수 Node.js 사용)

---

## 스킬 상세

### memory-persistence

**세션 간 컨텍스트 영속화**

세션 시작 시 이전 작업 상태를 복원하고, 종료 시 자동으로 저장합니다.

#### 왜 필요한가?

- 세션이 끊기면 컨텍스트가 사라짐
- 다음 세션에서 "어디까지 했지?" 문제 발생
- Hook 기반 자동화로 100% 신뢰성 확보

#### 작동 방식

```
세션 시작                              세션 종료
    │                                     │
    ▼                                     ▼
session-start.js                    session-end.js
    │                                     │
    ▼                                     ▼
컨텍스트 파일 탐색                    컨텍스트 파일 생성
    │                                     │
    │ 여러 개 발견                         ▼
    ▼                              context-{timestamp}.md
AskQuestion
"어떤 컨텍스트를 복원할까요?"
```

#### 컨텍스트 파일 예시

```markdown
---
saved: 2026-01-29T17:00:00Z
session_id: 20260129-170000
project: my-project
phase: implementation
---

# 세션 컨텍스트

## 작업 요약
- Strategic Compact 기능 구현
- session-end.js 훅 개선

## 다음 단계
- [ ] 테스트 검증
- [ ] 문서 업데이트

## Git 상태
M  src/utils.ts
A  src/api.ts
```

#### AskQuestion 사용 시나리오

| 상황 | 질문 |
|------|------|
| 컨텍스트 파일 다수 | "복원할 컨텍스트를 선택하세요" |
| 저장 시점 불명확 | "지금 저장할까요?" |
| 복원 후 | "이어서 진행할까요?" |

#### 관련 커맨드

- `/context-save` - 현재 컨텍스트 저장
- `/context-restore` - 이전 컨텍스트 복원

---

### strategic-compact

**전략적 시점에 컨텍스트 압축 제안**

임의의 자동 압축 대신 논리적 경계에서 수동 `/compact` 실행을 제안합니다.

#### 왜 필요한가?

자동 압축의 문제점:
- 작업 중간에 트리거되어 중요 컨텍스트 손실
- 논리적 작업 경계를 인식하지 못함
- 복잡한 다단계 작업 중단

전략적 압축의 장점:
- **탐색 완료 후, 구현 전** - 연구 컨텍스트 정리
- **마일스톤 완료 후** - 다음 단계를 위한 새 시작
- **컨텍스트 전환 전** - 현재 작업 정리

#### 압축 제안 조건

| 조건 | 임계값 | 행동 |
|------|--------|------|
| 도구 호출 | 20회 | 💡 첫 제안 |
| 도구 호출 | 30, 40, ... | 📢 리마인더 |
| 도구 호출 | 50회+ | 🚨 강력 권장 |
| Phase 전환 | 탐색→구현 | 💡 압축 권장 |

#### AskQuestion 사용 시나리오

```markdown
질문: "컨텍스트 압축을 권장합니다"

설명:
- 도구 호출: 52회
- 현재 단계: 탐색 완료

옵션:
1. 지금 압축 (memory-persistence로 저장 후)
2. 나중에 압축 (10회 후 다시 알림)
3. 이 세션에서 다시 묻지 않기
```

#### 압축 절차

1. AskQuestion으로 확인
2. memory-persistence로 컨텍스트 저장
3. `/compact` 실행
4. 필요시 복원

---

### continuous-learning

**Instinct 기반 자동 학습 시스템**

세션 활동을 관찰하여 재사용 가능한 지식(Instinct)으로 변환합니다.

#### 왜 필요한가?

- 같은 실수 반복 방지
- 사용자 선호도 자동 학습
- 패턴을 skill/command/agent로 진화

#### v2 핵심 변경점

| 기능 | v1 | v2 |
|------|----|----|
| 관찰 | 세션 종료 시 | PreToolUse/PostToolUse (100%) |
| 단위 | 전체 스킬 | 원자적 instinct |
| 신뢰도 | 없음 | 0.3-0.9 가중치 |
| 진화 | 직접 생성 | instinct → 클러스터 → 진화 |

#### Instinct 모델

Instinct는 **작은 학습된 행동**입니다:

```yaml
---
id: prefer-functional-style
trigger: "새 함수 작성 시"
confidence: 0.7
domain: "code-style"
---

# Prefer Functional Style

## 액션
클래스보다 함수형 패턴 선호

## 증거
- 5회 함수형 패턴 선호 관찰
- 2026-01-28 클래스 → 함수형 수정
```

**속성:**
- **원자적** - 하나의 트리거, 하나의 액션
- **신뢰도 가중치** - 0.3(임시) ~ 0.9(확실)
- **도메인 태그** - code-style, testing, git, debugging, workflow
- **증거 기반** - 생성 근거 추적

#### 신뢰도 시스템

| 점수 | 의미 | 동작 |
|------|------|------|
| 0.3 | 임시 | AskQuestion 필수 |
| 0.5 | 보통 | AskQuestion 권장 |
| 0.7 | 강함 | 자동 적용 |
| 0.9 | 확실 | 항상 적용 |

**증가 조건:**
- 패턴 반복 관찰 (+0.1)
- 사용자가 제안 수용 (+0.1)

**감소 조건:**
- 사용자가 명시적 수정 (-0.15)
- 30일간 미관찰 (-0.05)

#### 패턴 감지 유형

| 유형 | 설명 |
|------|------|
| error_resolution | 에러 → 수정 → 성공 |
| user_correction | Agent 제안 → 사용자 수정 |
| repeated_workflow | 동일 패턴 3회+ 반복 |
| tool_preference | 특정 도구 조합 반복 |

#### AskQuestion 사용 시나리오

**instinct 생성 시:**
```markdown
질문: "새로운 패턴을 감지했습니다. Instinct로 저장할까요?"

패턴: 함수형 스타일 선호
관찰: 3회 클래스 → 함수형 수정
신뢰도: 0.5

옵션:
1. 예, instinct로 저장
2. 아니오, 이번만 해당
```

**진화 시 (/evolve):**
```markdown
질문: "관련 instinct들을 skill로 진화할까요?"

클러스터: testing-workflow
포함:
- always-test-first (0.9)
- mock-external-deps (0.8)

옵션:
1. Skill로 진화
2. Command로 진화
3. Agent로 진화
```

#### 관련 커맨드

- `/instinct-status` - 학습된 instinct 목록
- `/evolve` - instinct → skill/command 진화
- `/learn` - 수동 패턴 학습

---

### iterative-retrieval

**점진적 컨텍스트 검색 패턴**

서브에이전트의 "컨텍스트 문제"를 해결합니다.

#### 왜 필요한가?

서브에이전트는 제한된 컨텍스트로 시작:
- 어떤 파일에 관련 코드가 있는지 모름
- 코드베이스의 패턴을 모름
- 프로젝트의 용어를 모름

기존 접근법의 한계:
- **전부 보내기** → 컨텍스트 한계 초과
- **안 보내기** → 중요 정보 부족
- **추측하기** → 대부분 틀림

#### 4단계 반복 검색

```
┌──────────┐      ┌──────────┐
│ DISPATCH │─────▶│ EVALUATE │
│  (검색)  │      │  (평가)  │
└──────────┘      └──────────┘
     ▲                  │
     │                  ▼
┌──────────┐      ┌──────────┐
│   LOOP   │◀─────│  REFINE  │
│  (반복)  │      │  (정제)  │
└──────────┘      └──────────┘

    최대 3 사이클 후 진행
```

**DISPATCH**: 넓은 범위로 후보 파일 수집
**EVALUATE**: 관련성 점수 부여 (0-1)
**REFINE**: 키워드/패턴 추가, 낮은 관련성 제외
**LOOP**: 0.7+ 파일 3개 이상 또는 3사이클에서 종료

#### 실제 예시

```
Task: "인증 토큰 만료 버그 수정"

Cycle 1:
  DISPATCH: "token", "auth", "expiry" 검색
  EVALUATE:
    - auth.ts (0.9) ✅
    - tokens.ts (0.8) ✅
    - user.ts (0.3) ❌
  REFINE: "refresh", "jwt" 추가; user.ts 제외

Cycle 2:
  DISPATCH: 정제된 조건으로 검색
  EVALUATE:
    - session-manager.ts (0.95) ✅
    - jwt-utils.ts (0.85) ✅
  REFINE: 충분한 컨텍스트 확보

결과: auth.ts, tokens.ts, session-manager.ts, jwt-utils.ts
```

#### AskQuestion 사용 시나리오

| 상황 | 질문 |
|------|------|
| 검색 범위 결정 | "전체 검색? 특정 폴더만?" |
| 결과 불충분 | "다른 키워드로 재검색?" |
| 의존성 발견 | "관련 파일도 포함?" |

---

### verification-loop

**6단계 종합 검증 시스템**

기능 완료 후 품질을 보장합니다.

#### 왜 필요한가?

- 빌드 실패한 채로 PR 생성 방지
- 타입 에러, 린트 에러 조기 발견
- 테스트 커버리지 80% 목표 유지
- 시크릿 노출 방지

#### 검증 흐름

```
BUILD ──FAIL──→ 🛑 즉시 중단
  │PASS
TYPES ──FAIL──→ AskQuestion (수정 범위?)
  │PASS
LINT ──FAIL──→ AskQuestion (자동 수정?)
  │PASS
TESTS ──FAIL──→ 🛑 즉시 중단
  │PASS
SECURITY ──FAIL──→ 🛑 즉시 중단
  │PASS
DIFF ──→ 리뷰
  │OK
✅ READY for PR
```

#### 각 단계 명령어

```bash
# BUILD
npm run build

# TYPES
npx tsc --noEmit

# LINT (자동 수정: --fix)
npm run lint

# TESTS (목표: 80% 커버리지)
npm run test -- --coverage

# SECURITY
rg -n "sk-|api_key|password" --type ts --type js .
rg -n "console\.log" src/

# DIFF
git diff --stat
```

#### AskQuestion 사용 시나리오

**타입 에러:**
```markdown
질문: "타입 에러가 발견되었습니다"

발견: 3개
- src/utils.ts:15 - Type 'string' not assignable
- src/api.ts:42 - Property 'name' does not exist

옵션:
1. 모두 수정
2. 치명적인 것만 수정
3. 무시하고 계속 (위험)
```

**테스트 실패:**
```markdown
질문: "테스트 실패가 발견되었습니다"

실패: 3개
커버리지: 76% (목표 80%)

옵션:
1. 실패한 테스트 수정
2. test-agent 호출하여 분석
3. 테스트 케이스 확인
```

#### 출력 형식

```
VERIFICATION REPORT
==================

Build:     PASS
Types:     PASS (0 errors)
Lint:      PASS (2 warnings)
Tests:     PASS (45/45, 82%)
Security:  PASS (0 issues)
Diff:      5 files changed

Overall:   ✅ READY for PR
```

#### 관련 커맨드

- `/verify` - 전체 검증 실행
- `/checkpoint` - 검증 상태 저장

---

## 커맨드

| 커맨드 | 설명 | 연동 스킬 |
|--------|------|-----------|
| `/context-save` | 현재 컨텍스트 저장 | memory-persistence |
| `/context-restore` | 이전 컨텍스트 복원 | memory-persistence |
| `/instinct-status` | 학습된 instinct 목록 | continuous-learning |
| `/evolve` | instinct → skill/command 진화 | continuous-learning |
| `/learn` | 수동 패턴 학습 | continuous-learning |
| `/verify` | 종합 검증 실행 | verification-loop |
| `/checkpoint` | 검증 상태 저장 | verification-loop |

---

## 훅

| 훅 | 트리거 | 설명 |
|----|--------|------|
| session-start.js | sessionStart | 이전 컨텍스트 탐색 및 복원 안내 |
| session-end.js | sessionEnd, stop | 컨텍스트 자동 저장 |
| pre-compact.js | preCompact | 압축 전 스냅샷 저장 |
| strategic-compact.js | preToolUse, afterFileEdit | 압축 제안 확인 |
| observe.js | preToolUse, postToolUse | 도구 사용 관찰 기록 |
| analyze-observations.js | sessionEnd | 패턴 분석 및 instinct 제안 |
| reset-strategic-state.js | sessionStart | strategic-compact 상태 초기화 |

---

## 핵심 원칙

### AskQuestion 적극 활용

모든 스킬에서 **모호한 상황 발생 시 즉시 AskQuestion 사용**:

- 복원할 컨텍스트가 여러 개일 때
- 저장/압축 시점이 불명확할 때
- 검증 실패 시 수정 방향 결정
- instinct 생성/적용 시 확인
- 검색 범위/깊이 조정 시

### Hook 기반 자동화

100% 신뢰성의 Hook 기반 관찰:
- Skills는 확률적 (50-80% 실행)
- Hooks는 결정적 (100% 실행)

---

## 라이선스

MIT
