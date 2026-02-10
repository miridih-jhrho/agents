---
name: checkpoint
description: 현재 검증 상태 저장 (연속 검증용)
---

# /checkpoint

현재 검증 상태를 저장하여 나중에 이어서 검증할 수 있도록 합니다.

## 사용 시나리오

1. 긴 세션에서 주기적 검증
2. 작업 중간에 품질 확인
3. PR 전 단계별 검증

## 실행 절차

### Step 1: 현재 상태 수집

```bash
# 빠른 검증 실행
npm run build && npx tsc --noEmit
```

### Step 2: 체크포인트 저장 (AskQuestion)

```markdown
질문: "체크포인트를 저장할까요?"

현재 상태:
- Build: PASS
- Types: PASS
- 마지막 검증: 2026-01-29 17:00
- 이후 변경: 3 files

옵션:
1. 예, 체크포인트 저장
2. 전체 검증 실행 (/verify)
3. 취소
```

### Step 3: 체크포인트 파일 생성

```json
// .cursor/tmp/checkpoint.json
{
  "timestamp": "2026-01-29T17:00:00Z",
  "phases": {
    "build": { "status": "pass", "timestamp": "..." },
    "types": { "status": "pass", "errors": 0 },
    "lint": { "status": "pending" },
    "tests": { "status": "pending" },
    "security": { "status": "pending" },
    "diff": { "files_changed": 3 }
  },
  "files_since_last": [
    "src/utils.ts",
    "src/api.ts",
    "tests/utils.test.ts"
  ]
}
```

### Step 4: 확인

```markdown
✅ **체크포인트 저장됨**

상태: Build ✓ Types ✓ (나머지 미검증)
변경 파일: 3개
다음 검증 권장: Lint, Tests

`/verify`로 전체 검증을 실행하거나
계속 작업 후 다시 `/checkpoint`하세요.
```

## 체크포인트 복원

다음 `/verify` 실행 시:

```markdown
질문: "이전 체크포인트가 있습니다"

저장 시간: 2026-01-29 17:00
검증 완료: Build, Types
미검증: Lint, Tests, Security

옵션:
1. 미검증 단계만 실행
2. 전체 다시 검증
3. 체크포인트 무시
```

## 연동 스킬

- `verification-loop` - 검증 로직 상세

## 연동 커맨드

- `/verify` - 전체 검증 실행
