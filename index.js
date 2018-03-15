import extractVersion from './extractVersion';

function createTag(src) {
  let tag;

  if (src.slice(-4) === '.css') {
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
  const tag = createTag(src);
  document.body.appendChild(tag);
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
