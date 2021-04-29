import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, useHistory, useParams, useRouteMatch } from 'react-router-dom';

import { boxAction, fetchBox } from 'app/modules/Warehouse/warehouse-redux/boxSlice';
import useTrans from 'helper/useTrans';
import { fetchSFA } from 'app/modules/Warehouse/warehouse-redux/sfaSlice';
import getBoxCloseState from 'app/modules/Warehouse/selector/PerformEntry/getBoxCloseState';

import { Card, CardBody, CardHeader, CardHeaderToolbar } from '_metronic/_partials/controls';
import NotFound from 'app/components/NotFound';
import Loading from 'app/components/Loading';
import CurrentBox from '../../../../components/PerformEntry/CurrentBox';
import AddBoxItem from './AddBoxItem';
import TableBoxItem from './TableBoxItem';
import CreateNewBox from '../../../../components/PerformEntry/CreateNewBox';
import Header from './Header';
import ListBox from 'app/modules/Warehouse/components/List/ListBox';
import NeedPermission from 'app/components/NeedPermission';
import Switch from '@material-ui/core/Switch';
import { dialog } from 'app/components/DialogNotify';

const CheckingBox = props => {

    const isBoxClosed = useSelector(getBoxCloseState);
    const { data, loading } = useSelector(state => state.warehouse.box.detail);
    const isCloseAndPrintLabel = useSelector(state => state.warehouse.box.isCloseAndPrintLabel);
    const params = useParams();
    const dispatch = useDispatch();
    const match = useRouteMatch();
    const history = useHistory();
    const [trans] = useTrans();

    useEffect(() => {
        if (params?.box_id) f5BoxData();
    }, [params?.box_id]); // eslint-disable-line

    const f5BoxData = () => {
        dispatch(fetchBox({ id: params?.box_id, with: 'childs;items' }));
    }

    const updateBoxSuccess = () => {
        f5BoxData();
    }

    const createBoxSuccess = (res) => {
        history.push(`/warehouse/inbound/step-2/${params?.sfa_id}/${res.id}`);
        f5SFAData();
    }

    const f5SFAData = () => {
        dispatch(fetchSFA({ id: params?.sfa_id, with: 'boxes' }))
    }

    const handleSelectBox = (box) => {
        history.push(`/warehouse/inbound/step-2/${params?.sfa_id}/${box.id}`);
    }

    const handleChangeSwitch = (e) => {
        dispatch(boxAction.setIsCloseAndPrint(e.target.checked));

        dialog.success(trans("common.change_mode.success"));
    }

    if (!data && !loading) return <NotFound />;

    return (
        <div className="checking-box position-relative">
            {loading && <Loading local />}

            <div className="row">
                <div className="col-lg-9 col-md-12 col-sm-12" style={{ height: '100%' }}>
                    <div className="row">
                        <div className="col-sm-12"><Header /></div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12"><CurrentBox /></div>
                    </div>

                    <Card className="mb-0">
                        <CardHeader title={trans("warehouse.box_item.title")}>
                            <CardHeaderToolbar>
                                {!isBoxClosed && (
                                    <div className="d-flex align-items-center">
                                        <span className="switch-label">
                                            {
                                                isCloseAndPrintLabel ?
                                                    trans("warehouse.sku.is_close_and_print_label.on")
                                                    : trans("warehouse.sku.is_close_and_print_label.off")
                                            }
                                        </span>
                                        <Switch
                                            checked={isCloseAndPrintLabel}
                                            onChange={handleChangeSwitch}
                                            color="primary"
                                            name="checkedB"
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    </div>
                                )}
                            </CardHeaderToolbar>
                        </CardHeader>
                        <CardBody>
                            <AddBoxItem />
                            <TableBoxItem />
                        </CardBody>
                    </Card>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12 ipad-hidden">
                    <ListBox onSelectBox={handleSelectBox} showQuantity={(b) => b.duplicate} />
                </div>
            </div>

            <NeedPermission need={"boxes.create"}>
                <Route path={`${match.path}/create-box`}>
                    {({ match }) => (
                        <CreateNewBox
                            show={match !== null}
                            onSuccess={createBoxSuccess}
                        />
                    )}
                </Route>
            </NeedPermission>

            <NeedPermission need={"boxes.update"}>
                <Route path={`${match.path}/edit-box`}>
                    {({ match }) => (
                        <CreateNewBox
                            show={match !== null}
                            onSuccess={updateBoxSuccess}
                            initialValues={data}
                            isHaveDuplicate={false}
                        />
                    )}
                </Route>
            </NeedPermission>
        </div>
    );
};

CheckingBox.propTypes = {

};

export default React.memo(CheckingBox);