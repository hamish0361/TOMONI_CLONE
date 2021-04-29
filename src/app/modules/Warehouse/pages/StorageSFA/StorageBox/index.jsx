import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import StorageBoxCpn from 'app/modules/Warehouse/pages/PerformEntry/Step3_StorageBox/StorageBox';

import './index.scss';
import { performEntryAction } from 'app/modules/Warehouse/warehouse-redux/performEntrySlice';

const StorageBox = props => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(performEntryAction.setListPallets([]));
    }, []); // eslint-disable-line

    return (
        <div className="storage-box-page">
            <StorageBoxCpn />
        </div>
    );
};

export default StorageBox;