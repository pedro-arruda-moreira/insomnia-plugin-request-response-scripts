import { RequestContext, RequestContextRequest, RequestHook, ResponseContext, ResponseHook } from "../insomnia-api/InsomniaAPI";
import { isValidScript, tryExecuteScript } from "../script-handler/loader";
import { getVarStore, OpenObject } from "../Utils";

const RESPONSE_SCRIPT_KEY = '_response_scripts';

export const requestHook: RequestHook = async (context: RequestContext) => {
    const rq = context.request;
    getVarStore(global, false)[rq.getId()] = rq;
    const responseScriptStore: Array<string> = [];
    getVarStore(rq, false)[RESPONSE_SCRIPT_KEY] = responseScriptStore;
    const headers = rq.getHeaders();
    for(const header of headers) {
        if(await tryExecuteScript(header.name, context, 'request')) {
            rq.removeHeader(header.name);
        } else if(isValidScript(header.name, 'response')) {
            responseScriptStore.push(header.name);
            rq.removeHeader(header.name);
        }
    }
};

export const responseHook: ResponseHook = async (context: ResponseContext) => {
    const rs = context.response;
    const requestId = rs.getRequestId();
    const varStore = getVarStore(global, false);
    const rq = varStore[requestId] as RequestContextRequest;
    const responseScriptStore: Array<string> = getVarStore(rq, false)[RESPONSE_SCRIPT_KEY] as string[];
    for(const script of responseScriptStore) {
        if(await tryExecuteScript(script, context, 'response')) {
            
        }
    }
    getVarStore(rq, true);
    delete varStore[requestId];
};