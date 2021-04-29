import { dialog } from 'app/components/DialogNotify';
import ItemTable from 'app/modules/Purchase/components/ItemTable';
import { createPurchaseItemOrder } from 'app/modules/Purchase/redux/purchaseItemSlice';
import formatNumber from 'helper/formatNumber';
import useTrans from 'helper/useTrans';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Select from 'react-select';
import { Button } from 'reactstrap';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar
} from '_metronic/_partials/controls';

DivisionItemCard.propTypes = {
    onSearchOrder: PropTypes.func,
    onDeleteDivisionItemClick: PropTypes.func,
    onDivisionItemClick: PropTypes.func,

    purchaseItem: PropTypes.object
};

function DivisionItemCard({
    onSearchOrder,
    onDeleteDivisionItemClick,
    onDivisionItemClick,
    purchaseItem,
    intl,
    onSuccess,
    itemId
}) {
    const dispatch = useDispatch();
    const [trans] = useTrans();
    const { purchaseItemId } = useParams();
    const { handleSubmit, register, reset } = useForm({
        quantity: 0,
        price: 0
    });
    const [orderSelected, setOrderSelected] = useState(null);

    const { itemList } = useSelector(
        ({ order }) => ({
            itemList: order.item.itemList
        }),
        shallowEqual
    );

    useEffect(() => {
        setOrderSelected(null);
    }, [purchaseItemId]);

    const orderOptions = itemList?.map(item => {
        return {
            value: item.id,
            label: `${item.order_id} - ${item.order?.status?.name}`,
            quantity: item.quantity,
            product_id: item.product_id
        };
    });

    //select customer handle search and câl api
    const customerRef = useRef(null);
    const handleOrderSearch = value => {
        if (customerRef.current) {
            clearTimeout(customerRef.current);
        }
        customerRef.current = setTimeout(() => {
            const params = {
                value,
                type: 'order_id'
            };

            if (value && onSearchOrder) onSearchOrder(params);
        }, 500);
    };

    const handleOrderSelect = order => {
        if (order.product_id !== purchaseItem?.product_id) {
            dialog.warning(trans('PURCHCASE.ITEM.CHECK_PRODUCT'));
        } else {
            setOrderSelected({
                id: order.label,
                quantity: order.quantity,
                order_product_id: order.value,
                value: order.value,
                label: order.label
            });
        }

        setOrderSelected({
            id: order.label,
            quantity: order.quantity,
            order_product_id: order.value,
            value: order.value,
            label: order.label
        });
    };

    const handleNewItem = data => {
        const params = {
            // purchase_product_id: itemId,
            order_product_id: orderSelected?.order_product_id,
            quantity: data.quantity,
            price: data.price
        };

        if (data.quantity <= 0 || data.price <= 0) {
            dialog.warning(trans('PURCHASE.ITEM.DIVISION_GOODS.WARNING'));
        } else if (data.quantity > orderSelected?.quantity) {
            dialog.warning(
                trans('PURCHASE.ITEM.DIVISION_GOODS.QUANTITY.WARNING')
            );
        } else {
            handleNewDivisionItem(params);
        }
    };

    const handleNewDivisionItem = ({ quantity, price, order_product_id }) => {
        const body = {
            purchase_product_id: itemId,
            order_product_id,
            quantity,
            price
        };
        dispatch(createPurchaseItemOrder(body)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({
                        id: 'PURCHASE.DIVISION.ITEM.SUCCESSFUL.DIALOG'
                    })
                );
                reset({ quantity: 0, price: 0 });
                setOrderSelected(null);
                onSuccess && onSuccess();
            } else {
                dialog.error(
                    intl.formatMessage({
                        id: 'PURCHASE.DIVISION.ITEM.ERROR.DIALOG'
                    })
                );
            }
        });
    };

    const handleDelete = id => {
        setOrderSelected(null);
        reset();

        onDeleteDivisionItemClick(id);
    };

    const columns = [
        {
            id: 'id',
            title: intl.formatMessage({ id: 'ORDER.RETAIL.TABLE_ID' })
        },
        {
            id: 'order_id',
            title: intl.formatMessage({ id: 'ORDER.RETAIL.TABLE_ID' })
        },
        { id: 'quantity', title: intl.formatMessage({ id: 'ORDER.QUANTITY' }) },
        { id: 'price', title: intl.formatMessage({ id: 'ORDER.PRICE' }) }
    ];

    const rows = purchaseItem?.order_product_purchases?.map(item => {
        return {
            id: item.id,
            order_id: item.order_item?.order_id,
            quantity: item.quantity,
            price: item.price
        };
    });

    return (
        <Card>
            <CardHeader
                title={intl.formatMessage({ id: 'PURCHASE.DIVISION.TITLE' })}
            >
                <CardHeaderToolbar>
                    <Button
                        form="udpate-division-item"
                        color="primary"
                        type="submit"
                        disabled={!orderSelected?.id}
                    >
                        <FormattedMessage id="GLOBAL.BUTTON.ADD" />
                    </Button>
                </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
                <form
                    onSubmit={handleSubmit(handleNewItem)}
                    id="udpate-division-item"
                >
                    <div>
                        {/* begin box */}
                        <div className="row form-group">
                            <div className="col-6">
                                <label>
                                    <FormattedMessage id="ORDER.RETAIL.TABLE_ID" />
                                </label>
                                <Select
                                    placeholder={trans(
                                        'GLOBAL.SEARCH.PLACEHOLER_INPUT'
                                    )}
                                    options={orderOptions}
                                    onInputChange={handleOrderSearch}
                                    onChange={handleOrderSelect}
                                    value={orderSelected}
                                />
                            </div>
                            <div className="col-6">
                                <label>
                                    <FormattedMessage id="PURCHASE.DIVISION.ITEM.QUANTITY_ORDER" />
                                </label>
                                <div>
                                    <span className="form-control bg-light ">
                                        {formatNumber(orderSelected?.quantity)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="row form-group">
                            <div className="col-6">
                                <label>
                                    <FormattedMessage id="PURCHASE.DIVISION.ITEM.QUANTITY_DIVISION" />
                                </label>
                                <input
                                    ref={register}
                                    name="quantity"
                                    type="number"
                                    className="form-control"
                                />
                            </div>
                            <div className="col-6">
                                <label>
                                    {' '}
                                    <FormattedMessage id="ORDER.PRICE" />
                                </label>
                                <input
                                    ref={register}
                                    name="price"
                                    type="number"
                                    className="form-control"
                                />
                            </div>
                        </div>
                        {/* end box */}
                    </div>
                </form>
                <div className="border">
                    <ItemTable
                        columns={columns}
                        rows={rows}
                        onDelete={handleDelete}
                        onViewEdit={onDivisionItemClick}
                        isPagination={false}
                    />
                </div>
            </CardBody>
        </Card>
    );
}

export default DivisionItemCard;
