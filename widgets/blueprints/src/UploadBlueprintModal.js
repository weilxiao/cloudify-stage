/**
 * Created by kinneretzin on 05/10/2016.
 */

export default class UploadModal extends React.Component {

    constructor(props,context) {
        super(props,context);

        this.state = {...UploadModal.initialState, open: false};
        this.actions = new Stage.Common.BlueprintActions(props.toolbox);
    }

    static initialState = {
        loading: false,
        urlLoading: false,
        fileLoading: false,
        blueprintUrl: '',
        blueprintName: '',
        blueprintFileName: '',
        imageUrl: '',
        errors: {},
        yamlFiles: [],
        privateResource: false
    }

    onApprove () {
        this._submitUpload();
        return false;
    }

    onCancel () {
        this.setState({open: false});
        return true;
    }

    componentWillUpdate(prevProps, prevState) {
        if (!prevState.open && this.state.open) {
            this.refs.blueprintFile && this.refs.blueprintFile.reset();
            this.refs.imageFile && this.refs.imageFile.reset();
            this.setState(UploadModal.initialState);
        }
    }

    _submitUpload() {
        let blueprintFile = this.refs.blueprintFile.file();

        let errors = {};

        if (_.isEmpty(this.state.blueprintUrl) && !blueprintFile) {
            errors['blueprintUrl']=Stage.Lang.WARN_SELECT_BLUEPRINT_FILE;
        }

        if (!_.isEmpty(this.state.blueprintUrl) && blueprintFile) {
            errors['blueprintUrl']=Stage.Lang.WARN_EITHER_URL_OR_FILE;
        }

        if (_.isEmpty(this.state.blueprintName)) {
            errors['blueprintName']=Stage.Lang.WARN_MISSING_NAME;
        }

        if (!_.isEmpty(errors)) {
            this.setState({errors});
            return false;
        }

        // Disable the form
        this.setState({loading: true});

        this.actions.doUpload(this.state.blueprintName,
                         this.state.blueprintFileName,
                         this.state.blueprintUrl,
                         blueprintFile,
                         this.state.imageUrl,
                         this.refs.imageFile.file(),
                         this.state.privateResource).then(()=>{
            this.setState({errors: {}, loading: false, open: false});
            this.props.toolbox.refresh();
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, loading: false});
        });
    }

    _handleInputChange(proxy, field) {
        this.setState(Stage.Basic.Form.fieldNameValue(field));
    }

    _onBlueprintUrlBlur() {
        if (!this.state.blueprintUrl) {
            this.setState({yamlFiles: [], errors: {}});
            return;
        }

        this.setState({urlLoading: true});
        this.refs.blueprintFile.reset();
        this.actions.doListYamlFiles(this.state.blueprintUrl).then((yamlFiles)=>{
            this.setState({yamlFiles, errors: {}, urlLoading: false});
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, urlLoading: false});
        });
    }

    _onBlueprintFileChange(file) {
        if (!file) {
            this.setState({yamlFiles: [], errors: {}});
            return;
        }

        this.setState({fileLoading: true, blueprintUrl: ''});
        this.actions.doListYamlFiles(null, file).then((yamlFiles)=>{
            this.setState({yamlFiles, errors: {}, fileLoading: false});
        }).catch((err)=>{
            this.setState({errors: {error: err.message}, fileLoading: false});
        });
    }

    render() {
        var {Modal, Button, Icon, Form, ApproveButton, CancelButton, PrivateField} = Stage.Basic;
        const uploadButton = <Button content={Stage.Lang.UPLOAD} icon='upload' labelPosition='left' className="uploadBlueprintButton"/>;

        var options = _.map(this.state.yamlFiles, item => { return {text: item, value: item} });

        return (
            <div>
                <Modal trigger={uploadButton} open={this.state.open} onOpen={()=>this.setState({open:true})}
                       onClose={()=>this.setState({open:false})} className="uploadBlueprintModal">
                    <Modal.Header>
                        <Icon name="upload"/> Upload blueprint
                        <PrivateField lock={this.state.privateResource} title={Stage.Lang.PRIVATE_RESOURCE} className="rightFloated"
                                 onClick={()=>this.setState({privateResource:!this.state.privateResource})}/>
                    </Modal.Header>

                    <Modal.Content>
                        <Form loading={this.state.loading} errors={this.state.errors}
                              onErrorsDismiss={() => this.setState({errors: {}})}>
                            <Form.Group>
                                <Form.Field width="9" error={this.state.errors.blueprintUrl}>
                                    <Form.Input label={Stage.Lang.URL} placeholder={Stage.Lang.ENTER_BLUEPRINT_URL} name="blueprintUrl"
                                                onChange={this._handleInputChange.bind(this)} value={this.state.blueprintUrl}
                                                onBlur={this._onBlueprintUrlBlur.bind(this)} loading={this.state.urlLoading}
                                                icon={this.state.urlLoading?'search':false} disabled={this.state.urlLoading} />
                                </Form.Field>
                                <Form.Field width="1" style={{position:'relative'}}>
                                    <div className="ui vertical divider">
                                        Or
                                    </div>
                                </Form.Field>
                                <Form.Field width="8" error={this.state.errors.blueprintUrl}>
                                    <Form.File placeholder={Stage.Lang.SELECT_BLUEPRINT_FILE} name="blueprintFile" ref="blueprintFile"
                                               onChange={this._onBlueprintFileChange.bind(this)} loading={this.state.fileLoading}
                                               disabled={this.state.fileLoading}/>
                                </Form.Field>
                            </Form.Group>

                            <Form.Field error={this.state.errors.blueprintName}>
                                <Form.Input name='blueprintName' placeholder={Stage.Lang.BLUEPRINT_ID_NAME}
                                            value={this.state.blueprintName} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>

                            <Form.Field>
                                <Form.Dropdown placeholder={Stage.Lang.BLUEPRINT_FILENAME} search selection options={options} name="blueprintFileName"
                                               value={this.state.blueprintFileName} onChange={this._handleInputChange.bind(this)}/>
                            </Form.Field>

                            <Form.Group>
                                <Form.Field width="9" error={this.state.errors.imageUrl}>
                                    <Form.Input label={Stage.Lang.URL} placeholder={Stage.Lang.ENTER_IMAGE_URL} name="imageUrl"
                                                value={this.state.imageUrl} onChange={this._handleInputChange.bind(this)}
                                                onBlur={()=>this.state.imageUrl ? this.refs.imageFile.reset() : ''}/>
                                </Form.Field>
                                <Form.Field width="1" style={{position:'relative'}}>
                                    <div className="ui vertical divider">
                                        Or
                                    </div>
                                </Form.Field>
                                <Form.Field width="8" error={this.state.errors.imageUrl}>
                                    <Form.File placeholder={Stage.Lang.SELECT_IMAGE_FILE} name="imageFile" ref="imageFile"
                                               onChange={(file)=>file ? this.setState({imageUrl: ''}) : ''}/>
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </Modal.Content>

                    <Modal.Actions>
                        <CancelButton onClick={this.onCancel.bind(this)} disabled={this.state.loading} />
                        <ApproveButton onClick={this.onApprove.bind(this)} disabled={this.state.loading} content={Stage.Lang.UPLOAD} icon="upload" color="green"/>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
};
