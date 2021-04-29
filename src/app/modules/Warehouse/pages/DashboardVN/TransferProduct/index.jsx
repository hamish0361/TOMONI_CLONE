import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { dashboardVNAction } from 'app/modules/Warehouse/warehouse-redux/dashboardVNSlice';

import TableOutPickers from 'app/modules/Warehouse/components/Table/TableOutPickers';
import { Card, CardBody } from '_metronic/_partials/controls';
import BoxDetail from './BoxDetail';
import TransferProductFilter from './Filter';

const TransferProduct = props => {

    const { data } = useSelector(state => state.warehouse.dashboard_vn.boxes);
    const dispatch = useDispatch();
    const modalRef = useRef();

    const handleClickRow = (row, idx) => {
        dispatch(dashboardVNAction.setBoxDetailIdx(idx));

        modalRef.current.open();
    }

    return (
        <>
        <TransferProductFilter />

        <Card className="transfer-product">
            <CardBody>
                <TableOutPickers
                    data={data}
                    onRowClick={handleClickRow}
                />

                <BoxDetail ref={modalRef} />
            </CardBody>
        </Card>
        </>
    );
};

TransferProduct.propTypes = {

};

export default TransferProduct;