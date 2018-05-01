export default function processLoadEvents(callback, failed) {
  if (typeof callback === 'undefined') {
    throw new TypeError('Callback Not Defined');
  }

  return e => {
    if (failed) {
      callback(e); // Failure
    }

    if (e.target.tagName === 'LINK') {
      try {
        if (
          e.target.sheet &&
          e.target.sheet.cssRules &&
          e.target.sheet.cssRules.length
        ) {
          callback(null, e); // Success
        } else {
          callback(e); // Failure
        }
      } catch (error) {
        callback(e);
      }
    }
  };
}
