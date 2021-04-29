import Loading from 'app/components/Loading';
import formatNumber from 'helper/formatNumber';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Card, CardBody } from '_metronic/_partials/controls';
import AccountTable from './AccountTable';
import TopHeader from '../../components/TopHeader';
import {
    createUserAccounting,
    fetchUserCurrency,
    resetUserCurrency
} from '../../redux/userCurrencySlice';
import TopFilter from './TopFilter';
import DialogCreateAccount from './DialogCreateAccount';
import { dialog } from 'app/components/DialogNotify';
import './styles.scss';

function CustomerPage({ intl }) {
    const dispatch = useDispatch();
    const history = useHistory();

    const [open, setOpen] = useState(false);

    const columns = [
        { id: 'id', title: intl.formatMessage({ id: 'ACCOUNTING.ID' }) },
        {
            id: 'currency_id',
            title: intl.formatMessage({ id: 'ACCOUNTING.ID' })
        },
        {
            id: 'currency',
            title: intl.formatMessage({ id: 'ACCOUNTING.ACCOUNT.CURRENCY' })
        },
        {
            id: 'username',
            title: intl.formatMessage({ id: 'ACCOUNTING.USERNAME' })
        },
        {
            id: 'total_payment',
            title: intl.formatMessage({
                id: 'ACCOUNTING.ACCOUNT.PAYMENT'
            })
        },
        {
            id: 'balance',
            title: intl.formatMessage({ id: 'ACCOUNTING.ACCOUNT.BALANCE' })
        },
        {
            id: 'deposit',
            title: intl.formatMessage({ id: 'ACCOUNTING.ACCOUNT.DEPOSIT' })
        },
        {
            id: 'created_at',
            title: intl.formatMessage({ id: 'ACCOUNTING.ACCOUNT.CREATED_AT' })
        }
    ];

    // store
    const { userList, isLoading, pagination } = useSelector(
        ({ accounting }) => ({
            userList: accounting.userCurrency.list,
            isLoading: accounting.userCurrency.isLoading,
            pagination: accounting.userCurrency.pagination
        }),
        shallowEqual
    );

    // state
    const [params, setParams] = useState({
        page: 1,
        with: 'currency',
        orderBy: 'created_at',
        sortedBy: 'desc'
    });

    useEffect(() => {
        dispatch(resetUserCurrency());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(fetchUserCurrency(params));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params]);

    const handlePageChange = newPage => {
        setParams({
            ...params,
            page: newPage
        });
    };

    const handleSubmitSearch = ({ search, searchFields, searchJoin }) => {
        setParams({
            ...params,
            page: 1,
            search,
            searchFields,
            searchJoin
        });
    };

    const handleViewDetail = (id, currency_id) => {
        history.push(`/ke-toan/tai-khoan-tien/${id}/${currency_id}/chi-tiet`);
    };

    // create account
    const handleNewAccount = body => {
        dispatch(createUserAccounting(body)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({
                        id: 'ACCOUNTING.ACCOUNT.CREATE.SUCCESS'
                    })
                );
                history.push(
                    `/ke-toan/tai-khoan-tien/${res.payload?.user_id}/${res.payload?.currency_id}/chi-tiet`
                );
            } else {
                dialog.error(
                    intl.formatMessage({ id: 'ACCOUNTING.ACCOUNT.CREATE.FAIL' })
                );
            }
        });
    };

    const rows = userList?.map(item => {
        return {
            id: item.user_id,
            currency_id: item.currency_id,
            currency: item.currency?.name,
            username: item.user_id,
            balance: formatNumber(item.balance),
            total_payment: (
                <div>
                    <div className="total-payment pb-1">
                        <div>
                            <b>
                                {intl.formatMessage({
                                    id: 'ACCOUNTING.ACCOUNT.ORDER'
                                })}
                            </b>
                            : {formatNumber(item.payment_sales_order)}{' '}
                        </div>
                        <div>
                            <b>
                                {intl.formatMessage({
                                    id: 'ACCOUNTING.ACCOUNT.PURCHASE'
                                })}
                            </b>
                            : {formatNumber(item.payment_purchase_order)}{' '}
                        </div>
                        <div>
                            <b>
                                {intl.formatMessage({
                                    id: 'ACCOUNTING.ACCOUNT.PAYMENT_SERVICE'
                                })}
                            </b>
                            : {formatNumber(item.payment_service)}{' '}
                        </div>
                    </div>
                    <div className="pt-1">
                        <b>
                            {intl.formatMessage({
                                id: 'ACCOUNTING.ACCOUNT.TOTAL_PAYMENT'
                            })}
                        </b>
                        : {formatNumber(item.total_payment)}{' '}
                    </div>
                </div>
            ),
            deposit: formatNumber(item.deposit),
            created_at: item.created_at || '-'
        };
    });

    return (
        <>
            <>
                {isLoading && <Loading />}
                {/* begin header */}
                <TopHeader
                    title={intl.formatMessage({
                        id: 'ACCOUNTING.CUSTOMER.TITLE'
                    })}
                >
                    <Button onClick={() => setOpen(true)}>
                        <FormattedMessage id="GLOBAL.BUTTON.CREATE.ACCOUNT" />
                    </Button>
                </TopHeader>
                {/* end header */}
                <div className="px-8 pb-8">
                    <Card>
                        <CardBody>
                            <TopFilter
                                onSearch={handleSubmitSearch}
                                intl={intl}
                            />
                            <AccountTable
                                width="1250px"
                                columns={columns}
                                rows={rows}
                                page={params.page}
                                lastpage={pagination.lastPage}
                                isDelete={false}
                                onViewEdit={handleViewDetail}
                                onPageChange={handlePageChange}
                            />
                        </CardBody>
                    </Card>
                </div>
            </>

            <DialogCreateAccount
                open={open}
                onHide={() => setOpen(false)}
                onNewAccount={handleNewAccount}
            />
        </>
    );
}

export default injectIntl(connect(null, null)(CustomerPage));
