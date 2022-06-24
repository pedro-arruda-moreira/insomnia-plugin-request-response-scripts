import { SCRIPT_PLACEHOLDER } from "../constants";
import { RenderContext, TemplateTagHandler, TemplateTagHandlerLiveDisplayNameArgument } from "../insomnia-api/InsomniaAPI";
import { loadScriptId, tryExecuteScript } from "../script-handler/loader";

export const preRequestTagHandler: TemplateTagHandler = {
    liveDisplayName: (args: TemplateTagHandlerLiveDisplayNameArgument[]) => {
        return `Pre Request Script => ${args[0].value}`;
    },
    displayName: "Pre Request Script",
    name: "pre_req_script",
    description: "Script to execute before request",
    args: [
        {
            displayName: "fileName",
            type: "string",
            help: 'The name of the script to execute'
        },
        {
            displayName: "Acknowledge",
            type: 'boolean',
            help: 'You acknowledge that you must use this tag as the first content inside the body',
            defaultValue: false
        },
        {
            displayName: 'bodyType',
            type: 'enum',
            help: 'The type of body this tag is being put on',
            options: [
              { displayName: 'Text (JSON, XML, YAML, EDN, Plain)', value: 'text' },
              { displayName: 'Structured (Multipart Form, Form URL Encoded)', value: 'struct' },
            ],
          },
    ],
    run: function (context: RenderContext, ...args: (string | boolean)[]): string | Promise<string> {
        if(!args[1]) {
            throw new Error('not acknowledged');
        }
        if(context.renderPurpose != 'send') {
            return loadScriptId(context, args[0] as string, 'request');
        }
        tryExecuteScript(args[0] as string, context, 'request');
        if(args[2] as string == 'text') {
            return '';
        } else {
            return SCRIPT_PLACEHOLDER;
        }
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
    run: function (context: RenderContext, ...args: (string | boolean)[]): string | Promise<string> {
        return loadScriptId(context, args[0] as string, 'response');
    }
};