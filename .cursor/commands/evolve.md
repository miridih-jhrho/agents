---
name: evolve
description: 관련 instinct들을 skill/command/agent로 진화
---

# /evolve

관련 instinct들을 클러스터링하여 skill, command, 또는 agent로 진화시킵니다.

## 실행 절차

### Step 1: 진화 가능한 클러스터 탐색

진화 조건:
- 같은 도메인의 instinct 3개 이상
- 평균 신뢰도 0.7 이상

```markdown
## 발견된 클러스터

### 1. testing-workflow (진화 가능)
- always-test-first (0.9)
- mock-external-deps (0.8)
- coverage-80-percent (0.7)
평균 신뢰도: 0.8

### 2. code-style (진화 대기)
- prefer-functional (0.8)
- avoid-any-type (0.4)
평균 신뢰도: 0.6 (기준 미달)
```

### Step 2: 진화 대상 선택 (AskQuestion 필수)

```markdown
질문: "어떤 클러스터를 진화시킬까요?"

옵션:
1. testing-workflow → skill로 진화
2. testing-workflow → command로 진화
3. testing-workflow → agent로 진화
4. 모든 가능한 클러스터 진화
5. 취소
```

### Step 3: 진화 유형 결정 (AskQuestion)

```markdown
질문: "testing-workflow를 어떤 형태로 진화시킬까요?"

설명: |
  포함 instinct:
  - always-test-first: "새 기능은 테스트 먼저 작성"
  - mock-external-deps: "외부 의존성은 모킹"
  - coverage-80-percent: "80% 커버리지 목표"

옵션:
1. Skill - 워크플로우 가이드 (SKILL.md)
2. Command - 슬래시 커맨드 (/tdd)
3. Agent - 전문 서브에이전트 (test-specialist)
```

### Step 4: 진화 실행

선택에 따라 파일 생성:

**Skill로 진화:**
```
.cursor/evolved/skills/testing-workflow/SKILL.md
```

**Command로 진화:**
```
.cursor/evolved/commands/tdd.md
```

**Agent로 진화:**
```
.cursor/evolved/agents/test-specialist.md
```

### Step 5: 결과 보고

```markdown
✅ **진화 완료**

생성됨: .cursor/evolved/skills/testing-workflow/SKILL.md

포함된 instinct:
- always-test-first (0.9) → 통합됨
- mock-external-deps (0.8) → 통합됨
- coverage-80-percent (0.7) → 통합됨

원본 instinct는 유지됩니다 (신뢰도 기록용).
```

## 연동 스킬

- `continuous-learning` - instinct 및 진화 상세

## 연동 커맨드

- `/instinct-status` - instinct 현황 확인
- `/learn` - 수동 instinct 생성
