import { RenderContext } from "../insomnia-api/InsomniaAPI";
import { readFileSync } from "fs";
import { sep as separator } from "path";
import { SCRIPT_LOCATION_ENV_VAR, SCRIPT_PLACEHOLDER } from "../constants";
import { getVarStore, isNotValid } from "../Utils";
import { isAsyncFunction } from "util/types";



function toBase64(value: string) {
    return Buffer.from(value, 'utf8').toString('base64');
}

function fromBase64(value: string) {
    return Buffer.from(value, 'base64').toString('utf8');
}

function getScriptsDir() {
    let envDir = process.env[SCRIPT_LOCATION_ENV_VAR];
    if(isNotValid(envDir)) {
        envDir = getVarStore(global, false)[SCRIPT_LOCATION_ENV_VAR] as string;
    }
    if(isNotValid(envDir)) {
        throw new Error(`Cannot find dir for scripts!
Set environment var or configure on the settings screen for this plugin.`);
    }
    return envDir;
}

export function loadScriptId(context: RenderContext, name: string, kind: 'request' | 'response') {
    const scriptLocation = `${getScriptsDir()}${separator}${name}`;
    let error: Error | null = null;
    let scriptContent = '';
    try {
        scriptContent = readFileSync(scriptLocation, {
            encoding: "utf-8"
        });
    } catch(e: any) {
        error = e;
    }
    if(context.renderPurpose != 'send') {
        if(error != null) {
            return `Script NOT found at [${scriptLocation}]`;
        }
        return `Script found at [${scriptLocation}]
-- content preview (first 100 bytes) --
${scriptContent.substring(0, 100)}`;
    } else {
        if(error != null) {
            throw new Error(`Script NOT found at [${scriptLocation}]`);
        }
        return `${SCRIPT_PLACEHOLDER}${kind}${toBase64(scriptLocation)}`;
    }
}

export function isValidScript(tryLocation: string, kind: 'request' | 'response') {
    return tryLocation.startsWith(`${SCRIPT_PLACEHOLDER}${kind}`);
}

export async function tryExecuteScript(tryLocation: string, context: any, kind: 'request' | 'response'): Promise<boolean> {
    let location = '';
    if(isValidScript(tryLocation, kind)) {
        location = fromBase64(tryLocation.substring(`${SCRIPT_PLACEHOLDER}${kind}`.length));
    } else {
        return false;
    }
    const originalExpect = global.expect;
    try {
        delete global.expect;
        global.context = context;
        const code = `
            (function () {
                return async function() {
                    ${readFileSync(location)}
                };
            })();
        `;
        const func = eval(code);
        if(isAsyncFunction(func)) {
            await func();
        } else {
            throw new Error('critical error!');
        }
        return true;
    } finally {
        delete global.context;
        global.expect = originalExpect;
    }
}