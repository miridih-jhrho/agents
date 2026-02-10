# Agents

Cursor AI 에이전트를 위한 워크플로우, 스킬, 에이전트 설정 모음입니다.

## sdd-orchestration/

**Spec-Driven Development (SDD) Orchestration** — 명세 기반 개발 워크플로우를 정의합니다.

기능 개발 시 `명세화 → 설계 → 태스크 → 구현 → 검증 → 명세 동기화` 흐름을 따르며, 각 단계에서 Clarify 프로세스를 거쳐 모호한 부분을 사전에 해소합니다.

```
/specify → /plan → /task → /implement → /verify → /spec-update
                                            ↓
                                        (실패 시)
                                         /revise ↔ /verify
```

### 폴더 구조

```
sdd-orchestration/
├── agents/                         # 서브 에이전트 정의
│   ├── review-agent.md             #   코드 리뷰 에이전트 (품질, 보안, 성능 검토)
│   └── test-agent.md               #   테스트 실행 및 커버리지 분석 에이전트
├── commands/                       # 사용자 명령어
│   ├── checkpoint.md               #   /checkpoint - 검증 상태 저장 (연속 검증용)
│   └── learn.md                    #   /learn - 패턴을 instinct로 수동 저장
├── references/                     # 참조 설정
│   ├── commit-convention.json      #   커밋 메시지 컨벤션 ({issue_number} {message})
│   └── parse-issue-number.sh       #   브랜치에서 이슈 번호 파싱 스크립트
├── rules/                          # Cursor 룰
│   └── sdd-orchestration.mdc       #   SDD 워크플로우 전체 규칙 (alwaysApply)
├── skills/                         # 각 단계별 스킬 정의
│   ├── clarify/                    #   모호성 탐지 및 질문 루프
│   │   ├── SKILL.md
│   │   └── taxonomy.json
│   ├── specify/SKILL.md            #   기능 명세화
│   ├── plan/SKILL.md               #   아키텍처 설계
│   ├── task/SKILL.md               #   태스크 분리
│   ├── implement/SKILL.md          #   코드 구현
│   ├── verify/SKILL.md             #   테스트/리뷰 검증
│   ├── revise/SKILL.md             #   이슈 수정
│   ├── spec-update/SKILL.md        #   명세 동기화
│   └── pr-description/             #   PR 설명 생성
│       ├── SKILL.md
│       └── template.md
└── templates/                      # 문서 템플릿
    ├── checkpoint-specify.md       #   명세 체크포인트
    ├── checkpoint-plan.md          #   설계 체크포인트
    ├── checkpoint-task.md          #   태스크 체크포인트
    ├── module-spec.md              #   최종 모듈 명세
    └── adr.md                      #   Architecture Decision Record
```

### 워크플로우 단계

| 명령어 | 역할 | 출력 |
|--------|------|------|
| `/specify` | 기능 명세화 | `docs/.checkpoints/{feature}/specify.md` |
| `/plan` | 아키텍처 설계 | `docs/.checkpoints/{feature}/plan.md` |
| `/task` | 태스크 분리 | `docs/.checkpoints/{feature}/task.md` |
| `/implement` | 코드 구현 | 코드 + 커밋 |
| `/verify` | 테스트/리뷰 | 검증 리포트 |
| `/revise` | 이슈 수정 | 수정된 코드 |
| `/spec-update` | 명세 동기화 | `docs/modules/`, `docs/decisions/` |

### 에이전트

| 에이전트 | 역할 | 모델 | 호출 시점 |
|----------|------|------|----------|
| `review-agent` | 코드 품질, 보안, 성능 검토 | inherit | 코드 작업 완료 시 |
| `test-agent` | 테스트 실행, 커버리지 분석 | fast | 코드 작업 완료 시 |

### 핵심 원칙

- **Clarify 필수**: 모든 단계에서 모호한 부분을 사전 질문으로 해소 (10개 카테고리 Ambiguity Scan)
- **작업 리뷰**: 완료 시 사용자에게 변경사항 제시 → 승인 후 다음 단계 진행
- **문서 기반**: 임시 체크포인트(`docs/.checkpoints/`)로 작업, 완료 시 최종 문서(`docs/modules/`, `docs/decisions/`)로 통합
- **커밋 컨벤션**: `{이슈번호} {메시지}` 형식, 브랜치에서 이슈번호 자동 파싱
