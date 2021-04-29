import React, { useEffect, useState } from 'react';
import Loading from 'app/components/Loading';
import TopFilter from './TopFilter';
import TopHeader from '../../components/TopHeader';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Card, CardBody, CardHeader } from '_metronic/_partials/controls';
import {
    fetchTransactions,
    fetchTransactionsById,
    deleteReceipt,
    createReceipt,
    createNewPaymentSale
} from '../../redux/transactionSlice';
import 'assets/css/order.scss';
import { dialog } from 'app/components/DialogNotify';
import DialogDetailTransaction from './PurchaseDetail';
import formatNumber from 'helper/formatNumber';
import AccountingTable from '../../components/AccountingTable';
import { injectIntl } from 'react-intl';
import { fetchCurrency } from 'app/modules/Accounting/redux/userCurrencySlice';
import NewOrderPay from './NewOrderPay';
import { fetchUsers } from 'app/modules/AuthService/auth-service-redux/userSlice';
import { fetchOrder } from 'app/modules/Order/order-redux/orderSlice';

PurchasePage.propTypes = {};

function PurchasePage({ intl }) {
    const dispatch = useDispatch();
    const [isShow, setShow] = useState(false);
    const [isShowPay, setShowPay] = useState(false);
    const [isNewOrderReceipt, setNewOrderReceipt] = useState(false);
    const transactions = useSelector(state => state.accounting.transaction);
    const {
        list,
        pagination,
        isLoading,
        detailTransaction,
        isActionLoading,
        isLoadingDetail
    } = transactions;

    const [params, setParams] = useState({
        page: 1,
        search: 'type_id:payment-purchase',
        appends: 'user;preparedBy',
        with: 'receipts;type',
        searchJoin: 'and',
        orderBy: 'updated_at',
        sortedBy: 'desc',
        searchFields: ''
    });

    const rows = list?.map(item => {
        return {
            idOrder: item.id || '-',
            created_at: item.created_at || '-',
            amount: formatNumber(item.amount) || '-',
            user_id: item.user ? (
                <div>
                    <p>
                        {item.user?.id || '-'} | {item.currency_id || '-'}
                    </p>
                </div>
            ) : (
                '-'
            ),
            prepared_by_id: item.prepared_by_id || '-',
            description: item.description || '-'
        };
    });

    useEffect(() => {
        dispatch(fetchTransactions(params));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);
    useEffect(() => {
        dispatch(fetchCurrency());
        dispatch(fetchOrder());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(
            fetchUsers({
                page: 1,
                search: ''
            })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // detail and edit receipt
    const handleViewEditRow = id => {
        setShow(true);
        const bodyFetch = {
            id,
            params: {
                with: 'receipts;type',
                appends: 'user;preparedBy'
            }
        };
        dispatch(fetchTransactionsById(bodyFetch));
    };

    //hanlde change page
    const handlePageChange = newPage => {
        setParams({
            ...params,
            page: newPage
        });
    };
    //handle sort page
    const handleSort = (orderBy, sortedBy) => {
        setParams({
            ...params,
            page: 1,
            orderBy,
            sortedBy
        });
    };

    //search transaction
    const handleSubmitSearch = object => {
        const searchAPI = object.search;
        const searchFieldAPI = object.searchFields;
        const searchJoinAPI = object.searchJoin;
        setParams({
            ...params,
            page: 1,
            search: searchAPI,
            searchFields: searchFieldAPI,
            searchJoin: searchJoinAPI
        });
    };

    //delete transaction
    const handleDeleteReceipt = (id, idTransaction) => {
        dispatch(deleteReceipt(id)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    ` ${intl.formatMessage({
                        id: 'ACCOUNTING.RECEIPT.SUCCESS'
                    })}`
                );
                const bodyFetch = {
                    id: idTransaction,
                    params: {
                        with: 'receipts;type',
                        appends: 'user;preparedBy'
                    }
                };
                dispatch(fetchTransactionsById(bodyFetch));
            } else {
                dialog.error(
                    ` ${intl.formatMessage({
                        id: 'ACCOUNTING.RECEIPT.ERROR'
                    })}`
                );
            }
        });
    };

    //upload files receipt default
    const handleFilesReceipt = data => {
        const params = {
            id: detailTransaction?.id
        };
        dispatch(createReceipt(params)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    ` ${intl.formatMessage({
                        id: 'ACCOUNTING.RECEIPT.UPDATE.FILE.SUCCESS'
                    })}`
                );
                const bodyFetch = {
                    id: detailTransaction?.id,
                    params: {
                        with: 'receipts;type',
                        appends: 'user;preparedBy'
                    }
                };
                dispatch(fetchTransactionsById(bodyFetch));
            } else {
                dialog.error(
                    ` ${intl.formatMessage({
                        id: 'ACCOUNTING.RECEIPT.UPDATE.FILE.ERROR'
                    })}`
                );
            }
        });
    };

    //upload files receipt new
    const handleReceiptNew = dataReceipt => {
        const body = {
            param: {
                transaction_id: detailTransaction?.id,
                receiptable_type: 'purchase',
                receiptable_id: dataReceipt?.receiptable_id?.value
            }
        };
        dispatch(createReceipt(body)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    ` ${intl.formatMessage({
                        id: 'ACCOUNTING.RECEIPT.UPDATE.NEW_ORDER.SUCCESS'
                    })}`
                );
                const bodyFetch = {
                    id: detailTransaction?.id,
                    params: {
                        with: 'receipts;type',
                        appends: 'user;preparedBy'
                    }
                };
                dispatch(fetchTransactionsById(bodyFetch));
            } else {
                dialog.error(
                    ` ${intl.formatMessage({
                        id: 'ACCOUNTING.RECEIPT.UPDATE.NEW_ORDER.ERROR'
                    })}`
                );
            }
        });
    };
    //upload files receipt new
    const handleNewPaymentSale = (object, listOrderReceipt) => {
        const body = {
            type_id: 'payment-purchase',
            amount: object?.amount.replace(/,/g, ''),
            description: object?.description,
            user_id: object.user_id?.value,
            receipts: listOrderReceipt,
            currency_id: object.currency_id?.value
        };
        dispatch(createNewPaymentSale(body)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    ` ${intl.formatMessage({
                        id: 'ACCOUNTING.CREATE.NEW_PAYMENT_SALE.DIALOG.SUCCESS'
                    })}`
                );
                dispatch(fetchTransactions(params));
            } else {
                dialog.error(
                    ` ${intl.formatMessage({
                        id: 'ACCOUNTING.CREATE.NEW_PAYMENT_SALE.DIALOG.ERROR'
                    })}`
                );
            }
            setShowPay(false);
        });
    };

    const columns = [
        { id: 'idOrder', title: 'Mã giao dịch' },
        {
            id: 'created_at',
            title: ` ${intl.formatMessage({
                id: 'ACCOUNTING.ORDER.CREATED_DATE'
            })}`
        },

        {
            id: 'amount',
            title: ` ${intl.formatMessage({
                id: 'ACCOUNTING.ORDER.AMOUNT_OF_MONEY'
            })}`,
            isSort: true
        },
        {
            id: 'user_id',
            title: ` ${intl.formatMessage({
                id: 'ACCOUNTING.ACCOUNT'
            })}`
        },
        {
            id: 'prepared_by_id',
            title: ` ${intl.formatMessage({
                id: 'ACCOUNTING.ORDER.PERFORMER'
            })}`
        },
        {
            id: 'description',
            title: ` ${intl.formatMessage({
                id: 'ACCOUNTING.ORDER.DESCRIPTION'
            })}`
        }
    ];

    return (
        <>
            {isLoading && <Loading />}
            <TopHeader title="Tiền nộp đơn mua hàng">
                <button
                    className="btn btn-primary btn-sm font-size-h6 font-weight-bolder mr-2"
                    onClick={() => {
                        setShowPay(true);
                    }}
                >
                    {intl.formatMessage({
                        id: 'ACCOUNTING.ORDER.BUTTON'
                    })}
                </button>
            </TopHeader>
            <div className="px-8 pb-8">
                <>
                    <Card>
                        <CardHeader title="Danh sách tiền nộp" />
                        <CardBody>
                            <TopFilter
                                onSearch={handleSubmitSearch}
                                intl={intl}
                            />
                            <AccountingTable
                                columns={columns}
                                rows={rows}
                                page={params.page}
                                lastpage={pagination.lastPage}
                                onViewEdit={handleViewEditRow}
                                onSort={handleSort}
                                onPageChange={handlePageChange}
                                intl={intl}
                                isDelete={false}
                                isIndex={false}
                            />
                        </CardBody>
                    </Card>
                </>
            </div>
            {/*Modal detail order*/}
            <DialogDetailTransaction
                detailTransaction={detailTransaction}
                show={isShow}
                onFilesReceipt={handleFilesReceipt}
                onFilesReceiptNew={handleReceiptNew}
                onDeleteReceipt={handleDeleteReceipt}
                onHide={() => setShow(false)}
                isActionLoading={isActionLoading}
                isLoadingDetail={isLoadingDetail}
                intl={intl}
                showNew={isNewOrderReceipt}
                onHideNew={() => setNewOrderReceipt(false)}
                onNewOrderReceipt={handleReceiptNew}
                onShowModalNewOrder={() => setNewOrderReceipt(true)}
            />
            <NewOrderPay
                show={isShowPay}
                onNew={handleNewPaymentSale}
                onHide={() => setShowPay(false)}
                isActionLoading={isActionLoading}
                intl={intl}
            />
        </>
    );
}

export default injectIntl(connect(null, null)(PurchasePage));
