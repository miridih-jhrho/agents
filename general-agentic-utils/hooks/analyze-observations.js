#!/usr/bin/env node
/**
 * Analyze Observations Hook
 * 
 * 세션 종료 시 관찰 데이터 분석:
 * 1. observations.jsonl 읽기
 * 2. 패턴 감지 (기본 분석)
 * 3. instinct 후보 생성
 * 4. 복잡한 패턴은 observer-agent 호출 권장
 * 
 * hooks.json의 sessionEnd에서 호출됨
 */

const path = require('path');
const fs = require('fs');

// 설정
const CONFIG = {
  MIN_OBSERVATIONS_FOR_DEEP_ANALYSIS: 20,  // 이 이상이면 observer-agent 권장
  COMPLEX_PATTERN_THRESHOLD: 3             // 복잡한 패턴 수 임계값
};

// lib/utils.js 로드
const utilsPath = path.join(__dirname, '..', 'lib', 'utils.js');
let utils;

try {
  utils = require(utilsPath);
} catch (e) {
  console.log('[analyze-observations] Utils not found, skipping');
  process.exit(0);
}

// 패턴 감지 규칙
const PATTERN_RULES = {
  // 동일 도구 반복 사용
  repeated_tool: {
    minCount: 5,
    domain: 'workflow'
  },
  // 에러 후 수정
  error_resolution: {
    sequence: ['postToolUse:fail', 'preToolUse:Write', 'postToolUse:success'],
    domain: 'debugging'
  },
  // 특정 파일 패턴 반복
  file_pattern: {
    minCount: 3,
    domain: 'workflow'
  }
};

function analyzePatterns(observations) {
  const patterns = [];
  
  if (observations.length < 10) {
    return patterns;  // 너무 짧은 세션은 분석 안 함
  }
  
  // 1. 도구 사용 빈도 분석
  const toolCounts = {};
  for (const obs of observations) {
    if (obs.tool && obs.tool !== 'unknown') {
      toolCounts[obs.tool] = (toolCounts[obs.tool] || 0) + 1;
    }
  }
  
  // 자주 사용된 도구 패턴
  for (const [tool, count] of Object.entries(toolCounts)) {
    if (count >= PATTERN_RULES.repeated_tool.minCount) {
      patterns.push({
        type: 'repeated_tool',
        tool,
        count,
        domain: 'workflow',
        confidence: Math.min(0.3 + (count / 20), 0.7)
      });
    }
  }
  
  // 2. 에러 → 수정 → 성공 패턴 분석
  let errorResolutions = 0;
  for (let i = 0; i < observations.length - 2; i++) {
    const curr = observations[i];
    const next = observations[i + 1];
    const afterNext = observations[i + 2];
    
    if (curr.event === 'postToolUse' && curr.success === false) {
      if (next.event === 'preToolUse' && ['Write', 'StrReplace', 'Edit'].includes(next.tool)) {
        if (afterNext.event === 'postToolUse' && afterNext.success === true) {
          errorResolutions++;
        }
      }
    }
  }
  
  if (errorResolutions >= 2) {
    patterns.push({
      type: 'error_resolution',
      count: errorResolutions,
      domain: 'debugging',
      confidence: Math.min(0.4 + (errorResolutions / 10), 0.8)
    });
  }
  
  return patterns;
}

function generateInstinctSuggestions(patterns) {
  const suggestions = [];
  
  for (const pattern of patterns) {
    if (pattern.type === 'repeated_tool') {
      suggestions.push({
        trigger: `${pattern.tool} 도구 자주 사용`,
        action: `${pattern.tool} 사용 최적화 고려`,
        domain: pattern.domain,
        confidence: pattern.confidence,
        evidence: `세션 중 ${pattern.count}회 사용`
      });
    }
    
    if (pattern.type === 'error_resolution') {
      suggestions.push({
        trigger: '에러 발생 시',
        action: '즉시 수정 후 재실행',
        domain: pattern.domain,
        confidence: pattern.confidence,
        evidence: `세션 중 ${pattern.count}회 에러 해결 패턴`
      });
    }
  }
  
  return suggestions;
}

function main() {
  try {
    const projectRoot = utils.findProjectRoot();
    const observationsPath = utils.getObservationsPath(projectRoot);
    
    // observations 읽기
    const observations = utils.readJsonl(observationsPath);
    
    if (observations.length === 0) {
      console.log('[analyze-observations] No observations to analyze');
      return;
    }
    
    console.log(`[analyze-observations] Analyzing ${observations.length} observations`);
    
    // 패턴 분석
    const patterns = analyzePatterns(observations);
    
    if (patterns.length === 0) {
      console.log('[analyze-observations] No significant patterns detected');
      return;
    }
    
    console.log(`[analyze-observations] Detected ${patterns.length} patterns`);
    
    // instinct 제안 생성
    const suggestions = generateInstinctSuggestions(patterns);
    
    if (suggestions.length > 0) {
      // 제안 파일 저장
      const timestamp = utils.getTimestamp();
      const suggestionsPath = path.join(
        utils.getInstinctsDir(projectRoot),
        `_auto-suggestions-${timestamp}.md`
      );
      
      let content = `---
generated: ${utils.getISODate()}
type: auto-suggestions
status: pending-review
---

# 자동 감지된 패턴 제안

다음 패턴들이 이 세션에서 감지되었습니다.
\`/learn\` 커맨드로 instinct로 저장하거나 무시할 수 있습니다.

`;
      
      for (const suggestion of suggestions) {
        content += `## ${suggestion.trigger}

- **액션**: ${suggestion.action}
- **도메인**: ${suggestion.domain}
- **신뢰도**: ${suggestion.confidence}
- **증거**: ${suggestion.evidence}

---

`;
      }
      
      utils.writeFile(suggestionsPath, content);
      console.log(`[analyze-observations] Suggestions saved to ${path.basename(suggestionsPath)}`);
    }
    
    // Observer Agent 호출 권장 여부 판단
    const shouldCallObserver = 
      observations.length >= CONFIG.MIN_OBSERVATIONS_FOR_DEEP_ANALYSIS ||
      patterns.length >= CONFIG.COMPLEX_PATTERN_THRESHOLD;
    
    if (shouldCallObserver) {
      console.log('');
      console.log('[analyze-observations] 📊 심층 분석 권장');
      console.log(`  관찰 수: ${observations.length}개`);
      console.log(`  감지된 패턴: ${patterns.length}개`);
      console.log('');
      console.log('  복잡한 패턴 분석을 위해 observer-agent 호출을 권장합니다.');
      console.log('  /learn 커맨드로 수동 분석을 실행하거나,');
      console.log('  다음 Task 호출로 observer-agent를 실행하세요:');
      console.log('');
      console.log('  Task(');
      console.log('    subagent_type="generalPurpose",');
      console.log('    model="fast",');
      console.log('    prompt="Observer Agent로 .cursor/tmp/observations.jsonl 분석"');
      console.log('  )');
      console.log('');
      
      // observer 호출 권장 플래그 저장
      const flagPath = path.join(utils.getTmpDir(projectRoot), 'observer-recommended.json');
      utils.writeJson(flagPath, {
        timestamp: utils.getISODate(),
        observations_count: observations.length,
        patterns_count: patterns.length,
        reason: 'deep_analysis_recommended'
      });
    }
    
    // observations 아카이브 (선택적)
    // 현재는 파일을 유지하고 다음 세션에서 덮어씀
    
  } catch (e) {
    console.error('[analyze-observations] Error:', e.message);
  }
}

main();
