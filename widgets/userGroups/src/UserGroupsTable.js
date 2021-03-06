/**
 * Created by jakubniezgoda on 03/02/2017.
 */
import Actions from './actions';
import MenuAction from './MenuAction';
import GroupDetails from './GroupDetails';
import CreateModal from './CreateModal';
import TenantsModal from './TenantsModal';
import UsersModal from './UsersModal';

export default class UserGroupsTable extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            error: null,
            showModal: false,
            modalType: '',
            group: {},
            tenants: {},
            users: {}
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.props.widget, nextProps.widget)
            || !_.isEqual(this.state, nextState)
            || !_.isEqual(this.props.data, nextProps.data);
    }

    _refreshData() {
        this.props.toolbox.refresh();
    }

    componentDidMount() {
        this.props.toolbox.getEventBus().on('userGroups:refresh', this._refreshData, this);
    }

    componentWillUnmount() {
        this.props.toolbox.getEventBus().off('userGroups:refresh', this._refreshData);
    }

    fetchData(fetchParams) {
        return this.props.toolbox.refresh(fetchParams);
    }

    _selectUserGroup(userGroup) {
        let selectedUserGroup = this.props.toolbox.getContext().getValue('userGroup');
        this.props.toolbox.getContext().setValue('userGroup', userGroup === selectedUserGroup ? null : userGroup);
    }

    _getAvailableTenants(value, group) {
        this.props.toolbox.loading(true);

        let actions = new Actions(this.props.toolbox);
        actions.doGetTenants().then((tenants)=>{
            this.setState({error: null, group, tenants, modalType: value, showModal: true});
            this.props.toolbox.loading(false);
        }).catch((err)=> {
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });
    }

    _getAvailableUsers(value, group) {
        this.props.toolbox.loading(true);

        let actions = new Actions(this.props.toolbox);
        actions.doGetUsers().then((users)=>{
            this.setState({error: null, group, users, modalType: value, showModal: true});
            this.props.toolbox.loading(false);
        }).catch((err)=> {
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });
    }

    _showModal(value, group) {
        if (value === MenuAction.EDIT_TENANTS_ACTION) {
            this._getAvailableTenants(value, group);
        } else if (value === MenuAction.EDIT_USERS_ACTION) {
            this._getAvailableUsers(value, group);
        } else if (value === MenuAction.DELETE_ACTION || value === MenuAction.SET_ROLE_ACTION) {
            this.setState({group, modalType: value, showModal: true});
        } else {
            this.setState({error: `Internal error: Unknown action ('${value}') cannot be handled.`});
        }
    }

    _hideModal() {
        this.setState({showModal: false});
    }

    _handleError(message) {
        this.setState({error: message});
    }

    _deleteUserGroup() {
        this.props.toolbox.loading(true);

        var actions = new Actions(this.props.toolbox);
        actions.doDelete(this.state.group.name).then(()=>{
            this._hideModal();
            this.setState({error: null});
            this.props.toolbox.loading(false);
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this._hideModal();
            this.setState({error: err.message});
            this.props.toolbox.loading(false);
        });
    }

    render() {
        let {ErrorMessage, DataTable, Label, Confirm} = Stage.Basic;
        let RoleModal = Stage.Common.RoleModal;
        let actions = new Actions(this.props.toolbox);

        return (
            <div>
                <ErrorMessage error={this.state.error} onDismiss={() => this.setState({error: null})} autoHide={true}/>

                <DataTable fetchData={this.fetchData.bind(this)}
                           totalSize={this.props.data.total}
                           pageSize={this.props.widget.configuration.pageSize}
                           sortColumn={this.props.widget.configuration.sortColumn}
                           sortAscending={this.props.widget.configuration.sortAscending}
                           className="userGroupsTable">

                    <DataTable.Column label="Group" name="name" width="30%" />
                    <DataTable.Column label="LDAP group" name="ldap_dn" width="20%" />
                    <DataTable.Column label="System Role" name="role" width="15%" />
                    <DataTable.Column label="# Users" width="10%" />
                    <DataTable.Column label="# Tenants" width="10%" />
                    <DataTable.Column label="" width="5%" />
                    {
                        this.props.data.items.map((item) => {
                            return (
                                <DataTable.RowExpandable key={item.name} expanded={item.isSelected}>
                                    <DataTable.Row key={item.name} selected={item.isSelected} onClick={this._selectUserGroup.bind(this, item.name)}>
                                        <DataTable.Data>{item.name}</DataTable.Data>
                                        <DataTable.Data>{item.ldap_dn}</DataTable.Data>
                                        <DataTable.Data>{item.role} (<i>direct role</i>)</DataTable.Data>
                                        <DataTable.Data><Label className="green" horizontal>{item.userCount}</Label></DataTable.Data>
                                        <DataTable.Data><Label className="blue" horizontal>{item.tenantCount}</Label></DataTable.Data>
                                        <DataTable.Data className="center aligned">
                                            <MenuAction item={item} onSelectAction={this._showModal.bind(this)}/>
                                        </DataTable.Data>
                                    </DataTable.Row>
                                    <DataTable.DataExpandable>
                                        <GroupDetails data={item} toolbox={this.props.toolbox} onError={this._handleError.bind(this)}/>
                                    </DataTable.DataExpandable>
                                </DataTable.RowExpandable>
                            );
                        })
                    }
                    <DataTable.Action>
                        <CreateModal roles={this.props.roles} toolbox={this.props.toolbox}/>
                    </DataTable.Action>
                </DataTable>

                <UsersModal
                    open={this.state.modalType === MenuAction.EDIT_USERS_ACTION && this.state.showModal}
                    group={this.state.group}
                    users={this.state.users}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>

                <RoleModal
                    open={this.state.modalType === MenuAction.SET_ROLE_ACTION && this.state.showModal}
                    roles={this.props.roles}
                    resource={{role: this.state.group.role, name: this.state.group.name}}
                    onSetRole={(groupName, role) => {
                        this.props.toolbox.getEventBus().trigger('users:refresh');
                        return actions.doSetRole(groupName, role);
                    }}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>

                <TenantsModal
                    open={this.state.modalType === MenuAction.EDIT_TENANTS_ACTION && this.state.showModal}
                    group={this.state.group}
                    tenants={this.state.tenants}
                    onHide={this._hideModal.bind(this)}
                    toolbox={this.props.toolbox}/>

                <Confirm content={`Are you sure you want to remove group ${this.state.group.name}?`}
                         open={this.state.modalType === MenuAction.DELETE_ACTION && this.state.showModal}
                         onConfirm={this._deleteUserGroup.bind(this)}
                         onCancel={this._hideModal.bind(this)} />

            </div>
        );
    }
}
