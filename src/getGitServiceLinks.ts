type Parameters = {
    service: string,
    repoUrl: string, 
    hash: string
};

type ServiceId = 'github' | 'gitlab' | 'bitbucket';

export function getGitServiceLinks({ service, repoUrl, hash }: Parameters) {
  const serviceLinks = {
      github: {
          issue: `${repoUrl}/issues/${hash}`,
          commit: `${repoUrl}/commit/${hash}`,
      },
      bitbucket: {
          issue: `${repoUrl}/issues/${hash}`,
          commit: `${repoUrl}/commits/${hash}`,
      },
      gitlab: {
        issue: `${repoUrl}/issues/${hash}`,
        commit: `${repoUrl}/commit/${hash}`,
      },
  };
  const defaultLinks = { issue: '', commit: '' };
  const serviceId = Object.keys(serviceLinks).find((id) => !!new RegExp(id).exec(service));

  return serviceId ? serviceLinks[serviceId as ServiceId] : defaultLinks;
}