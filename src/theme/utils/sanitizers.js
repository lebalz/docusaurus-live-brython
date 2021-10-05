/**
* 
* @param {string} id 
* @returns string
*/
function sanitizedTitle(id) {
    if (!id) {
        return;
    }
    return id.replace(/--/g, '<<HYPHEN>>').replace(/__/g, '<<UNDERSCORE>>').replace(/[-_]/g, ' ').replace(/<<UNDERSCORE>>/g, '_').replace(/<<HYPHEN>>/g, '-')
}

/**
* 
* @param {string} id 
* @returns string
*/
function sanitizeId(id) {
    if (!id) {
        return;
    }
    return id.replace(/[\/\.\-#]/g, '_').replace(/%201/g, '_').replace(/[\.:,"'\s]/g, '')
}


/**
 * The python script is transformed to a string by embedding it with """ characters.
 * So we must prevent the script itself to contain this sequence of characters.
 * @param {String} script 
 */
 function sanitizePyScript(script) {
    return script.replace(/"{3}/g, "'''").replace(/\\n/, '\\\\n')
  }

export {sanitizeId, sanitizedTitle, sanitizePyScript}