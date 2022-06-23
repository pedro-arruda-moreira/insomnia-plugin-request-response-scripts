
const ENVIRONMENT_KEY = '__environment__';

export function getVarStore(targetObj: any, reset: boolean): OpenObject {
	let varStore = targetObj.varStore as OpenObject | null;
	if(isNotValid(varStore) || reset) {
		console.log('creating new var store.');
        const oldVarStore = varStore;
		varStore = {};
        if(oldVarStore?.ENVIRONMENT_KEY) {
            varStore[ENVIRONMENT_KEY] = oldVarStore[ENVIRONMENT_KEY];
        }
		targetObj.varStore = varStore;
	}
	return varStore as OpenObject;
}

export function isValid(value: any) {
    return value != null && value != undefined;
}

export function isNotValid(value: any) {
    return !isValid(value);
}

export interface OpenObject {
    [x: string]: unknown;
}