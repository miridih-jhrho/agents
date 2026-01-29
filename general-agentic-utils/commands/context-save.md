---
name: context-save
description: 현재 세션 컨텍스트를 파일로 저장
---

# /context-save

현재 세션의 컨텍스트를 `.cursor/tmp/context-{timestamp}.md` 파일로 저장합니다.

## 실행 절차

### Step 1: 작업 요약 작성

다음 내용을 **Agent가 직접 작성**합니다:

```markdown
## 작업 요약
- 완료한 작업들
- 현재 진행 중인 작업

## 다음 단계
- [ ] 남은 태스크 1
- [ ] 남은 태스크 2

## 메모
- 중요한 결정 사항
- 주의할 점
```

### Step 2: Git 상태 수집

```bash
git status --short
git diff --stat
```

### Step 3: 컨텍스트 파일 생성

파일 경로: `.cursor/tmp/context-{YYYYMMDD-HHMMSS}.md`

```markdown
---
saved: {ISO 날짜}
session_id: {timestamp}
project: {프로젝트명}
phase: {exploration|implementation|review}
---

# 세션 컨텍스트

{작업 요약}

{다음 단계}

{메모}

## Git 상태
{git status}

## 변경 사항
{git diff --stat}
```

### Step 4: 저장 확인

```
✅ 컨텍스트 저장 완료
📁 파일: .cursor/tmp/context-20260129-170000.md
```

## AskQuestion 사용

저장 전 확인이 필요한 경우:

```markdown
질문: "컨텍스트를 저장할까요?"

옵션:
1. 예, 지금 저장
2. 작업 완료 후 저장
3. 저장하지 않음
```

## 연동 스킬

- `memory-persistence` - 저장 로직 상세
- `strategic-compact` - 압축 전 자동 저장
