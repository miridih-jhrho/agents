---
name: revise
description: 수정 단계. verify에서 발견된 이슈를 수정하고 체크포인트를 업데이트합니다. clarify를 통해 수정 방향을 확인합니다.
---

# Revise Skill

검증에서 발견된 이슈를 수정하고 재검증을 준비합니다.

## When to Use

- `/revise` 명령 시
- verify 실패 후 자동 전환 시
- "수정", "고치기", "fix" 키워드 시

## Prerequisites

- verify 리포트 (실패한 테스트, 리뷰 이슈)
- 모든 체크포인트 접근 가능

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

verify에서 생성된 리포트를 분석합니다.

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

## Step 2: Clarify for Fix Direction

수정 방향에 대해 clarify를 수행합니다.

**Clarify 포커스 카테고리** (revise 단계):
- Edge Cases
- Non-Functional (보안)
- Misc

### 예상 질문들

```markdown
**테스트 실패 수정 방향**

`auth.test.ts:45`: login should reject invalid credentials
현재: 500 에러 반환, 예상: 401 에러

**Recommended:** Option A - 적절한 에러 핸들링 추가

| Option | Description |
|--------|-------------|
| A | catch 블록에서 401 반환하도록 수정 |
| B | 입력 검증 로직 추가 |
| C | 테스트 케이스 수정 (현재 동작이 맞다면) |

Reply with option letter or "yes" for recommended.
```

```markdown
**보안 이슈 수정**

SQL injection 취약점이 발견되었습니다.

**Recommended:** Option A - 업계 표준 방식

| Option | Description |
|--------|-------------|
| A | Parameterized query로 변경 |
| B | ORM 사용 (새로운 의존성) |
| C | 입력값 sanitize 함수 추가 |

Reply with option letter or "yes" for recommended.
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
...
```

## Step 4: Update Checkpoint

필요 시 체크포인트를 업데이트합니다.

### 업데이트가 필요한 경우
- 수정 중 새로운 결정이 내려진 경우
- 명세 변경이 필요한 경우
- 추가 엣지 케이스가 발견된 경우

```markdown
## 체크포인트 업데이트

**{feature}-task.md**:
- TASK-003 Acceptance Criteria 업데이트
  - [추가] 잘못된 인증 시 401 반환

**{feature}-plan.md**:
- Technical Decisions 업데이트
  - [추가] SQL injection 방지: parameterized query 사용
```

## Step 5: Commit Fixes

수정 사항을 커밋합니다.

```markdown
**커밋 메시지 확인**

**Suggested:** fix(auth): handle invalid credentials properly [TASK-003]

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
- {feature}-task.md: TASK-003 criteria 업데이트
- {feature}-plan.md: security decision 추가

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
