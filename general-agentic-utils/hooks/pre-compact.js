#!/usr/bin/env node
/**
 * Pre-Compact Hook
 * 
 * 컨텍스트 압축 전 실행:
 * 1. 현재 상태 스냅샷
 * 2. 컨텍스트 파일 생성
 * 3. 압축 로그 기록
 * 
 * hooks.json의 preCompact에서 호출됨
 */

const path = require('path');

// lib/utils.js 로드
const utilsPath = path.join(__dirname, '..', 'lib', 'utils.js');
let utils;

try {
  utils = require(utilsPath);
} catch (e) {
  console.log('[pre-compact] Utils not found, skipping');
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
phase: pre-compact
trigger: compaction
---

# Pre-Compact 스냅샷

## 압축 전 상태

이 파일은 컨텍스트 압축 직전에 자동 생성되었습니다.
압축 후 컨텍스트 복원이 필요하면 이 파일을 참조하세요.

## 작업 요약

<!-- 압축 전 상태 - Agent가 채워야 함 -->

## 다음 단계

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
    
    // 압축 로그 기록
    const logPath = path.join(utils.getTmpDir(projectRoot), 'sessions', 'compaction-log.txt');
    const logEntry = `${isoDate} - Pre-compact snapshot: context-${timestamp}.md\n`;
    
    const fs = require('fs');
    const logDir = path.dirname(logPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    fs.appendFileSync(logPath, logEntry);
    
    console.log('[pre-compact] Snapshot saved');
    console.log(`  File: context-${timestamp}.md`);
    console.log('  Compaction log updated');
    
  } catch (e) {
    console.error('[pre-compact] Error:', e.message);
  }
}

main();
