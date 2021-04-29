import React from 'react';
import PropTypes from 'prop-types';

import BoxItem from './BoxItem';

import './index.scss';

const SelectedBoxList = ({ dataList, onChangeItem }) => {

    return (
        <div className="selected-box-list">
            {dataList.map((b) => <BoxItem key={`selected-box-list-${b.id}`} item={b} onChangeItem={onChangeItem} />)}
        </div>
    );
};

SelectedBoxList.propTypes = {
    dataList: PropTypes.any,
    onQuantity: PropTypes.func,
    onUnSelect: PropTypes.func
};

export default SelectedBoxList;