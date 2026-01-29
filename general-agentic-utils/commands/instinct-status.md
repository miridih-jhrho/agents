---
name: instinct-status
description: 학습된 instinct 목록과 신뢰도 표시
---

# /instinct-status

학습된 모든 instinct와 신뢰도를 표시합니다.

## 실행 절차

### Step 1: Instinct 파일 탐색

```bash
ls -la .cursor/instincts/**/*.md
```

### Step 2: Instinct 목록 생성

```markdown
# Instinct 현황

## 신뢰도 높음 (0.7+)

| ID | 트리거 | 신뢰도 | 도메인 |
|----|--------|--------|--------|
| always-test-first | 새 기능 구현 시 | 0.9 | testing |
| prefer-functional | 함수 작성 시 | 0.8 | code-style |

## 신뢰도 보통 (0.5-0.7)

| ID | 트리거 | 신뢰도 | 도메인 |
|----|--------|--------|--------|
| use-zod-validation | API 입력 처리 시 | 0.6 | validation |

## 신뢰도 낮음 (< 0.5)

| ID | 트리거 | 신뢰도 | 도메인 |
|----|--------|--------|--------|
| avoid-any-type | 타입 정의 시 | 0.4 | code-style |

---
총: 4개 instinct
진화 가능: 2개 (신뢰도 0.8+ 클러스터)
```

### Step 3: 추가 작업 제안 (AskQuestion)

```markdown
질문: "추가 작업을 수행할까요?"

옵션:
1. 상세 보기 (특정 instinct)
2. /evolve 실행 (진화 가능한 instinct)
3. 낮은 신뢰도 정리
4. 완료
```

## 연동 스킬

- `continuous-learning` - instinct 관리 상세

## 연동 커맨드

- `/evolve` - instinct를 skill/command로 진화
- `/learn` - 수동 instinct 생성
