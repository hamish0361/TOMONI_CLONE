import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { fetchLocations } from 'app/modules/Warehouse/warehouse-redux/locationSlice';
import { isLocationCode, useScanBarcode } from 'helper/useScanBarcode';
import useTrans from 'helper/useTrans';

import TMNBaseSelect from '../BaseSelect';

import './index.scss';

const SelectLocation = ({ onChange, value, showLabel = true, defaultQuery = {}, ...props }) => {
    const locationList = useSelector(state => state.warehouse.location.list.data);
    const loading = useSelector(state => state.warehouse.location.list.loading);
    const dispatch = useDispatch();
    const [trans] = useTrans();

    const makeOption = useCallback((i) => ({
        value: i?.id,
        label: i?.name
    }), []);

    const locationOptions = locationList?.map(item => makeOption(item));

    useScanBarcode({
        condition: isLocationCode,
        onEnter: (v) => { onChange(v) }
    });

    const getParams = useCallback((myParams) => {
        let params = { ...defaultQuery };

        Object.entries(myParams).forEach(([key, value]) => {
            if (params[key]) params[key] += `;${value}`;
            else params[key] = value;
        });

        return params;
    }, [defaultQuery]);

    const handleSelect = option => {
        onChange && onChange(option.value);
    };

    const fetchData = (params) => {
        dispatch(fetchLocations(getParams({ ...params, with: 'shelve.area' })));
    }

    return (
        <TMNBaseSelect
            value={value}
            label={showLabel && trans("warehouse.location.title")}
            className="select-location"
            placeholder={trans("warehouse.location.find")}
            options={locationOptions}
            onChange={handleSelect}
            loading={loading}
            onFetchData={fetchData}
            typeSearch="name"
            {...props}
        />
    );
};

SelectLocation.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    showLabel: PropTypes.bool,
    defaultQuery: PropTypes.any
};

export default SelectLocation;
