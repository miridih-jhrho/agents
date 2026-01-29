---
name: implement
description: 구현 단계. 모든 체크포인트를 참조하여 태스크 순서대로 코드를 작성하고, task 단위로 커밋합니다.
---

# Implement Skill

태스크 계획에 따라 코드를 구현하고, 각 태스크 완료 시 커밋합니다.

## When to Use

- `/implement` 명령 시
- task 완료 후 자동 전환 시
- "구현", "코딩", "개발" 키워드 시

## Prerequisites

- `docs/.checkpoints/{feature}-specify.md` (status: ready)
- `docs/.checkpoints/{feature}-plan.md` (status: ready)
- `docs/.checkpoints/{feature}-task.md` (status: ready)
- 없으면 이전 단계 먼저 실행 안내

## Process

```mermaid
flowchart TD
    A[모든 체크포인트 로드] --> B[Task 목록 확인]
    B --> C[다음 Task 선택]
    C --> D[코드 구현]
    D --> E[로컬 검증]
    E --> F{통과?}
    F -->|No| D
    F -->|Yes| G[커밋]
    G --> H{남은 Task?}
    H -->|Yes| C
    H -->|No| I[완료 메시지]
    I --> J{다음 단계?}
    J -->|yes| K[/verify 실행]
    J -->|no| L[대기]
```

## Step 1: Load Checkpoints

모든 체크포인트를 로드하여 컨텍스트를 확보합니다.

```
docs/.checkpoints/{feature}-specify.md
- Functional Requirements
- Acceptance Criteria

docs/.checkpoints/{feature}-plan.md
- Technology Stack
- Component Design
- File Structure
- Technical Decisions

docs/.checkpoints/{feature}-task.md
- Task List
- Implementation Order
- Task Details
```

## Step 2: Task Execution Loop

각 태스크를 순서대로 실행합니다.

### Task 시작 메시지

```markdown
## TASK-001 시작: 프로젝트 초기 설정

**Description**: 프로젝트 구조 생성, 의존성 설치

**Files to create/modify**:
- package.json
- tsconfig.json
- src/index.ts

**Acceptance Criteria**:
- [ ] npm install 성공
- [ ] TypeScript 컴파일 성공

---
구현을 시작합니다...
```

### 코드 구현

1. Task Details의 Files 목록에 따라 파일 생성/수정
2. plan의 Technical Decisions 준수
3. specify의 Acceptance Criteria 충족

### 로컬 검증

커밋 전 기본 검증 수행 (config.json 설정에 따름):

```bash
# lint check (if enabled)
npm run lint

# type check (if enabled)  
npx tsc --noEmit

# test (if enabled)
npm run test
```

## Step 3: Commit

태스크 완료 시 커밋합니다.

### Commit Message Format

`config.json`의 설정에 따라 커밋 메시지를 생성합니다.

```
{type}({scope}): {message} [{task_id}]
```

**예시:**
```
feat(auth): add JWT token validation [TASK-001]
fix(api): handle null response [TASK-002]
test(auth): add login integration tests [TASK-003]
```

### Commit Types

| Type | Description |
|------|-------------|
| feat | 새 기능 추가 |
| fix | 버그 수정 |
| refactor | 코드 리팩토링 |
| test | 테스트 추가/수정 |
| docs | 문서 수정 |
| chore | 빌드, 설정 등 |
| style | 코드 스타일 변경 |

### Commit 메시지 생성 프로세스

```markdown
**커밋 메시지 확인**

**Suggested:** feat(auth): implement user login API [TASK-003]

Reply "yes" to commit, or provide a different message.
```

## Step 4: Task Complete

각 태스크 완료 후 진행 상황을 표시합니다.

```markdown
## TASK-001 완료 ✓

**Commit**: `a1b2c3d` feat(setup): initialize project structure [TASK-001]

**Files changed**:
- package.json (created)
- tsconfig.json (created)
- src/index.ts (created)

**Progress**: 1/6 tasks (17%)

---

다음: TASK-002 - User 엔티티 및 DB 스키마
```

## Step 5: All Tasks Complete

모든 태스크 완료 시:

```markdown
## Implement 완료

**Feature**: auth-login
**Tasks Completed**: 6/6

### Commit History
| Commit | Message | Task |
|--------|---------|------|
| a1b2c3d | feat(setup): initialize project | TASK-001 |
| b2c3d4e | feat(db): add User entity | TASK-002 |
| c3d4e5f | feat(auth): implement login API | TASK-003 |
| d4e5f6g | feat(auth): add JWT utilities | TASK-004 |
| e5f6g7h | feat(ui): create login component | TASK-005 |
| f6g7h8i | test(auth): add integration tests | TASK-006 |

### Files Changed
- 15 files changed
- 450 insertions(+)
- 10 deletions(-)

---

**다음 단계**: /verify - 검증

| Option | Action |
|--------|--------|
| yes | /verify 바로 실행 |
| no | 대기 (나중에 수동 실행) |

Reply: yes, no, or another command
```

## Step 6: Next Stage Transition

사용자 응답에 따라:
- `yes` → /verify skill 자동 실행
- `no` → 대기
- 다른 명령 → 해당 명령 실행

## Configuration

`config.json`에서 커밋 형식 및 동작을 설정합니다.

```json
{
  "commit": {
    "format": "{type}({scope}): {message}",
    "include_task_id": true,
    "task_id_position": "suffix"
  },
  "implementation": {
    "one_task_one_commit": true,
    "verify_before_commit": true
  }
}
```

## Error Handling

- 이전 체크포인트 없음 → 해당 단계 먼저 실행 안내
- 컴파일/린트 에러 → 에러 수정 후 재시도
- 테스트 실패 → 수정 또는 skip 옵션 제공
- 커밋 실패 → 에러 메시지 및 재시도 옵션

## Partial Implementation

중간에 중단된 경우:

```markdown
**구현 재개**

마지막 완료: TASK-003
다음 태스크: TASK-004

이어서 진행할까요? (yes/no)
```

## Output

- 코드 파일 생성/수정
- Task별 커밋
- 다음 단계: /verify 추천

## Integration

```
/specify (완료) 
    ↓
/plan (완료)
    ↓
/task (완료)
    ↓
/implement (현재)
    ├── 모든 체크포인트 참조
    ├── Task 순서대로 구현
    └── Task별 커밋
    ↓
/verify (다음)
```
