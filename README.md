## 빠른 시작

### 설치

```bash
# 새 프로젝트에 SDD 구조 설치
curl -fsSL https://raw.githubusercontent.com/{user}/cursor-flow/main/install-sdd.sh | bash

# 또는 로컬에서
./install-sdd.sh
```

### 옵션

```bash
./install-sdd.sh --skip-prompts  # 대화형 프롬프트 건너뛰기
./install-sdd.sh --force         # 기존 파일 덮어쓰기
```

## 구조

```
.cursor/
├── agents/          # 전문화된 서브에이전트
├── commands/        # 슬래시 커맨드
├── docs/            # 명세 문서
│   ├── modules/     # 모듈별 명세
│   └── decisions/   # ADR (Architecture Decision Records)
├── instincts/       # 학습된 패턴
├── evolved/         # 진화된 skill/command/agent
├── rules/           # 항상 적용되는 규칙
├── skills/          # 상황별 활성화 스킬
├── scripts/         # 유틸리티 스크립트
│   ├── hooks/       # 세션 영속화 hooks
│   └── lib/         # 공통 유틸리티
└── tmp/             # 컨텍스트 저장 (gitignore)
    └── sessions/    # 세션 로그
```

## 에이전트

| Agent | 역할 | 트리거 |
|-------|------|--------|
| `sdd-agent` | SDD 워크플로우 총괄 | 새 기능, 리팩토링 |
| `architect-agent` | 시스템 아키텍처 설계 | 아키텍처, 설계, ADR |
| `planner-agent` | 구현 계획 수립 | 계획, 어떻게 구현 |
| `spec-writer-agent` | 명세 문서 작성 | 명세, 문서화 |
| `review-agent` | 코드 리뷰 | 리뷰, 검토 |
| `test-agent` | 테스트 실행/분석 | 테스트, 커버리지 |

### 워크플로우

```
새 기능: sdd-agent → spec-writer → architect → planner → 구현 → test → review
버그수정: planner → 구현 → test → review
리팩토링: architect → planner → 구현 → test → review
```

## 커맨드

| 커맨드 | 용도 |
|--------|------|
| `/initialize` | 새 프로젝트에 SDD 구조 생성 |
| `/create-index` | INDEX.md 생성/업데이트 |
| `/implement` | 태스크 기반 구현 시작 |
| `/verify` | 종합 검증 (빌드/타입/린트/테스트/보안) |
| `/pr-docs` | PR 문서 생성 |
| `/context-save` | 현재 컨텍스트 즉시 저장 |
| `/learn` | 수동 학습 → instinct/스킬화 |
| `/instinct-status` | 학습된 instincts 현황 |
| `/evolve` | instincts → skill/command 진화 |

## 스킬

### 명세 관련

| 스킬 | 용도 |
|------|------|
| `spec-navigator` | 명세 문서 탐색 |
| `spec-writer` | 명세 문서 작성 |
| `impl-planner` | 구현 계획 수립 |
| `task-breakdown` | 태스크 분해 |

### 검증 관련

| 스킬 | 용도 |
|------|------|
| `verification-loop` | 종합 검증 루프 |
| `security-review` | 보안 체크리스트 |

### 컨텍스트 관리

| 스킬 | 용도 |
|------|------|
| `context-compact` | 컨텍스트 압축 및 저장 |
| `session-restore` | 이전 세션 복원 |
| `iterative-retrieval` | 점진적 컨텍스트 검색 |

### 학습

| 스킬 | 용도 |
|------|------|
| `continuous-learning` | 자동 학습 (에러, 수정, 반복 패턴) |

## SDD 워크플로우

### 1. 명세화 (Spec)

```bash
# spec-writer 스킬 또는 spec-writer-agent 사용
# → .cursor/docs/modules/{기능}.md 생성
```

### 2. 계획 (Plan)

```bash
# impl-planner 스킬 또는 planner-agent 사용
# → ADR 작성 (필요시)
# → task-breakdown으로 TODO 분해
```

### 3. 구현 (Implement)

```bash
/implement
# → P0 태스크부터 순서대로 구현
# → 각 태스크 완료 시 체크박스 업데이트
```

### 4. 검증 (Verify)

```bash
/verify
# → 빌드 → 타입 → 린트 → 테스트 → 보안 → Diff
# → 실패 시 수정 후 재검증
```

### 5. 완료 (Complete)

```bash
/pr-docs
# → PR 문서 자동 생성
```

### 6. 학습 (Learn)

```bash
# 자동: continuous-learning 스킬이 패턴 감지
# 수동: /learn 커맨드로 instinct 저장
# 진화: /evolve로 skill/command로 승격
```

## 컨텍스트 관리

### ctx_window 기반 자동 관리

| 남은 토큰 | 행동 |
|-----------|------|
| 100,000+ | 정상 진행 |
| 70,000~100,000 | 저장 제안 |
| 50,000~70,000 | 자동 저장 |
| 50,000 미만 | 즉시 저장, 새 세션 권장 |

### 세션 복원

