/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Builds a global regex that matches any of `needles` as a whole token.
 *
 * Word boundaries are only applied at needle edges that are word characters.
 * A needle such as `"Debugger.enable"` is already delimited by its quotes, so
 * it must match regardless of what follows it (e.g. `"Debugger.enable",`).
 */
export function buildNeedleRegExp(needles: string[]): RegExp {
  return new RegExp(
    needles
      .map(
        (needle) =>
          (/^\w/.test(needle) ? '\\b' : '') +
          escapeRegExp(needle) +
          (/\w$/.test(needle) ? '\\b' : ''),
      )
      .join('|'),
    'g',
  );
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
