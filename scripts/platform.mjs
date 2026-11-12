import { spawn, spawnSync } from 'node:child_process';

export const isWindows = process.platform === 'win32';

const npmCli = process.env.npm_execpath;

function npmInvocation(args) {
  if (isWindows) {
    if (!npmCli || !npmCli.endsWith('.js')) {
      throw new Error('Не найден npm CLI. Запустите проект через npm run demo.');
    }

    return [process.execPath, [npmCli, ...args]];
  }

  return ['npm', args];
}

export function spawnNpm(args, options = {}) {
  const [command, commandArgs] = npmInvocation(args);

  return spawn(command, commandArgs, {
    stdio: 'inherit',
    ...options
  });
}

export function spawnNpmSync(args, options = {}) {
  const [command, commandArgs] = npmInvocation(args);

  return spawnSync(command, commandArgs, {
    stdio: 'inherit',
    ...options
  });
}

export function stopProcessTree(child) {
  if (!child?.pid) return;
  if (isWindows) {
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], {
      stdio: 'ignore',
      windowsHide: true
    });
    return;
  }
  try {
    child.kill('SIGTERM');
  } catch {
    // Процесс уже завершён.
  }
}