```bash
# 새 세션 시작 시 session-restore 스킬 자동 실행
# .cursor/tmp/context-*.md에서 이전 상태 복원
```

## Hooks 시스템

세션 영속화와 자동 학습을 위한 hook 스크립트 시스템입니다.

### Hook 설정

Hook 설정은 `.cursor/hooks.json`에서 관리합니다 (Cursor 공식 형식).

> 참고: [Cursor Hooks 문서](https://cursor.com/ko/docs/agent/hooks)

### Hook 목록

| Hook | 스크립트 | 트리거 | 역할 |
|------|----------|--------|------|
| `sessionStart` | `session-start.js` | 세션 시작 | 이전 컨텍스트 로드 |
| `sessionEnd` | `session-end.js` | 세션 종료 | 컨텍스트 저장 |
| `preCompact` | `pre-compact.js` | 압축 전 | 스냅샷 저장 |
| `preToolUse` | `observe.js pre` | 도구 사용 전 | 관찰 기록 |
| `postToolUse` | `observe.js post` | 도구 사용 후 | 관찰 기록 |
| `afterFileEdit` | `suggest-compact.js` | 파일 편집 후 | 저장 제안 |
| `stop` | `session-end.js` | 에이전트 종료 | 컨텍스트 저장 |

### 수동 실행

```bash
# 세션 시작 (이전 컨텍스트 복원)
node .cursor/scripts/hooks/session-start.js

# 컨텍스트 저장 (세션 종료 시뮬레이션)
node .cursor/scripts/hooks/session-end.js

# 압축 전 스냅샷
node .cursor/scripts/hooks/pre-compact.js

# 세션 패턴 분석
node .cursor/scripts/hooks/evaluate-session.js
```

### 자동화 흐름

```
세션 시작
    │
    ▼
session-start.js ──→ 이전 컨텍스트 복원
    │
    ▼
[작업 진행]
    │
    ├─→ suggest-compact.js (20회 편집마다)
    │       └─→ 저장 제안
    │
    ├─→ pre-compact.js (압축 전)
    │       └─→ 스냅샷 저장
    │
    ▼
세션 종료
    │
    ▼
session-end.js ──→ 컨텍스트 저장
    │
    ▼
evaluate-session.js ──→ 패턴 분석 → instinct 제안
```

### 파일 구조

```
.cursor/
├── hooks.json                  # Hook 설정 파일 (Cursor 공식 형식)
├── scripts/
│   ├── hooks/
│   │   ├── session-start.js    # 세션 시작 hook
│   │   ├── session-end.js      # 세션 종료 hook
│   │   ├── pre-compact.js      # 압축 전 hook
│   │   ├── suggest-compact.js  # 저장 제안 hook
│   │   ├── evaluate-session.js # 패턴 분석 hook
│   │   ├── observe.js          # 도구 사용 관찰
│   │   ├── analyze-observations.js # 관찰 분석
│   │   └── audit.js            # 위험 명령 감사
│   └── lib/
│       └── utils.js            # 공통 유틸리티
└── tmp/
    ├── context-*.md            # 저장된 컨텍스트
    ├── pre-compact-*.md        # 압축 전 스냅샷
    ├── observations.jsonl      # 관찰 데이터
    └── audit.log               # 감사 로그
```

### 스킬 연동

| 스킬 | 연동 Hook |
|------|-----------|
| `context-compact` | `session-end.js`, `pre-compact.js` |
| `session-restore` | `session-start.js` |
| `continuous-learning` | `evaluate-session.js` |

## 학습 시스템

### Instinct

작은 학습 패턴 (에러 해결, 스타일 선호 등)

```yaml
# .cursor/instincts/{domain}-{id}.md
id: code-style-001
type: style_preference
domain: code-style
confidence: 0.7
```

### 진화

Instinct → Skill/Command/Agent

```bash
/instinct-status  # 현황 확인
/evolve           # 진화 실행 (confidence >= 0.8, 동일 domain 3개+)
```

## 프로젝트 설정

`/initialize` 실행 시 프로젝트 정보를 수집하여 `.cursor/project-config.md` 생성:

- 언어 (TypeScript, Python, Go, Rust)
- 프레임워크 (Next.js, FastAPI 등)
- 패키지 매니저
- 테스트 프레임워크

이 정보를 기반으로 언어별 코드 예시와 검증 스크립트가 자동 생성됩니다.

## 파일 설명

### Rules (항상 적용)

- `sdd-workflow.mdc` - SDD 워크플로우 마스터 규칙
- `agent-orchestration.mdc` - 에이전트 오케스트레이션 가이드

### Templates

- `docs/modules/TEMPLATE.md` - 모듈 명세 템플릿
- `docs/decisions/TEMPLATE.md` - ADR 템플릿
- `docs/PROJECT-CONFIG-TEMPLATE.md` - 프로젝트 설정 템플릿
- `instincts/_example.md` - Instinct 예시

## 기여

1. Fork 후 수정
2. PR 생성
3. 리뷰 후 머지

## 라이선스

MIT

---

**Remember**: 명세 없이 코드 없다. 명세는 선택이 아닌 필수.
