import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import useTrans from 'helper/useTrans';
import { fetchShipmentMethods } from 'app/modules/Warehouse/warehouse-redux/shipmentMethodSlice';

import TMNBaseSelect from '../BaseSelect';

import './index.scss';

const SelectEmbagoes = ({ onChange, value, showLabel = true, ...props }) => {
    const shipmentMethod = useSelector(state => state.warehouse.shipmentMethod.list.data);
    const loading = useSelector(state => state.warehouse.shipmentMethod.list.loading);
    const dispatch = useDispatch();
    const [trans] = useTrans();

    const makeOption = useCallback((i) => ({
        value: i.id,
        label: i.name
    }), []);

    const options = shipmentMethod?.map(item => makeOption(item));

    const handleSelect = option => {
        onChange && onChange((option || []).map(i => i.value));
    };

    const fetchData = (params) => {
        dispatch(fetchShipmentMethods(params));
    }

    return (
        <TMNBaseSelect
            value={value}
            label={showLabel && trans("PRODUCT.CREATE.PLACEHOLER.EMBARGOES")}
            className="select-embagoes"
            placeholder={trans("PRODUCT.CREATE.PLACEHOLER.EMBARGOES")}
            options={options}
            onChange={handleSelect}
            loading={loading}
            onFetchData={fetchData}
            isMulti
            {...props}
        />
    );
};

SelectEmbagoes.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    showLabel: PropTypes.bool
};

export default SelectEmbagoes;