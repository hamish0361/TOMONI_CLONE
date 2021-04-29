import useTrans from 'helper/useTrans';
import React, { useCallback } from 'react';

export default function useColumns() {
    const [trans] = useTrans();

    const getStatusColorText = useCallback((status_id) => {
 
        if(status_id === 'waiting_shipment') return 'text-warning';
        if(status_id === 'shipping') return 'text-primary';
        if(status_id !== 'waiting_shipment') return 'text-success';

        return '';
    }, []);

    return [
        { id: 'id', title: trans('common.id') },
        { 
            id: ['place_of_delivery', 'consignee'], 
            title: trans('common.name'),
            render: (consignee, {place_of_delivery, goods_delivery_status}) => (
                <div className="place-of-delivery">
                    <div className="place-of-delivery__consignee font-weight-bold">{consignee}</div>
                    <div className="place-of-delivery__address">{place_of_delivery.full_address}</div>
                    <b className={getStatusColorText(goods_delivery_status?.id)}>{goods_delivery_status?.name}</b>
                </div>
            )
         },
        {
            id: ['delivery_partner', 'name'],
            title: trans('warehouse.delivery_partner.title'),
            render: (partner_name, {shipping_cost, quantity_box_lading_bills}) => (
                <div className="delivery-partner">
                    <b className="delivery-partner__name text-primary">{partner_name || '---'}</b>
                    <div className="shipping_cost">{trans('warehouse.cost.shipping')}: <b>{shipping_cost || 0}</b></div>
                    <div className="quantity_box_lading_bills">{trans('warehouse.sku.quantity')}: <b>{quantity_box_lading_bills || 0}</b></div>
                </div>
            )
        },
    ];
}
