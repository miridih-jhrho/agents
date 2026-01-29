# SDD Orchestration

Spec-Driven Development 기반의 Cursor Agent 워크플로우 패키지입니다.

## 개요

SDD Orchestration은 기능 개발을 체계적인 단계로 분리하여 진행하는 워크플로우를 제공합니다.

```
/specify → /plan → /task → /implement → /verify → /spec-update
                                            ↓
                                        (실패 시)
                                         /revise
```

## 핵심 기능

- **Ambiguity Detection**: 각 단계에서 모호한 부분을 자동으로 탐지하고 질문
- **체크포인트 기반**: 임시 문서로 작업하고 완료 시 최종 문서로 통합
- **Task 단위 커밋**: 각 태스크 완료 시 자동 커밋
- **자동 단계 전환**: 각 단계 완료 시 다음 단계 추천 및 자동 실행

## 설치

### 1. 패키지 복사

```bash
# sdd-orchestration 폴더를 프로젝트의 .cursor/ 디렉토리에 복사
cp -r sdd-orchestration /path/to/your/project/.cursor/
```

### 2. 규칙 활성화

`.cursor/rules/` 폴더에 `sdd-orchestration.mdc`를 복사하거나 심볼릭 링크를 생성합니다.

```bash
ln -s ../.cursor/sdd-orchestration/rules/sdd-orchestration.mdc .cursor/rules/
```

### 3. 문서 폴더 생성

```bash
mkdir -p docs/{.checkpoints,modules,decisions}
```

## 사용법

### 새 기능 개발

1. **명세화** - 기능 요구사항 정의
   ```
   /specify 로그인 기능
   ```

2. **설계** - 아키텍처 및 기술 결정
   ```
   /plan
   ```

3. **태스크 분리** - 구현 태스크 정의
   ```
   /task
   ```

4. **구현** - 코드 작성 및 태스크별 커밋
   ```
   /implement
   ```

5. **검증** - 테스트 및 코드 리뷰
   ```
   /verify
   ```

6. **명세 동기화** - 최종 문서 생성
   ```
   /spec-update
   ```

### 자동 진행

각 단계 완료 시 다음 단계를 추천합니다. `yes`를 입력하면 자동으로 다음 단계가 실행됩니다.

```markdown
## Specify 완료

다음 단계: /plan

| Option | Action |
|--------|--------|
| yes | /plan 바로 실행 |
| no | 대기 |

Reply: yes, no, or another command
```

## 워크플로우 상세

### Clarify 프로세스

모든 단계(specify, plan, task, revise)에서 Ambiguity Detection을 수행합니다.

**10개 카테고리 분석:**
- Functional Scope & Behavior
- Domain & Data Model
- Interaction & UX Flow
- Non-Functional Quality Attributes
- Integration & External Dependencies
- Edge Cases & Failure Handling
- Constraints & Tradeoffs
- Terminology & Consistency
- Completion Signals
- Misc / Placeholders

**질문 규칙:**
- 세션당 최대 10개 질문
- 한 번에 1개씩 순차 출력
- 추천 옵션 반드시 제시
- Impact × Uncertainty 우선순위

### 체크포인트

작업 중에는 임시 체크포인트를 사용합니다.

```
docs/.checkpoints/
├── {feature}-specify.md   # 기능 명세
├── {feature}-plan.md      # 아키텍처 설계
└── {feature}-task.md      # 태스크 목록
```

`/spec-update` 완료 시 최종 문서로 통합되고 체크포인트는 삭제됩니다.

```
docs/
├── modules/{module}/README.md   # 모듈 명세
└── decisions/{num}-{title}.md   # ADR
```

### 커밋 규칙

`/implement` 단계에서 각 태스크 완료 시 커밋합니다.

```
{type}({scope}): {message} [{task_id}]
```

**예시:**
```
feat(auth): add JWT token validation [TASK-001]
fix(api): handle null response [TASK-002]
```

커밋 형식은 `skills/implement/config.json`에서 설정합니다.

## 구조

```
sdd-orchestration/
├── README.md
├── skills/
│   ├── clarify/
│   │   ├── SKILL.md           # Ambiguity Detection
│   │   └── taxonomy.json      # 10개 카테고리
│   ├── specify/SKILL.md       # 기능 명세화
│   ├── plan/SKILL.md          # 아키텍처 설계
│   ├── task/SKILL.md          # 태스크 분리
│   ├── implement/
│   │   ├── SKILL.md           # 코드 구현
│   │   └── config.json        # 커밋 설정
│   ├── verify/SKILL.md        # 검증
│   ├── revise/SKILL.md        # 수정
│   └── spec-update/SKILL.md   # 명세 동기화
├── templates/
│   ├── checkpoint-specify.md
│   ├── checkpoint-plan.md
│   ├── checkpoint-task.md
│   ├── module-spec.md
│   └── adr.md
├── agents/
│   ├── test-agent.md          # 테스트 에이전트
│   └── review-agent.md        # 리뷰 에이전트
└── rules/
    └── sdd-orchestration.mdc  # 워크플로우 규칙
```

## 커스터마이징

### 커밋 형식 변경

`skills/implement/config.json` 수정:

```json
{
  "commit": {
    "format": "{type}: {message}",
    "include_task_id": false
  }
}
```

### 템플릿 수정

`templates/` 폴더의 템플릿을 프로젝트에 맞게 수정합니다.

### 카테고리 추가/수정

`skills/clarify/taxonomy.json`에서 Ambiguity Scan 카테고리를 수정합니다.

## 명령어 요약

| 명령어 | 역할 | 출력 |
|--------|------|------|
| `/specify` | 기능 명세화 | {feature}-specify.md |
| `/plan` | 아키텍처 설계 | {feature}-plan.md |
| `/task` | 태스크 분리 | {feature}-task.md |
| `/implement` | 코드 구현 | 코드 + 커밋 |
| `/verify` | 테스트/리뷰 | 검증 리포트 |
| `/revise` | 이슈 수정 | 수정된 코드 |
| `/spec-update` | 명세 동기화 | modules/, decisions/ |

## 라이선스

MIT
