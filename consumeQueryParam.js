// If the named parameter is present in the query string, remove it
// and return its value. Leave the rest of the query string undisturbed.
export default function consumeQueryParam(location, name) {
  const {search} = location;
  const pattern = new RegExp(`(\\?|&)${name}=(.+?)(&|$)`);
  const result = search.match(pattern);

  if(result) {
    const updatedURL = [
      window.location.origin,
      window.location.pathname,
      search.replace(result[0], result[3] && result[1])
    ].join('');
    window.history.replaceState({}, null, updatedURL);

    return result[2];
  }

  return null;
}
