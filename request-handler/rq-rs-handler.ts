import { SCRIPT_PLACEHOLDER } from "../constants";
import { RequestContext, RequestContextRequest, RequestContextRequestBodyParam, RequestHook, ResponseContext, ResponseHook } from "../insomnia-api/InsomniaAPI";
import { isValidScript, tryExecuteScript } from "../script-handler/loader";
import { getVarStore } from "../Utils";

const RESPONSE_SCRIPT_KEY = '_response_scripts';

export const requestHook: RequestHook = async (context: RequestContext) => {
    const rq = context.request;
    getVarStore(global, false)[rq.getId()] = rq;
    const responseScriptStore: Array<string> = [];
    getVarStore(rq, false)[RESPONSE_SCRIPT_KEY] = responseScriptStore;
    const headers = rq.getHeaders();
    for(const header of headers) {
        if(isValidScript(header.name, 'response')) {
            responseScriptStore.push(header.name);
            rq.removeHeader(header.name);
        }
    }
    const body = rq.getBody();
    if(body == undefined) {
        return;
    }
    if(body.mimeType != 'application/x-www-form-urlencoded' && body.mimeType != 'multipart/form-data') {
        return;
    }
    const newParams: RequestContextRequestBodyParam[] = [];
    for(const param of body.params as RequestContextRequestBodyParam[]) {
        if(param.name != SCRIPT_PLACEHOLDER) {
            newParams.push(param);
        }
    }
    body.params = newParams;
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