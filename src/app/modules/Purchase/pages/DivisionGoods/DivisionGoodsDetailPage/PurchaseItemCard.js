import EmptyData from 'app/components/EmptyData';
import clsx from 'clsx';
import useTrans from 'helper/useTrans';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardHeader } from '_metronic/_partials/controls';
import './index.scss';
import PopoverConfirmDelete from './PopoverConfirmDelete';

PurchaseItemCard.propTypes = {
    items: PropTypes.array,

    onItemClick: PropTypes.func,
    onDeletePurchaseItem: PropTypes.func,
    itemId: PropTypes.string
};

function PurchaseItemCard({
    items,
    onItemClick,
    onDeletePurchaseItem,
    itemId
}) {
    const [trans] = useTrans();
    return (
        <Card>
            <CardHeader
                title={trans('PURCHASE.DIVISION_GOOGS.ITEM.PURCHASE_ITEM')}
            />

            <div className="purchase-item-list-item">
                {items?.length > 0 ? (
                    items?.map((item, index) => (
                        <div
                            className={clsx(
                                'item px-8 d-flex justify-content-between align-items-start',
                                +itemId === +item.id && 'active'
                            )}
                            key={index}
                        >
                            <div
                                style={{ flex: '1 0' }}
                                onClick={() => onItemClick(item.id)}
                            >
                                <div>
                                    <FormattedMessage id="ORDER.PRODUCT" />:{' '}
                                    {item.product_id}
                                </div>
                                <div>
                                    <FormattedMessage id="ORDER.QUANTITY" />:{' '}
                                    <span className="text-danger">
                                        {
                                            item.quantity_in_order_product_purchase
                                        }
                                    </span>
                                    /
                                    <span className="text-success">
                                        {item.quantity}
                                    </span>
                                </div>
                                <div>
                                    <FormattedMessage id="ORDER.TRACKING" />:{' '}
                                    {item.tracking_id}
                                </div>
                            </div>
                            <PopoverConfirmDelete
                                id={`item-${index}`}
                                onYesClick={() => onDeletePurchaseItem(item.id)}
                            />
                        </div>
                    ))
                ) : (
                    <EmptyData />
                )}
            </div>
        </Card>
    );
}

export default PurchaseItemCard;
