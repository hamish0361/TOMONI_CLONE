import formatNumber from 'helper/formatNumber';
import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardBody, CardHeader } from '_metronic/_partials/controls';
import ItemTable from './ItemTable';

PurchaseItemCard.prototype = {
    items: PropTypes.array.array
};

function PurchaseItemCard({ items, intl }) {
    const columns = [
        { id: 'id', title: intl.formatMessage({ id: 'TRACKING.ID' }) },
        {
            id: 'product',
            title: intl.formatMessage({ id: 'TRACKING.PRODUCT' })
        },
        {
            id: 'purchase',
            title: intl.formatMessage({ id: 'PURCHASE.TITLE' })
        },
        {
            id: 'quantity',
            title: intl.formatMessage({ id: 'TRACKING.QUANTITY' })
        },
        {
            id: 'balance',
            title: intl.formatMessage({ id: 'ORDER.BALANCE' })
        },
        {
            id: 'note',
            title: intl.formatMessage({ id: 'ORDER.NOTE' })
        }
    ];

    const rows = items?.map(item => {
        return {
            id: item.id,
            product: item.product_id,
            purchase: item.purchase_id,
            quantity: (
                <div>
                    <span className="text-danger">
                        {item.quantity_in_order_product_purchase}
                    </span>
                    /<span className="text-success">{item.quantity}</span>
                </div>
            ),
            balance: formatNumber(item.balance),
            note: item.note
        };
    });

    return (
        <Card>
            <CardHeader
                title={intl.formatMessage({ id: 'TRACKING.PURCHASE_ITEM' })}
            />
            <div>
                <CardBody>
                    <ItemTable
                        columns={columns}
                        rows={rows}
                        isAction={false}
                        page={1}
                        lastpage={1}
                    />
                </CardBody>
            </div>
        </Card>
    );
}

export default PurchaseItemCard;
