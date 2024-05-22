/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { HtmlTags, LoadContext, Plugin, Preset } from '@docusaurus/types';
// eslint-disable-next-line import/no-extraneous-dependencies, import/order
import webpack from 'webpack';
const path = require('path');

interface ThemeOptions {
    brython_src?: string;
    brython_stdlib_src?: string;
    brython_pips?: string[];

}

const theme: Plugin = (
    context: LoadContext,
    options: ThemeOptions,
) => {
    return {
        name: 'docusaurus-live-brython',
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
        getThemePath() {
            return '../lib/theme';
        },
        getTypeScriptThemePath() {
            return '../src/theme';
        },
        injectHtmlTags({ content }: {content?: {remoteHeadTags: HtmlTags[]}}) {
            const remoteHeadTags: HtmlTags[] = content ? content.remoteHeadTags : [];
            const brython_pips: HtmlTags[] = [];
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

export default theme;