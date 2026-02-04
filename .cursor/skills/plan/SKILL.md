---
name: plan
description: 아키텍처 설계 단계. 스펙 명세를 바탕으로 기술적 설계를 진행합니다. 기능을 문서화한 후 구현하기 전 설계 단계에서 사용합니다. 
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## When to Use

- specify 완료 후
- 기능 구현 전
- "설계", "아키텍처", "구조" 키워드 시

## Prerequisites

- `docs/.checkpoints/{feature}/specify.md` 존재 (status: ready)
- 없으면 `/specify` 먼저 실행 안내

## Process

```mermaid
flowchart TD
    A[Specify 체크포인트 로드] --> B[Plan 체크포인트 생성]
    B --> C[Clarify 호출]
    C --> D{모호함 해소?}
    D -->|No| C
    D -->|Yes| E[기술 결정 정리]
    E --> F[체크포인트 Ready]
    F --> G[완료 메시지]
    G --> H{다음 단계?}
    H -->|yes| I[/task 실행]
    H -->|no| J[대기]
```

## Step 1: Load Specify Checkpoint

```
docs/.checkpoints/{feature}/specify.md 로드

- Feature Overview 확인
- Functional Requirements 확인
- Acceptance Criteria 확인
```

    a. read specify.md
    b. Analyze existing features to understand:
      - Existing architecture patterns used in the project
      - Common technology stack and dependencies
      - Shared data models and APIs
      - Established conventions
   
   c. Identify related features from index:
      - Features in the same category
      - Features that share entities or data models
      - Features this one depends on
   
   d. If dependencies found, read their artifacts:
      - **data-model.md**: Reuse existing entity definitions
      - **contracts/**: Understand existing API patterns
      - **plan.md**: Reference architecture decisions
   
   e. Ensure consistency with existing implementations:
      - Use same naming conventions
      - Follow established patterns
      - Extend rather than duplicate shared components

## Step 2: Create Plan Checkpoint

`docs/.checkpoints/{feature}/plan.md` 생성
`.cursor/templates/checkpoint-plan.md` 파일을 활용하여 내용을 채웁니다. **반드시 템플릿 파일에서 시작해야 합니다.**

**Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

**Check existing implementations**:
   - If similar technology decisions exist in other features, reference them
   - If shared infrastructure exists, plan to reuse rather than recreate

**Generate human-readable summary sections** (IMPORTANT for human reviewers):
   - **한줄 요약**: 기술적으로 무엇을 어떻게 구현하는지 한 문장으로 작성
   - **TL;DR 테이블**: 기술 스택, 아키텍처, 주요 컴포넌트, 예상 복잡도, 주의사항을 테이블로 정리
   - **아키텍처 개요 다이어그램**: Technical Context 기반으로 mermaid flowchart 생성
     ```mermaid
     flowchart TB
         subgraph client [Client Layer]
             UI[UI Components]
         end
         subgraph server [Server Layer]
             API[API Layer]
             Service[Service Layer]
             Data[Data Layer]
         end
         UI --> API
         API --> Service
         Service --> Data
     ```
   - **데이터 흐름 다이어그램**: 주요 시나리오의 데이터 흐름을 sequence diagram으로 생성
     ```mermaid
     sequenceDiagram
         participant User
         participant API
         participant Service
         participant DB
         User->>API: 요청
         API->>Service: 처리
         Service->>DB: 조회/저장
         DB-->>Service: 결과
         Service-->>API: 응답
         API-->>User: 결과
     ```



## Step 3: Run Clarify


이전 단계에서 모호함이 해결되었어도 최대한 재검토하여 모호함을 지워야 합니다.

`clarify` skill을 호출합니다.

```text
/clarify docs/.checkpoints/{feature}/plan.md
```

### 예상 질문들

```markdown
**기술 스택 선택**
**Recommended:** Option A - 프로젝트 요구사항에 가장 적합

| Option | Description |
|--------|-------------|
| A | React + TypeScript + Vite |
| B | Next.js + TypeScript |
| C | Vue + TypeScript |

---

**데이터베이스 선택**
**Recommended:** Option B - 관계형 데이터에 적합, 확장성 우수

| Option | Description |
|--------|-------------|
| A | MongoDB (NoSQL) |
| B | PostgreSQL (RDBMS) |
| C | MySQL (RDBMS) |

---

**인증 방식**
**Recommended:** Option A - stateless, 확장 용이

| Option | Description |
|--------|-------------|
| A | JWT + Refresh Token |
| B | Session-based |
| C | OAuth only |
```

## Step 4: Document Technical Decisions

clarify 완료 후 기술 결정을 정리합니다.

```markdown
## Content

### Architecture Overview
{전체 아키텍처 다이어그램 또는 설명}

### Technology Stack
| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | React + TypeScript | 타입 안정성, 생태계 |
| Backend | Node.js + Express | 빠른 개발, JS 통합 |
| Database | PostgreSQL | ACID, 관계형 데이터 |
| Auth | JWT | Stateless, 확장성 |

### Component Design
- Component A: {역할}
- Component B: {역할}

### Data Model
{엔티티 관계 다이어그램 또는 설명}

### File Structure
```
src/
├── components/
├── hooks/
├── services/
├── types/
└── utils/
```

### Technical Decisions
| Decision | Options | Selected | Reason |
|----------|---------|----------|--------|
| Auth | JWT vs Session | JWT | Stateless |
| DB | Postgres vs Mongo | Postgres | ACID |
```

## Step 5: Completion Message

**사용자에게 A(yes), B(no), C(other...)로 질문을 출력합니다.**

```markdown
## Plan 완료

**체크포인트**: `docs/.checkpoints/auth-login-plan.md`
**상태**: Ready

### Coverage Summary
| Category | Status |
|----------|--------|
| Domain & Data Model | Clear |
| Non-Functional | Clear |
| Constraints | Clear |
| ... | ... |

### Technical Decisions (4)
- Auth: JWT + Refresh Token
- Database: PostgreSQL
- Frontend: React + TypeScript
- API: REST

---

**다음 단계**: /task - 태스크 분리

| Option | Action |
|--------|--------|
| yes | /task 바로 실행 |
| no | 대기 (나중에 수동 실행) |

Reply: yes, no, or another command
```

## Step 6: Next Stage Transition

사용자 응답에 따라:
- `yes` → /task skill 자동 실행
- `no` → 대기
- 다른 명령 → 해당 명령 실행

## Output

- 생성: `docs/.checkpoints/{feature}/plan.md`
- 상태: Ready
- 다음 단계: /task 추천

## Error Handling

- specify 체크포인트 없음 → `/specify` 먼저 실행 안내
- specify status가 ready가 아님 → `/specify` 완료 필요 안내
- 기술 결정 충돌 → 추가 clarify 질문

## Integration

```
/specify (완료) 
    ↓
/plan (현재)
    ├── specify 체크포인트 참조
    ├── clarify 호출
    └── plan 체크포인트 생성
    ↓
/task (다음)
```
