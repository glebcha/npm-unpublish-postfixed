
import packageJson from 'package-json';

import { processPackageVersions } from './processPackageVersions';
import { ConfigRecord } from './types';

export function getPostfixVersions({ name, repository }: ConfigRecord) {
    return packageJson(name, { allVersions: true })
        .then((info) => processPackageVersions(info, repository))
        .catch((error: Error) => {
            throw new Error(`Failed to get postfix versions:\n${error.message}`);
        });

}