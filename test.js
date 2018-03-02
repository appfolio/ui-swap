import test from 'ava';

import UISwap from '.';

test('should have test key with stuff', t => {
  t.is(UISwap.test, 'stuff');
});
