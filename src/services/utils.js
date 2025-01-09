import Lang from '../translations';

export function getAttribute(obj={}, key="") {
    if (obj === null || typeof obj !== 'object') {
        return undefined;
    }
    
    for(let i of Object.keys(obj)){
        if(i.startsWith(key)){
            return obj[i];
        }
    }
    
    for (let prop in obj) {
        if (typeof obj[prop] === 'object') {
            const result = getAttribute(obj[prop], key);
            if (result !== undefined) {
                return result;
            }
        }
    }
    
    return undefined;
}

export const isJson = (str) => {
    try {
        let aux = Object.keys(JSON.parse(str));
        return true;
    } catch (err) {
        return false;
    }
};

export const isNumber = (str) => {
    try {
        return Number(str) == str;
    } catch (err) {
        return false;
    }
}
