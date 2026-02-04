---
name: memory-persistence
description: 세션 컨텍스트를 저장하고 복원합니다. 새 세션 시작 시 이전 작업을 이어가거나, 세션 종료 전 현재 상태를 저장할 때 사용합니다. 사용자가 "이어서", "계속", "어디까지 했지", "복원" 등을 언급할 때 사용합니다.
---

# Memory Persistence

## When to Use

- 새 세션 시작 시 (이전 컨텍스트 복원)
- 세션 종료/중단 전 (현재 상태 저장)
- 사용자가 "이어서", "계속", "어디까지 했지", "복원" 언급 시
- 장시간 작업 중간에 상태 보존 필요 시
- `/context-save`, `/context-restore` 커맨드 실행 시

## 저장 (SAVE)

1. 작업 요약 작성 (Agent가 직접 작성)
2. Git 상태 수집: `git status --short && git diff --stat`
3. 파일 생성: `.cursor/tmp/context-{YYYYMMDD-HHMMSS}.md`
4. 저장 확인 메시지 출력

## 복원 (RESTORE)

1. 파일 탐색: `ls .cursor/tmp/context-*.md`
2. **AskQuestion 필수** - 여러 파일 시 선택 요청
3. 선택된 파일 읽기
4. 상태 보고 및 이어서 진행 여부 확인

## AskQuestion 필수 상황

- 컨텍스트 파일이 여러 개일 때 → 복원 대상 선택
- 저장 시점이 불명확할 때 → 저장 여부 확인
- 복원 후 → 이어서 진행할지 확인

## 컨텍스트 파일 형식

```markdown
---
saved: {ISO 날짜}
session_id: {timestamp}
project: {프로젝트명}
phase: {exploration|implementation|review}
---

# 세션 컨텍스트

## 작업 요약
## 다음 단계
## 메모
## Git 상태
## 변경 사항
```

## 연동

- Hook: `session-start.js`, `session-end.js`
- Command: `/context-save`, `/context-restore`
