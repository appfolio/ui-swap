import extractVersion from './extractVersion';

function createTag(src) {
  let tag;

  if (src.slice(-4) === '.css') {
    tag = document.createElement('style');
    tag.textContent = '@import "' + src + '"';
  } else {
    tag = document.createElement('script');
    tag.src = src;
    tag.crossOrigin = 'anonymous';
  }

  return tag;
}

function loadFile(src, cb) {
  const tag = createTag(src);

  if (cb) {
    tag.addEventListener('error', cb, false);
  }

  document.body.appendChild(tag);
}

export default function UISwap({
  base,
  devBase,
  files,
  fallbackVersion,
  defaultVersion
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

  const mayDev =
    (!fallbackVersion && !defaultVersion) || version === 'localhost';

  if (mayDev && devBase) {
    files.forEach(file => loadFile(`${devBase}/${file}`));
  } else {
    files.forEach(file => {
      loadFile(`${base}/${version || defaultVersion}/${file}`, err => {
        if (err) {
          loadFile(`${base}/${fallbackVersion}/${file}`);
        }
      });
    });
  }
}

window.UISwap = UISwap;
