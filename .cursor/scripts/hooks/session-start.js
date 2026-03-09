#!/usr/bin/env node
/**
 * SessionStart Hook - Load previous context on new session
 *
 * Cross-platform (Windows, macOS, Linux)
 *
 * Runs when a new session starts. Checks for recent session
 * files and notifies of available context to load.
 */

const {
  getSessionsDir,
  getLearnedSkillsDir,
  findFiles,
  ensureDir,
  output
} = require('../lib/utils');

const { listAliases } = require('../lib/session-aliases');

async function main() {

  const outputArray = [];

  const sessionsDir = getSessionsDir();
  const learnedDir = getLearnedSkillsDir();

  // Ensure directories exist
  ensureDir(sessionsDir);
  ensureDir(learnedDir);

  // Check for recent session files (last 7 days)
  // Match both old format (YYYY-MM-DD-session.tmp) and new format (YYYY-MM-DD-shortid-session.tmp)
  const recentSessions = findFiles(sessionsDir, '*-session.tmp', { maxAge: 7 });

  if (recentSessions.length > 0) {
    const latest = recentSessions[0];
    outputArray.push(`[SessionStart] Found ${recentSessions.length} recent session(s)`);
    outputArray.push(`[SessionStart] Latest: ${latest.path}`);
  }

  // Check for learned skills
  const learnedSkills = findFiles(learnedDir, '*.md');

  if (learnedSkills.length > 0) {
    outputArray.push(`[SessionStart] ${learnedSkills.length} learned skill(s) available in ${learnedDir}`);
  }

  // Check for available session aliases
  const aliases = listAliases({ limit: 5 });

  if (aliases.length > 0) {
    const aliasNames = aliases.map(a => a.name).join(', ');
    outputArray.push(`[SessionStart] ${aliases.length} session alias(es) available: ${aliasNames}`);
    outputArray.push(`[SessionStart] Use /sessions load <alias> to continue a previous session`);
  }
      outputArray.push(`**MUST** Use /sessions load session and continue a previous session`);

  output(outputArray);
  process.exit(0);
}

main().catch(err => {
  console.error('[SessionStart] Error:', err.message);
  process.exit(0); // Don't block on errors
});