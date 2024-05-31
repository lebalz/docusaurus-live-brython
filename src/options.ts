/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Joi} from '@docusaurus/utils-validation';

import type {ThemeConfigValidationContext} from '@docusaurus/types';

export type ThemeOptions = {
    /**
     * The path to the brython source file.
     * @default 'https://raw.githack.com/brython-dev/brython/master/www/src/brython.js
     */
    brythonSrc: string;
    /**
     * The path to the brython standard library source file.
     * @default 'https://raw.githack.com/brython-dev/brython/master/www/src/brython_stdlib.js'
     */
    brythonStdlibSrc: string;
    /**
     * The folder path to brython specific libraries.
     * When a python file imports a module, the module is searched in the libDir directory.
     * By default, the libDir is created in the static folder and the needed python files are copied there.
     * This can be changed by setting `skipCopyAssetsToLibDir` to true and setting libDir to a custom path.
     * Make sure to copy the needed python files to the custom libDir.
     * @default '/bry-libs/'
     */
    libDir: string;
    /**
     * Skip copying the brython specific libraries to the `libDir`.
     * Make sure to copy the needed python files to the custom libDir yourself.
     * @ref [needed python files](https://github.com/lebalz/docusaurus-live-brython/tree/main/src/assets)
     * @default false
     */
    skipCopyAssetsToLibDir: boolean;
    /**
     * Specifies the the time in milliseconds to wait before syncing current changes to the local store.
     * This is useful to prevent storing the code on every key press.
     * @default 1000
     */
    syncMaxOnceEvery: number;
}


export type Options = Partial<ThemeOptions>;

export const DEFAULT_OPTIONS: ThemeOptions = {
    brythonSrc: 'https://raw.githack.com/brython-dev/brython/master/www/src/brython.js',
    brythonStdlibSrc: 'https://raw.githack.com/brython-dev/brython/master/www/src/brython_stdlib.js',
    libDir: '/bry-libs/',
    skipCopyAssetsToLibDir: false,
    syncMaxOnceEvery: 1000
};

const ThemeOptionSchema = Joi.object<ThemeOptions>({
    brythonSrc: Joi.string().default(DEFAULT_OPTIONS.brythonSrc),
    brythonStdlibSrc: Joi.string().default(DEFAULT_OPTIONS.brythonStdlibSrc),
    libDir: Joi.string().default(DEFAULT_OPTIONS.libDir),
    skipCopyAssetsToLibDir: Joi.boolean().default(DEFAULT_OPTIONS.skipCopyAssetsToLibDir),
    syncMaxOnceEvery: Joi.number().default(DEFAULT_OPTIONS.syncMaxOnceEvery)
});

export function validateThemeConfig(
    {themeConfig, validate}: ThemeConfigValidationContext<Options, ThemeOptions>
): ThemeOptions {
  const validatedConfig = validate(ThemeOptionSchema, themeConfig);
  return validatedConfig;
}