---
name: context-restore
description: 이전 세션 컨텍스트 복원
---

# /context-restore

이전 세션의 컨텍스트를 복원합니다.

## 실행 절차

### Step 1: 컨텍스트 파일 탐색

```bash
ls -la .cursor/tmp/context-*.md
```

### Step 2: 복원 대상 선택 (AskQuestion 필수)

**⚠️ 파일이 여러 개일 경우 반드시 사용자에게 선택 요청:**

```markdown
질문: "복원할 컨텍스트를 선택하세요"

옵션:
1. context-20260129-170000.md (가장 최근, 1시간 전)
   - 작업: Strategic Compact 기능 구현
   - Phase: implementation
2. context-20260129-150000.md (3시간 전)
   - 작업: 스킬 문서 작성
   - Phase: exploration
3. context-20260128-180000.md (어제)
   - 작업: Hook 시스템 설계
   - Phase: planning
4. 복원하지 않고 새로 시작
```

### Step 3: 컨텍스트 읽기

선택된 파일에서 핵심 정보 추출:
- 현재 작업
- 진행 상황
- 다음 단계
- 메모

### Step 4: 상태 보고

```markdown
📂 **이전 세션 복원됨**

**마지막 저장**: 2026-01-29 17:00:00
**프로젝트**: cursor-flow
**Phase**: implementation

## 이전 작업
- Strategic Compact 기능 구현
- session-end.js 훅 개선

## 남은 태스크
- [ ] 테스트 검증
- [ ] 문서 업데이트

---
이어서 진행할까요?
```

## AskQuestion 사용

### 복원 확인

```markdown
질문: "이전 세션을 이어서 진행할까요?"

옵션:
1. 예, 다음 태스크부터 계속
2. 예, 처음부터 검토
3. 아니오, 새로 시작
```

## 연동 스킬

- `memory-persistence` - 복원 로직 상세

## 자동 트리거

다음 키워드 감지 시 자동 실행 제안:
- "이어서", "계속", "어디까지 했지", "복원"
