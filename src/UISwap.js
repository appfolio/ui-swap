import consumeQueryParam from './consumeQueryParam';
import getSessionValueFromQueryParamValue from './getSessionValueFromQueryParamValue';

let logDebug = () => undefined;
const logInfo = console.log;
const logError = console.error;

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
    const cbWithSrc = err => cb(err, src);
    tag.addEventListener('error', cbWithSrc, false);
  }

  document.body.appendChild(tag);
}

function handleResult(err, src) {
  if (err) {
    if (src.slice(-3) === '.js') {
      logInfo(
        'UISwap: JavaScript source failed to load; clearing ui_version for next reload'
      );
      // promote reliability on reload
      sessionStorage.removeItem('ui');
    } else {
      logDebug('UISwap: Cannot load', src);
    }
  } else {
    logDebug('UISwap: Loaded', src);
  }
}

export default function UISwap({
  base,
  devBase,
  files,
  fallbackVersion,
  defaultVersion
}) {
  const newVersion = consumeQueryParam(window.location, 'ui_version');
  if (newVersion && newVersion !== '')
    sessionStorage.setItem(
      'ui',
      getSessionValueFromQueryParamValue(newVersion)
    );

  const debugSelf = consumeQueryParam(window.location, 'ui_swap');
  if (debugSelf) logDebug = logInfo;

  const version = sessionStorage.getItem('ui') || defaultVersion;

  const mayDev =
    (!fallbackVersion && !defaultVersion) || version === 'localhost';

  if (mayDev && devBase) {
    logDebug('UISwap: using devBase');
    files.forEach(file => loadFile(`${devBase}/${file}`, handleResult));
  } else {
    logDebug('UISwap: using base');
    files.forEach(file => {
      loadFile(`${base}/${version}/${file}`, err => {
        if (err) {
          handleResult(err, file);
          logInfo(`UISwap: fallback to ${fallbackVersion}`);
          loadFile(`${base}/${fallbackVersion}/${file}`, handleResult);
        }
      });
    });
  }
}

window.UISwap = UISwap;
