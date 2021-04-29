import { dialog } from 'app/components/DialogNotify';
import Loading from 'app/components/Loading';
import { fetchUsers } from 'app/modules/AuthService/auth-service-redux/userSlice';
import useDebounce from 'helper/useDebounce';
import useTrans from 'helper/useTrans';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { updateDeposit, updateDepositFile } from '../../redux/depositSlice';
import {
    createTransaction,
    deleteTransaction
} from '../../redux/transactionSlice';

DialogDetail.propTypes = {
    deposit: PropTypes.object,
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

function DialogDetail({ deposit, open, onHide, onSuccess }) {
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
            isActionLoadingTransaction: accounting.transaction.isActionLoading,
            currencies: home.home.currencyList
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
            label: user.id
        };
    });

    const currencyOptions = currencies?.map(currency => {
        return {
            value: currency.id,
            label: currency.name
        };
    });

    //handle deposit
    const handleUpdateDeposit = ({ sourceOfCash, amount, note }) => {
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
            const body = {
                amount: amountNumber,
                note,
                source_of_cash_id: sourceOfCash?.value
            };

            const params = {
                id: deposit?.id,
                body
            };

            dispatch(updateDeposit(params)).then(res => {
                if (res.type.includes('fulfilled')) {
                    dialog.success(trans('ACCOUNTING.UPDATE.DEPOSIT.SUCCESS'));
                    onSuccess && onSuccess();
                } else {
                    dialog.error(trans('ACCOUNTING.UPDATE.DEPOSIT.FAIL'));
                }
            });
        }
    };

    const hanldeFileChange = e => {
        const files = e.target.files;
        const formData = new FormData();
        formData.append('file', e.target.files[0], e.target.files[0].name);
        const requestParams = {
            id: deposit?.id,
            body: formData,
            params: {
                _method: 'PUT'
            }
        };
        dispatch(updateDepositFile(requestParams)).then(res => {
            if (res.type.includes('fulfilled')) {
                setFiles(files);
                dialog.success(trans('ACCOUNTING.UPDATE.DEPOSIT.SUCCESS'));
                onSuccess && onSuccess();
            } else {
                dialog.error(trans('ACCOUNTING.UPDATE.DEPOSIT.FAIL'));
            }
        });
    };

    // handle transaction
    const [currency, setCurrency] = useState(null);
    const handleCurrencyChange = currency => {
        setCurrency(currency);
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
        } else if (transactionFile?.length <= 0) {
            dialog.warning(`${trans('ACCOUNTING.RECEIPT.WARNING')}`);
        } else {
            const formData = new FormData();
            if (transactionFile?.length > 0) {
                formData.append(
                    'receipts[0][file]',
                    transactionFile[0],
                    transactionFile[0].name
                );
            }

            const params = {
                currency_id: currency?.value,
                amount: amountNumber,
                user_id: transactionUser?.value,
                type_id: 'deposit',
                deposit_id: deposit?.id
            };

            const file = transactionFile[0];
            dispatch(createTransaction({ params, body: formData })).then(
                res => {
                    if (res.type.includes('fulfilled')) {
                        dialog.success(
                            trans('ACCOUNTING.UPDATE.DEPOSIT.SUCCESS')
                        );
                        const transaction = {
                            user_id: transactionUser?.value,
                            user_email: transactionUser?.label,
                            amount: amountNumber,
                            fileName: file?.name,
                            file: file,
                            id: res?.payload?.id
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
                        onSuccess();
                    } else {
                        dialog.error(trans('ACCOUNTING.UPDATE.DEPOSIT.FAIL'));
                    }
                }
            );
        }
    };

    const handleDeleteTransaction = (index, id) => {
        dispatch(deleteTransaction(id)).then(res => {
            if (res.type.includes('fulfilled')) {
                const clone = [...transactions];
                clone.splice(index, 1);
                setTransactions(clone);
                dialog.success(trans('ACCOUNTING.DELETE.DEPOSIT.SUCCESS'));
                onSuccess();
            } else {
                dialog.error(trans('ACCOUNTING.DELETE.DEPOSIT.FAIL'));
            }
        });
    };

    const handleFileTransactionChange = (e, index) => {
        const clone = [...transactions];
        const transaction = clone[index];
        const formData = new FormData();
        formData.append('file', e.target.files[0], e.target.files[0].name);
        console.log('transaction', transaction);
        // dispatch(
        //     updateFileTransaction({
        //         id: transaction.id,
        //         params: {
        //             _method: 'PUT'
        //         },
        //         body: formData
        //     })
        // ).then(res => {
        //     if (res.type.includes('fulfilled')) {
        //         dialog.success(trans('ACCOUNTING.UPDATE.DEPOSIT.SUCCESS'));
        //     } else {
        //         dialog.error(trans('ACCOUNTING.UPDATE.DEPOSIT.FAIL'));
        //     }
        // });
    };

    const handleUpdateTransaction = body => {
        console.log('body', body);
    };

    // fetch data
    useEffect(() => {
        if (open) {
            setTransactions(deposit?.transactions);
            setFiles(null);
            setCurrency(
                deposit?.transactions?.length > 0
                    ? {
                          value: deposit?.transactions[0]?.currency?.id,
                          label: deposit?.transactions[0]?.currency?.name
                      }
                    : null
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    useEffect(() => {
        if (searchCustomerDebounce) {
            dispatch(
                fetchUsers({
                    search: searchCustomerDebounce,
                    searchFields: 'id:like'
                })
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchCustomerDebounce]);

    const disabledTransaction =
        !getValues('transactionUser') ||
        !getValues('transactionAmount') ||
        (!currency && transactions?.length <= 0);

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
                <h6>Thông tin deposit</h6>

                <form
                    onSubmit={handleSubmit(handleUpdateDeposit)}
                    id="deposit-update-form"
                >
                    <div className="p-4 border">
                        <div className="row form-group">
                            <div className="col-6">
                                <label>
                                    <FormattedMessage id="ACCOUNTING.SOURCE_OF_CASH" />
                                </label>
                                <Controller
                                    name="sourceOfCash"
                                    control={control}
                                    options={sourceOfCashOptions}
                                    defaultValue={{
                                        value: deposit?.source_of_cash?.id,
                                        label: deposit?.source_of_cash?.name
                                    }}
                                    as={Select}
                                    placeholder="Chọn hình thức nộp tiền"
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
                                    defaultValue={deposit?.amount}
                                    as={NumberFormat}
                                    placeholder="Nhập số tiền"
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <label>
                                    <FormattedMessage id="ORDER.NOTE" />
                                </label>
                                <input
                                    name="note"
                                    ref={register}
                                    defaultValue={deposit?.note}
                                    className="form-control"
                                    placeholder="Nhập ghi chú"
                                />
                            </div>
                        </div>
                        <div className="mt-4 d-flex justify-content-end">
                            <Button
                                type="submit"
                                form="deposit-update-form"
                                color="primary"
                                size="sm"
                                className="font-weight-bolder"
                            >
                                <FormattedMessage id="GLOBAL.BUTTON.UPDATE" />
                            </Button>
                        </div>
                    </div>
                </form>
                {/* end deposit form */}
                {/* begin file */}
                <div className="row form-group mt-4">
                    <div className="col-12">
                        <label className="d-block">
                            <FormattedMessage id="ACCOUNTING.ORDER.DETAIL.TRANSACTION.FILE" />
                        </label>
                        <div className="d-flex align-items-center">
                            <input
                                type="file"
                                style={{ width: '92px' }}
                                onChange={hanldeFileChange}
                                className="mr-4"
                            />
                            {files ? (
                                <div>{files && files[0]?.name}</div>
                            ) : deposit?.path_file ? (
                                <a
                                    href={`${process.env.REACT_APP_API_URL_ACCOUNTING}/files/${deposit?.path_file}`}
                                    download
                                >
                                    {deposit?.path_file}
                                </a>
                            ) : null}
                        </div>
                    </div>
                </div>
                {/* end file */}

                <div>
                    <div className="row mb-4 align-items-center">
                        <h6 className="col-7">Transaction</h6>
                        <div className="col-5">
                            <Select
                                className="w-100"
                                placeholder="Chọn loại tiền"
                                isDisabled={transactions?.length > 0}
                                onChange={handleCurrencyChange}
                                options={currencyOptions}
                                value={currency}
                            />
                        </div>
                    </div>

                    <div className="p-4 border">
                        {/* begin transaction form */}
                        <form onSubmit={handleSubmit(handleNewTransaction)}>
                            <div className="form-group">
                                <div className="input-group align-items-end">
                                    <div
                                        className="row mr-4"
                                        style={{ flex: '1 0' }}
                                    >
                                        <div className="col-4">
                                            <label>
                                                <FormattedMessage id="ACCOUNTING.ORDER.USER" />
                                            </label>
                                            <Controller
                                                name="transactionUser"
                                                control={control}
                                                defaultValue={null}
                                                render={({
                                                    onChange,
                                                    value
                                                }) => (
                                                    <Select
                                                        options={userOptions}
                                                        onChange={user => {
                                                            onChange(user);
                                                            trigger();
                                                        }}
                                                        onInputChange={val =>
                                                            setSearchCustomer(
                                                                val
                                                            )
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
                                                render={({
                                                    onChange,
                                                    value
                                                }) => (
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
                                                className="form-control border-0 px-0"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        color="primary"
                                        type="submit"
                                        disabled={disabledTransaction}
                                        size="sm"
                                    >
                                        <FormattedMessage id="GLOBAL.BUTTON.ADD" />
                                    </Button>
                                </div>
                            </div>
                        </form>
                        {/* end transaction form */}
                        {/* begin render transaction */}
                        <RenderTransaction
                            transactions={transactions}
                            onDeleteTransaction={handleDeleteTransaction}
                            userOptions={userOptions}
                            onSearchUser={val => setSearchCustomer(val)}
                            onUpdate={handleUpdateTransaction}
                            onFileChange={handleFileTransactionChange}
                        />
                        {/* end render transaction */}
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onHide} color="secondary">
                    <FormattedMessage id="GLOBAL.BUTTON.CLOSE" />
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default DialogDetail;

const RenderTransaction = ({
    transactions,
    onDeleteTransaction,
    userOptions,
    onSearchUser,
    onUpdate,
    onFileChange
}) => {
    const handleUserChange = (userId, transactionId) => {
        onUpdate({
            id: transactionId,
            params: {
                user_id: userId
            }
        });
    };

    const amounRef = useRef(null);
    const handleAmountChange = (amount, transactionId) => {
        const amountNumber =
            typeof amount === 'string' && amount.includes(',')
                ? amount.replaceAll(',', '')
                : amount;
        if (amounRef.current) {
            clearTimeout(amounRef.current);
        }

        amounRef.current = setTimeout(() => {
            if (amountNumber) {
                onUpdate({
                    id: transactionId,
                    params: {
                        amount: amountNumber
                    }
                });
            }
        }, 700);
    };

    return (
        <>
            {transactions?.map((transaction, index) => (
                <div key={index} className="form-group">
                    <div className="input-group align-items-center">
                        <div className="row mr-4" style={{ flex: '1 0' }}>
                            <div className="col-4">
                                <Select
                                    options={userOptions}
                                    defaultValue={{
                                        value: transaction.user_id,
                                        label: transaction.user_id
                                    }}
                                    onInputChange={onSearchUser}
                                    onChange={user => {
                                        handleUserChange(
                                            user.value,
                                            transaction.id
                                        );
                                    }}
                                    isDisabled
                                />
                            </div>
                            <div className="col-4">
                                <NumberFormat
                                    className="form-control"
                                    defaultValue={transaction.amount}
                                    thousandSeparator
                                    placeholder="Nhập số tiền"
                                    onChange={e => {
                                        handleAmountChange(
                                            e.target.value,
                                            transaction.id
                                        );
                                    }}
                                    disabled
                                />
                            </div>
                            <div className="col-4">
                                <div className="d-flex h-100 align-items-center overflow-hidden border-0 px-0">
                                    <input
                                        type="file"
                                        style={{ width: '92px' }}
                                        onChange={e => onFileChange(e, index)}
                                        className="mr-2"
                                    />
                                    {transaction.fileName ? (
                                        <div style={{ width: 0 }}>
                                            {transaction.fileName}
                                        </div>
                                    ) : transaction?.receipts[0]?.path_file ? (
                                        <a
                                            style={{ width: 0 }}
                                            href={`${process.env.REACT_APP_API_URL_ACCOUNTING}/files/${transaction?.receipts[0]?.path_file}`}
                                            download
                                        >
                                            {
                                                transaction?.receipts[0]
                                                    ?.path_file
                                            }
                                        </a>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <Button
                            color="danger"
                            type="submit"
                            style={{ width: '56px' }}
                            size="sm"
                            onClick={() =>
                                onDeleteTransaction(index, transaction.id)
                            }
                        >
                            <FormattedMessage id="GLOBAL.BUTTON.DELETE" />
                        </Button>
                    </div>
                </div>
            ))}
        </>
    );
};
