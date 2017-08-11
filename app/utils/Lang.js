/**
 * Created by Alex Laktionow on 8/7/17.
 */

export default class Lang {
    // Core
    LOGIN_ERR_NO_TENANT = 'User is not attached to any tenant, cannot login';

    // Widgets
    DISPLAY_STYLE = 'Display style';
    TOGGLE_CLICK_TO_DRILLDOWN = 'Enable click to drill down';
    BLUEPRINT_ID_FILTER = 'Blueprint ID to filter by';
    BLUEPRINT_ID_FILTER_EXT = 'Enter the blueprint id you wish to filter by';

    // Graph
    DEPLOYMENT_ID_NAME = 'Deployment ID';
    DEPLOYMENT_ID_PLACEHOLDER = 'If not set, then will be taken from context';
    TIME_RANGE_START_NAME = 'Time range start';
    TIME_RANGE_START_PLACEHOLDER = 'Start time for data to be presented';
    TIME_RANGE_END_NAME = 'Time range end';
    TIME_RANGE_END_PLACEHOLDER = 'End time for data to be presented';
    METRIC_NAME = 'Metric';
    METRIC_PLACEHOLDER = 'Metric data to be presented on the graph';
    TIME_RESOLUTION_VALUE_NAME = 'Time resolution value';
    TIME_RESOLUTION_UNIT_NAME = 'Time resolution unit';
    DATABASE_QUERY_NAME = 'Database query';
    DATABASE_QUERY_PLACEHOLDER = 'InfluxQL query to fetch input data for the graph';
    GRAPH_TYPE_NAME = 'Graph type';
    GRAPH_LABEL_NAME = 'Graph label';
    GRAPH_LABEL_PLACEHOLDER = 'Data label to be shown below the graph';
    GRAPH_DATA_UNIT_NAME = 'Graph data unit';
    GRAPH_DATA_UNIT_PLACEHOLDER = 'Data unit to be shown on the left side of the graph';
    WARN_INVALID_CONFIG = 'Widget not configured properly. Please provide Metric and Deployment ID or database Query.';

    // BlueprintActionButtons
    CONFIRM_BLUEPRINT_REMOVE = 'Are you sure you want to remove this blueprint?';
    CREATE_DEPLOYMENT = 'Create deployment';
    DELETE_BLUEPRINT = 'Delete blueprint';

    // BlueprintCatalog
    GIT_USERNAME_NAME = 'Fetch with username';
    GIT_USERNAME_PLACEHOLDER = 'Type username';
    GIT_FILTER_NAME = 'Optional blueprints filter';
    GIT_FILTER_PLACEHOLDER = 'Type filter for GitHub repositories';
    WARN_MISSING_NAME = 'Please provide blueprint name';
    NAME = 'Name';
    DESCRIPTION = 'Description';

    // BlueprintInfo
    BLUEPRINT_ID_NAME = 'Blueprint ID';
    BLUEPRINT_ID_PLACEHOLDER = 'Enter the blueprint id you wish to show info';
    CREATED = 'Created';
    CREATOR = 'Creator';
    MAIN_BLUEPRINT_FILE = 'Main Blueprint File';
    UPDATED = 'Updated';
    DEPLOYMENTS = 'Deployments';
    UPLOAD = 'Upload';
    UPLOAD_BLUEPRINT = 'Upload blueprint';
    WARN_NO_BLUEPRINT_SELECTED = 'No blueprint selected';
    PRIVATE_RESOURCE = 'Private resource';
    BLUEPRINT_NAME = 'Blueprint name';
    BLUEPRINT_FILENAME = 'Blueprint filename';

    // Blueprints
    DELETE = 'Delete';
    DEPLOY = 'Deploy';
    WARN_SELECT_BLUEPRINT_FILE = 'Please select blueprint file or url';
    WARN_EITHER_URL_OR_FILE = 'Either blueprint file or url must be selected, not both';
    ENTER_BLUEPRINT_URL = 'Enter blueprint url';
    ENTER_IMAGE_URL = 'Enter image url';
    URL = 'URL';
    SELECT_BLUEPRINT_FILE = 'Select blueprint file';
    SELECT_IMAGE_FILE = 'Select image file';

    // BlueprintSources
    WARN_SELECT_BLUEPRINT_FOR_SOURCES = 'Please select blueprint to display source files';

    // Common
    WARN_NO_DEPLOYMENT_SELECTED = 'Please provide deployment name';
    WARN_NO_INPUTS_AVAILABLE = 'No inputs available for the blueprint';
    DEFAULT_VALUE = 'Default value';
    SKIP_PLUGIN_VALIDATION = 'Skip plugins validation';
    WARN_PLUGIN_ADVANCED_USERS = 'The recommended path is uploading plugins as wagons to Cloudify. This option is designed for plugin development and advanced users only.';

    // EventActions
    EVENTS_WORKFLOW_RECEIVED = 'Workflow received';
    EVENTS_WORKFLOW_STARTED = 'Workflow started';
    EVENTS_WORKFLOW_INIT_POLICIES = 'Workflow initializing policies';
    EVENTS_WORKFLOW_INIT_NODE = 'Workflow initializing node';
    EVENTS_WORKFLOW_END_SUCCESS = 'Workflow ended successfully';
    EVENTS_WORKFLOW_FAILED = 'Workflow failed';
    EVENTS_WORKFLOW_CANCELED = 'Workflow cancelled';
    EVENTS_WORKFLOW_STAGED = 'Workflow staged';
    EVENTS_TASK_STARTED = 'Task started';
    EVENTS_TASK_SENT = 'Task sent';
    EVENTS_TASK_RECEIVED = 'Task received';
    EVENTS_TASK_END_SUCCESS = 'Task ended successfully';
    EVENTS_TASK_FAILED = 'Task failed';
    EVENTS_TASK_RESCHEDULED = 'Task rescheduled';
    EVENTS_TASK_RETRIED = 'Task retried';
    ///[...]

    // ExecuteDeploymentModal
    WARN_MISSING_WORKFLOW_OR_DEPLOYMENT = 'Missing workflow or deployment';
    WARN_NO_PARAMS_FOR_EXECUTION = 'No parameters available for the execution';
    EXECUTE = 'Execute';

    // ExecutionStatus
    CANCEL = 'Cancel';
    FORCE_CANCEL = 'Force Cancel';

    // UpdateDeploymentModal
    WARN_NO_WORKFLOW_ID = 'Please provide workflow id';
    ENTER_NEW_BLUEPRINT_URL = 'Enter new blueprint url';
    SELECT_NEW_BLUEPRINT_FILE = 'Select new blueprint file';
    SELECT_INPUTS_FILE = 'Select inputs file';
    RUN_DEFAULT_WORKFLOW = 'Run default workflow';
    WORKFLOW_ID = 'WorkflowId';
    RUN_CUSTOM_WORKFLOW = 'Run custom workflow';
    RUN_UNINSTALL_WORKFLOW = 'Run uninstall workflow on removed nodes';
    RUN_INSTALL_WORKFLOW = 'Run install workflow on added nodes';
}