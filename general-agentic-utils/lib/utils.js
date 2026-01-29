/**
 * Agentic Utils - 공통 유틸리티
 * 
 * 크로스 플랫폼 지원 (Windows, macOS, Linux)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * 프로젝트 루트 경로 찾기
 * .git 폴더 또는 .cursor 폴더가 있는 곳
 */
function findProjectRoot(startDir = process.cwd()) {
  let dir = startDir;
  while (dir !== path.parse(dir).root) {
    if (fs.existsSync(path.join(dir, '.git')) || fs.existsSync(path.join(dir, '.cursor'))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return startDir;
}

/**
 * .cursor 디렉토리 경로
 */
function getCursorDir(projectRoot = findProjectRoot()) {
  return path.join(projectRoot, '.cursor');
}

/**
 * tmp 디렉토리 경로 (없으면 생성)
 */
function getTmpDir(projectRoot = findProjectRoot()) {
  const tmpDir = path.join(getCursorDir(projectRoot), 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  return tmpDir;
}

/**
 * 타임스탬프 생성 (YYYYMMDD-HHMMSS)
 */
function getTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

/**
 * ISO 날짜 문자열
 */
function getISODate(date = new Date()) {
  return date.toISOString();
}

/**
 * 파일 안전하게 읽기
 */
function readFileSafe(filePath, defaultValue = null) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    return defaultValue;
  }
}

/**
 * JSON 파일 안전하게 읽기
 */
function readJsonSafe(filePath, defaultValue = {}) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (e) {
    return defaultValue;
  }
}

/**
 * JSON 파일 쓰기
 */
function writeJson(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * 파일 쓰기 (디렉토리 자동 생성)
 */
function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
}

/**
 * JSONL 파일에 한 줄 추가
 */
function appendJsonl(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.appendFileSync(filePath, JSON.stringify(data) + '\n');
}

/**
 * JSONL 파일 읽기
 */
function readJsonl(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.trim().split('\n').filter(Boolean).map(line => JSON.parse(line));
  } catch (e) {
    return [];
  }
}

/**
 * 가장 최근 컨텍스트 파일 찾기
 */
function findLatestContextFile(projectRoot = findProjectRoot()) {
  const tmpDir = getTmpDir(projectRoot);
  const files = fs.readdirSync(tmpDir)
    .filter(f => f.startsWith('context-') && f.endsWith('.md'))
    .sort()
    .reverse();
  
  if (files.length === 0) return null;
  return path.join(tmpDir, files[0]);
}

/**
 * 모든 컨텍스트 파일 목록
 */
function listContextFiles(projectRoot = findProjectRoot()) {
  const tmpDir = getTmpDir(projectRoot);
  try {
    return fs.readdirSync(tmpDir)
      .filter(f => f.startsWith('context-') && f.endsWith('.md'))
      .sort()
      .reverse()
      .map(f => ({
        name: f,
        path: path.join(tmpDir, f),
        timestamp: f.replace('context-', '').replace('.md', '')
      }));
  } catch (e) {
    return [];
  }
}

/**
 * 오래된 컨텍스트 파일 정리 (최근 N개만 유지)
 */
function cleanupContextFiles(keep = 10, projectRoot = findProjectRoot()) {
  const files = listContextFiles(projectRoot);
  const toDelete = files.slice(keep);
  
  for (const file of toDelete) {
    try {
      fs.unlinkSync(file.path);
    } catch (e) {
      // 삭제 실패 무시
    }
  }
  
  return toDelete.length;
}

/**
 * Git 명령어 실행
 */
function execGit(args, cwd = findProjectRoot()) {
  const { execSync } = require('child_process');
  try {
    return execSync(`git ${args}`, { cwd, encoding: 'utf-8' }).trim();
  } catch (e) {
    return '';
  }
}

/**
 * Git 상태 가져오기
 */
function getGitStatus(projectRoot = findProjectRoot()) {
  return execGit('status --short', projectRoot);
}

/**
 * Git diff 통계 가져오기
 */
function getGitDiffStat(projectRoot = findProjectRoot()) {
  return execGit('diff --stat', projectRoot);
}

/**
 * 현재 프로젝트 이름 가져오기
 */
function getProjectName(projectRoot = findProjectRoot()) {
  return path.basename(projectRoot);
}

/**
 * instincts 디렉토리 경로
 */
function getInstinctsDir(projectRoot = findProjectRoot()) {
  const dir = path.join(getCursorDir(projectRoot), 'instincts');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * evolved 디렉토리 경로
 */
function getEvolvedDir(projectRoot = findProjectRoot()) {
  const dir = path.join(getCursorDir(projectRoot), 'evolved');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * observations 파일 경로
 */
function getObservationsPath(projectRoot = findProjectRoot()) {
  return path.join(getTmpDir(projectRoot), 'observations.jsonl');
}

/**
 * strategic-compact 상태 파일 경로
 */
function getStrategicCompactStatePath(projectRoot = findProjectRoot()) {
  return path.join(getTmpDir(projectRoot), 'strategic-compact-state.json');
}

/**
 * 환경 정보
 */
function getEnvInfo() {
  return {
    platform: os.platform(),
    nodeVersion: process.version,
    cwd: process.cwd()
  };
}

module.exports = {
  findProjectRoot,
  getCursorDir,
  getTmpDir,
  getTimestamp,
  getISODate,
  readFileSafe,
  readJsonSafe,
  writeJson,
  writeFile,
  appendJsonl,
  readJsonl,
  findLatestContextFile,
  listContextFiles,
  cleanupContextFiles,
  execGit,
  getGitStatus,
  getGitDiffStat,
  getProjectName,
  getInstinctsDir,
  getEvolvedDir,
  getObservationsPath,
  getStrategicCompactStatePath,
  getEnvInfo
};
