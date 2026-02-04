#!/usr/bin/env node
/**
 * Reset Strategic State Hook
 * 
 * 세션 시작 시 strategic-compact 상태 초기화
 * 
 * hooks.json의 sessionStart에서 호출됨
 */

const path = require('path');

// lib/utils.js 로드
const utilsPath = path.join(__dirname, '..', 'lib', 'utils.js');
let utils;

try {
  utils = require(utilsPath);
} catch (e) {
  process.exit(0);
}

function main() {
  try {
    const projectRoot = utils.findProjectRoot();
    const statePath = utils.getStrategicCompactStatePath(projectRoot);
    
    // 상태 초기화
    const initialState = {
      toolCallCount: 0,
      lastSuggestion: null,
      suppressUntilSessionEnd: false,
      phase: 'unknown',
      sessionStart: utils.getISODate()
    };
    
    utils.writeJson(statePath, initialState);
    
  } catch (e) {
    // 에러 시 조용히 종료
  }
}

main();
