import { Divider } from '@material-ui/core';
import { dialog } from 'app/components/DialogNotify';
import Loading from 'app/components/Loading';
import { fetchUsers } from 'app/modules/AuthService/auth-service-redux/userSlice';
import formatNumber from 'helper/formatNumber';
import useDebounce from 'helper/useDebounce';
import useTrans from 'helper/useTrans';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import DropFile from '../../components/DropFile';
import { createDeposit } from '../../redux/depositSlice';

DialogDeposit.propTypes = {
    open: PropTypes.bool,

    onHide: PropTypes.func,
    onSuccess: PropTypes.func
};

const defaultValue = {
    amount: 0,
    note: '',
    sourceOfCashes: null,
    transactionAmount: 0,
    transactionUser: null,
    currency: null,
    transactionFile: null
};

function DialogDeposit({ open, onHide, onSuccess }) {
    const dispatch = useDispatch();
    const [trans] = useTrans();
    const {
        handleSubmit,
        control,
        register,
        reset,
        getValues,
        trigger
    } = useForm({ defaultValue });

    const [transactions, setTransactions] = useState([]);
    const [files, setFiles] = useState(null);

    // store
    const {
        sourceOfCashes,
        users,
        currencies,
        isActionLoadingTransaction
    } = useSelector(
        ({ accounting, authService, home }) => ({
            sourceOfCashes: accounting.deposit.sourceOfCashList,
            users: authService.user.userList,
            currencies: home.home.currencyList,
            isActionLoadingTransaction: accounting.transaction.isActionLoading
        }),
        shallowEqual
    );

    const [searchCustomer, setSearchCustomer] = useState('');
    const searchCustomerDebounce = useDebounce(searchCustomer);

    //options
    const sourceOfCashOptions = sourceOfCashes?.map(item => {
        return {
            value: item.id,
            label: item.name
        };
    });

    const userOptions = users?.map(user => {
        return {
            value: user.id,
            label: user.email
        };
    });

    const currencyOptions = currencies?.map(currency => {
        return {
            value: currency.id,
            label: currency.name
        };
    });

    //handle
    const handleDeposit = ({ sourceOfCash, amount, note, currency }) => {
        const formData = new FormData();

        const amountNumber =
            typeof amount === 'string' && amount.includes(',')
                ? amount.replaceAll(',', '')
                : amount;

        const totalAmount = transactions.reduce(
            (sum, tran) => sum + +tran?.amount,
            0
        );
        const total = totalAmount;

        if (total > +amountNumber) {
            dialog.warning(
                `${trans('ACCOUNTING.LIMIT_AMOUNT_WARNING')} ${amountNumber}`
            );
        } else {
            formData.append('amount', amountNumber);
            formData.append('note', note);
            formData.append('currency_id', currency?.value);
            formData.append('source_of_cash_id', sourceOfCash?.value);
            if (files?.length > 0) {
                formData.append('file', files[0], files[0].name);
            }

            // eslint-disable-next-line array-callback-return
            transactions?.map((item, index) => {
                formData.append(
                    `transactions[${index}][user_id]`,
                    item.user_id
                );
                // formData.append(
                //     `transactions[${index}][currency_id]`,
                //     currency?.value
                // );
                formData.append(`transactions[${index}][amount]`, item.amount);
                if (item.file) {
                    formData.append(
                        `transactions[${index}][receipts][0][file]`,
                        item.file,
                        item.file[0]?.name
                    );
                }
                if (item.order) {
                    formData.append(
                        `transactions[${index}][receipts][0][receiptable_id]`,
                        item.order?.value
                    );
                    formData.append(
                        `transactions[${index}][receipts][0][receiptable_type]`,
                        'order'
                    );
                }
            });

            dispatch(createDeposit(formData)).then(res => {
                if (res.type.includes('fulfilled')) {
                    dialog.success(trans('ACCOUNTING.DEPOSIT.SUCCESS'));
                    reset(defaultValue);
                    setTransactions([]);
                    onHide();
                    onSuccess && onSuccess();
                } else {
                    dialog.error(trans('ACCOUNTING.DEPOSIT.FAIL'));
                }
            });
        }
    };

    const handleNewTransaction = ({
        amount,
        transactionUser,
        transactionAmount,
        transactionFile
    }) => {
        const amountNumber =
            typeof transactionAmount === 'string' &&
            transactionAmount.includes(',')
                ? transactionAmount.replaceAll(',', '')
                : transactionAmount;

        const depositAmountNumber =
            typeof amount === 'string' && amount.includes(',')
                ? amount.replaceAll(',', '')
                : amount;

        const totalAmount = transactions.reduce(
            (sum, tran) => sum + +tran?.amount,
            0
        );
        const total = totalAmount + +amountNumber;

        if (total > +depositAmountNumber) {
            dialog.warning(
                `${trans('ACCOUNTING.LIMIT_AMOUNT_WARNING')} ${amount}`
            );
        } else {
            const transaction = {
                user_id: transactionUser?.value,
                user_email: transactionUser?.label,
                amount: amountNumber,
                fileName: transactionFile[0]?.name,
                file: transactionFile.length > 0 ? transactionFile[0] : null
            };
            const cloneList = [...transactions];
            cloneList.push(transaction);
            setTransactions(cloneList);
            reset({
                ...getValues(),
                transactionUser: null,
                transactionAmount: 0,
                transactionFile: null
            });
        }
    };

    const handleDeleteTransaction = index => {
        const clone = [...transactions];
        clone.splice(index, 1);
        setTransactions(clone);
    };

    // fetch data
    useEffect(() => {
        if (searchCustomerDebounce) {
            dispatch(
                fetchUsers({
                    search: searchCustomerDebounce,
                    searchFields: 'email:like'
                })
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchCustomerDebounce]);

    const disabledTransaction =
        !getValues('transactionUser') || !getValues('transactionAmount');

    const disabledDeposit =
        !getValues('sourceOfCash') ||
        !getValues('currency') ||
        !getValues('amount') ||
        transactions?.length < 1;

    const loading = isActionLoadingTransaction;

    return (
        <Modal
            returnFocusAfterClose={true}
            isOpen={open}
            className="dialog-common"
        >
            {loading && <Loading />}
            <ModalHeader>
                <FormattedMessage id="ACCOUNTING.DEPOSIT" />
            </ModalHeader>
            <ModalBody>
                {/* begin deposit form */}
                <form onSubmit={handleSubmit(handleDeposit)} id="deposit-form">
                    <div className="row form-group">
                        <div className="col-6">
                            <label>
                                <FormattedMessage id="ACCOUNTING.SOURCE_OF_CASH" />
                            </label>
                            <Controller
                                name="sourceOfCash"
                                control={control}
                                defaultValue={null}
                                render={({ onChange }) => (
                                    <Select
                                        options={sourceOfCashOptions}
                                        onChange={sourceOfCash => {
                                            onChange(sourceOfCash);
                                            trigger();
                                        }}
                                        placeholder="Chọn hình thức nộp tiền"
                                    />
                                )}
                            />
                        </div>
                        <div className="col-6">
                            <label>
                                <FormattedMessage id="ORDER.AMOUNT" />
                            </label>
                            <Controller
                                name="amount"
                                control={control}
                                className="form-control"
                                thousandSeparator
                                defaultValue={null}
                                as={NumberFormat}
                                placeholder="Nhập số tiền"
                            />
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-6">
                            <label>
                                <FormattedMessage id="ACCOUNTING.CURRENCY" />
                            </label>
                            <Controller
                                name="currency"
                                control={control}
                                defaultValue={null}
                                render={({ onChange, value }) => (
                                    <Select
                                        options={currencyOptions}
                                        onChange={currency => {
                                            onChange(currency);
                                            trigger();
                                        }}
                                        isClearable
                                        value={value}
                                        placeholder="Chọn loại tiền"
                                    />
                                )}
                            />
                        </div>
                        <div className="col-6">
                            <label>
                                <FormattedMessage id="ORDER.NOTE" />
                            </label>
                            <input
                                name="note"
                                ref={register}
                                className="form-control"
                                placeholder="Nhập ghi chú "
                            />
                        </div>
                    </div>
                </form>
                {/* end deposit form */}
                {/* begin deposit file */}
                <div className="row form-group">
                    <div className="col-12">
                        <label>
                            <FormattedMessage id="ACCOUNTING.ORDER.DETAIL.TRANSACTION.FILE" />
                        </label>
                        <DropFile onFileDrop={files => setFiles(files)} />
                    </div>
                </div>
                {/* end deposit file */}

                <h6>Transaction</h6>
                <Divider className="mb-4" />

                {/* begin transaction form */}
                <form onSubmit={handleSubmit(handleNewTransaction)}>
                    <div className="form-group">
                        <div className="input-group align-items-end">
                            <div className="row mr-4" style={{ flex: '1 0' }}>
                                <div className="col-4">
                                    <label>
                                        <FormattedMessage id="ACCOUNTING.ORDER.USER" />
                                    </label>
                                    <Controller
                                        name="transactionUser"
                                        control={control}
                                        defaultValue={null}
                                        render={({ onChange, value }) => (
                                            <Select
                                                options={userOptions}
                                                onChange={user => {
                                                    onChange(user);
                                                    trigger();
                                                }}
                                                onInputChange={val =>
                                                    setSearchCustomer(val)
                                                }
                                                value={value}
                                                placeholder="Chọn người dùng"
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-4">
                                    <label>
                                        <FormattedMessage id="ORDER.AMOUNT" />
                                    </label>
                                    <Controller
                                        name="transactionAmount"
                                        control={control}
                                        defaultValue={null}
                                        render={({ onChange, value }) => (
                                            <NumberFormat
                                                placeholder="Nhập số tiền"
                                                className="form-control"
                                                thousandSeparator
                                                onChange={val => {
                                                    onChange(val);
                                                    trigger();
                                                }}
                                                value={value}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="col-4">
                                    <label>
                                        <FormattedMessage id="ACCOUNTING.ORDER.DETAIL.TRANSACTION.FILE" />
                                    </label>
                                    <input
                                        name="transactionFile"
                                        type="file"
                                        ref={register}
                                        className="form-control border-0"
                                    />
                                </div>
                            </div>
                            <Button
                                color="primary"
                                type="submit"
                                disabled={disabledTransaction}
                            >
                                <FormattedMessage id="GLOBAL.BUTTON.ADD" />
                            </Button>
                        </div>
                    </div>
                </form>
                {/* end transaction form */}
                <RenderTransaction
                    transactions={transactions}
                    onDeleteTransaction={handleDeleteTransaction}
                />
            </ModalBody>
            <ModalFooter>
                <Button onClick={onHide} color="secondary">
                    <FormattedMessage id="GLOBAL.BUTTON.CANCEL" />
                </Button>
                <Button
                    type="submit"
                    form="deposit-form"
                    color="primary"
                    className="font-weight-bolder"
                    disabled={disabledDeposit}
                >
                    <FormattedMessage id="ACCOUNTING.DEPOSIT" />
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default DialogDeposit;

const RenderTransaction = ({ transactions, onDeleteTransaction }) => {
    return (
        <>
            {transactions?.map((transaction, index) => (
                <div key={index} className="form-group">
                    <div className="input-group align-items-end">
                        <div className="row mr-4" style={{ flex: '1 0' }}>
                            <div className="col-4">
                                <div className="form-control bg-light">
                                    {transaction.user_email}
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-control bg-light">
                                    {formatNumber(+transaction.amount)}
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="form-control bg-light overflow-hidden pr-2">
                                    {transaction.fileName}
                                </div>
                            </div>
                        </div>
                        <Button
                            color="danger"
                            type="submit"
                            style={{ minWidth: '66px' }}
                            onClick={() => onDeleteTransaction(index)}
                        >
                            <FormattedMessage id="GLOBAL.BUTTON.DELETE" />
                        </Button>
                    </div>
                </div>
            ))}
        </>
    );
};
