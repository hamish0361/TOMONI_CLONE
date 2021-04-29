import ItemTable from 'app/modules/Purchase/components/ItemTable';
import formatNumber from 'helper/formatNumber';
import PropTypes from 'prop-types';
import React from 'react';
import { Card, CardHeader } from '_metronic/_partials/controls';

DivisionItemCard.propTypes = {
    onDelete: PropTypes.func,
    onViewEdit: PropTypes.func,

    purchaseItems: PropTypes.array
};

function DivisionItemCard({ intl, purchaseItems, onDelete, onViewEdit }) {
    const columns = [
        {
            id: 'id',
            title: intl.formatMessage({ id: 'ORDER.ID' })
        },
        {
            id: 'product_id',
            title: intl.formatMessage({ id: 'ORDER.PRODUCT' })
        },
        { id: 'price', title: intl.formatMessage({ id: 'ORDER.PRICE' }) },
        { id: 'quantity', title: intl.formatMessage({ id: 'ORDER.QUANTITY' }) }
    ];

    const rows = purchaseItems?.map(item => {
        return {
            id: item.id,
            product_id: item.product_id,
            price: formatNumber(item.price),
            quantity: formatNumber(item.quantity)
        };
    });

    return (
        <Card className="h-100">
            <CardHeader
                title={intl.formatMessage({
                    id: 'PURCHASE.ITEM.DIVISION_GOODS'
                })}
            />
            <div className="px-8 pb-8">
                <ItemTable
                    columns={columns}
                    rows={rows}
                    onDelete={onDelete}
                    onViewEdit={onViewEdit}
                    isPagination={false}
                />
            </div>
        </Card>
    );
}

export default DivisionItemCard;
