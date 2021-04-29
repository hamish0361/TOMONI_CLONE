import CustomModal from '../../components/CustomModal';
import { fetchUsers } from 'app/modules/AuthService/auth-service-redux/userSlice';
import { fetchOrder } from 'app/modules/Order/order-redux/orderSlice';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button } from 'reactstrap';
import { ModalProgressBar } from '_metronic/_partials/controls';
import { dialog } from 'app/components/DialogNotify';
import formatNumber from 'helper/formatNumber';

NewOrderPay.propTypes = {
    onHide: PropTypes.func,
    show: PropTypes.bool,
    onNew: PropTypes.func,
    isActionLoading: PropTypes.bool
};

function NewOrderPay({
    show = false,
    onHide = null,
    onNew,
    isActionLoading,
    intl
}) {
    const dispatch = useDispatch();
    const { userList } = useSelector(state => state.authService.user);
    const orderList = useSelector(state => state.order.list.orderList);

    const [idReceipt, setIdReceipt] = useState('');
    const [checkAddOrder, setCheckAddOrder] = useState(true);
    const [amountReceipt, setAmountReceipt] = useState('');
    const [userId, setUserId] = useState(null);

    const [listOrderReceipt, setListOrderReceipt] = useState([]);
    const [listOrderAmount, setListOrderAmount] = useState([]);

    const { currencies } = useSelector(
        ({ home, authService }) => ({
            currencies: home.home.currencyList
        }),
        shallowEqual
    );

    const {
        register,
        handleSubmit,
        control,
        getValues,
        reset,
        trigger
    } = useForm({});
    const optionUser = userList?.map(item => {
        return {
            label: item?.email,
            value: item?.id
        };
    });

    const optionOrderList = orderList?.map(item => {
        return {
            label: `Mã đơn: ${item?.id} - Giá: ${formatNumber(item?.balance)}`,
            value: item?.id,
            balance: item?.balance
        };
    });
    const optionCurrencies = currencies?.map(item => {
        return {
            label: item?.name,
            value: item?.id
        };
    });

    //
    const handleSelectUser = e => {
        const user = e?.value;
        setUserId(user);
        if (user !== null) {
            const params = {
                search: `customer_id:${e?.value}`,
                searchFields: `customer_id:like`
            };
            dispatch(fetchOrder(params));
        }
    };

    //new transaction
    const onSubmit = data => {
        onNew(data, listOrderReceipt);
        reset();
        setListOrderReceipt([]);
        setListOrderAmount([]);
    };

    //cancel transaction
    const handleCancelModal = () => {
        onHide();
        reset();
        setListOrderReceipt([]);
        setListOrderAmount([]);
    };

    // eslint-disable-next-line
    const handleSearch = useCallback(
        _.debounce((e, fetchData) => {
            if (e.length > 0) {
                const params = {
                    search: e,
                    searchFields: `email:like`
                };
                dispatch(fetchData(params));
            }
        }, 500),
        []
    );

    //Handle change order amount
    const handleChangeOrder = e => {
        setIdReceipt(e?.value);

        //add amount in list
        const orderAmount = [...listOrderAmount];
        orderAmount.push(e?.balance);
        setListOrderAmount(orderAmount);
        setCheckAddOrder(false);
        setAmountReceipt(e?.balance);
    };

    // eslint-disable-next-line
    const handleSearchOrder = useCallback(
        _.debounce((e, fetchData) => {
            const usersId = getValues('user_id')?.value;
            if (e.length > 0) {
                const params = {
                    search: `id:${e};customer_id:${usersId}`,
                    searchFields: `id:like;customer_id:like`
                };
                dispatch(fetchData(params));
            }
        }, 200),
        []
    );

    const handleAddOrder = () => {
        const orderReceiptType = {
            receiptable_id: idReceipt,
            receiptable_type: 'order',
            user_id: userId,
            amount: amountReceipt
        };

        let sumAmount = listOrderAmount
            ?.map(item => item)
            ?.reduce((a, b) => a + b, 0);
        let amountInput = getValues('amount').replace(/,/g, '');
        if (amountInput <= 0) {
            dialog.warning(
                `${intl.formatMessage({
                    id: 'ACCOUNTING.CARD.DIALOG_NEW.REQUIRED.AMOUNT'
                })}`
            );
        } else if (amountInput <= sumAmount) {
            dialog.warning(
                `${intl.formatMessage({
                    id: 'ACCOUNTING.CARD.DIALOG_NEW.REQUIRED.AMOUNT.COMPARE'
                })}`
            );
        } else {
            //show all list
            const orderListReceipt = [...listOrderReceipt];
            orderListReceipt.push(orderReceiptType);
            setListOrderReceipt(orderListReceipt);
            setCheckAddOrder(true);
        }
    };

    const handleRemoveOrderReceipt = index => {
        const orderListReceipt = [...listOrderReceipt];
        orderListReceipt.splice(index, 1);
        setListOrderReceipt(orderListReceipt);
    };
    return (
        <div>
            <>
                {/*Modal*/}
                <CustomModal
                    show={show}
                    title={intl.formatMessage({
                        id: 'ACCOUNTING.CREATE.NEW_PAYMENT_SALE.TITLE'
                    })}
                    onHide={handleCancelModal}
                >
                    {isActionLoading && <ModalProgressBar />}
                    <Modal.Body className="overlay overlay-block cursor-default">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                                <div className="form-group col-lg-6">
                                    <label className="modal-title font-size-h6 text-dark">
                                        {intl.formatMessage({
                                            id: 'ACCOUNTING.AMOUNT'
                                        })}
                                    </label>

                                    <Controller
                                        defaultValue={''}
                                        thousandSeparator
                                        name="amount"
                                        control={control}
                                        render={({ onChange }) => (
                                            <NumberFormat
                                                onChange={e => {
                                                    onChange(e);
                                                    trigger();
                                                }}
                                                value={getValues('amount')}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id:
                                                            'ACCOUNTING.CARD.PLEACEHOLDER.AMOUNT'
                                                    }
                                                )}
                                                thousandSeparator
                                                className="form-control"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="form-group col-lg-6">
                                    <label className="modal-title font-size-h6 text-dark">
                                        {intl.formatMessage({
                                            id: 'ACCOUNTING.USERNAME'
                                        })}
                                    </label>
                                    <Controller
                                        name="user_id"
                                        control={control}
                                        defaultValue={''}
                                        render={({ onChange }) => (
                                            <Select
                                                onChange={e => {
                                                    onChange(e);
                                                    handleSelectUser(e);
                                                }}
                                                value={getValues('user_id')}
                                                options={optionUser}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id:
                                                            'GLOBAL.PLACEHOLER.SELECT'
                                                    }
                                                )}
                                                onInputChange={e =>
                                                    handleSearch(e, fetchUsers)
                                                }
                                                isClearable={true}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="form-group col-lg-6">
                                    <label className="modal-title font-size-h6 text-dark">
                                        Tiền tệ
                                    </label>
                                    <Controller
                                        name="currency_id"
                                        control={control}
                                        defaultValue={''}
                                        as={
                                            <Select
                                                options={optionCurrencies}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id:
                                                            'GLOBAL.PLACEHOLER.SELECT'
                                                    }
                                                )}
                                                isClearable={true}
                                            />
                                        }
                                    />
                                </div>
                                <div className="form-group col-lg-6">
                                    <label className="modal-title font-size-h6 text-dark">
                                        {intl.formatMessage({
                                            id:
                                                'AUTH_SERVICE.DECENTRALIZATION.TRANSACTION.TOPFILTER.DESCRIPTION'
                                        })}
                                    </label>
                                    <input
                                        className="form-control"
                                        name="description"
                                        ref={register}
                                        placeholder={intl.formatMessage({
                                            id: 'GLOBAL.PLACEHOLER.INPUT'
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group col-lg-6">
                                    <label className="modal-title font-size-h6 text-dark">
                                        {intl.formatMessage({
                                            id:
                                                'ACCOUNTING.CREATE.NEW_PAYMENT_SALE.RECIEPT'
                                        })}
                                    </label>
                                    <div className="form-control bg-light">
                                        Order
                                    </div>
                                </div>
                                <div className="form-group col-lg-5">
                                    <label className="modal-title font-size-h6 text-dark">
                                        {intl.formatMessage({
                                            id: 'DASHBOARD.ORDER.ID'
                                        })}
                                    </label>
                                    <Controller
                                        name="receiptable_id"
                                        control={control}
                                        defaultValue=""
                                        render={({ onChange }) => (
                                            <Select
                                                onChange={e => {
                                                    onChange(e);
                                                    handleChangeOrder(e);
                                                }}
                                                value={getValues(
                                                    'receiptable_id'
                                                )}
                                                options={optionOrderList}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id:
                                                            'GLOBAL.PLACEHOLER.SELECT'
                                                    }
                                                )}
                                                onInputChange={e =>
                                                    handleSearchOrder(
                                                        e,
                                                        fetchOrder
                                                    )
                                                }
                                                isClearable={true}
                                                isDisabled={
                                                    !getValues('amount')
                                                }
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-lg-1 pt-7">
                                    <Button
                                        color="primary"
                                        onClick={handleAddOrder}
                                        style={{ width: '100%' }}
                                        disabled={checkAddOrder}
                                    >
                                        {intl.formatMessage({
                                            id: 'GLOBAL.BUTTON.ADD'
                                        })}
                                    </Button>
                                </div>
                            </div>
                            <div className="pt-1">
                                {listOrderReceipt?.map((item, index) => (
                                    <div key={index}>
                                        <div className="row">
                                            <div className="form-group col-lg-6">
                                                <div className="form-control bg-light">
                                                    {item.receiptable_type}
                                                </div>
                                            </div>
                                            <div className="form-group col-lg-5">
                                                <div className="form-control bg-light">
                                                    Mã đơn:{' '}
                                                    {item.receiptable_id} - Giá:{' '}
                                                    {item.amount}
                                                </div>
                                            </div>
                                            <div className="form-group col-lg-1">
                                                <span
                                                    className="btn btn-danger"
                                                    onClick={() =>
                                                        handleRemoveOrderReceipt(
                                                            index
                                                        )
                                                    }
                                                    style={{ width: '100%' }}
                                                >
                                                    <FormattedMessage id="GLOBAL.BUTTON.DELETE" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type="button"
                            onClick={handleCancelModal}
                            className="btn btn-light btn-elevate modal-title font-size-h6 text-dark"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            className="btn btn-primary btn-elevate modal-title font-size-h6"
                        >
                            {intl.formatMessage({
                                id: `ACCOUNTING.CREATE.NEW_PAYMENT_SALE.BUTTON`
                            })}
                        </button>
                    </Modal.Footer>
                </CustomModal>
            </>
        </div>
    );
}

export default NewOrderPay;
