
import React from 'react';

import clsx from 'clsx';
import useTrans from 'helper/useTrans';

const BoxItem = ({ item, onChangeItem }) => {

    const [trans] = useTrans();

    const handleChangeQuantity = (e) => {
        onChangeItem && onChangeItem({ ...item, currentQuantity: e.target.value });
    }

    return (
        <div className={clsx("box-list-selected__item", !item.checked && 'd-none')}>
            <div className="box-list-selected__item-info">
                <span className={clsx("suggest-shipment", item?.suggestShipmentMethod === 'sea' ? 'text-primary' : 'text-success')}>{item.suggestShipmentMethod}</span>
                <span className="box-id">{item?.box_id}</span>
            </div>

            <div className="box-list-selected__quantity">
                <label htmlFor="">{trans("common.quantity")}</label>
                <input
                    value={item.currentQuantity}
                    type="number"
                    max={item.avalableQuantity}
                    className="form-control"
                    onChange={handleChangeQuantity}
                    min={0}
                />
            </div>
        </div>
    );
};

BoxItem.propTypes = {

};

export default BoxItem;