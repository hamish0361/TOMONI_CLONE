import React from 'react';

import { currenyUnit } from 'config/currency';
import formatNumber from 'helper/formatNumber';
import useTrans from 'helper/useTrans';
import clsx from 'clsx';

export default function useColumns() {

    const [trans] = useTrans();

    return [
        {
            id: 'id',
            title: trans("warehouse.lading_bill.id"),
            render: (id, { containers }) => (
                <div className="lb">
                    <div className="lb__id font-weight-bold">{id}</div>
                    {!!containers?.length && (
                        <div
                            className={clsx("container-type text-left font-weight-bold", containers[0].shipment_method_id === 'sea' ? 'text-primary' : 'text-success')}
                        >{containers[0].shipment_method?.name}</div>
                    )}
                </div>
            )
        },
        { 
            id: 'volume', 
            title: trans('common.physical_info'),
            render: (volume, {weight}) => (
                <div>
                    <div>{trans("common.volume")}: <b>{formatNumber(volume, { round: 3 })}</b></div>
                    <div>{trans("common.weight")}: <b>{formatNumber(weight)}</b></div>
                </div>
            )
         },
        // { id: 'name', title: trans("warehouse.lading_bill.name") },
        { id: 'customer_id', title: trans("common.customer") },
        {
            id: 'balance', title: trans("warehouse.lading_bill.cost"), render: (balance, { shipping_inside_cost, additional_cost }) => (
                <div>
                    {formatNumber(balance, { round: 2 })} {currenyUnit}
                    <div className="text-nowrap d-flex align-items-center justify-content-between"><small className="text-primary">{trans("warehouse.cost.shipping_inside")}: </small><small className="text-primary">{formatNumber(shipping_inside_cost, { round: 2 })} {currenyUnit}</small></div>
                    <div className="text-nowrap d-flex align-items-center justify-content-between"><small className="text-primary">{trans("warehouse.cost.additional")}: </small><small className="text-primary">{formatNumber(additional_cost, { round: 2 })} {currenyUnit}</small></div>
                </div>
            )
        },
        {
            id: 'storage_cost', title: trans("warehouse.cost.storage"), render: (storage_cost, { quantity_boxes }) => (
                <div>
                    {formatNumber(storage_cost, { round: 2 })} {currenyUnit}
                    <div><small className="text-primary text-nowrap">{trans("warehouse.sku.quantity")}: {formatNumber(Number(quantity_boxes))}</small></div>
                </div>
            )
        }
    ];
}