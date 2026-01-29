---
name: verification-loop
description: Build, Types, Lint, Tests, Security, Diff 6단계로 코드를 종합 검증합니다. 기능 구현 완료 후, 코드 수정 후, PR 생성 전, 또는 리팩토링 후에 사용합니다. 사용자가 "검증", "체크", "확인해줘", "PR 준비" 등을 언급할 때 사용합니다.
---

# Verification Loop

## When to Use

- 기능 구현 완료 후
- PR 생성 전
- 리팩토링 완료 후
- `/verify`, `/checkpoint` 커맨드 실행 시
- "검증", "체크", "확인해줘" 키워드 시
- git commit 전
- 테스트 실패 분석 필요 시

## 검증 흐름

```
BUILD ──FAIL──→ 🛑 중단
  │PASS
TYPES ──FAIL──→ AskQuestion
  │PASS
LINT ──FAIL──→ AskQuestion (자동 수정?)
  │PASS
TESTS ──FAIL──→ 🛑 중단
  │PASS
SECURITY ──FAIL──→ 🛑 중단
  │PASS
DIFF ──→ 리뷰
  │OK
✅ READY
```

## 각 단계 명령어

```bash
# BUILD
npm run build

# TYPES
npx tsc --noEmit

# LINT
npm run lint

# TESTS (목표: 80% 커버리지)
npm run test -- --coverage

# SECURITY
rg -n "sk-|api_key|password" --type ts --type js .
rg -n "console\.log" src/

# DIFF
git diff --stat
```

## AskQuestion 필수 상황

- 타입 에러 시 → 수정 범위 결정
- 린트 에러 시 → 자동 수정 여부
- 테스트 실패 시 → 수정 vs test-agent 호출
- 커버리지 부족 시 → 테스트 추가 여부
- 보안 이슈 시 → 대응 방향

## 출력 형식

```
VERIFICATION REPORT
==================
Build:     [PASS/FAIL]
Types:     [PASS/FAIL] (X errors)
Lint:      [PASS/FAIL] (X warnings)
Tests:     [PASS/FAIL] (X/Y, Z%)
Security:  [PASS/FAIL]
Diff:      [X files]

Overall:   [READY/NOT READY]
```

## 연동

- Command: `/verify`, `/checkpoint`
- Agent: `test-agent`, `review-agent`
