import { access, readFile } from 'fs/promises';

import chalk from 'chalk';

const { log } = console;

export function readConfig<Output = unknown>(configPath: string) {
  return access(configPath)
    .then(() => readFile(configPath))
    .then((json) => (JSON.parse(String(json)) as Record<string, Output>))
    .catch(() => {
      log(chalk.yellow(`\nCan't read configuration file ${configPath}\n`));

      return {};
    });
}