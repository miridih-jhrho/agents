---
name: strategic-compact
description: 전략적 시점에 컨텍스트 압축을 제안합니다. 도구 호출이 20회 이상이거나, 탐색에서 구현으로 전환할 때, 또는 컨텍스트 윈도우가 부족할 때 사용합니다. 사용자가 "압축", "compact", "정리" 등을 언급할 때 사용합니다.
---

# Strategic Compact

## When to Use

- 도구 호출 20회 이상 시
- 탐색(Exploration) → 구현(Implementation) 전환 시
- 디버깅 완료 후 다음 작업 전
- ctx_window 잔여 토큰 70,000 이하 시
- 사용자가 "압축", "compact" 언급 시
- 긴 대화 후 새로운 주제 시작 전

## 압축 제안 조건

| 카운트 | 행동 |
|--------|------|
| 0-20 | 정상 진행 |
| 20 | 💡 첫 번째 제안 |
| 30, 40, ... | 📢 10회마다 리마인더 |
| 50+ | 🚨 강력 권장 |

## 압축 절차

1. **AskQuestion** - 압축 여부 확인
2. memory-persistence로 컨텍스트 저장
3. `/compact` 실행
4. 필요시 컨텍스트 복원

## AskQuestion 필수 상황

- 임계값 도달 시 → 압축 진행 여부
- Phase 전환 시 (탐색→구현) → 압축 권장
- 즉시 압축 권장 시 → 위험 안내

## Phase 전환 신호

- Exploration → Implementation: "구현하자", 파일 생성 시작
- Implementation → Review: "/verify", "리뷰", "PR"

## 연동

- Hook: `strategic-compact.js`, `pre-compact.js`
- Skill: `memory-persistence` (저장 후 압축)
