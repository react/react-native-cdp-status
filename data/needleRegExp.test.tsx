/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { buildNeedleRegExp } from './needleRegExp';

function countMatches(needles: string[], source: string) {
  return [...source.matchAll(buildNeedleRegExp(needles))].length;
}

describe('buildNeedleRegExp', () => {
  const literal = '"Network.dataReceived"';

  it.each([
    'cdp::jsonNotification("Network.dataReceived", params.toDynamic());',
    'if (method == "Network.dataReceived") {',
    '{"Network.dataReceived"}',
    'auto name = "Network.dataReceived";',
    'case "Network.dataReceived":',
  ])('matches a string literal in %s', (source) => {
    expect(countMatches([literal], source)).toBe(1);
  });

  it('does not match a longer string literal', () => {
    expect(
      countMatches([literal], 'jsonNotification("Network.dataReceivedFoo", p);'),
    ).toBe(0);
  });

  it('matches identifiers only as whole words', () => {
    const needles = ['DataReceivedNotification'];
    expect(countMatches(needles, 'm::DataReceivedNotification n;')).toBe(1);
    expect(countMatches(needles, 'm::DataReceivedNotificationFoo n;')).toBe(0);
    expect(countMatches(needles, 'm::FooDataReceivedNotification n;')).toBe(0);
  });

  it('matches any of several needles', () => {
    expect(
      countMatches(
        ['EnableRequest', '"Debugger.enable"'],
        'EnableRequest req; dispatch("Debugger.enable", req);',
      ),
    ).toBe(2);
  });
});
