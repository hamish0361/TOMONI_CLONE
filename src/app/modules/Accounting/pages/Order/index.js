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
import DialogDetailTransaction from './OrderDetail';
import formatNumber from 'helper/formatNumber';
import AccountingTable from '../../components/AccountingTable';
import { injectIntl } from 'react-intl';
import { fetchCurrency } from 'app/modules/Accounting/redux/userCurrencySlice';
import NewOrderPay from './NewOrderPay';
import { fetchUsers } from 'app/modules/AuthService/auth-service-redux/userSlice';
import { fetchReceipt } from '../../redux/receiptSlice';
import { useHistory } from 'react-router-dom';

OrderPage.propTypes = {};

function OrderPage({ intl }) {
    const RETAIL_ID = 'OR';
    const WHOLESALE_ID = 'OW';
    const PAYMENT_ID = 'OP';
    const SHIPMENT_ID = 'OS';
    const history = useHistory();

    const dispatch = useDispatch();
    const [isShow, setShow] = useState(false);
    const [isShowPay, setShowPay] = useState(false);
    const [isNewOrderReceipt, setNewOrderReceipt] = useState(false);
    const transactions = useSelector(state => state.accounting.transaction);
    const receipt = useSelector(state => state.accounting.receipt);
    const {
        list,
        pagination,
        isLoading,
        detailTransaction,
        isActionLoading,
        isLoadingDetail
    } = transactions;

    const { listReceipt, paginationReceipt, isLoadingReceipt } = receipt;

    const [params, setParams] = useState({
        page: 1,
        search: 'type_id:payment-sale',
        appends: 'user;preparedBy',
        with: 'receipts;type',
        searchJoin: 'and',
        orderBy: 'updated_at',
        sortedBy: 'desc',
        searchFields: ''
    });
    const [paramsOrder, setParamsOrder] = useState({
        page: 1,
        search: 'transaction.type_id:payment-sale',
        with: 'transaction',
        searchJoin: 'and',
        sortedBy: 'desc',
        searchFields: '',
        appends: 'order'
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

    const rowsOrder = listReceipt?.map(item => {
        return {
            id: item?.order?.id || '-',
            order_id: item?.order?.id || '-',
            shipment_method_id: item?.order?.shipment_method_id || '-',
            customer: item?.order?.customer_id || '-',
            product: item?.order?.first_item?.product_id || '-',
            balance: formatNumber(item?.order?.balance) || 0,
            status: item?.order?.status?.name || '-',
            note: item?.order?.note || '-',
            created_at: item?.order?.created_at || '-',
            updated_at: item?.order?.updated_at || '-'
        };
    });

    const navigateOrderPage = orderId => {
        if (orderId.includes(RETAIL_ID)) {
            history.push(`/ban-hang/don-le/${orderId}/chi-tiet`);
        } else if (orderId.includes(SHIPMENT_ID)) {
            history.push(`/ban-hang/don-van-chuyen-ho/${orderId}/chi-tiet`);
        } else if (orderId.includes(PAYMENT_ID)) {
            history.push(`/ban-hang/don-thanh-toan-ho/${orderId}/chi-tiet`);
        } else if (orderId.includes(WHOLESALE_ID)) {
            history.push(`/ban-hang/don-si/${orderId}/chi-tiet`);
        } else {
            return;
        }
    };

    useEffect(() => {
        dispatch(fetchTransactions(params));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);
    useEffect(() => {
        dispatch(fetchCurrency());
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

    useEffect(() => {
        dispatch(fetchReceipt(paramsOrder));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsOrder]);

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

    //hanlde change page receipt
    const handlePageChangeReceipt = newPage => {
        setParamsOrder({
            ...paramsOrder,
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
    const handleSubmitSearch = (object, objectReceipt) => {
        const searchAPI = object.search;
        const searchFieldAPI = object.searchFields;
        const searchJoinAPI = object.searchJoin;
        const searchAPIReceipt = objectReceipt.search;
        const searchFieldAPIReceipt = objectReceipt.searchFields;
        const searchJoinAPIReceipt = objectReceipt.searchJoin;
        setParams({
            ...params,
            page: 1,
            search: searchAPI,
            searchFields: searchFieldAPI,
            searchJoin: searchJoinAPI
        });
        setParamsOrder({
            ...paramsOrder,
            page: 1,
            search: searchAPIReceipt,
            searchFields: searchFieldAPIReceipt,
            searchJoin: searchJoinAPIReceipt
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
                receiptable_type: 'order',
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
        if (object?.amount?.length === 0) {
            dialog.warning(
                `${intl.formatMessage({
                    id: 'ACCOUNTING.CARD.DIALOG_NEW.REQUIRED.AMOUNT'
                })}`
            );
        } else if (object?.user_id?.length === 0) {
            dialog.warning(
                `${intl.formatMessage({
                    id: 'ACCOUNTING.CARD.DIALOG_NEW.REQUIRED.USER'
                })}`
            );
        } else if (object?.currency_id?.length === 0) {
            dialog.warning(
                `${intl.formatMessage({
                    id: 'ACCOUNTING.CARD.DIALOG_NEW.REQUIRED.CURRENCY_ID'
                })}`
            );
        } else {
            const body = {
                type_id: 'payment-sale',
                amount: object?.amount.replace(/,/g, ''),
                description: object?.description,
                user_id: object?.user_id?.value,
                receipts: listOrderReceipt,
                currency_id: object?.currency_id?.value
            };
            dispatch(createNewPaymentSale(body)).then(res => {
                if (res.type.includes('fulfilled')) {
                    dialog.success(
                        ` ${intl.formatMessage({
                            id:
                                'ACCOUNTING.CREATE.NEW_PAYMENT_SALE.DIALOG.SUCCESS'
                        })}`
                    );
                    dispatch(fetchTransactions(params));
                } else {
                    dialog.error(
                        ` ${intl.formatMessage({
                            id:
                                'ACCOUNTING.CREATE.NEW_PAYMENT_SALE.DIALOG.ERROR'
                        })}`
                    );
                }
                setShowPay(false);
            });
        }
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
    const columnsOrder = [
        {
            id: 'id',
            title: intl.formatMessage({ id: 'ORDER.WHOLESALE.TABLE_ID' }),
            isSort: false
        },
        {
            id: 'order_id',
            title: intl.formatMessage({ id: 'ORDER.WHOLESALE.TABLE_ID' }),
            isSort: false
        },
        {
            id: 'shipment_method_id',
            title: intl.formatMessage({ id: 'ORDER.SHIPMENT_METHOD' }),
            isSort: false
        },
        {
            id: 'customer',
            title: intl.formatMessage({ id: 'ORDER.RETAIL.TABLE_CUSTOMER' }),
            isSort: false
        },
        {
            id: 'product',
            title: intl.formatMessage({ id: 'ORDER.WHOLESALE.TABLE_PRODUCT' }),
            isSort: false
        },
        {
            id: 'balance',
            title: intl.formatMessage({ id: 'ORDER.WHOLESALE.TABLE_PRICE' }),
            isSort: false
        },
        {
            id: 'status',
            title: intl.formatMessage({ id: 'ORDER.WHOLESALE.TABLE_STATUS' }),
            isSort: false
        },
        {
            id: 'note',
            title: intl.formatMessage({ id: 'ORDER.WHOLESALE.TABLE_NOTE' }),
            isSort: false,
            width: '22%'
        },
        {
            id: 'created_at',
            title: intl.formatMessage({
                id: 'GLOBAL.FILTER.CREATE_DATE'
            })
        },
        {
            id: 'updated_at',
            title: intl.formatMessage({
                id: 'ORDER.WHOLESALE.TABLE_UPDATE_DATE'
            }),
            isSort: true
        }
    ];

    return (
        <>
            {(isLoadingReceipt || isLoading) && <Loading />}
            <TopHeader
                title={intl.formatMessage({
                    id: 'ACCOUNTING.ORDER.TITLE'
                })}
            >
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
            <div className="px-8 pb-8">
                <>
                    <Card>
                        <CardHeader title="Danh sách đơn bán hàng" />
                        <CardBody>
                            <AccountingTable
                                columns={columnsOrder}
                                rows={rowsOrder}
                                page={paramsOrder.page}
                                lastpage={paginationReceipt.lastPage}
                                onPageChange={handlePageChangeReceipt}
                                intl={intl}
                                isDelete={false}
                                isIndex={false}
                                onViewEdit={navigateOrderPage}
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

export default injectIntl(connect(null, null)(OrderPage));
