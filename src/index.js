/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

function theme() {
  return {
    name: 'docusaurus-live-brython',

    getThemePath() {
      return path.resolve(__dirname, './theme');
    },

    configureWebpack() {
      return {
        module: {
          rules: [
            {
              test: /\.raw\.*/,
              type: 'asset/source'
            },
          ],
        },
      };
    },
    injectHtmlTags({ content }) {
      const remoteHeadTags = content ? content.remoteHeadTags : []
      return {
        headTags: [
          {
            tagName: 'script',
            attributes: {
              src: "https://raw.githack.com/brython-dev/brython/master/www/src/brython.js",
              crossorigin: "anonymous",
              referrerpolicy: "no-referrer"
            },
          },
          {
            tagName: 'script',
            attributes: {
              src: "https://raw.githack.com/brython-dev/brython/master/www/src/brython_stdlib.js",
              crossorigin: "anonymous",
              referrerpolicy: "no-referrer"
            },
          },
          ...remoteHeadTags,
        ],
      };
    },
  };
}

module.exports = theme;
