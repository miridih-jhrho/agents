---
name: revise
description: 잘못된 코드를 수정합니다. 구현 후 검증 단계에서 발견된 이슈를 해결할 때 사용합니다.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## When to Use

- verify 실패 후 자동 전환 시
- "수정", "고치기", "fix" 키워드 시

## Prerequisites

- verify 리포트 (실패한 테스트, 리뷰 이슈)
- `docs/.checkpoints/{feature}/specify.md` (status: ready)
- `docs/.checkpoints/{feature}/plan.md` (status: ready)
- `docs/.checkpoints/{feature}/task.md` (status: ready)

## Process

```mermaid
flowchart TD
    A[Verify 리포트 로드] --> B[이슈 분석]
    B --> C[Clarify 호출]
    C --> D{수정 방향 확정?}
    D -->|No| C
    D -->|Yes| E[코드 수정]
    E --> F[체크포인트 업데이트]
    F --> G[커밋]
    G --> H[완료 메시지]
    H --> I{다음 단계?}
    I -->|yes| J[/verify 실행]
    I -->|no| K[대기]
```

## Step 1: Load Verify Report

verify에서 생성된 리포트를 분석합니다. 또는 체크포인트 파일을 읽습니다.


```markdown
## 발견된 이슈

### Test Failures (2)
1. `auth.test.ts:45` - login should reject invalid credentials
2. `user.test.ts:30` - createUser should validate email

### Critical Issues (1)
1. SQL injection 취약점

### Warnings (2)
1. 하드코딩된 secret
2. 매직 넘버 사용
```

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

## Step 2: Clarify for Fix Direction

**Clarify 포커스 카테고리** (revise 단계):
- Edge Cases
- Non-Functional (보안)
- Misc

`clarify` skill을 호출합니다.

```text
/clarify `수정사항`
```

## Step 3: Apply Fixes

확정된 수정 방향에 따라 코드를 수정합니다.

### 수정 진행 표시

```markdown
## 수정 진행

### 1. Test Failures 수정

**auth.test.ts:45 수정 중...**
- 파일: `src/auth/login.ts`
- 수정: try-catch 블록에서 적절한 에러 코드 반환

```diff
- } catch (error) {
-   throw error;
+ } catch (error) {
+   if (error instanceof InvalidCredentialsError) {
+     return res.status(401).json({ error: 'Invalid credentials' });
+   }
+   throw error;
```

✓ 완료

**user.test.ts:30 수정 중...**
```
```

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


## Step 4: Update Checkpoint

필요 시 체크포인트를 업데이트합니다.

### 업데이트가 필요한 경우
- 수정 중 새로운 결정이 내려진 경우
- 명세 변경이 필요한 경우
- 추가 엣지 케이스가 발견된 경우

```markdown
## 체크포인트 업데이트

**{feature}/task.md**:
- TASK-003 Acceptance Criteria 업데이트
  - [추가] 잘못된 인증 시 401 반환

**{feature}/plan.md**:
- Technical Decisions 업데이트
  - [추가] SQL injection 방지: parameterized query 사용
```

## Step 5: Commit Fixes

#### Commit Message Format

`.cursor/implement/ences/commit-convention.json`의 설정에 따라 커밋 메시지를 생성합니다.

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


여러 수정이 있는 경우 각각 커밋하거나 하나로 묶을 수 있습니다:

```markdown
**여러 수정이 있습니다. 커밋 방식을 선택하세요.**

| Option | Description |
|--------|-------------|
| A | 각각 별도 커밋 (3 commits) |
| B | 하나로 묶어서 커밋 |

Reply with option letter.
```

## Step 6: Completion Message

**사용자에게 A(yes), B(no), C(other...)로 질문을 출력합니다.**

```markdown
## Revise 완료

**Feature**: auth-login

### 수정된 이슈

#### Test Failures (2/2 수정)
1. ✓ `auth.test.ts:45` - 에러 핸들링 수정
2. ✓ `user.test.ts:30` - 이메일 검증 추가

#### Critical Issues (1/1 수정)
1. ✓ SQL injection - parameterized query로 변경

#### Warnings (2/2 수정)
1. ✓ 하드코딩된 secret → 환경변수 사용
2. ✓ 매직 넘버 → 상수 추출

### Commits
| Commit | Message |
|--------|---------|
| g7h8i9j | fix(auth): handle invalid credentials [TASK-003] |
| h8i9j0k | fix(security): use parameterized queries |
| i9j0k1l | refactor(config): move secrets to env |

### Checkpoint Updates
- {feature}/task.md: TASK-003 criteria 업데이트
- {feature}/plan.md: security decision 추가

---

**다음 단계**: /verify - 재검증

| Option | Action |
|--------|--------|
| yes | /verify 바로 실행 |
| no | 대기 (나중에 수동 실행) |

Reply: yes, no, or another command
```

## Step 7: Next Stage Transition

사용자 응답에 따라:
- `yes` → /verify skill 자동 실행
- `no` → 대기
- 다른 명령 → 해당 명령 실행

## Output

- 수정된 코드 파일
- 수정 커밋
- 업데이트된 체크포인트 (필요 시)
- 다음 단계: /verify 추천

## Error Handling

- 수정 중 새 에러 발생 → 추가 clarify
- 수정 범위 확대 필요 → 추가 태스크 생성 제안
- 테스트 환경 문제 → 환경 설정 안내

## Partial Revision

일부 이슈만 수정하는 경우:

```markdown
**일부 이슈만 수정되었습니다.**

- 수정됨: 2/4
- 미수정: 2/4
  - Warning: 매직 넘버 (나중에 수정 예정)
  - Warning: 미사용 import (영향 없음)

이대로 진행할까요? (yes: /verify 실행, no: 계속 수정)
```

## Integration

```
/verify (실패)
    ↓
/revise (현재)
    ├── clarify (수정 방향 확인)
    ├── 코드 수정
    ├── 체크포인트 업데이트
    └── 커밋
    ↓
/verify (재검증)
    ↓
  ┌─────┴─────┐
  ↓           ↓
/spec-update  /revise
(PASS)        (다시 FAIL)
```
