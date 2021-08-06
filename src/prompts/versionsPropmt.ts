import { prompt, Separator } from 'inquirer';

import { PostfixInfo } from '../types';

export function versionsPropmt(
  [answers, postfixVersions]: [{ postfixes: Array<string> }, { [x: string]: PostfixInfo[] }],
) {
  const { postfixes } = answers;
  const choices =
    postfixes.reduce((result: Array<unknown>, postfix) => {
      const versions =
        postfixVersions[postfix]
          .map(({ version, commit, artefact }) => ({ 
            name: version, 
            value: version,
            short: `\n\n${version}\n\nCommit: ${commit}\n\nArtefact: ${artefact}`, 
          }));
          
      return [...result, ...versions, new Separator('============')];
    }, []);

  const variants = {
    type: 'checkbox',
    message: 'Choose versions: ',
    name: 'versions',
    choices,
  };
  return prompt([variants]);
}