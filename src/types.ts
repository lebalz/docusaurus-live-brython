
export type ThemeOptions = {
    /**
     * The path to the brython source file.
     * @default 'https://raw.githack.com/brython-dev/brython/master/www/src/brython.js
     */
    brython_src?: string;
    /**
     * The path to the brython standard library source file.
     * @default 'https://raw.githack.com/brython-dev/brython/master/www/src/brython_stdlib.js'
     */
    brython_stdlib_src?: string;
    /**
     * The folder path to brython specific libraries.
     * When a python file imports a module, the module is searched in the libDir directory.
     * By default, the libDir is created in the static folder and the needed python files are copied there.
     * This can be changed by setting skipCopyAssetsToLibDir to true and setting libDir to a custom path.
     * Make sure to copy the needed python files to the custom libDir.
     * @default '/bry-libs/'
     */
    libDir?: string;
    /**
     * Skip copying the brython specific libraries to the libDir.
     * Make sure to copy the needed python files to the custom libDir yourself.
     * @ref [needed python files](https://github.com/lebalz/docusaurus-live-brython/tree/main/src/assets)
     * @default false
     */
    skipCopyAssetsToLibDir?: boolean;
}
