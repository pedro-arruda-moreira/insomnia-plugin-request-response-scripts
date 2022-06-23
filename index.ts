import { workspaceAction } from "./gui/gui";
import { RequestHook, ResponseHook, TemplateTagHandler, WorkspaceAction } from "./insomnia-api/InsomniaAPI";
import { requestHook, responseHook } from "./request-handler/rq-rs-handler";
import { postResponseTagHandler, preRequestTagHandler } from "./tag-handler/handler";

export const templateTags: TemplateTagHandler[] = [
	preRequestTagHandler,
    postResponseTagHandler
];

export const requestHooks: RequestHook[] = [
    requestHook
];

export const responseHooks: ResponseHook[] = [
    responseHook
];

export const workspaceActions: WorkspaceAction[] = [
    workspaceAction
];