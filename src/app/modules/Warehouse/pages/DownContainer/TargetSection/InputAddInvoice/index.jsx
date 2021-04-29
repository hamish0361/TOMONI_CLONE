import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import _ from 'lodash';

import { addInvoice, downContainerAction } from 'app/modules/Warehouse/warehouse-redux/downContainerSlice';
import SelectInvoice from 'app/components/Select/SelectInvoice';

const InputAddInvoice = props => {

    const dispatch = useDispatch();
    const listInvoices = useSelector(state => state.warehouse.downContainer.listInvoices.data);

    const handleSelectInvoice = (v) => {
        let matchedInvoice = _.find(listInvoices, ['id', v]);
        if(matchedInvoice) {
            dispatch(downContainerAction.setCurrentContainer(matchedInvoice))
        } else {
            dispatch(addInvoice({ id: v }));
        }
    }

    return (
        <SelectInvoice onChange={handleSelectInvoice} showLabel={false} />
    );
};

InputAddInvoice.propTypes = {

};

export default InputAddInvoice;