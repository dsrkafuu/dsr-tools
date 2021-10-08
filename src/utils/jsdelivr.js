/**
 * resolve cdn path
 * @param {string} path
 * @param {string} repo
 * @param {version} repo
 */
export default (path, repo, version = '1') => {
  return `https://cdn.jsdelivr.net/gh/dsrkafuu/${repo}@${version}${path}`;
};
