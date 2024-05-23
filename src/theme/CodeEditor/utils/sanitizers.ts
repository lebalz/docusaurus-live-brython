
const sanitizedTitle = (id: string) => {
    if (!id) {
        return;
    }
    return id.replace(/--/g, '<<HYPHEN>>').replace(/__/g, '<<UNDERSCORE>>').replace(/[-_]/g, ' ').replace(/<<UNDERSCORE>>/g, '_').replace(/<<HYPHEN>>/g, '-')
}

const sanitizeId = (id: string) => {
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
const sanitizePyScript = (script: string) => {
    return script.replace(/"{3}/g, "'''").replace(/\\n/g, '\\\\n').replace(/\\r/g, '\\\\r')
}

export {sanitizeId, sanitizedTitle, sanitizePyScript}