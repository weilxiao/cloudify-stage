/**
 * Created by jakubniezgoda on 27/01/2017.
 */

class ExecutionActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doCancel(execution,action) {
        return this.toolbox.getManager().doPost(`/executions/${execution.id}`, null, {
            'action': action
        });
    }

    getExecution(execution){
        return this.toolbox.getManager().doGet(`/executions/${execution.id}`);
    }
}

Stage.defineCommon({
    name: 'ExecutionActions',
    common: ExecutionActions
});