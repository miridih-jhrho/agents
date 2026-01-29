#!/usr/bin/env node
/**
 * Observe Hook
 * 
 * 도구 사용 전후 관찰 데이터 수집:
 * - preToolUse: 도구 호출 전 기록
 * - postToolUse: 도구 호출 후 결과 기록
 * 
 * 사용법:
 *   node observe.js pre
 *   node observe.js post
 * 
 * hooks.json의 preToolUse/postToolUse에서 호출됨
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

// 환경 변수에서 도구 정보 가져오기 (Cursor hooks가 제공)
function getToolInfo() {
  return {
    tool: process.env.CURSOR_TOOL_NAME || 'unknown',
    input: process.env.CURSOR_TOOL_INPUT || '',
    output: process.env.CURSOR_TOOL_OUTPUT || '',
    exitCode: process.env.CURSOR_EXIT_CODE || null
  };
}

function main() {
  try {
    const phase = process.argv[2] || 'unknown';  // 'pre' or 'post'
    const projectRoot = utils.findProjectRoot();
    const observationsPath = utils.getObservationsPath(projectRoot);
    
    const toolInfo = getToolInfo();
    const timestamp = utils.getISODate();
    
    const observation = {
      timestamp,
      event: phase === 'pre' ? 'preToolUse' : 'postToolUse',
      tool: toolInfo.tool
    };
    
    // pre: 입력 기록
    if (phase === 'pre') {
      if (toolInfo.input) {
        try {
          // 입력이 너무 크면 요약
          const input = toolInfo.input.length > 500 
            ? toolInfo.input.substring(0, 500) + '...(truncated)'
            : toolInfo.input;
          observation.input = input;
        } catch (e) {
          observation.input = '(parse error)';
        }
      }
    }
    
    // post: 결과 기록
    if (phase === 'post') {
      observation.success = toolInfo.exitCode === '0' || toolInfo.exitCode === null;
      if (toolInfo.output && toolInfo.output.length > 0) {
        // 출력이 너무 크면 생략
        observation.hasOutput = true;
        observation.outputLength = toolInfo.output.length;
      }
    }
    
    // observations.jsonl에 추가
    utils.appendJsonl(observationsPath, observation);
    
  } catch (e) {
    // 관찰 실패해도 조용히 종료
  }
}

main();
