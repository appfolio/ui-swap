export default function extractVersion(search = '') {
  const result = search.match(/(\?|&)ui_version=(.+?)(&|$)/);

  return {
    search: result ? search.replace(result[0], result[3] && result[1]) : search,
    version: result && result[2]
  };
}
