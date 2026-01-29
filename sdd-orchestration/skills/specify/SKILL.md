---
name: specify
description: 기능 명세화 단계. 사용자 요구사항을 분석하고 체크포인트를 생성합니다. clarify 프로세스를 통해 모호함을 해소합니다.
---

# Specify Skill

사용자 요구사항을 분석하여 기능 명세 체크포인트를 생성합니다.

## When to Use

- 새 기능 개발 시작 시
- `/specify` 또는 `/spec` 명령 시
- "명세", "기능 정의", "요구사항" 키워드 시

## Process

```mermaid
flowchart TD
    A[사용자 요구사항] --> B[Feature 이름 결정]
    B --> C[체크포인트 생성]
    C --> D[Clarify 호출]
    D --> E{모호함 해소?}
    E -->|No| D
    E -->|Yes| F[체크포인트 Ready]
    F --> G[완료 메시지]
    G --> H{다음 단계?}
    H -->|yes| I[/plan 실행]
    H -->|no| J[대기]
```

## Step 1: Feature Name

사용자 요구사항에서 feature 이름을 추출하거나 확인합니다.

```markdown
**Feature 이름을 확인해주세요.**

**Suggested:** auth-login - 로그인 관련 기능으로 보입니다.

Reply "yes" to accept, or provide a different name (<=3 words, kebab-case).
```

## Step 2: Create Checkpoint

`docs/.checkpoints/{feature}-specify.md` 파일을 생성합니다.

```markdown
# auth-login - Specify Checkpoint

## Metadata
- feature: auth-login
- stage: specify
- status: in_progress
- created: 2026-01-29
- depends_on: []

## Clarifications
### Session 2026-01-29

## Coverage Map
| Category | Status | Notes |
|----------|--------|-------|
| Functional Scope | Missing | |
...

## Content
### Feature Overview
### Functional Requirements
### Out of Scope
### Acceptance Criteria

## Open Questions
## Next Step
→ /plan
```

## Step 3: Run Clarify

clarify skill을 호출하여 모호함을 해소합니다.

**Clarify 포커스 카테고리** (specify 단계):
- Functional Scope (필수)
- Domain & Data Model
- Interaction & UX
- Terminology
- Completion Signals
- Misc

## Step 4: Update Checkpoint

clarify 완료 후 체크포인트를 업데이트합니다.

- status: `in_progress` → `ready`
- Coverage Map 업데이트
- Content 섹션 채우기

### Content 작성 가이드

```markdown
## Content

### Feature Overview
{clarify에서 확인된 기능 핵심 목적}

### Functional Requirements
- FR-001: {요구사항 1}
- FR-002: {요구사항 2}

### User Stories (선택)
- As a {role}, I want to {action}, so that {benefit}

### Out of Scope
- {이번 구현에서 제외할 항목}

### Acceptance Criteria
- [ ] {수락 기준 1}
- [ ] {수락 기준 2}
```

## Step 5: Completion Message

```markdown
## Specify 완료

**체크포인트**: `docs/.checkpoints/auth-login-specify.md`
**상태**: Ready

### Coverage Summary
| Category | Status |
|----------|--------|
| Functional Scope | Clear |
| Domain & Data Model | Clear |
| Interaction & UX | Partial |
| ... | ... |

### Clarifications (5)
- Q: 인증 방식은? → A: JWT
- Q: 소셜 로그인 필요? → A: 아니오
- ...

---

**다음 단계**: /plan - 아키텍처 설계

| Option | Action |
|--------|--------|
| yes | /plan 바로 실행 |
| no | 대기 (나중에 수동 실행) |

Reply: yes, no, or another command
```

## Step 6: Next Stage Transition

사용자 응답에 따라:
- `yes` → /plan skill 자동 실행
- `no` → 대기
- 다른 명령 → 해당 명령 실행

## Output

- 생성: `docs/.checkpoints/{feature}-specify.md`
- 상태: Ready
- 다음 단계: /plan 추천

## Error Handling

- Feature 이름 충돌 → 새 이름 요청 또는 기존 체크포인트 로드 옵션
- clarify 중 사용자 취소 → 체크포인트 status를 `in_progress`로 유지
- 파일 시스템 에러 → 에러 메시지 출력, 재시도 옵션

## Examples

### Example 1: Simple Feature

```
User: 로그인 기능 만들어줘

Agent:
1. Feature 이름 확인: auth-login
2. 체크포인트 생성
3. Clarify 시작
   - Q: 인증 방식은? → A: 이메일/비밀번호
   - Q: 비밀번호 찾기 필요? → A: 예
4. 체크포인트 완료
5. /plan 추천
```

### Example 2: Complex Feature

```
User: 결제 시스템 구현해줘

Agent:
1. Feature 이름 확인: payment-system
2. 체크포인트 생성
3. Clarify 시작 (더 많은 질문)
   - Q: 결제 수단? → A: 카드, 계좌이체
   - Q: PG사? → A: 토스페이먼츠
   - Q: 정기결제? → A: 아니오
   - Q: 환불 정책? → A: 7일 이내 전액
   - ...
4. 체크포인트 완료
5. /plan 추천
```
