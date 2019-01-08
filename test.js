import { getSessionValueFromQueryParamValue } from './';

describe('getSessionValueFromQueryParamValue', () => {
  it('appends `branches/`', () => {
    expect(getSessionValueFromQueryParamValue('branchName')).toEqual(
      'branches/branchName'
    );
  });

  it('does not append `branches/` to `localhost`', () => {
    expect(getSessionValueFromQueryParamValue('localhost')).toEqual(
      'localhost'
    );
  });
});
