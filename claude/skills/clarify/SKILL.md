---
name: clarify
description: Interview user for clarify Ambiguity. 스펙 설계, 아키텍쳐 설계, 태스크 나열 등 코드 작성 이외의 단계에서 사용합니다. 명확하게 정해지지 않은 부분을 찾아 유저에게 질문하고 명확화합니다.
---

# Clarify

확실하게 정해져있지 않은 것을 유저에게 질문하고, 답변을 얻어 명확하게 만듭니다.

## Step 2: Ambiguity Scan

아래 10개 카테고리에 대해 분석합니다.

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
  

## Step 3: Prioritize Questions

질문 우선순위 = Impact × Uncertainty

```
Priority Score = category.impact × (1 - clarity)

where:
- impact: high=3, medium=2, low=1
- clarity: Clear=1.0, Partial=0.5, Missing=0.0
```

최대 10개의 질문을 큐에 추가합니다.

- If no meaningful ambiguities found (or all potential questions would be low-impact), respond: "No critical ambiguities detected worth formal clarification." and suggest proceeding.

## Step 4: Sequential questioning loop (interactive)

**한 번에 1개 질문만** 출력합니다.

사용자가 선택할 수 있도록 객관식 질문을 출력합니다.

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

## Step 5: Loop Until Complete

큐의 질문에 대한 답변을 모두 받을 때까지 반복합니다.

### 종료 시 동작
- 기능 스펙 문서 `docs` 등이 있다면, 질답 내용을 바탕으로 업데이트합니다

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


## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

Goal: Detect and reduce ambiguity or missing decision points in the active feature specification and record the clarifications directly in the spec file.