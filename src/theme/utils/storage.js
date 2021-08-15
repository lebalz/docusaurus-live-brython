const _MS_PER_DAY = 1000 * 60 * 60 * 24;
const _30_DAYS = 30 * _MS_PER_DAY;
const _1_YEAR = 365 * _MS_PER_DAY;
const _4_YEARS = 4 * _1_YEAR;

const checkExpiry = () => {
    const now = Date.now();
    const lastCleanup = JSON.parse(localStorage.getItem('last_cleanup') || now)
    if (now - lastCleanup > _MS_PER_DAY) {
        cleanUp();
    }
}

/**
 * 
 * @param {string} key 
 * @param {string|undefined} context 
 * @param {any} default_val 
 * @returns 
 */
const getItem = (key, context = undefined, default_val = undefined) => {
    checkExpiry();
    if (context) {
        const contextItem = localStorage.getItem(context);
        if (contextItem) {
            const item = JSON.parse(contextItem)
            if (typeof item === 'object') {
                const val = item[key];
                if (val === undefined) {
                    return default_val;
                }
                return val;
            }
            return default_val;
        }
    }
    const item = localStorage.getItem(key);
    if (item) {
        return JSON.parse(item)
    }
    return default_val;
}

/**
 * 
 * @param {string} key 
 * @param {object} value the value must be an object or an array of objects, s.t. it can be spreaded. 
 * @param {number} ttl time to live, default is 30 days
 * @example ```js
 * setItem('foo', {bar: 'baz'})
 * ```
 */
const setItem = (key, value, context = undefined, ttl = _30_DAYS) => {
    const now = Date.now();

    if (context) {
        let contextData = getItem(context, undefined, {})
        if (typeof contextData !== 'object') {
            contextData = {}
        }
        const oldItem = contextData[key] || {};
        const item = {
            ...oldItem,
            ...value
        }
        contextData.expiry = now + ttl;
        contextData[key] = item;
        localStorage.setItem(context, JSON.stringify(contextData))
        return;
    }
    const old = getItem(key, context, {})
    const item = {
        ...old,
        ...value,
        expiry: now + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item))
}

const cleanUp = () => {
    const now = Date.now();
    Object.keys(localStorage).forEach((key) => {
        const item = getItem(key, {});
        if (item.expiry && item.expiry > now) {
            localStorage.removeItem(key);
        }
    })
    localStorage.setItem('last_cleanup', now);
}

export { setItem, getItem, _1_YEAR, _4_YEARS }