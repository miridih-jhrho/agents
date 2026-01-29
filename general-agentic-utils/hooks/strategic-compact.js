#!/usr/bin/env node
/**
 * Strategic Compact Hook
 * 
 * 파일 수정 도구 사용 시 실행:
 * 1. 도구 호출 카운트 증가
 * 2. 임계값 확인
 * 3. 압축 제안 출력
 * 
 * hooks.json의 preToolUse (Write/StrReplace/Edit) 또는 afterFileEdit에서 호출됨
 */

const path = require('path');

// lib/utils.js 로드
const utilsPath = path.join(__dirname, '..', 'lib', 'utils.js');
let utils;

try {
  utils = require(utilsPath);
} catch (e) {
  // utils 로드 실패 시 종료
  process.exit(0);
}

// 설정
const CONFIG = {
  FIRST_THRESHOLD: 20,      // 첫 번째 제안
  REMINDER_INTERVAL: 10,    // 이후 10회마다 리마인더
  CRITICAL_THRESHOLD: 50    // 강력 권장
};

function main() {
  try {
    const projectRoot = utils.findProjectRoot();
    const statePath = utils.getStrategicCompactStatePath(projectRoot);
    
    // 현재 상태 로드
    const state = utils.readJsonSafe(statePath, {
      toolCallCount: 0,
      lastSuggestion: null,
      suppressUntilSessionEnd: false,
      phase: 'unknown'
    });
    
    // 억제 상태면 종료
    if (state.suppressUntilSessionEnd) {
      return;
    }
    
    // 카운트 증가
    state.toolCallCount++;
    
    // 임계값 확인
    const count = state.toolCallCount;
    let shouldSuggest = false;
    let urgency = 'normal';
    
    if (count >= CONFIG.CRITICAL_THRESHOLD) {
      shouldSuggest = true;
      urgency = 'critical';
    } else if (count === CONFIG.FIRST_THRESHOLD) {
      shouldSuggest = true;
      urgency = 'normal';
    } else if (count > CONFIG.FIRST_THRESHOLD && (count - CONFIG.FIRST_THRESHOLD) % CONFIG.REMINDER_INTERVAL === 0) {
      shouldSuggest = true;
      urgency = 'reminder';
    }
    
    // 상태 저장
    utils.writeJson(statePath, state);
    
    // 제안 출력
    if (shouldSuggest) {
      state.lastSuggestion = utils.getISODate();
      utils.writeJson(statePath, state);
      
      if (urgency === 'critical') {
        console.log('');
        console.log('🚨 [strategic-compact] 컨텍스트 압축을 강력히 권장합니다');
        console.log(`   도구 호출: ${count}회`);
        console.log('   /compact 실행을 고려하세요');
        console.log('');
      } else if (urgency === 'normal') {
        console.log('');
        console.log('💡 [strategic-compact] 컨텍스트 압축을 권장합니다');
        console.log(`   도구 호출: ${count}회`);
        console.log('   /context-save로 저장 후 /compact 실행을 고려하세요');
        console.log('');
      } else {
        console.log('');
        console.log(`📢 [strategic-compact] 리마인더: 도구 호출 ${count}회`);
        console.log('');
      }
    }
    
  } catch (e) {
    // 에러 시 조용히 종료
  }
}

main();
