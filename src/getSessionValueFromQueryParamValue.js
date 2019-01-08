const getSessionValueFromQueryParamValue = newVersion =>
  newVersion === 'localhost' ? 'localhost' : 'branches/' + newVersion;

export default getSessionValueFromQueryParamValue;
