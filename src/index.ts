import { spawn } from 'child_process';

import chalk from 'chalk';
import ora from 'ora';

import { confirmationPropmt, Versions } from './prompts/confirmationPropmt';
import { postfixesPrompt } from './prompts/postfixesPrompt';
import { versionsPropmt } from './prompts/versionsPropmt';
import { readConfig } from './readConfig';
import { ConfigRecord } from './types';

const spinner = ora();
let packageInfo = { name: '', repository: {} };

function spawnPromise(cmd: string, args: Array<string>) {
  return new Promise(function (resolve, reject) {
    const process = spawn(cmd, args);

    process.on('close', resolve);
    process.on('error', reject);
  });
}

export function run() {
  return readConfig('package.json')
    .then((info) => {
      const { name, repository } = info as ConfigRecord;

      packageInfo = { name, repository };

      return packageInfo;
    })
    .then(postfixesPrompt)
    .then(versionsPropmt)
    .then(confirmationPropmt)
    .then(([{ confirmation }, versions]: [{ confirmation: boolean }, Versions]) => {
      const hasVersions = Array.isArray(versions) && versions.length > 0;
      const shouldUnpublish = confirmation && hasVersions;
      const text = chalk.blue('Begin to unpublish selected versions');
      
      spinner.start(text);

      return shouldUnpublish ?
        Promise.all(
          versions.map((version) => 
            spawnPromise(
              'npm', 
              ['unpublish', `${packageInfo.name}@${String(version)}`], 
            ),
          )) :
        null;
    })
    .then(() => {
      const text = chalk.green('Successfully unpublished all selected versions');
      spinner.succeed(text);
    })
    .catch((error: Error) => {
      const text = chalk.red(`Failed to unpublish selected versions\nError:\n${String(error?.message)}`);
      spinner.fail(text);
    });
}