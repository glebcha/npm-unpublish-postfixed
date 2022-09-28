
import packageJson from 'package-json';

import { getGitServiceLinks } from './getGitServiceLinks';
import { parseGitUrl } from './parseGitUrl';
import { ConfigRecord, PostfixInfo } from './types';

function getVersionPostfix(version = '') {
    const matches = /([0-9.]+)(-)([a-zA-Z0-9].*\.)/g.exec(version) || [];

    return matches[3]?.replace('.', '');
}

export function processPackageVersions(
  packageInfo: packageJson.AbbreviatedMetadata, 
  repository: ConfigRecord['repository'],
) {
    return Object.keys(packageInfo.versions)
        .reduce((acc: { [version: string]: Array<PostfixInfo> }, key) => {
            const {
                version, 
                gitHead, 
                dist,
            } = packageInfo.versions[key];

            const url = 
                typeof repository === 'string' ? 
                repository : 
                repository.url;

            const { repoUrl, service } = parseGitUrl(url);
            const { commit } = getGitServiceLinks({ service, repoUrl, hash: String(gitHead) });
            const info = { version, commit, artefact: dist.tarball };
            const postfix = getVersionPostfix(version);
            const purePostfix = postfix && postfix.split('.')[0];
            const updatedPostfixInfo =
                purePostfix ?
                { [purePostfix]: acc[purePostfix] ? [...acc[purePostfix], info] : [info] } :
                {};

            return { ...acc, ...updatedPostfixInfo };
        }, {});
}