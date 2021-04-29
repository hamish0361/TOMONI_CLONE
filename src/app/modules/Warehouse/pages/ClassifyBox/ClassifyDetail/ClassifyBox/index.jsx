import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import useTrans from 'helper/useTrans';
import { fetchBoxOwners } from 'app/modules/Warehouse/warehouse-redux/boxOwnerSlice';

import { Card, CardBody } from '_metronic/_partials/controls';
import Layout from 'app/modules/Warehouse/components/Layout';
import ListBox from 'app/modules/Warehouse/components/List/ListBox';
import Loading from 'app/components/Loading';
import TableBoxOwners from 'app/modules/Warehouse/components/Table/TableBoxOwners';
import AddOrder from './AddOrder';
import AlertShipmentMethod from './AlertShipmentMethod';
import SelectBox from 'app/modules/Warehouse/components/SelectBox';

import './index.scss';

const ClassifyBox = ({ f5DataSFA }) => {
    const boxOwnerData = useSelector(state => state.warehouse.boxOwner.list.data);
    const loading = useSelector(state => state.warehouse.boxOwner.list.loading);
    const dispatch = useDispatch();
    const params = useParams();
    const history = useHistory();
    const [trans] = useTrans();

    useEffect(() => {
        if (params?.box_id) f5DataBox();
    }, [params?.box_id]); // eslint-disable-line

    const f5DataBox = () => {
        return dispatch(fetchBoxOwners({
            search: `box_id:${params?.box_id}`,
            searchFields: 'box_id:=',
            appends: 'object'
        }))
    }

    const handleSelectBox = (box) => {
        history.push(`/warehouse/classify-box/${params?.sfa_id}/${box.id}`);
    }

    const handleBoxChange = (option) => {
        if (!option) return;

        handleSelectBox({ id: option.value });
    }

    return (
        <Layout title={`${trans("MENU.WAREHOUSE.ASSIGN_BOXES")} - SFA: ${params?.sfa_id}`}>
            <div className="row classify-box">
                <div className="col-lg-9 col-md-12 col-sm-12" style={{ height: '100%' }}>
                    <Card className="mb-0 position-relative">
                        {loading && <Loading local />}
                        <CardBody>
                            <div className="ipad-shown select-box-mobile">
                                <label htmlFor="">{trans("warehouse.sku.title")}</label>
                                <SelectBox onChange={handleBoxChange} />
                            </div>
                            <AddOrder onSuccess={f5DataBox} />
                            <AlertShipmentMethod />
                            <TableBoxOwners onRefresh={f5DataBox} data={boxOwnerData} />
                        </CardBody>
                    </Card>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12 ipad-hidden">
                    <ListBox
                        onSelectBox={handleSelectBox}
                        showQuantity={(b) => b.duplicate}
                        showTotalItems
                        showRelative
                        showItems
                        externalLink={b => `/warehouse/inbound/step-2/${b.sfa_id}/${b.id}`}
                    />
                </div>
            </div>
        </Layout>
    );
};

ClassifyBox.propTypes = {

};

export default ClassifyBox;
