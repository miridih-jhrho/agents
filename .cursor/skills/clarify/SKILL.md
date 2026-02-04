---
name: clarify
description: Ambiguity Detection & Clarification Loop. 기능 구현 이전 여러 선택지 중 하나를 확정합니다.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

Goal: Detect and reduce ambiguity or missing decision points in the active feature specification and record the clarifications directly in the spec file.


## When to Use

- `/specify`, `/plan`, `/task`, `/revise` 스킬 실행 중 
- 선택지 중 하나를 골라야 하는 경우 

## Process

```
1. Load Context
   ↓
2. Ambiguity Scan (10 categories)
   ↓
3. Generate Coverage Map
   ↓
4. Prioritize Questions (Impact × Uncertainty)
   ↓
5. Ask One Question (with recommendation)
   ↓
6. Record Answer → Checkpoint
   ↓
7. Loop until no ambiguity
```

## Step 1: Load Context

현재 단계의 체크포인트와 의존 체크포인트를 로드합니다.

```
# 체크포인트 경로
docs/.checkpoints/{feature}/specify.md
docs/.checkpoints/{feature}/plan.md
docs/.checkpoints/{feature}/task.md
```

의존 관계:
- specify: 없음
- plan: specify 참조
- task: specify, plan 참조
- revise: 모든 체크포인트 참조

## Step 2: Ambiguity Scan

`taxonomy.json`의 10개 카테고리에 대해 분석합니다.

| Category | Check Items | Impact |
|----------|-------------|--------|
| Functional Scope | goals, out-of-scope, user roles | high |
| Domain & Data Model | entities, relationships, lifecycle | high |
| Interaction & UX | user journeys, error states | medium |
| Non-Functional | performance, security, scalability | high |
| Integration | external APIs, failure modes | medium |
| Edge Cases | negative scenarios, conflicts | medium |
| Constraints | technical limits, tradeoffs | high |
| Terminology | glossary, deprecated terms | low |
| Completion Signals | acceptance criteria, DoD | medium |
| Misc | TODO markers, vague adjectives | low |

각 카테고리에 대해 상태 판단:
- **Clear**: 명확하게 정의됨
- **Partial**: 일부만 정의됨 (질문 후보)
- **Missing**: 정의 없음 (질문 필수)

## Step 3: Generate Coverage Map

체크포인트의 Coverage Map 섹션을 업데이트합니다.

```markdown
## Coverage Map
| Category | Status | Notes |
|----------|--------|-------|
| Functional Scope | Clear | 기능 범위 명확 |
| Domain & Data Model | Partial | 엔티티 관계 불명확 |
| Integration | Missing | 외부 API 미정의 |
```

## Step 4: Prioritize Questions

질문 우선순위 = Impact × Uncertainty

```
Priority Score = category.impact × (1 - clarity)

where:
- impact: high=3, medium=2, low=1
- clarity: Clear=1.0, Partial=0.5, Missing=0.0
```

최대 10개의 질문을 큐에 추가합니다.

- If no meaningful ambiguities found (or all potential questions would be low-impact), respond: "No critical ambiguities detected worth formal clarification." and suggest proceeding.

## Step 5: Sequential questioning loop (interactive)

**한 번에 1개 질문만** 출력합니다.

  - For multiple‑choice questions:
       - **Analyze all options** and determine the **most suitable option** based on:
          - Best practices for the project type
          - Common patterns in similar implementations
          - Risk reduction (security, performance, maintainability)
          - Alignment with any explicit project goals or constraints visible in the spec
       - Present your **recommended option prominently** at the top with clear reasoning (1-2 sentences explaining why this is the best choice).
       - Format as: `**Recommended:** Option [X] - <reasoning>`
       - Then render all options as a Markdown table:

       | Option | Description |
       |--------|-------------|
       | A | <Option A description> |
       | B | <Option B description> |
       | C | <Option C description> (add D/E as needed up to 5) |
       | Short | Provide a different short answer (<=5 words) (Include only if free-form alternative is appropriate) |

       - After the table, add: `You can reply with the option letter (e.g., "A"), accept the recommendation by saying "yes" or "recommended", or provide your own short answer.`
    - For short‑answer style (no meaningful discrete options):
       - Provide your **suggested answer** based on best practices and context.
       - Format as: `**Suggested:** <your proposed answer> - <brief reasoning>`
       - Then output: `Format: Short answer (<=5 words). You can accept the suggestion by saying "yes" or "suggested", or provide your own answer.`
    - After the user answers:
       - If the user replies with "yes", "recommended", or "suggested", use your previously stated recommendation/suggestion as the answer.
       - Otherwise, validate the answer maps to one option or fits the <=5 word constraint.
       - If ambiguous, ask for a quick disambiguation (count still belongs to same question; do not advance).
       - Once satisfactory, record it in working memory (do not yet write to disk) and move to the next queued question.
    - Stop asking further questions when:
       - All critical ambiguities resolved early (remaining queued items become unnecessary), OR
       - User signals completion ("done", "good", "no more"), OR
       - You reach 5 asked questions.
    - Never reveal future queued questions in advance.
    - If no valid questions exist at start, immediately report no critical ambiguities.

## Step 6: Record Answer

사용자 답변을 체크포인트의 Clarifications 섹션에 기록합니다.

```markdown
## Clarifications
### Session 2026-01-29
- Q: 인증 방식은? → A: JWT + refresh token
- Q: 세션 만료 시간? → A: 24시간
```

동시에 관련 섹션도 업데이트:
- Functional → Content의 Functional Requirements
- Data Model → Content의 Data Model
- Non-Functional → Content의 해당 섹션

## Step 7: Loop Until Complete

Coverage Map의 모든 카테고리가 Clear가 되거나, 세션 질문 한도(10개)에 도달하면 종료합니다.

### 종료 조건
1. 모든 카테고리 Clear
2. 세션 질문 10개 도달
3. 사용자가 "done", "good", "no more" 입력

### 종료 시 동작
- 체크포인트 status를 `clarified` 또는 `ready`로 업데이트
- Open Questions 섹션 업데이트
- 호출한 skill로 제어 반환

## Output

```markdown
## Clarify Complete

**Questions Asked**: 5
**Coverage**: 8/10 Clear, 2/10 Partial

### Updated Sections
- Functional Requirements (3 items added)
- Data Model (entity relationships clarified)

**Checkpoint**: docs/.checkpoints/{feature}/{stage}.md updated
```

## Error Handling

- 체크포인트 파일 없음 → 호출 skill이 먼저 생성
- 사용자 답변 모호 → 같은 질문 재질문 (disambiguation)
- 네트워크/파일 에러 → 에러 메시지 후 재시도 옵션
