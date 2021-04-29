import warehouseApi from "apis/warehouse";
import { useEffect, useState } from "react";
import _ from 'lodash';

export default function useOutboundPicker(goodDeliveryId) {

    const [outBoundPickers, setOutboundPickers] = useState([]);

    useEffect(() => {
        if(goodDeliveryId) {
            warehouseApi.goodsDelivery.fetchGoodsDelivery(goodDeliveryId, {
                with: 'outBoundPickers'
            }).then(response => {
                setOutboundPickers(response.out_bound_pickers);
            })
        }
    }, [goodDeliveryId]); // eslint-disable-line

    return outBoundPickers;
}

export function getBoxOutBoundPicker(box_id, outBoundPickers) {
    return _.find(outBoundPickers, ['box_id', box_id]);
}