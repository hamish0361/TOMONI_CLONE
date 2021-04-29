
import React from 'react';

import clsx from 'clsx';

const BoxItem = ({ item, onChangeItem }) => {

    const toggleBox = (e) => {
        onChangeItem && onChangeItem({ ...item, checked: e.target.checked });
    }

    return (
        <div className={clsx("box-list-for-select__item", item?.checked && 'is-checked')}>
            <div className="box-list-for-select__item-info">
                <span className="box-id">{item?.owning_box?.box_id}</span>
            </div>

            <span className="check-section">
                <input
                    type="checkbox"
                    className="form-control"
                    checked={item.checked}
                    onChange={toggleBox}
                />
            </span>

        </div>
    );
};

BoxItem.propTypes = {

};

export default BoxItem;