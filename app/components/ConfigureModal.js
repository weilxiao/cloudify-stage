/**
 * Created by kinneretzin on 07/03/2017.
 */

import React, {Component, PropTypes} from "react";
import {Modal, ErrorMessage, GenericField, Form, ApproveButton, CancelButton} from "./basic";

export default class ConfigureModal extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = ConfigureModal.initialState(props);
    }

    static initialState = (props) => {
        return {
            loading: false,
            canUserEdit: props.config.canUserEdit,
            mainColor: props.config.mainColor,
            headerTextColor: props.config.headerTextColor,
            logoUrl: props.config.logoUrl,
            loginPageHeader: props.config.loginPageHeader,
            loginPageText: props.config.loginPageText
        }
    };

    static propTypes = {
        show: PropTypes.bool.isRequired,
        onSave: PropTypes.func.isRequired
    };

    static defaultProps = {
    };

    componentWillReceiveProps(nextProps) {
        this.setState(ConfigureModal.initialState(nextProps));
    }

    onApprove () {
        this.props.onSave({
            canUserEdit: this.state.canUserEdit,
            mainColor: this.state.mainColor,
            headerTextColor: this.state.headerTextColor,
            sidebarColor: this.state.sidebarColor,
            sidebarTextColor: this.state.sidebarTextColor,
            logoUrl: this.state.logoUrl,
            loginPageHeader: this.state.loginPageHeader,
            loginPageText: this.state.loginPageText
        })
            .then(this.props.onHide)
            .catch((err)=>{
                    this.setState({error: err.message});
                });
        return false;
    }

    onDeny () {
        this.props.onHide();
        return true;
    }

    _handleInputChange(proxy, field) {
        this.setState(Form.fieldNameValue(field));
    }

    render() {
        return (
            <Modal open={this.props.show}>
                <Modal.Header>
                    Configure UI properties
                </Modal.Header>
                <Modal.Content>
                    <ErrorMessage error={this.state.error}/>

                    <Form loading={this.state.loading}>
                        <GenericField label='Can users edit their own screens?'
                                      name='canUserEdit'
                                      type={GenericField.BOOLEAN_TYPE}
                                      description='Check this if you want to allow users (non admin) to edit their own screens in the UI (move to edit mode)'
                                      value={this.state.canUserEdit}
                                      onChange={this._handleInputChange.bind(this)}/>

                        <GenericField label='Main color'
                                      name='mainColor'
                                      type={GenericField.COLOR_TYPE}
                                      description=''
                                      value={this.state.mainColor}
                                      onChange={this._handleInputChange.bind(this)}/>

                        <GenericField label='Header text color'
                                      name='headerTextColor'
                                      type={GenericField.COLOR_TYPE}
                                      description=''
                                      value={this.state.headerTextColor}
                                      onChange={this._handleInputChange.bind(this)}/>

                        <GenericField label='Sidebar color'
                                      name='sidebarColor'
                                      type={GenericField.COLOR_TYPE}
                                      description=''
                                      value={this.state.sidebarColor}
                                      onChange={this._handleInputChange.bind(this)}/>

                        <GenericField label='Sidebar text color'
                                      name='sidebarTextColor'
                                      type={GenericField.COLOR_TYPE}
                                      description=''
                                      value={this.state.sidebarTextColor}
                                      onChange={this._handleInputChange.bind(this)}/>

                        <GenericField label='Logo URL'
                                      name='logoUrl'
                                      type={GenericField.STRING_TYPE}
                                      description=''
                                      value={this.state.logoUrl}
                                      onChange={this._handleInputChange.bind(this)}/>

                        <GenericField label='Login page header'
                                      name='loginPageHeader'
                                      type={GenericField.STRING_TYPE}
                                      description=''
                                      value={this.state.loginPageHeader}
                                      onChange={this._handleInputChange.bind(this)}/>

                        <GenericField label='Login page text'
                                      name='loginPageText'
                                      type={GenericField.STRING_TYPE}
                                      description=''
                                      value={this.state.loginPageText}
                                      onChange={this._handleInputChange.bind(this)}/>
                    </Form>
                </Modal.Content>

                <Modal.Actions>
                    <CancelButton onClick={this.onDeny.bind(this)} disabled={this.state.loading} />
                    <ApproveButton content="Save" color="green" onClick={this.onApprove.bind(this)} disabled={this.state.loading} />
                </Modal.Actions>
            </Modal>
        )
    }
}