/**
 * Created by jakubniezgoda on 27/01/2017.
 */

class ExecutionActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doCancel(execution,action) {
        return this.toolbox.getManager().doPost(`/executions/${execution.id}`, null, {
            // 'deployment_id': execution.deployment_id, // no need for coz we use this function in snapshots too
            'action': action
        });
    }
}

Stage.defineCommon({
    name: 'ExecutionActions',
    common: ExecutionActions
});