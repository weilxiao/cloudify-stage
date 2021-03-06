/**
 * Created by pawelposel on 03/11/2016.
 */

import { connect } from 'react-redux'
import Manager from '../components/Manager'
import stageUtils from '../utils/stageUtils';
import Consts from '../utils/consts';

const mapStateToProps = (state, ownProps) => {
    var showServicesStatus = stageUtils.isUserAuthorized(Consts.permissions.STAGE_SERVICES_STATUS, state.manager);
    return {
        manager: ownProps.manager,
        showServicesStatus
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Manager);
