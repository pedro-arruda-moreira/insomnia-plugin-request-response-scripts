import { RenderContext, TemplateTagHandler, TemplateTagHandlerLiveDisplayNameArgument } from "../insomnia-api/InsomniaAPI";
import { loadScriptId } from "../script-handler/loader";

export const preRequestTagHandler: TemplateTagHandler = {
    liveDisplayName: (args: TemplateTagHandlerLiveDisplayNameArgument[]) => {
        return `Pre Request Script => ${args[0].value}`;
    },
    displayName: "Pre Request Script",
    name: "pre_req_script",
    description: "Script to execute before request",
    args: [{
        displayName: "fileName",
        type: "string"
    }],
    run: function (context: RenderContext, ...args: string[]): string | Promise<string> {
        return loadScriptId(context, args[0], 'request');
    }
};

export const postResponseTagHandler: TemplateTagHandler = {
    liveDisplayName: (args: TemplateTagHandlerLiveDisplayNameArgument[]) => {
        return `Post Response Script => ${args[0].value}`;
    },
    displayName: "Post Response Script",
    name: "post_resp_script",
    description: "Script to execute after response",
    args: [{
        displayName: "fileName",
        type: "string"
    }],
    run: function (context: RenderContext, ...args: string[]): string | Promise<string> {
        return loadScriptId(context, args[0], 'response');
    }
};