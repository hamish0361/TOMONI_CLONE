import { Pagination } from '@material-ui/lab';
import { dialog } from 'app/components/DialogNotify';
import EmptyData from 'app/components/EmptyData';
import Loading from 'app/components/Loading';
import {
    createOrderItem,
    fetchOrderItem
} from 'app/modules/Order/order-redux/orderItemSlice';
import { fetchOrderById } from 'app/modules/Order/order-redux/orderSlice';
import { fetchProduct } from 'app/modules/Product/product-redux/productSlice';
import 'assets/css/order.scss';
import { IMAGES } from 'constant/Images';
import formatNumber from 'helper/formatNumber';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar
} from '_metronic/_partials/controls';
import DialogAddItem from './DialogAddItem';

ItemCard.prototype = {
    onEdit: PropTypes.func,
    onPageChange: PropTypes.func,
    idOrder: PropTypes.string,
    statusOrder: PropTypes.string
};

function ItemCard({ onEdit, onPageChange, intl, idOrder, statusOrder }) {
    const {
        itemList,
        isActionLoading,
        productList,
        taxList,
        pagination
    } = useSelector(
        ({ order, product, home }) => ({
            itemList: order.item.itemList,
            isActionLoading: order.item.isActionLoading,
            productList: product.list.productList,
            taxList: home.home.taxList,
            pagination: order.item.pagination
        }),
        shallowEqual
    );

    const dispatch = useDispatch();
    const [isShow, setShow] = useState(false);

    // product
    const handleSearchProduct = ({ value, type }) => {
        const params = {
            search: value,
            searchFields: `${type}:like`
        };
        dispatch(fetchProduct(params));
    };

    const handleSubmitNew = values => {
        const paramItems = {
            page: 1,
            appends: 'product.unit;product.package;supplier',
            search: `order_id:${idOrder}`
        };
        const paramDetail = {
            id: idOrder,
            params: {
                with: 'shipmentInfor;attachments',
                appends: 'customer;shipmentMethod;transactions'
            }
        };

        dispatch(createOrderItem(values)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({
                        id: 'ADD.ITEM.TITLE.SUCCESS'
                    })
                );
                setShow(false);
                dispatch(fetchOrderItem(paramItems));
                dispatch(fetchOrderById(paramDetail));
            } else {
                dialog.error(
                    intl.formatMessage({
                        id: 'ADD.ITEM.TITLE.FAIL'
                    })
                );
            }
        });
    };

    return (
        <>
            <Card>
                {isActionLoading && <Loading local={true} />}
                <CardHeader title={intl.formatMessage({ id: 'ORDER.ITEM' })}>
                    <CardHeaderToolbar>
                        {' '}
                        {statusOrder === 'Pending' ? (
                            <button
                                style={{ minWidth: '100px' }}
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setShow(true)}
                            >
                                <FormattedMessage id="BUTTON.ADD.ITEM" />
                            </button>
                        ) : (
                            ''
                        )}
                    </CardHeaderToolbar>
                </CardHeader>
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
                                                            id:
                                                                'ORDER.NUMBER_BOX'
                                                        })}
                                                        :{' '}
                                                        {formatNumber(
                                                            item?.product
                                                                ?.package
                                                                ?.quantity
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-4 col-sm-6">
                                                        {intl.formatMessage({
                                                            id:
                                                                'ORDER.TAX_MONEY'
                                                        })}
                                                        :{' '}
                                                        {formatNumber(item.tax)}
                                                    </div>
                                                    <div className="col-md-4 col-sm-6">
                                                        {intl.formatMessage({
                                                            id:
                                                                'ORDER.TAX_PERCENT'
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
                                                        <b>
                                                            {intl.formatMessage(
                                                                {
                                                                    id:
                                                                        'ORDER.MONEY_GOODS'
                                                                }
                                                            )}
                                                        </b>
                                                        :{' '}
                                                        {formatNumber(
                                                            item.amount
                                                        )}
                                                    </div>
                                                    <div className="col-md-4 col-sm-6">
                                                        <b>
                                                            {intl.formatMessage(
                                                                {
                                                                    id:
                                                                        'ORDER.TOTAL_MONEY'
                                                                }
                                                            )}
                                                            :
                                                        </b>{' '}
                                                        {formatNumber(
                                                            item.balance
                                                        )}
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
                                    onChange={(e, newPage) =>
                                        onPageChange(newPage)
                                    }
                                />
                            </div>
                        </div>
                    ) : (
                        <EmptyData />
                    )}
                </CardBody>
            </Card>
            <DialogAddItem
                show={isShow}
                onHide={() => setShow(false)}
                intl={intl}
                productList={productList}
                onSearchProduct={handleSearchProduct}
                taxList={taxList}
                onAddItem={handleSubmitNew}
                idOrder={idOrder}
            ></DialogAddItem>
        </>
    );
}

export default ItemCard;
