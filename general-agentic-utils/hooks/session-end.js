#!/usr/bin/env node
/**
 * Session End Hook
 * 
 * 세션 종료 시 실행:
 * 1. Git 상태 수집
 * 2. 컨텍스트 파일 생성 (기본 템플릿)
 * 3. 오래된 파일 정리
 * 
 * hooks.json의 sessionEnd 또는 stop에서 호출됨
 */

const path = require('path');

// lib/utils.js 로드
const utilsPath = path.join(__dirname, '..', 'lib', 'utils.js');
let utils;

try {
  utils = require(utilsPath);
} catch (e) {
  console.log('[session-end] Utils not found, skipping');
  process.exit(0);
}

function main() {
  try {
    const projectRoot = utils.findProjectRoot();
    const timestamp = utils.getTimestamp();
    const isoDate = utils.getISODate();
    const projectName = utils.getProjectName(projectRoot);
    
    // Git 정보 수집
    const gitStatus = utils.getGitStatus(projectRoot);
    const gitDiffStat = utils.getGitDiffStat(projectRoot);
    
    // 컨텍스트 파일 내용 생성
    const content = `---
saved: ${isoDate}
session_id: ${timestamp}
project: ${projectName}
phase: unknown
---

# 세션 컨텍스트

## 작업 요약

<!-- Agent가 채워야 함 -->

## 다음 단계

<!-- Agent가 채워야 함 -->

## 메모

<!-- Agent가 채워야 함 -->

## Git 상태

\`\`\`
${gitStatus || '(변경 없음)'}
\`\`\`

## 변경 사항

\`\`\`
${gitDiffStat || '(변경 없음)'}
\`\`\`
`;

    // 파일 저장
    const contextPath = path.join(utils.getTmpDir(projectRoot), `context-${timestamp}.md`);
    utils.writeFile(contextPath, content);
    
    console.log('[session-end] Context saved');
    console.log(`  File: context-${timestamp}.md`);
    
    // 오래된 파일 정리 (최근 10개 유지)
    const deleted = utils.cleanupContextFiles(10, projectRoot);
    if (deleted > 0) {
      console.log(`  Cleaned up: ${deleted} old context files`);
    }
    
  } catch (e) {
    console.error('[session-end] Error:', e.message);
  }
}

main();
