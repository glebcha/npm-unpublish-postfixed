import { spawn } from 'child_process';

import { blue, green, red } from 'colorette';
import ora from 'ora';
import getRegistry from 'registry-url';

import { confirmationPropmt, Versions } from './prompts/confirmationPropmt';
import { postfixesPrompt } from './prompts/postfixesPrompt';
import { versionsPropmt } from './prompts/versionsPropmt';
import { readConfig } from './readConfig';
import { ConfigRecord } from './types';

const spinner = ora();
let packageInfo = { 
  name: '', 
  registry: '',
  repository: {}, 
};

function spawnPromise(cmd: string, args: Array<string>) {
  return new Promise(function (resolve, reject) {
    const process = spawn(cmd, args);

    process.on('close', (code: number) => {
      const isError = code === 1;
      const command = process.spawnargs.join(' ');

      isError ? reject(`${command} exited unexpectedly`) : resolve(code);
    });
    process.on('error', reject);
  });
}

export function run() {
  return readConfig('package.json')
    .then((info) => {
      const { name = '', repository } = info as ConfigRecord;
      const [scope] = name.split('/');
      const hasEmptyScope = scope.length === 0;
      const registry = getRegistry(scope);

      if (hasEmptyScope) {
        throw new Error('please check that package.json has property "name"');
      }

      packageInfo = { name, repository, registry };

      return packageInfo;
    })
    .then(postfixesPrompt)
    .then(versionsPropmt)
    .then(confirmationPropmt)
    .then(([{ confirmation }, versions]: [{ confirmation: boolean }, Versions]) => {
      const hasVersions = Array.isArray(versions) && versions.length > 0;
      const shouldUnpublish = confirmation && hasVersions;
      const text = blue('Begin to unpublish selected versions');
      
      spinner.start(text);

      return shouldUnpublish ?
        Promise.all(
          versions.map((version) => 
            spawnPromise(
              'npm', 
              [
                'unpublish', 
                '--registry',
                packageInfo.registry, 
                `${packageInfo.name}@${String(version)}`,
              ], 
            ),
          )) :
        null;
    })
    .then(() => {
      const text = green('Successfully unpublished all selected versions');
      spinner.succeed(text);
    })
    .catch((error: Error) => {
      const text = red(`Failed to unpublish selected versions\nError:\n${String(error?.message ?? error)}`);
      spinner.fail(text);
    });
}