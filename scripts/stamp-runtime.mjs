// stamp-runtime.mjs —— 启动时生成静态版本信息,不引入游戏后端
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { APP_VERSION } from '../src/version.js';

function commitSha() {
  if (process.env.APP_COMMIT) return process.env.APP_COMMIT;
  if (process.env.SOURCE_VERSION) return process.env.SOURCE_VERSION;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

const payload = {
  version: APP_VERSION,
  commit: commitSha(),
  startedAt: new Date().toISOString(),
};
writeFileSync(new URL('../runtime.json', import.meta.url), JSON.stringify(payload, null, 2) + '\n');
console.log(`版本信息已生成:v${payload.version}+${payload.commit.slice(0, 7)} · ${payload.startedAt}`);
