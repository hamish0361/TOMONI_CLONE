import { dialog } from 'app/components/DialogNotify';
import { fetchOrderItem } from 'app/modules/Order/order-redux/orderItemSlice';
import { fetchPurchaseItemById } from 'app/modules/Order/order-redux/purchaseItemSlice';
import { createPurchaseItemOrder } from 'app/modules/Purchase/redux/purchaseItemSlice';
import formatNumber from 'helper/formatNumber';
import useDebounce from 'helper/useDebounce';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Select from 'react-select';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

DialogNewDivisionItem.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func
};

function DialogNewDivisionItem({ show, onHide, intl }) {
    const dispatch = useDispatch();

    const { itemId } = useParams();
    const { itemList } = useSelector(
        ({ order }) => ({
            itemList: order.item.itemList
        }),
        shallowEqual
    );
    const { register, handleSubmit } = useForm({});
    const [values, setValues] = useState({
        id_order: '',
        quantity: 0,
        order_product_id: ''
    });

    const [searchOrder, setSearchOrder] = useState('');
    const searchOrderDebounce = useDebounce(searchOrder);

    // options
    const orderOptions = itemList?.map(item => {
        return {
            value: item.id,
            label: item.order_id,
            quantity: item.quantity
        };
    });

    useEffect(() => {
        if (show) {
            setValues({
                id_order: '',
                order_product_id: '',
                quantity: 0
            });
        }
    }, [show]);

    const onSubmit = data => {
        const params = {
            purchase_product_id: itemId,
            order_product_id: values.order_product_id,
            quantity: data.quantity,
            price: data.price
        };

        if (data.quantity <= 0 || data.price <= 0) {
            dialog.warning(
                intl.formatMessage({
                    id: 'PURCHASE.ITEM.DIVISION_GOODS.WARNING'
                })
            );
        } else if (data.quantity > values.quantity) {
            dialog.warning(
                intl.formatMessage({
                    id: 'PURCHASE.ITEM.DIVISION_GOODS.QUANTITY.WARNING'
                })
            );
        } else {
            dispatch(createPurchaseItemOrder(params)).then(res => {
                if (res.type.includes('fulfilled')) {
                    dialog.success(
                        intl.formatMessage({
                            id: 'PURCHASE.DIVISION.ITEM.SUCCESSFUL.DIALOG'
                        })
                    );
                    onHide();
                    dispatch(fetchPurchaseItemById({ id: itemId, params }));
                } else {
                    dialog.error(
                        intl.formatMessage({
                            id: 'PURCHASE.DIVISION.ITEM.ERROR.DIALOG'
                        })
                    );
                }
            });
        }
    };

    //select customer and check duplicate division of good(item)
    const handleSelectCustomer = customerSelected => {
        setValues({
            ...values,
            id_order: customerSelected.label,
            quantity: customerSelected.quantity,
            order_product_id: customerSelected.value
        });
    };

    useEffect(() => {
        if (searchOrderDebounce) {
            const params = {
                search: searchOrderDebounce,
                searchFields: `order_id:like`
            };
            dispatch(fetchOrderItem(params));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchOrderDebounce]);

    return (
        <Modal
            isOpen={show}
            style={{ maxWidth: '850px' }}
            title={intl.formatMessage({ id: 'PURCHASE.DIVISION.ITEM.TITLE' })}
        >
            <ModalHeader>
                <FormattedMessage id="PURCHASE.DIVISION.ITEM.TITLE" />
            </ModalHeader>
            <ModalBody>
                <div className="align-item-center">
                    <div className="d-fex justify-content-between align-items-center">
                        <span className="order-title">
                            {intl.formatMessage({
                                id: 'PURCHASE.DIVISION.ITEM.ORDER.TITLE'
                            })}
                        </span>
                    </div>

                    <Select
                        placeholder={intl.formatMessage({
                            id: 'GLOBAL.SEARCH.PLACEHOLER_INPUT'
                        })}
                        options={orderOptions}
                        onInputChange={value => setSearchOrder(value)}
                        onChange={handleSelectCustomer}
                    />
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group align-items-center mt-4">
                                <div>
                                    <span className="order-title">
                                        {intl.formatMessage({
                                            id: 'TRACKING.ORDER_ID'
                                        })}
                                    </span>
                                </div>
                                <div>
                                    <span className="form-control bg-light ">
                                        {values.id_order}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group align-items-center mt-4">
                                <div>
                                    <span className="order-title">
                                        {intl.formatMessage({
                                            id:
                                                'PURCHASE.DIVISION.ITEM.QUANTITY_ORDER'
                                        })}
                                    </span>
                                </div>
                                <div>
                                    <span className="form-control bg-light ">
                                        {formatNumber(values.quantity)}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group align-items-center">
                                <>
                                    <div>
                                        <span className="order-title">
                                            {intl.formatMessage({
                                                id:
                                                    'PURCHASE.DIVISION.ITEM.QUANTITY_DIVISION'
                                            })}
                                        </span>
                                    </div>
                                    <div>
                                        <input
                                            className="form-control"
                                            name="quantity"
                                            type="number"
                                            ref={register}
                                            placeholder={intl.formatMessage({
                                                id:
                                                    'PURCHASE.DIVISION.ITEM.QUANTITY.PLACEHOLDER'
                                            })}
                                        />
                                    </div>
                                </>
                            </div>
                            <div className="form-group align-items-center">
                                <>
                                    <div>
                                        <span className="order-title">
                                            {intl.formatMessage({
                                                id:
                                                    'PURCHASE.DIVISIOM.ITEM.PRICE'
                                            })}
                                        </span>
                                    </div>
                                    <div>
                                        <input
                                            className="form-control"
                                            name="price"
                                            type="number"
                                            ref={register}
                                            placeholder={intl.formatMessage({
                                                id:
                                                    'PURCHASE.DIVISIOM.ITEM.PRICE.PLACEHOLDER'
                                            })}
                                        />
                                    </div>
                                </>
                            </div>
                        </form>
                    </div>
                    {/* end form */}
                </div>
            </ModalBody>
            <ModalFooter>
                <button
                    style={{ minWidth: '100px' }}
                    type="button"
                    onClick={onHide}
                    className="btn btn-light btn-elevate"
                >
                    <FormattedMessage id="GLOBAL.BUTTON.CANCEL" />
                </button>
                <button
                    type="submit"
                    form="form-update"
                    className="btn btn-primary btn-elevate"
                    onClick={handleSubmit(onSubmit)}
                    disabled={!values.id_order}
                >
                    <FormattedMessage id="GLOBAL.DIVISION.OF.GOOD" />
                </button>
            </ModalFooter>
        </Modal>
    );
}

export default injectIntl(connect(null, null)(DialogNewDivisionItem));
