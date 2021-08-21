/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');

function theme(context, options) {
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
      const remoteHeadTags = content ? content.remoteHeadTags : [];
      const brython_pips = [];
      (options.brython_pips || []).forEach(pip => {
        brython_pips.push(
          {
            tagName: 'script',
            attributes: {
              src: pip,
              crossorigin: "anonymous",
              referrerpolicy: "no-referrer"
            },
          }
        );
      });
      return {
        headTags: [
          {
            tagName: 'script',
            attributes: {
              src: options.brython_src || "https://cdn.jsdelivr.net/npm/brython@3.9.5/brython.min.js",
              crossorigin: "anonymous",
              referrerpolicy: "no-referrer"
            },
          },
          {
            tagName: 'script',
            attributes: {
              src: options.brython_stdlib_src || "https://cdn.jsdelivr.net/npm/brython@3.9.5/brython_stdlib.js",
              crossorigin: "anonymous",
              referrerpolicy: "no-referrer"
            },
          },
          ...brython_pips,
          ...remoteHeadTags,
        ],
      };
    },
  };
}

module.exports = theme;
