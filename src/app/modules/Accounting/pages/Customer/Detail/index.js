import { dialog } from 'app/components/DialogNotify';
import Loading from 'app/components/Loading';
import { resetUserCurrency } from 'app/modules/Accounting/redux/userCurrencySlice';
import {
    fetchOrder,
    resetOrder
} from 'app/modules/Order/order-redux/orderSlice';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from 'reactstrap';
import TopHeader from '../../../components/TopHeader';
import {
    createTransaction,
    fetchTransactions,
    fetchTransactionType,
    resetTransaction,
    updateTransaction
} from '../../../redux/transactionSlice';
import { fetchUserCurrency } from '../../../redux/userCurrencySlice';
import DialogDepositPayment from './DialogDepositPayment';
import DialogPayment from './DialogPayment';
import DialogTransactionDetail from './DialogTransactionDetail';
import InfoCard from './InfoCard';
import TransactionCard from './TransactionCard';

const DEPOSIT_TYPE = 'deposit';
const PAYMENT_SALE_TYPE = 'payment-sale';

function CustomerDetailPage({ intl }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { id, currencyId } = useParams();

    // store
    const { isLoading, isActionLoading } = useSelector(
        ({ accounting }) => ({
            isLoading: accounting.transaction.isLoading,
            isActionLoading: accounting.transaction.isActionLoading
        }),
        shallowEqual
    );

    // state
    const [paramsRequest, setParamsRequest] = useState({
        page: 1,
        search: `user_id:${id};currency_id:${currencyId};type_id:${DEPOSIT_TYPE},${PAYMENT_SALE_TYPE}`,
        searchFields: `user_id:=;currency_id:=;type_id:in`,
        searchJoin: 'and',
        with: 'receipts;type;currency',
        appends: 'user',
        orderBy: 'created_at',
        sortedBy: 'desc'
    });
    const [show, setShow] = useState(false);
    const [openTransaction, setOpenTransaction] = useState(false);
    const [transaction, setTransaction] = useState(null);

    const [openDepositPayment, setOpenDepositPayment] = useState(false);

    useEffect(() => {
        dispatch(resetTransaction());
        dispatch(resetUserCurrency());
        dispatch(resetOrder());
        dispatch(
            fetchOrder({
                search: `customer_id:${id}`,
                searchFields: 'customer_id:=',
                with: 'trackings'
            })
        );
        dispatch(
            fetchUserCurrency({
                search: `user_id:${id};currency_id:${currencyId}`,
                searchFields: `user_id:=;currency_id:=`,
                searchJoin: 'and',
                with: 'currency'
            })
        );
        dispatch(fetchTransactionType());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(fetchTransactions(paramsRequest));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramsRequest]);

    const handlePageChange = newPage => {
        setParamsRequest({
            ...paramsRequest,
            page: newPage
        });
    };

    const handleSearchTransaction = ({ search, searchFields, searchJoin }) => {
        setParamsRequest({
            ...paramsRequest,
            search,
            searchFields,
            searchJoin
        });
    };

    // dialog
    const handleDeposit = params => {
        dispatch(createTransaction(params)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({ id: 'ACCOUNTING.DEPOSIT.SUCCESS' })
                );
                dispatch(
                    fetchUserCurrency({
                        search: `user_id:${id}`,
                        with: 'currency'
                    })
                );
                dispatch(
                    fetchTransactions({
                        ...paramsRequest,
                        orderBy: 'updated_at'
                    })
                );
                setShow(false);
            } else {
                dialog.error(
                    intl.formatMessage({ id: 'ACCOUNTING.DEPOSIT.FAIL' })
                );
            }
        });
    };

    // dialog transaction
    const handleTransactionDetail = transactionObj => {
        setTransaction(transactionObj);
        setOpenTransaction(true);
    };

    const handleUpdateTransaction = body => {
        dispatch(updateTransaction(body)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({
                        id: 'ACCOUNTING.ACCOUNT.DETAIL.UPDATE.SUCCESS'
                    })
                );
                dispatch(fetchTransactions(paramsRequest));
            } else {
                dialog.error(
                    intl.formatMessage({
                        id: 'ACCOUNTING.ACCOUNT.DETAIL.UPDATE.FAIL'
                    })
                );
            }
            setOpenTransaction(false);
        });
    };

    const loading = isActionLoading || isLoading;

    return (
        <>
            {loading && <Loading />}
            {/* begin header */}
            <TopHeader
                title={intl.formatMessage({
                    id: 'ACCOUNTING.CUSTOMER.DETAIL.TITLE'
                })}
            >
                <Button
                    color="secondary"
                    onClick={() => {
                        history.goBack();
                    }}
                >
                    <i className="fa fa-arrow-left" />
                    <FormattedMessage id="GLOBAL.BUTTON.BACK" />
                </Button>
                <Button
                    color="primary"
                    onClick={() => {
                        setShow(true);
                    }}
                    className="mx-2"
                >
                    <FormattedMessage id="GLOBAL.BUTTON.MONEY" />
                </Button>
                <Button
                    color="primary"
                    onClick={() => setOpenDepositPayment(true)}
                >
                    <FormattedMessage id="GLOBAL.BUTTON.DEPOSIT_PAYMENT" />
                </Button>
            </TopHeader>
            {/* end header */}
            <div className="px-8 pb-8">
                <InfoCard />

                <TransactionCard
                    onPageChange={handlePageChange}
                    onTransactionDetail={handleTransactionDetail}
                    onSearchTransaction={handleSearchTransaction}
                />
            </div>
            {/* begin modal */}
            <DialogPayment
                intl={intl}
                show={show}
                onHide={() => setShow(false)}
                onDeposit={handleDeposit}
            />
            {/* end modal */}
            <DialogTransactionDetail
                open={openTransaction}
                onHide={() => setOpenTransaction(false)}
                transaction={transaction}
                onUpdate={handleUpdateTransaction}
            />
            <DialogDepositPayment
                intl={intl}
                show={openDepositPayment}
                onHide={() => setOpenDepositPayment(false)}
            />
        </>
    );
}

export default injectIntl(connect(null, null)(CustomerDetailPage));
