---
name: implement
description: 구현 단계. 만들어진 task를 기반으로 순서대로 코드를 작성하고, 인식가능한 작업 단위로 커밋합니다. 코드 구현 시 사용합니다. 
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## When to Use

- `/implement` 명령 시
- task 완료 후 자동 전환 시
- 기능 구현 시 
- "구현", "코딩", "개발" 키워드 시

## Prerequisites

- `docs/.checkpoints/{feature}/specify.md` (status: ready)
- `docs/.checkpoints/{feature}/plan.md` (status: ready)
- `docs/.checkpoints/{feature}/task.md` (status: ready)
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
docs/.checkpoints/{feature}/specify.md
- Functional Requirements
- Acceptance Criteria

docs/.checkpoints/{feature}/plan.md
- Technology Stack
- Component Design
- File Structure
- Technical Decisions

docs/.checkpoints/{feature}/task.md
- Task List
- Implementation Order
- Task Details
```

- **REQUIRED**: Read task.md for the complete task list and execution plan
- **REQUIRED**: Read plan.md for tech stack, architecture, and file structure
- **IF EXISTS**: Read /docs and load context from existing documents. 
- **IF EXISTS**: Read code referenced from /docs.

### parse task 

Parse task.md structure and extract:
   - **Task phases**: Setup, Tests, Core, Integration, Polish
   - **Task dependencies**: Sequential vs parallel execution rules
   - **Task details**: ID, description, file paths, parallel markers [P]
   - **Execution flow**: Order and dependency requirements

## Step 2: Task Execution Loop

- 각 태스크를 하나씩 실행합니다. task가 완료된 경우 **반드시** 사용자에게 확인받습니다. 병렬 실행하지 않습니다.

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

### 사용자 확인

- 코드 구현이 완료된 경우에는 **반드시 사용자 리뷰**를 받습니다.
- 구현한 코드를 정리하여 사용자가 알아보기 쉽도록 출력한 후 사용자에게 질문합니다. 응답은 A 또는 B로, A를 선택하는 경우 다음 커밋을 하거나 다음 단계로 진입합니다. B 선택에서는 사용자가 직접 수정 사항을 입력받아 수정합니다.

#### 질문 예시

```text
## TASK-001 구현 완료

### 변경된 파일
| 파일 | 변경 내용 |
|------|----------|
| `src/auth/auth.service.ts` | JWT 토큰 생성 로직 추가 |
| `src/auth/auth.controller.ts` | 로그인 엔드포인트 구현 |
| `src/auth/dto/login.dto.ts` | 로그인 요청 DTO 생성 |

### 핵심 구현
- bcrypt를 사용한 비밀번호 해시 비교
- JWT 토큰 만료 시간: 1시간
- Refresh token은 다음 태스크에서 구현 예정
---
```
구현 코드 
```java
```

```text

**확인해 주세요:**
1. 구현이 요구사항과 일치하나요?
2. 코드 스타일/패턴에 수정이 필요한가요?
3. 커밋 후 다음 태스크로 진행해도 될까요?
```


### Commit

태스크 완료 시 사람이 인식 가능한 최소 단위가 되었다고 판단하는 경우 커밋합니다.

#### Commit Message Format

`.cursor/references/commit-convention.json`의 설정에 따라 커밋 메시지를 생성합니다.

**형식**: `{issue_number} {message}`

#### 이슈 번호 파싱

브랜치 이름에서 이슈 번호를 자동으로 파싱합니다.


파싱 스크립트: `.cursor/references/parse-issue-number.sh`


#### Commit 메시지 예시

| Commit Message | 설명 |
|----------------|------|
| `UNICORN-66265 JWT token 추가` | 새 기능 추가 |

#### Commit 메시지 생성 프로세스

1. 브랜치 이름에서 이슈 번호 파싱
2. 변경 내용을 설명하는 메시지 작성
3. 사용자 확인 후 커밋

```markdown
**커밋 메시지 확인**

**Issue Number**: `UNICORN-66265` (from branch: feature/UNICORN-66265-sdd)
**Suggested:** `UNICORN-66265 유저 인증 구현`

Reply "yes" to commit, or provide a different message.
```

### Task Complete

각 태스크 완료 후 진행 상황을 표시합니다.

```markdown
## TASK-001 완료 ✓

**Commit**: `a1b2c3d` `UNICORN-66265 프로젝트 초기화`

**Files changed**:
- package.json (created)
- tsconfig.json (created)
- src/index.ts (created)

**Progress**: 1/6 tasks (17%)

---

다음: TASK-002 - User 엔티티 및 DB 스키마
```

## Step 3: All Tasks Complete

모든 태스크 완료 시:

```markdown
## Implement 완료

**Feature**: auth-login
**Tasks Completed**: 6/6

### Commit History
| Commit | Message | Task |
|--------|---------|------|
| a1b2c3d | UNICORN-66265 initialize project | TASK-001 |
| b2c3d4e | UNICORN-66265 add User entity | TASK-002 |
| c3d4e5f | UNICORN-66265 implement login API | TASK-003 |
| d4e5f6g | UNICORN-66265 add JWT utilities | TASK-004 |
| e5f6g7h | UNICORN-66265 create login component | TASK-005 |
| f6g7h8i | UNICORN-66265 add integration tests | TASK-006 |

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

## Step 4: Next Stage Transition

**사용자에게 A(yes), B(no), C(other...)로 질문을 출력합니다.**
- `yes` → /verify skill 자동 실행
- `no` → 대기
- 다른 명령 → 해당 명령 실행

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
