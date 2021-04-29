import { Pagination } from '@material-ui/lab';
import EmptyData from 'app/components/EmptyData';
import Loading from 'app/components/Loading';
import 'assets/css/order.scss';
import { IMAGES } from 'constant/Images';
import formatNumber from 'helper/formatNumber';
import PropTypes from 'prop-types';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Card, CardBody, CardHeader } from '_metronic/_partials/controls';

ItemCard.prototype = {
    onEdit: PropTypes.func,
    onPageChange: PropTypes.func,
    page: PropTypes.number
};

function ItemCard({ onEdit, onPageChange, intl }) {
    const { itemList, pagination, isActionLoading, isLoading } = useSelector(
        ({ order }) => ({
            itemList: order.item.itemList,
            pagination: order.item.pagination,
            isActionLoading: order.item.isActionLoading,
            isLoading: order.item.isLoading
        }),
        shallowEqual
    );

    return (
        <Card>
            {(isActionLoading || isLoading) && <Loading />}
            <CardHeader title={intl.formatMessage({ id: 'ORDER.ITEM' })} />
            <CardBody>
                {itemList?.length > 0 ? (
                    <div>
                        {itemList?.map((item, index) => (
                            <div
                                key={index}
                                className="order-item p-4 mb-4"
                                onClick={() => onEdit(item.id)}
                            >
                                {/* begin product */}
                                <div className="d-flex align-items-start">
                                    <div
                                        className="d-flex "
                                        style={{ flex: '1 0' }}
                                    >
                                        <div className="symbol symbol-85 mr-5">
                                            <div className="symbol-label">
                                                <img
                                                    className="h-100 w-100"
                                                    style={{
                                                        objectFit: 'cover'
                                                    }}
                                                    src={
                                                        item.product?.images
                                                            ?.url ||
                                                        IMAGES.NOT_FOUND
                                                    }
                                                    alt="product"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-100">
                                            <div>
                                                <b>{item.product?.name}</b>
                                            </div>
                                            <div>
                                                <b>{item.product?.id}</b>
                                            </div>
                                            <div className="d-flex flex-wrap align-items-center">
                                                {intl.formatMessage({
                                                    id: 'PURCHASE.TITLE'
                                                })}
                                                :{' '}
                                                {item.order_item_purchases?.map(
                                                    (purchaseItem, idx) => (
                                                        <div
                                                            key={idx}
                                                            style={{
                                                                minWidth:
                                                                    '150px'
                                                            }}
                                                            className="m-2 px-4 py-1 purchase-item"
                                                        >
                                                            <div>
                                                                {intl.formatMessage(
                                                                    {
                                                                        id:
                                                                            'ORDER.ID'
                                                                    }
                                                                )}
                                                                :{' '}
                                                                {
                                                                    purchaseItem
                                                                        .purchase
                                                                        ?.id
                                                                }
                                                            </div>
                                                            <div className="d-flex">
                                                                <div className="mr-4">
                                                                    {intl.formatMessage(
                                                                        {
                                                                            id:
                                                                                'ORDER.QUANTITY'
                                                                        }
                                                                    )}
                                                                    :{' '}
                                                                    {
                                                                        purchaseItem?.quantity
                                                                    }
                                                                </div>
                                                                <div>
                                                                    {intl.formatMessage(
                                                                        {
                                                                            id:
                                                                                'ORDER.PRICE'
                                                                        }
                                                                    )}
                                                                    :{' '}
                                                                    {
                                                                        purchaseItem?.price
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    {intl.formatMessage({
                                                        id: 'ORDER.PRICE'
                                                    })}
                                                    : {item.price}
                                                </div>
                                                <div className="col-md-4">
                                                    {intl.formatMessage({
                                                        id: 'ORDER.QUANTITY'
                                                    })}
                                                    :{' '}
                                                    {formatNumber(
                                                        item.quantity
                                                    )}
                                                    /
                                                    {item.is_box
                                                        ? 'Cái'
                                                        : 'Thùng'}
                                                </div>
                                                <div className="col-md-4">
                                                    {intl.formatMessage({
                                                        id: 'ORDER.NUMBER_BOX'
                                                    })}
                                                    :{' '}
                                                    {formatNumber(
                                                        item?.product?.package
                                                            ?.quantity
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4 col-sm-6">
                                                    {intl.formatMessage({
                                                        id: 'ORDER.TAX_MONEY'
                                                    })}
                                                    : {formatNumber(item.tax)}
                                                </div>
                                                <div className="col-md-4 col-sm-6">
                                                    {intl.formatMessage({
                                                        id: 'ORDER.TAX_PERCENT'
                                                    })}
                                                    : {item.tax_percent}%
                                                </div>
                                                <div className="col-md-4 col-sm-6">
                                                    {intl.formatMessage({
                                                        id:
                                                            'ORDER.TAX_DISCOUNTS'
                                                    })}
                                                    :{' '}
                                                    {
                                                        item.discount_tax_per_tax_percent
                                                    }
                                                    %
                                                </div>
                                                <div className="col-md-4 col-sm-6">
                                                    {intl.formatMessage({
                                                        id: 'ORDER.MONEY_GOODS'
                                                    })}
                                                    :{' '}
                                                    {formatNumber(item.amount)}
                                                </div>
                                                <div className="col-md-4 col-sm-6">
                                                    <b>
                                                        {intl.formatMessage({
                                                            id:
                                                                'ORDER.TOTAL_MONEY'
                                                        })}
                                                        :
                                                    </b>{' '}
                                                    {formatNumber(item.balance)}
                                                </div>
                                            </div>

                                            <div>
                                                {intl.formatMessage({
                                                    id: 'ORDER.NOTE'
                                                })}
                                                : {item.note}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* begin product */}
                            </div>
                        ))}
                        <div className="d-flex justify-content-end">
                            <Pagination
                                count={pagination.lastPage}
                                page={pagination.currentPage}
                                shape="rounded"
                                onChange={(e, newPage) => onPageChange(newPage)}
                            />
                        </div>
                    </div>
                ) : (
                    <EmptyData />
                )}
            </CardBody>
        </Card>
    );
}

export default ItemCard;
