/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


/**
 * Notes
 * - how to add static files: https://github.com/facebook/docusaurus/discussions/6907
 *  ---> sitemap plugin: https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-plugin-sitemap/src/index.ts
 * - call brython with arguments: https://github.com/brython-dev/brython/issues/2421
 * 
 */

import type { HtmlTags, LoadContext, Plugin } from '@docusaurus/types';
// eslint-disable-next-line import/no-extraneous-dependencies, import/order
import logger from '@docusaurus/logger';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { type ThemeOptions, type Options, DEFAULT_OPTIONS } from './options';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const NAME = 'docusaurus-live-brython' as const;
export const DEFAULT_LIB_DIR = 'bry-libs' as const;

const theme: Plugin<{ remoteHeadTags: HtmlTags[] }> = (
    context: LoadContext,
    options: ThemeOptions,
) => {
    const libDir = options.libDir || DEFAULT_LIB_DIR;
    return {
        name: NAME,
        async loadContent() {
            if (!options.skipCopyAssetsToLibDir) {
                const staticDir = path.join(context.siteDir, context.siteConfig.staticDirectories[0], libDir);
                await fs.ensureDir(staticDir);
                if (process.env.NODE_ENV !== 'production') {
                    const assets = fs.readdirSync(path.join(__dirname, 'assets'));
                    for (const asset of assets) {
                        const assetFile = path.join(__dirname, 'assets', asset);
                        const assetOutFile = path.join(staticDir, asset);
                        logger.info(`copy "${asset}" to "${assetOutFile}"`);
                        await fs.copyFile(assetFile, assetOutFile);
                    }
                    return assets;
                }
            }
        },
        async contentLoaded({ content, actions }) {
            const { setGlobalData, addRoute } = actions;
            // Create friends global data
            setGlobalData({ libDir: `/${libDir.replace(/(\/|\\)/g, '')}/` });
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
        getThemePath() {
            return '../lib/theme';
        },
        getTypeScriptThemePath() {
            return '../src/theme';
        },
        injectHtmlTags() {
            return {
                headTags: [
                    {
                        tagName: 'script',
                        attributes: {
                            src: options.brythonSrc || DEFAULT_OPTIONS.brythonSrc,
                            crossorigin: "anonymous",
                            referrerpolicy: "no-referrer",
                            defer: 'defer'
                        },
                    },
                    {
                        tagName: 'script',
                        attributes: {
                            src: options.brythonStdlibSrc || DEFAULT_OPTIONS.brythonStdlibSrc,
                            crossorigin: "anonymous",
                            referrerpolicy: "no-referrer",
                            defer: 'defer'
                        },
                    }
                ],
            };
        },
        getSwizzleComponentList() {
            return [];
        }
    } as Plugin;
}

export default theme;
export {validateThemeConfig} from './options';
export {ThemeOptions, Options};