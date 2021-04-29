import { Switch } from '@material-ui/core';
import { dialog } from 'app/components/DialogNotify';
import DropFile from 'app/modules/Accounting/components/DropFile';
import {
    createTransaction,
    fetchTransactions
} from 'app/modules/Accounting/redux/transactionSlice';
import { fetchUserCurrency } from 'app/modules/Accounting/redux/userCurrencySlice';
import { fetchOrder } from 'app/modules/Order/order-redux/orderSlice';
import formatNumber from 'helper/formatNumber';
import useDebounce from 'helper/useDebounce';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { ModalBody } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Select from 'react-select';
import {
    Button,
    Form,
    FormGroup,
    Label,
    Modal,
    ModalFooter,
    ModalHeader
} from 'reactstrap';

DialogDepositPayment.propTypes = {
    onHide: PropTypes.func,

    show: PropTypes.bool
};

const DEPOSIT_TYPE = 'deposit';
const PAYMENT_SALE_TYPE = 'payment-sale';

function DialogDepositPayment({ onHide, show, intl }) {
    const dispatch = useDispatch();
    const { handleSubmit, register, control } = useForm();
    const [checked, setChecked] = useState(false);
    const [files, setFiles] = useState(null);

    const { id, currencyId } = useParams();
    const { currencies, orders, users } = useSelector(
        ({ home, order, accounting }) => ({
            orders: order.list.orderList,
            currencies: home.home.currencyList,
            users: accounting.userCurrency.list
        }),
        shallowEqual
    );

    const [searchOrder, setSearchOrder] = useState('');
    const searchOrderDebounce = useDebounce(searchOrder);

    const handleDeposit = ({ amount, description, order }) => {
        const amountNumber =
            typeof amount === 'string' && amount.includes(',')
                ? amount.replaceAll(',', '')
                : amount;

        if (!amount) {
            dialog.warning(
                intl.formatMessage({ id: 'ACCOUNTING.DEPOSIT.AMOUNT.WARNING' })
            );
        } else {
            // deposit
            const formData = new FormData();
            const paymentFormData = new FormData();
            if (files?.length > 0) {
                formData.append('receipts[0][file]', files[0], files[0]?.name);
                paymentFormData.append(
                    'receipts[0][file]',
                    files[0],
                    files[0]?.name
                );
            }
            const depositRequest = {
                params: {
                    amount: amountNumber,
                    description,
                    type_id: DEPOSIT_TYPE,
                    user_id: id,
                    currency_id: currencyId
                },
                body: files?.length > 0 ? formData : ''
            };

            paymentFormData.append('receipts[0][receiptable_type]', 'order');
            paymentFormData.append('receipts[0][receiptable_id]', order?.value);
            paymentFormData.append('receipts[0][user_id]', id);
            paymentFormData.append('receipts[0][amount]', order?.amount);
            const paymentRequest = {
                params: {
                    amount: amountNumber,
                    description,
                    type_id: PAYMENT_SALE_TYPE,
                    user_id: id,
                    currency_id: currencyId
                },
                body: paymentFormData
            };

            dispatch(createTransaction(depositRequest)).then(res => {
                if (res.type.includes('fulfilled')) {
                    dispatch(createTransaction(paymentRequest)).then(res => {
                        if (res.type.includes('fulfilled')) {
                            dialog.success(
                                intl.formatMessage({
                                    id: 'ACCOUNTING.DEPOSIT.PAYMENT.SUCCESS'
                                })
                            );
                            onHide();
                            dispatch(
                                fetchUserCurrency({
                                    search: `user_id:${id}`,
                                    with: 'currency'
                                })
                            );
                            dispatch(
                                fetchTransactions({
                                    page: 1,
                                    search: `user_id:${id};currency_id:${currencyId};type_id:${DEPOSIT_TYPE},${PAYMENT_SALE_TYPE}`,
                                    searchFields: `user_id:=;currency_id:=;type_id:in`,
                                    searchJoin: 'and',
                                    with: 'receipts;type;currency',
                                    appends: 'user',
                                    orderBy: 'created_at',
                                    sortedBy: 'desc'
                                })
                            );
                        } else {
                            dialog.error(
                                intl.formatMessage({
                                    id: 'ACCOUNTING.DEPOSIT.PAYMENT.FAIL'
                                })
                            );
                        }
                    });
                } else {
                    dialog.error(
                        intl.formatMessage({
                            id: 'ACCOUNTING.DEPOSIT.PAYMENT.FAIL'
                        })
                    );
                }
            });
        }
    };

    const handleCurrency = () => {
        const index = currencies?.findIndex(x => x.id === currencyId);

        if (index !== -1) {
            return currencies[index].name;
        }
        return;
    };

    useEffect(() => {
        if (searchOrderDebounce) {
            const search = !checked ? 'id' : 'trackings.id';
            dispatch(
                fetchOrder({
                    search: `customer_id:${users[0]?.user_id};${search}:${searchOrderDebounce}`,
                    searchFields: `customer_id:=;${search}:like`,
                    searchJoin: 'and',
                    with: 'trackings'
                })
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchOrderDebounce]);

    const orderOptions = orders?.map(item => {
        return {
            value: item.id,
            label: `Mã đơn: ${item.id} - ${
                item.status?.name
            } - Số tiền ${formatNumber(
                item.balance
            )} - Tracking ${(item.trackings && item.trackings[0]?.id) ||
                'N/A'}`,
            amount: item.balance
        };
    });

    return (
        <Modal
            returnFocusAfterClose={true}
            isOpen={show}
            className="dialog-common"
        >
            <ModalHeader>
                <FormattedMessage id="ACCOUNTING.PAYMENT.TITLE" />
            </ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit(handleDeposit)} id="deposit-form">
                    <FormGroup>
                        <Label className="font-size-h6 text-dark">
                            <FormattedMessage id="ACCOUNTING.ACCOUNT.CURRENCY" />
                        </Label>
                        <div className="form-control bg-light">
                            {handleCurrency()}
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label className="font-size-h6 text-dark">
                            <FormattedMessage id="ACCOUNTING.AMOUNT" />
                        </Label>
                        <Controller
                            name="amount"
                            control={control}
                            defaultValue={null}
                            as={NumberFormat}
                            className="form-control"
                            placeholder="Nhập số tiền"
                            thousandSeparator
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label className="font-size-h6 text-dark">
                            <FormattedMessage id="ACCOUNTING.DESCRIPTION" />
                        </Label>
                        <input
                            name="description"
                            type="textarea"
                            className="form-control"
                            placeholder={intl.formatMessage({
                                id: 'GLOBAL.PLACEHOLER.INPUT'
                            })}
                            ref={register}
                        />
                    </FormGroup>
                    <FormGroup>
                        <div className="d-flex justify-content-between align-items-center">
                            <Label className="font-size-h6 text-dark">
                                <FormattedMessage id="ACCOUNTING.ORDER" />
                            </Label>
                            <div>
                                <label>
                                    {!checked
                                        ? 'Tìm kiếm theo mã đơn hàng'
                                        : 'Tìm kiếm theo Tracking'}
                                </label>
                                <Switch
                                    checked={checked}
                                    onChange={e => setChecked(e.target.checked)}
                                    name="checked"
                                    color="primary"
                                />
                            </div>
                        </div>

                        <Controller
                            name="order"
                            control={control}
                            defaultValue={null}
                            render={({ onChange }) => (
                                <Select
                                    options={orderOptions}
                                    isClearable
                                    onInputChange={value =>
                                        setSearchOrder(value)
                                    }
                                    placeholder={
                                        !checked
                                            ? 'Nhập mã tìm kiếm đơn hàng'
                                            : 'Nhập mã tìm kiếm tracking'
                                    }
                                    onChange={onChange}
                                />
                            )}
                        />
                    </FormGroup>
                </Form>
                <FormGroup>
                    <Label className="font-size-h6 text-dark">
                        <FormattedMessage id="ACCOUNTING.PAYMENT.CHOOSE_RECEIPT" />
                    </Label>
                    <DropFile onFileDrop={files => setFiles(files)} />
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onHide} color="secondary">
                    <FormattedMessage id="GLOBAL.BUTTON.CANCEL" />
                </Button>
                <Button
                    type="submit"
                    color="primary"
                    className="font-weight-bolder"
                    form="deposit-form"
                >
                    <FormattedMessage id="GLOBAL.BUTTON.MONEY" />
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default DialogDepositPayment;
