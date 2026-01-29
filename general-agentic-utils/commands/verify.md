---
name: verify
description: 종합 검증 루프 실행 (Build/Types/Lint/Tests/Security/Diff)
---

# /verify

6단계 종합 검증 루프를 실행합니다.

## 실행 절차

### Step 1: 검증 범위 선택 (AskQuestion)

```markdown
질문: "어떤 검증을 실행할까요?"

옵션:
1. 전체 검증 (6단계 모두)
2. 빠른 검증 (Build + Types만)
3. 특정 단계만 선택
4. 취소
```

### Step 2: 6단계 검증 실행

```
Phase 1: BUILD
━━━━━━━━━━━━━━━
npm run build
→ [PASS/FAIL]

Phase 2: TYPES
━━━━━━━━━━━━━━━
npx tsc --noEmit
→ [PASS/FAIL] (X errors)

Phase 3: LINT
━━━━━━━━━━━━━━━
npm run lint
→ [PASS/FAIL] (X warnings)

Phase 4: TESTS
━━━━━━━━━━━━━━━
npm run test -- --coverage
→ [PASS/FAIL] (X/Y passed, Z% coverage)

Phase 5: SECURITY
━━━━━━━━━━━━━━━
rg -n "sk-|api_key|password" ...
→ [PASS/FAIL] (X issues)

Phase 6: DIFF
━━━━━━━━━━━━━━━
git diff --stat
→ [X files changed]
```

### Step 3: 실패 시 대응 (AskQuestion)

**BUILD 실패:**
```markdown
질문: "🛑 빌드 실패. 어떻게 처리할까요?"

옵션:
1. 에러 수정 후 재시도
2. 에러 상세 보기
3. 검증 중단
```

**TYPES/LINT 실패:**
```markdown
질문: "타입/린트 에러가 발견되었습니다"

옵션:
1. 모두 수정
2. 자동 수정 가능한 것만 (lint --fix)
3. 무시하고 계속 (위험)
```

**TESTS 실패:**
```markdown
질문: "테스트 실패가 발견되었습니다"

옵션:
1. 실패한 테스트 수정
2. test-agent 호출하여 분석
3. 테스트 케이스 확인
```

### Step 4: 결과 리포트

```
VERIFICATION REPORT
==================

Build:     PASS
Types:     PASS (0 errors)
Lint:      PASS (2 warnings)
Tests:     PASS (45/45 passed, 82% coverage)
Security:  PASS (0 issues)
Diff:      5 files changed

Overall:   ✅ READY for PR
```

## 연동 스킬

- `verification-loop` - 검증 로직 상세

## 연동 커맨드

- `/checkpoint` - 검증 상태 저장
