---
name: learn
description: 수동으로 패턴을 instinct로 저장
---

# /learn

현재 세션에서 발견한 패턴을 수동으로 instinct로 저장합니다.

## 실행 절차

### Step 1: 패턴 정보 수집 (AskQuestion 필수)

```markdown
질문: "어떤 패턴을 저장할까요?"

입력 필요:
- 트리거: 언제 이 패턴을 적용해야 하나요?
- 액션: 무엇을 해야 하나요?
- 도메인: 어떤 영역인가요?

옵션:
1. 현재 작업에서 패턴 추출 (자동 분석)
2. 직접 입력
3. 취소
```

### Step 2: 패턴 상세 입력 (직접 입력 시)

```markdown
질문: "패턴 상세 정보를 입력하세요"

## 트리거
예: "새 API 엔드포인트 작성 시"

## 액션
예: "Zod 스키마로 입력 검증 추가"

## 도메인
옵션:
1. code-style
2. testing
3. validation
4. git
5. debugging
6. workflow
7. 기타 (직접 입력)
```

### Step 3: 초기 신뢰도 설정 (AskQuestion)

```markdown
질문: "이 패턴의 확신도는 어느 정도인가요?"

옵션:
1. 0.3 (임시 - 아직 확실하지 않음)
2. 0.5 (보통 - 몇 번 적용해봄)
3. 0.7 (강함 - 항상 이렇게 함)
```

### Step 4: Instinct 파일 생성

```yaml
---
id: use-zod-for-api-input
trigger: "새 API 엔드포인트 작성 시"
confidence: 0.5
domain: "validation"
source: "manual"
created: "2026-01-29"
evidence_count: 1
---

# Use Zod for API Input

## 액션
Zod 스키마로 입력 검증 추가

## 증거
- 2026-01-29 수동 생성

## 적용 조건
- API 엔드포인트에 사용자 입력이 있을 때
```

저장 위치: `.cursor/instincts/{domain}/{id}.md`

### Step 5: 확인

```markdown
✅ **Instinct 생성 완료**

ID: use-zod-for-api-input
도메인: validation
신뢰도: 0.5
파일: .cursor/instincts/validation/use-zod-for-api-input.md

이 패턴이 관찰되면 신뢰도가 자동으로 증가합니다.
```

## 자동 추출 모드

"현재 작업에서 패턴 추출" 선택 시:

1. 최근 도구 사용 기록 분석
2. 반복 패턴 식별
3. 후보 패턴 제시 (AskQuestion)
4. 선택된 패턴 저장

## 연동 스킬

- `continuous-learning` - instinct 관리 상세

## 연동 커맨드

- `/instinct-status` - instinct 현황 확인
- `/evolve` - instinct를 skill/command로 진화
