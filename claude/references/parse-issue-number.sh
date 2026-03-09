#!/bin/bash
# 브랜치 이름에서 이슈 번호를 파싱하는 스크립트
# 브랜치 네이밍 컨벤션: feature/이슈번호[-설명] 또는 bugfix/이슈번호[-설명]
# 예: feature/UNICORN-66265-sdd -> UNICORN-66265
#     bugfix/BUG-123 -> BUG-123

BRANCH_NAME=$(git branch --show-current 2>/dev/null)

if [ -z "$BRANCH_NAME" ]; then
  echo ""
  exit 1
fi

# feature/ 또는 bugfix/ 접두사 제거 후 이슈 번호 추출
# 패턴: PREFIX/ISSUE-NUMBER[-optional-suffix]
# 이슈 번호는 대문자+숫자 형식 (예: UNICORN-66265, BUG-123)
ISSUE_NUMBER=$(echo "$BRANCH_NAME" | sed -E 's/^(feature|bugfix)\///' | grep -oE '^[A-Z]+-[0-9]+')

echo "$ISSUE_NUMBER"
