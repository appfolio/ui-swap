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

function loadFile(src, cb) {
  const tag = createTag(src);

  if (cb) {
    tag.addEventListener('error', cb, false);
    tag.addEventListener('load', e => cb(null, e), false);
  }

  document.body.appendChild(tag);
}

export default function UISwap({
  base,
  devBase,
  files,
  fallbackVersion,
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
    files.forEach(file => {
      loadFile(`${base}/${defaultVersion}/${file})`, err => {
        if (err) {
          loadFile(`${base}/${fallbackVersion}/${file})`);
        }
      });
    });
  }
}

window.UISwap = UISwap;
