import { access, readFile } from 'fs/promises';

import { logger } from './logger';

export function readConfig<Output = unknown>(configPath: string) {
  return access(configPath)
    .then(() => readFile(configPath))
    .then((json) => (JSON.parse(String(json)) as Record<string, Output>))
    .catch(() => {
      logger.warning(`\nCan't read configuration file ${configPath}\n`);

      return {};
    });
}