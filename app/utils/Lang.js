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
    CONFIRM_BLUEPRINT_REMOVE = 'Are you sure you want to remove blueprint'; // blueprint name follows
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
}