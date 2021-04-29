import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { fetchShelves } from 'app/modules/Warehouse/warehouse-redux/shelveSlice';
import useTrans from 'helper/useTrans';

import TMNBaseSelect from '../BaseSelect';

const SelectShelve = ({ onChange, value, showLabel = true, ...props }) => {
    const shelveList = useSelector(state => state.warehouse.shelve.list.data);
    const loading = useSelector(state => state.warehouse.shelve.list.loading);
    const dispatch = useDispatch();
    const [trans] = useTrans();

    const makeOption = useCallback((i) => ({
        value: i.id,
        label: i?.name
    }), []);

    const shelveOptions = shelveList?.map(item => makeOption(item));

    const handleSelect = option => {
        onChange && onChange(option.value);
    };

    const fetchData = (params) => {
        dispatch(fetchShelves(params));
    }

    return (
        <TMNBaseSelect
            value={value}
            label={showLabel && trans("warehouse.shelve.find")}
            placeholder={trans("warehouse.shelve.find")}
            className="select-shelve"
            options={shelveOptions}
            onChange={handleSelect}
            loading={loading}
            onFetchData={fetchData}
            typeSearch="name"
            {...props}
        />
    );
};

SelectShelve.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    showLabel: PropTypes.bool
};

export default SelectShelve;
