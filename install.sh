#!/bin/bash
#
# agents 설치 스크립트
# .cursor 디렉토리를 대상 프로젝트로 복사합니다.
#

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 스크립트 위치 (agents 리포지토리 루트)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_CURSOR="${SCRIPT_DIR}/.cursor"

# 사용법 출력
usage() {
    echo "Usage: $0 [OPTIONS] [TARGET_DIR]"
    echo ""
    echo "OPTIONS:"
    echo "  -b, --backup     기존 .cursor 디렉토리 백업"
    echo "  -f, --force      확인 없이 덮어쓰기"
    echo "  -h, --help       도움말 출력"
    echo ""
    echo "TARGET_DIR:"
    echo "  설치할 프로젝트 디렉토리 (기본값: 현재 디렉토리)"
    echo ""
    echo "예시:"
    echo "  $0                      # 현재 디렉토리에 설치"
    echo "  $0 /path/to/project     # 지정 디렉토리에 설치"
    echo "  $0 -b /path/to/project  # 백업 후 설치"
}

# 로그 함수
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 옵션 파싱
BACKUP=false
FORCE=false
TARGET_DIR=""

while [[ $# -gt 0 ]]; do
    case $1 in
        -b|--backup)
            BACKUP=true
            shift
            ;;
        -f|--force)
            FORCE=true
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        -*)
            log_error "알 수 없는 옵션: $1"
            usage
            exit 1
            ;;
        *)
            TARGET_DIR="$1"
            shift
            ;;
    esac
done

# 대상 디렉토리 설정
if [[ -z "$TARGET_DIR" ]]; then
    TARGET_DIR="$(pwd)"
fi

# 절대 경로로 변환
TARGET_DIR="$(cd "$TARGET_DIR" 2>/dev/null && pwd)" || {
    log_error "대상 디렉토리가 존재하지 않습니다: $TARGET_DIR"
    exit 1
}

TARGET_CURSOR="${TARGET_DIR}/.cursor"

# 자기 자신에게 설치하는 것 방지
if [[ "$TARGET_DIR" == "$SCRIPT_DIR" ]]; then
    log_error "agents 리포지토리 자체에는 설치할 수 없습니다."
    exit 1
fi

# 소스 디렉토리 확인
if [[ ! -d "$SOURCE_CURSOR" ]]; then
    log_error "소스 .cursor 디렉토리를 찾을 수 없습니다: $SOURCE_CURSOR"
    exit 1
fi

echo ""
echo "======================================"
echo "  Agents 설치 스크립트"
echo "======================================"
echo ""
echo "소스: $SOURCE_CURSOR"
echo "대상: $TARGET_CURSOR"
echo ""

# 기존 .cursor 디렉토리 처리
if [[ -d "$TARGET_CURSOR" ]]; then
    if [[ "$BACKUP" == true ]]; then
        BACKUP_DIR="${TARGET_CURSOR}.backup.$(date +%Y%m%d_%H%M%S)"
        log_info "기존 .cursor 백업 중: $BACKUP_DIR"
        mv "$TARGET_CURSOR" "$BACKUP_DIR"
    elif [[ "$FORCE" == false ]]; then
        log_warn "대상에 .cursor 디렉토리가 이미 존재합니다."
        read -p "덮어쓰시겠습니까? (y/N): " confirm
        if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
            log_info "설치가 취소되었습니다."
            exit 0
        fi
    fi
fi

# 복사할 디렉토리/파일 목록 (tmp 제외)
COPY_ITEMS=(
    "agents"
    "commands"
    "hooks"
    "hooks.json"
    "lib"
    "rules"
    "skills"
    "templates"
)

# 대상 디렉토리 생성
mkdir -p "$TARGET_CURSOR"

# 파일 복사
log_info "파일 복사 중..."

for item in "${COPY_ITEMS[@]}"; do
    src="${SOURCE_CURSOR}/${item}"
    if [[ -e "$src" ]]; then
        if [[ -d "$src" ]]; then
            # 디렉토리: 기존 내용 삭제 후 복사
            rm -rf "${TARGET_CURSOR}/${item}"
            cp -r "$src" "${TARGET_CURSOR}/"
            log_info "  복사됨: ${item}/"
        else
            # 파일 복사
            cp "$src" "${TARGET_CURSOR}/"
            log_info "  복사됨: ${item}"
        fi
    fi
done

# tmp 디렉토리 생성 (비어있는 상태로)
mkdir -p "${TARGET_CURSOR}/tmp"
log_info "  생성됨: tmp/ (빈 디렉토리)"

echo ""
log_info "설치 완료!"
echo ""
echo "설치된 구성요소:"
echo "  - agents/      : 서브에이전트 정의"
echo "  - commands/    : 커스텀 명령어"
echo "  - hooks/       : 자동화 훅"
echo "  - lib/         : 유틸리티"
echo "  - rules/       : 워크플로우 규칙"
echo "  - skills/      : AI 스킬"
echo "  - templates/   : 문서 템플릿"
echo ""
