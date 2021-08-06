import chalk from 'chalk';
import { prompt } from 'inquirer';

import { getPostfixVersions } from '../getPostfixVersions';
import { ConfigRecord } from '../types';

const { log } = console;

export function postfixesPrompt(packageInfo: ConfigRecord) {
  return getPostfixVersions(packageInfo)
    .then((postfixVersions) => {
      const choices =
        Object.keys(postfixVersions)
          .map((key) => ({ name: key, value: key }));
      const variants = {
        type: 'checkbox',
        message: 'Choose postfix: ',
        name: 'postfixes',
        pageSize: 10,
        choices,
      };

      if (choices.length === 0) {
        log(chalk.yellow(`\nSorry, no postfixes for package "${packageInfo.name}"\n`));
        process.exit(0);
      }

      return Promise.all([
        prompt([variants]),
        postfixVersions,
      ]);
    });
}