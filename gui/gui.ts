import { SCRIPT_LOCATION_ENV_VAR } from "../constants";
import { WorkspaceAction, WorkspaceActionContext } from "../insomnia-api/InsomniaAPI";
import { getVarStore } from "../Utils";

async function createGUI(context: WorkspaceActionContext): Promise<HTMLElement> {
    function createElem(type: string): HTMLElement {
        return global.document.createElement(type);
    }
    const span1 = createElem('span');
    const span2 = createElem('span');
    span1.innerHTML = 'Current script location:&nbsp;';
    span2.innerHTML = getVarStore(global, false)[SCRIPT_LOCATION_ENV_VAR] as string;
    const div = createElem('div');
    const btn = createElem('a') as HTMLAnchorElement;
    btn.innerHTML = 'Change scripts location';
    btn.href = 'javascript://';
    btn.addEventListener('click', async (_) => {
        getVarStore(global, false)[SCRIPT_LOCATION_ENV_VAR] = await context.app.prompt(
            'Please type new script location',
            {
                cancelable: true,
                defaultValue: getVarStore(global, false)[SCRIPT_LOCATION_ENV_VAR] as string,
                submitName: "Sounds good!"
            }
        );
        span2.innerHTML = getVarStore(global, false)[SCRIPT_LOCATION_ENV_VAR] as string;
    });
    div.appendChild(span1);
    div.appendChild(span2);
    div.appendChild(createElem('br'));
    div.appendChild(createElem('br'));
    div.appendChild(btn);
    return div;
}

export const workspaceAction: WorkspaceAction = {
    label: "insomnia-plugin-request-response-scripts options",
    icon: "fa-wrench",
    action: async function (context: WorkspaceActionContext, _: any): Promise<void> {
        context.app.dialog("insomnia-plugin-request-response-scripts options", await createGUI(context), {
            skinny: true,
            tall: false,
            wide: false
        })
    }
};