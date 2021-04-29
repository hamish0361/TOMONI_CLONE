import React from 'react';
import useTrans from 'helper/useTrans';
import formatNumber from 'helper/formatNumber';
import { currenyUnit } from 'config/currency';

export default function useColumns() {
    const [trans] = useTrans();

    return [
        { 
            id: 'id', 
            title: trans('warehouse.lading_bill.id'),
            render: (id, {customer_id}) => (
                <div>
                    <div><b>{id}</b></div>
                    <div>- <b>{customer_id}</b></div>
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
        // {
        //     id: 'name',
        //     title: trans('warehouse.lading_bill.name'),
        //     render: name => <b>{name}</b>
        // },
        {
            id: 'balance',
            title: trans('warehouse.cost.shipping'),
            render: (balance, { shipping_inside_cost, additional_cost }) => (
                <div>
                    {formatNumber(balance, { round: 2 })} {currenyUnit}
                    <div>
                        <small className="text-primary">
                            {trans('warehouse.cost.shipping_inside')}:{' '}
                            {formatNumber(shipping_inside_cost, { round: 2 })}{' '}
                            {currenyUnit}
                        </small>
                    </div>
                    <div>
                        <small className="text-primary">
                            {trans('warehouse.cost.additional')}:{' '}
                            {formatNumber(additional_cost, { round: 2 })}{' '}
                            {currenyUnit}
                        </small>
                    </div>
                </div>
            )
        },
        {
            id: 'storage_cost',
            title: trans('warehouse.cost.storage'),
            render: (storage_cost, { quantity_boxes }) => (
                <div>
                    {formatNumber(storage_cost, { round: 2 })} {currenyUnit}
                    <div>
                        <small className="text-primary">
                            {trans('warehouse.sku.quantity')}: {quantity_boxes}
                        </small>
                    </div>
                </div>
            )
        }
    ];
}
