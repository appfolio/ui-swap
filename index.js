export function extractVersion(search = '') {
  const result = search.match(/(\?|&)ui_version=(.+?)(&|$)/);

  return {
    search: result ? search.replace(result[0], result[3] && result[1]) : search,
    version: result && result[2]
  };
}

function createTag(src) {
  let tag;

  if (src.endsWith('.css')) {
    tag = document.createElement('link');
    tag.href = src;
    tag.rel = 'stylesheet';
  } else {
    tag = document.createElement('script');
    tag.src = src;
  }

  return tag;
}

function loadFile(src) {
  return new Promise((resolve, reject) => {
    const tag = createTag(src);

    tag.addEventListener('load', resolve, false);
    tag.addEventListener('error', reject, false);

    document.body.append(tag);
  });
}

export default function UISwap({
  base,
  devBase,
  files,
  defaultVersion = 'latest'
}) {
  let { version: newVersion, search } = extractVersion(window.location.search);

  if (newVersion) {
    const updatedURL = [
      window.location.origin,
      window.location.pathname,
      search
    ].join('');

    window.history.replaceState({}, null, updatedURL);

    sessionStorage.setItem('ui', newVersion);
  }

  const version = sessionStorage.getItem('ui');

  if (version) {
    files.forEach(file => loadFile(`${base}/${version}/${file}`));
  } else if (devBase) {
    files.forEach(file => loadFile(`${devBase}/${file}`));
  } else {
    files.forEach(file => loadFile(`${base}/${defaultVersion}/${file}`));
  }
}

window.UISwap = UISwap;
