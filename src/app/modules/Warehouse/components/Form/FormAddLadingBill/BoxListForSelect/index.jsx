import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BoxItem from './BoxItem';

import './index.scss';
import BaseSwitch from 'app/components/Switch';

const BoxListForSelect = ({ dataList, onChangeItem, onSelectMultiItem }) => {

    const [filterSM, setFilterSM] = useState('sea');
    const [selectAll, setSelectAll] = useState(false);

    const handleChangeFitlerSM = (checked) => {
        if (checked) setFilterSM('air');
        else setFilterSM('sea');

        setSelectAll(false);
    }

    const toggleSelectAll = () => {
        setSelectAll(!selectAll);

        let willChangeBox = dataList
            .filter(item => {
                return !item.suggestShipmentMethod || item.suggestShipmentMethod === filterSM;
            })
            .map(item => {
                return item.box_id
            });

        onSelectMultiItem(willChangeBox, !selectAll);
    }

    return (
        <div className="box-list-for-select">
            <div className="box-list-for-select__head">
                <BaseSwitch label={filterSM} onChange={handleChangeFitlerSM} />

                <div className="box-list-for-select__selectAll">
                    <label htmlFor="">Select all</label>
                    <input
                        type="checkbox"
                        className="form-control"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                    />
                </div>
            </div>
            {dataList.map(b => <BoxItem filter={filterSM} key={`box-list-for-select${b.id}`} item={b} onChangeItem={onChangeItem} />)}
        </div>
    );
};

BoxListForSelect.propTypes = {
    dataList: PropTypes.any
};

export default BoxListForSelect;