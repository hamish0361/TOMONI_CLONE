import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardHeader } from '_metronic/_partials/controls';
import AccountingTable from 'app/modules/Accounting/components/AccountingTable';
import useTrans from 'helper/useTrans';
import { shallowEqual, useSelector } from 'react-redux';
import formatNumber from 'helper/formatNumber';
import Loading from 'app/components/Loading';
import TopFilter from './TopFilter';

TransactionCard.propTypes = {
    onPageChange: PropTypes.func,
    onTransactionDetail: PropTypes.func,
    onSearchTransaction: PropTypes.func
};

function TransactionCard({
    onPageChange,
    onTransactionDetail,
    onSearchTransaction
}) {
    const [trans] = useTrans();

    // store
    const {
        transactions,
        pagination,
        isLoading,
        isActionLoading
    } = useSelector(
        ({ accounting }) => ({
            transactions: accounting.transaction.list,
            pagination: accounting.transaction.pagination,
            isLoading: accounting.transaction.isLoading,
            isActionLoading: accounting.transaction.isActionLoading
        }),
        shallowEqual
    );

    const handleTransactionDetail = id => {
        const index = transactions?.findIndex(x => x.id === id);

        if (index !== -1) {
            onTransactionDetail(transactions[index]);
        }
    };

    const handleSearchTransaction = params => {
        onSearchTransaction(params);
    };

    const columns = [
        { id: 'id', title: trans('ACCOUNTING.ID') },
        { id: 'created_at', title: trans('ACCOUNTING.ACCOUNT.CREATED_AT') },
        { id: 'type', title: trans('ACCOUNTING.TYPE') },
        {
            id: 'amount',
            title: trans('ACCOUNTING.AMOUNT')
        },
        {
            id: 'currency',
            title: trans('ACCOUNTING.CURRENCY')
        },
        {
            id: 'user_id',
            title: trans('ACCOUNTING.ACCOUNT')
        },
        {
            id: 'prepared_by_id',
            title: trans('ACCOUNTING.PERFORMER')
        },
        {
            id: 'description',
            title: trans('ACCOUNTING.DESCRIPTION')
        }
    ];

    const rows = transactions?.map(item => {
        return {
            id: item.id || '',
            created_at: item.created_at || '-',
            type: item.type?.name || '-',
            amount: formatNumber(item.amount) || '-',
            description: item.description || '-',
            prepared_by_id: item.prepared_by_id || '-',
            currency: item.currency?.name || '-',
            user_id: item.user_id || '-'
        };
    });

    return (
        <>
            {(isLoading || isActionLoading) && <Loading />}
            <Card>
                <CardHeader
                    title={trans('ACCOUNTING.ACCOUNT.TRANSACTION.TITLE')}
                />
                <CardBody>
                    <TopFilter onSearch={handleSearchTransaction} />

                    <AccountingTable
                        columns={columns}
                        rows={rows}
                        page={pagination.currentPage}
                        lastpage={pagination.lastPage}
                        onPageChange={onPageChange}
                        onViewEdit={handleTransactionDetail}
                    />
                </CardBody>
            </Card>
        </>
    );
}

export default TransactionCard;
