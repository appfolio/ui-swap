import test from 'ava';

import extractVersion from './extractVersion';

test('should get version from query string', t => {
  t.falsy(extractVersion().version);
  t.falsy(extractVersion('').version);
  t.falsy(extractVersion('bullshit').version);
  t.is(extractVersion('?ui_version=foobar').version, 'foobar');
  t.is(extractVersion('?ui_version=foobar&other=param').version, 'foobar');
  t.is(
    extractVersion('?first=param&ui_version=foobar&other=param').version,
    'foobar'
  );
  t.is(extractVersion('?first=param&ui_version=foobar').version, 'foobar');
  t.falsy(extractVersion('?first=param&xui_version=foobar').version);
  t.falsy(extractVersion('?first=param&ui_version=').version);
});

test('should extract version from query string', t => {
  t.is(extractVersion().search, '');
  t.is(extractVersion('').search, '');
  t.is(extractVersion('bullshit').search, 'bullshit');
  t.is(extractVersion('?ui_version=foobar').search, '');
  t.is(extractVersion('?ui_version=foobar&other=param').search, '?other=param');
  t.is(
    extractVersion('?first=param&ui_version=foobar&other=param').search,
    '?first=param&other=param'
  );
  t.is(extractVersion('?first=param&ui_version=foobar').search, '?first=param');
  t.is(
    extractVersion('?first=param&xui_version=foobar').search,
    '?first=param&xui_version=foobar'
  );
  t.is(
    extractVersion('?first=param&ui_version=').search,
    '?first=param&ui_version='
  );
  t.is(
    extractVersion('?first[]=param&first[]=param2&ui_version=hi').search,
    '?first[]=param&first[]=param2'
  );
});
