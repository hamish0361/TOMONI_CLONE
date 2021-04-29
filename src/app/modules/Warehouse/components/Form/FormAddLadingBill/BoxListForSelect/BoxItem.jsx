
import React, { useEffect, useMemo } from 'react';

import clsx from 'clsx';
import { useTracking } from '../../../context/trackingContext';

import getShipmentMethodFromTrackingInfo from 'helper/getShipmentMethodFromTrackingInfo';

const BoxItem = ({ item, onChangeItem, filter }) => {

    const tracking = useTracking(item?.box?.sfa?.tracking);

    const suggestShipmentMethod = useMemo(() => {
        return getShipmentMethodFromTrackingInfo(tracking.data);
    }, [tracking]);

    useEffect(() => {
        if (item?.suggestShipmentMethod !== suggestShipmentMethod)
            onChangeItem && onChangeItem({ ...item, suggestShipmentMethod })
    }, [suggestShipmentMethod, item]); // eslint-disable-line

    const toggleBox = (e) => {
        onChangeItem && onChangeItem({ ...item, checked: e.target.checked });
    }

    const isBoxFiltered = useMemo(() => {
        if(suggestShipmentMethod && suggestShipmentMethod !== filter) return false;

        return true;
    }, [filter, suggestShipmentMethod]);

    return (
        <div className={clsx("box-list-for-select__item", item?.checked && 'is-checked', !isBoxFiltered && 'd-none')}>
            <div className="box-list-for-select__item-info">
                <span className={clsx("suggest-shipment", suggestShipmentMethod === 'sea' ? 'text-primary' : 'text-danger')}>
                    {suggestShipmentMethod}
                </span>
                <span className="box-id">{item?.box_id}</span>
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