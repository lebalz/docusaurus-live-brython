
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

export {sanitizeId, sanitizedTitle}