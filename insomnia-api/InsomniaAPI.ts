import { OpenObject } from "../Utils";

export interface WorkspaceActionContextAppDialogParams {
    tall: boolean;
    wide: boolean;
    skinny: boolean;
}

export interface WorkspaceActionContextApp {
    dialog: (
        title: string,
        element: HTMLElement,
        params: WorkspaceActionContextAppDialogParams
    ) => void | Promise<void>;
    prompt(title: string, options?: {
        label?: string;
        defaultValue?: string;
        submitName?: string;
        cancelable?: boolean;
    }): Promise<string>;
}

export interface PluginStore {
    hasItem: (key: string) => Promise<boolean>;
    getItem: (key: string) => Promise<string>;
    setItem: (key: string, value: string) => Promise<void>;
    clear: () => Promise<void>;
    all(): Promise<Array<{ key: string, value: string }>>;
}

export interface WorkspaceActionContext {
    app: WorkspaceActionContextApp;
    store: PluginStore;
}

export interface WorkspaceAction {
    label: string;
    icon: string;
    action: (context: WorkspaceActionContext, data: any) => void | Promise<void>;
}

export interface Environment extends OpenObject {
    getEnvironmentId(): string;
}

export interface RequestContextRequestBodyParam {
    name: string;
    value: string;
    id: string;
}

export interface RequestContextRequestBody {
    mimeType: string;
    text?: string;
    params?: RequestContextRequestBodyParam[];
}

export interface RequestContextRequest {
    getEnvironment(): Environment;
    getId(): string;
    getHeaders(): Array<{ name: string, value: string }>;
    removeHeader(name: string): void;
    getBody(): RequestContextRequestBody | undefined;
}

export interface RequestContext {
    store: PluginStore;
    request: RequestContextRequest;
}

export interface ResponseContextResponse {
    getRequestId(): string;
}

export interface ResponseContext {
    response: ResponseContextResponse;
}

export interface RenderContext {
    store: PluginStore;
    context: Environment;
    renderPurpose: string;
}

export interface TemplateTagHandlerLiveDisplayNameArgument {
    name: string;
    value: string;
}

export interface TemplateTagHandlerArgOption {
    displayName: string | ((args: string[]) => string);
    value: string;
}

export interface TemplateTagHandlerArg {
    displayName: string;
    type: string;
    options?: TemplateTagHandlerArgOption[];
    description?: string;
    defaultValue?: boolean | string;
    help?: string;
    validate?: (value: string) => string;
}

export interface TemplateTagHandler {
    liveDisplayName?: (args: TemplateTagHandlerLiveDisplayNameArgument[]) => string;
    displayName: string;
    name: string;
    description: string;
    args: TemplateTagHandlerArg[];
    run: (context: RenderContext, ...args: (string | boolean)[]) => string | Promise<string>;
}

export type RequestHook = (context: RequestContext) => void | Promise<void>;
export type ResponseHook = (context: ResponseContext) => void | Promise<void>;