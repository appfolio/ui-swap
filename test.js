import { getSessionValueFromUrlParam } from '.';

describe('getSessionValueFromUrlParam', () => {
  it('appends `branches/`', () => {
    expect(getSessionValueFromUrlParam('branchName')).toEqual(
      'branches/branchName'
    );
  });

  it('does not append `branches/` to `localhost`', () => {
    expect(getSessionValueFromUrlParam('localhost')).toEqual('localhost');
  });
});
