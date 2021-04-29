import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { dashboardVNAction, fetchOutContainerPicker } from 'app/modules/Warehouse/warehouse-redux/dashboardVNSlice';

import { Card, CardBody } from '_metronic/_partials/controls';
import SelectInvoice from 'app/components/Select/SelectInvoice';

const TransferProductFilter = props => {

    const defaultArea = useSelector(state => state.warehouse.settings.default_area);
    const filter = useSelector(state => state.warehouse.dashboard_vn.boxes.filter);

    const dispatch = useDispatch();

    const handleChangeFilter = (value, key) => {
        dispatch(dashboardVNAction.changeFilterBoxes({ [key]: value }));
        dispatch(fetchOutContainerPicker());
    }

    const defaultParams = useMemo(() => {
        return defaultArea ? {
            search: `to_area_id:${defaultArea}`,
            searchFields: 'to_area_id:=',
            searchJoin: 'and'
        } : undefined
    }, [defaultArea]);

    return (
        <Card>
            <CardBody>
                <SelectInvoice
                    value={filter['outContainerPickers.container.id']}
                    onChange={(value) => handleChangeFilter(value, 'outContainerPickers.container.id')}
                    defaultParams={defaultParams}
                    showLabel={false}
                />
            </CardBody>
        </Card>
    );
};

TransferProductFilter.propTypes = {

};

export default TransferProductFilter;