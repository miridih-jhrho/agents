---
name: continuous-learning
description: 세션 활동에서 패턴을 감지하여 Instinct로 학습합니다. 에러를 해결했거나, 사용자가 Agent 제안을 수정했거나, 동일 패턴이 반복될 때 사용합니다. 사용자가 "학습", "패턴", "instinct" 등을 언급할 때 사용합니다.
---

# Continuous Learning

## When to Use

- 에러 해결 후 (error_resolution 패턴)
- 사용자가 Agent 제안을 수정했을 때 (user_correction 패턴)
- 동일 작업 패턴 3회 이상 반복 시 (repeated_workflow 패턴)
- `/instinct-status`, `/evolve`, `/learn` 커맨드 실행 시
- 세션 종료 시 (자동 분석)
- 사용자가 "학습", "패턴", "instinct" 언급 시

## Instinct 모델

```yaml
---
id: prefer-functional-style
trigger: "새 함수 작성 시"
confidence: 0.7
domain: "code-style"
---

# Prefer Functional Style

## 액션
클래스보다 함수형 패턴 선호

## 증거
- 5회 함수형 패턴 선호 관찰
```

## 신뢰도

| 점수 | 의미 | 동작 |
|------|------|------|
| 0.3 | 임시 | AskQuestion 필수 |
| 0.5 | 보통 | AskQuestion 권장 |
| 0.7 | 강함 | 자동 적용 |
| 0.9 | 확실 | 항상 적용 |

## 패턴 감지 유형

- **error_resolution**: 에러 → 수정 → 성공
- **user_correction**: Agent 제안 → 사용자 수정
- **repeated_workflow**: 동일 패턴 3회 이상

## AskQuestion 필수 상황

- instinct 생성 시 → 저장 여부 확인
- 신뢰도 < 0.7 적용 시 → 적용 여부 확인
- `/evolve` 시 → 진화 대상/유형 선택

## 파일 구조

```
.cursor/
├── tmp/observations.jsonl
├── instincts/{domain}/{id}.md
└── evolved/{agents,skills,commands}/
```

## Observer Agent 호출

복잡한 패턴 분석이 필요할 때 observer-agent를 호출합니다.

### 호출 시점

- observations.jsonl이 20개 이상 쌓였을 때
- 세션 종료 시 자동 분석
- `/learn` 커맨드로 수동 분석 요청 시

### 호출 방법

```markdown
Task(
  subagent_type="generalPurpose",
  model="fast",
  prompt="""
  Observer Agent로 관찰 데이터를 분석하세요.
  
  입력:
  - observations 파일: .cursor/tmp/observations.jsonl
  - instincts 디렉토리: .cursor/instincts/
  
  절차:
  1. observations.jsonl 읽기
  2. 패턴 분석 (error_resolution, user_correction, repeated_workflow)
  3. instinct 후보 생성
  4. AskQuestion으로 사용자 확인
  5. 승인된 instinct 저장
  """
)
```

## 설정

`config.json`에서 설정 조정 가능:
- `observation.capture_tools`: 관찰할 도구 목록
- `instincts.min_confidence`: 최소 신뢰도
- `observer.min_observations`: 분석 시작 최소 관찰 수

## 연동

- Hook: `observe.js`, `analyze-observations.js`
- Command: `/instinct-status`, `/evolve`, `/learn`
- Agent: `observer-agent` (복잡한 패턴 분석)
