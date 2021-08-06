export function parseGitUrl(initialUrl = '') {
  const [
    initial, 
    protocol, 
    serviceId, 
    delimiter, 
    repo,
    paths,
  ] = /(git\+|git@|https?:\/\/|https?:\/\/|ssh?:\/\/)([a-zA-Z0-9@?.\-_]+)(\/|:)([a-zA-Z0-9-]+)(.*)(\.git)/g.exec(initialUrl) || [];
  const isHttp = /http(s)?/.test(protocol);
  const isPort = /[0-9]/g.test(repo);
  const portChunk = isPort ? `:${repo}` : '';
  const repoChunk = isPort ? '' : `/${repo}`;
  const service = serviceId?.split('@')[1];
  
  const fullUrl = `https://${service}${portChunk}${repoChunk}${paths}`;

  const result = { 
    initialUrl, 
    protocol, 
    service,
    isHttp,
    port: isPort ? repo : '', 
    repo: isPort ? '' : repo, 
    repoUrl: serviceId ? fullUrl : initialUrl, 
  };

  return result;
}