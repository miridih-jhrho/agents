#!/usr/bin/env node
/**
 * Session Start Hook
 * 
 * 세션 시작 시 실행:
 * 1. 이전 컨텍스트 파일 탐색
 * 2. 복원 가능 상태 출력
 * 
 * hooks.json의 sessionStart에서 호출됨
 */

const path = require('path');

// lib/utils.js 로드 (상대 경로)
const utilsPath = path.join(__dirname, '..', 'lib', 'utils.js');
let utils;

try {
  utils = require(utilsPath);
} catch (e) {
  // utils 로드 실패 시 기본 동작
  console.log('[session-start] Utils not found, skipping');
  process.exit(0);
}

function main() {
  try {
    const projectRoot = utils.findProjectRoot();
    const contextFiles = utils.listContextFiles(projectRoot);
    
    if (contextFiles.length === 0) {
      console.log('[session-start] No previous context found');
      return;
    }
    
    const latest = contextFiles[0];
    const content = utils.readFileSafe(latest.path, '');
    
    // 메타데이터 추출
    const savedMatch = content.match(/saved:\s*(.+)/);
    const projectMatch = content.match(/project:\s*(.+)/);
    const phaseMatch = content.match(/phase:\s*(.+)/);
    
    console.log('[session-start] Previous context available');
    console.log(`  File: ${latest.name}`);
    console.log(`  Saved: ${savedMatch ? savedMatch[1] : 'unknown'}`);
    console.log(`  Project: ${projectMatch ? projectMatch[1] : 'unknown'}`);
    console.log(`  Phase: ${phaseMatch ? phaseMatch[1] : 'unknown'}`);
    console.log(`  Total contexts: ${contextFiles.length}`);
    console.log('');
    console.log('Use /context-restore to restore previous session');
    
  } catch (e) {
    console.error('[session-start] Error:', e.message);
  }
}

main();
