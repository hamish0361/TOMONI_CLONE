import React from 'react';
import PropTypes from 'prop-types';
import BoxItem from './BoxItem';

import './index.scss';

const BoxListForSelect = ({ dataList, onChangeItem }) => {

    return (
        <div className="box-list-for-select">
            {dataList.map(b => <BoxItem key={`box-list-for-select${b.id}`} item={b} onChangeItem={onChangeItem} />)}
        </div>
    );
};

BoxListForSelect.propTypes = {
    dataList: PropTypes.any
};

export default BoxListForSelect;