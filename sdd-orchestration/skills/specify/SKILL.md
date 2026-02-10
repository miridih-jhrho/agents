---
name: specify
description: 기능 명세화 단계. 사용자 요구사항을 분석하고 문서화합니다. 새로운 기능을 만들거나, 기존 기능을 수정하고자 할 때, 코드 구현 전 계획 단계에서 사용합니다. 
---

## User Input

```text
$ARGUMENTS
```

## When to Use

- 코드 구현 전 계획
- 새 기능 개발 시작 시
- 기존 기능을 수정 시
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

## Step 2: Load context

   a. Read `docs/` if it exists
   
   b. Analyze existing features to understand:
      - What features already exist in this project
      - Which categories are defined
      - Potential dependencies or related features
      - Existing patterns and conventions used
   
   c. Identify related features:
      - Same category as new feature (based on keywords in description)
      - Features that might share data models or APIs
      - Features the new one might depend on
   
   d. If related features found, read their spec.md files to:
      - Understand existing terminology and conventions
      - Identify shared entities or concepts
      - Avoid duplicating existing functionality
      - Reference existing features in the new spec if appropriate

### specify 

    1. Parse user description from Input
       If empty: ERROR "No feature description provided"
    2. Extract key concepts from description
       Identify: actors, actions, data, constraints
    3. **Generate human-readable summary sections** (IMPORTANT for human reviewers):
       - **한줄 요약**: 이 기능이 무엇인지 한 문장으로 작성
       - **TL;DR 테이블**: 목적, 대상 사용자, 핵심 기능, 범위를 테이블로 정리
       - **사용자 흐름 다이어그램**: User Scenarios 기반으로 mermaid flowchart 생성
         ```mermaid
         flowchart LR
             A[시작] --> B[주요 액션 1]
             B --> C[주요 액션 2]
             C --> D[완료]
         ```
    4. **Reference existing features** (from Step 2):
       - If this feature depends on existing features, note in spec
       - Use consistent terminology with related features
       - Reference shared entities from other specs
    5. For unclear aspects:
       - Make informed guesses based on context and industry standards
       - Only mark with [NEEDS CLARIFICATION: specific question] if:
         - The choice significantly impacts feature scope or user experience
         - Multiple reasonable interpretations exist with different implications
         - No reasonable default exists
       - **LIMIT: Maximum 3 [NEEDS CLARIFICATION] markers total**
       - Prioritize clarifications by impact: scope > security/privacy > user experience > technical details
    6. Fill User Scenarios & Testing section
       If no clear user flow: ERROR "Cannot determine user scenarios"
    7. Generate Functional Requirements
       Each requirement must be testable
       Use reasonable defaults for unspecified details (document assumptions in Assumptions section)
    8. Define Success Criteria
       Create measurable, technology-agnostic outcomes
       Include both quantitative metrics (time, performance, volume) and qualitative measures (user satisfaction, task completion)
       Each criterion must be verifiable without implementation details
    9. Identify Key Entities (if data involved)
       - Include ER diagram if entities have relationships:
         ```mermaid
         erDiagram
             Entity1 ||--o{ Entity2 : contains
         ```
       - Reference existing entities from related features if applicable
    10. Return: SUCCESS (spec ready for planning)

## Step 3: Create Checkpoint

`docs/.checkpoints/{feature}/specify.md` 파일을 생성합니다.

`.cursor/templates/checkpoint-specify.md` 파일을 활용하여 내용을 채웁니다. **반드시 템플릿 파일에서 시작해야 합니다.**

## Step 4: Run Clarify

`clarify` skill을 호출합니다.

```text
/clarify docs/.checkpoints/{feature}/specify.md
```

## Step 5: Update Checkpoint

체크포인트를 업데이트합니다.

- status: `in_progress` → `ready`
- Coverage Map 업데이트
- Content 섹션 채우기
- clarify에서 정해진 내용 채우기 

## Step 6: Completion Message

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

**사용자에게 A(yes), B(no), C(other...)로 질문을 출력합니다.**

| Option | Action |
|--------|--------|
| yes | /plan 바로 실행 |
| no | 대기 (나중에 수동 실행) |

Reply: yes, no, or another command
```

## Step 7: Next Stage Transition

사용자 응답에 따라:
- `yes` → /plan skill 자동 실행
- `no` → 대기
- 다른 명령 → 해당 명령 실행

## Output

- 생성: `docs/.checkpoints/{feature}/specify.md`
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
