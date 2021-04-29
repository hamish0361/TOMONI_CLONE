import useTrans from "helper/useTrans"
import React from 'react';

export default function useColumns() {
    const [trans] = useTrans();

    return [
        {
            id: 'id',
            title: trans("warehouse.sku.title")
        },
        {
            id: 'out_bound_pickers',
            title: trans("common.status"),
            render: (out_bound_pickers) => (
                <div className="outbound-pickers">
                    {out_bound_pickers.map(outboundPicker => (
                        <div className="outbound-picker" key={outboundPicker.id}>
                            {outboundPicker?.goods_delivery?.delivery_partner?.name}
                        </div>
                    ))}
                </div>
            )
        },
    ]
}