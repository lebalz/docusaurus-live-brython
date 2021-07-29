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
        resolve: {
          alias: {
            buble: path.resolve(__dirname, './custom-buble.js'),
          },
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
              src: "https://cdnjs.cloudflare.com/ajax/libs/brython/3.9.5/brython.min.js",
              integrity: "sha512-Oe3i0p3zVIqykQ2TZhGOA/+JGe0WAqVoPVMHJGnubFjr3n+FYJTpctq98B9VBBvFMaHgDm18i1XsH2Lt1heQ1Q==",
              crossorigin: "anonymous",
              referrerpolicy: "no-referrer"
            },
          },
          {
            tagName: 'script',
            attributes: {
              src: "https://cdnjs.cloudflare.com/ajax/libs/brython/3.9.5/brython_stdlib.min.js",
              integrity: "sha512-nXYxmap54wPG2SPS9Z6kQdZy4q1jkbJi6hfCivwP9HjbOiWEeyPSFy5kr1IoW296mcwVsqKWD1EOGqw7YAxO+Q==",
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
