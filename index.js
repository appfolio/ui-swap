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
    const cbWithSrc = err => cb(src, err)
    tag.addEventListener('error', cbWithSrc, false);
  }

  document.body.appendChild(tag);
}

function oops(src, err) {
  if(src.slice(-3) === '.js') {
    console.error('UISWap: Cannot load', src, 'due to', err);
    // promote reliability on reload
    sessionStorage.removeItem('ui');
  }
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

    if(newVersion && newVersion !== '')
      sessionStorage.setItem('ui', newVersion);
  }

  const version = sessionStorage.getItem('ui');

  const mayDev =
    (!fallbackVersion && !defaultVersion) || version === 'localhost';

  if (mayDev && devBase) {
    files.forEach(file => loadFile(`${devBase}/${file}`, oops));
  } else {
    files.forEach(file => {
      loadFile(`${base}/${version || defaultVersion}/${file}`, err => {
        if (err)
          loadFile(`${base}/${fallbackVersion}/${file}`, oops);
      });
    });
  }
}

window.UISwap = UISwap;
