import Loading from 'app/components/Loading';
import TopHeader from 'app/components/TopHeader';
import formatNumber from 'helper/formatNumber';
import useTrans from 'helper/useTrans';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import { Card, CardBody } from '_metronic/_partials/controls';
import AccountingTable from '../../components/AccountingTable';
import {
    fetchDeposit,
    fetchSourceOfCashes,
    resetDeposit
} from '../../redux/depositSlice';
import DialogDeposit from './DialogDeposit';
import DialogDetail from './DialogDetail';
import TopFilter from './TopFilter';

function DepositPage() {
    const dispatch = useDispatch();
    const [trans] = useTrans();
    // store
    const { deposits, pagination, isLoading, isActionLoading } = useSelector(
        ({ accounting }) => ({
            deposits: accounting.deposit.list,
            pagination: accounting.deposit.pagination,
            isLoading: accounting.deposit.isLoading,
            isActionLoading: accounting.deposit.isActionLoading
        }),
        shallowEqual
    );

    const [openDeposit, setOpenDeposit] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [queryParams, setQueryParams] = useState({
        page: 1,
        with: 'sourceOfCash;transactions.currency;transactions.receipts',
        appends: 'transactions.receipts.order',
        orderBy: 'created_at',
        sortedBy: 'desc'
    });
    const [deposit, setDeposit] = useState(null);

    //handle
    const handleSubmitSearch = search => {
        setQueryParams({
            ...queryParams,
            ...search
        });
    };

    const handleViewDetail = id => {
        const index = deposits?.findIndex(x => x.id === id);
        if (index !== -1) {
            setDeposit(deposits[index]);
        }
        setOpenDetail(true);
    };

    const handlePageChange = newPage => {
        setQueryParams({
            ...queryParams,
            page: newPage
        });
    };

    const handleNewSuccessDeposit = (
        orderBy = 'created_at',
        sortedBy = 'desc'
    ) => {
        dispatch(fetchDeposit({ ...queryParams, orderBy, sortedBy }));
    };

    useEffect(() => {
        dispatch(resetDeposit());
        dispatch(fetchSourceOfCashes());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // fetch data
    useEffect(() => {
        dispatch(fetchDeposit(queryParams));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParams]);

    // table
    const columns = [
        { id: 'id', title: 'id' },
        { id: 'importer_id', title: 'Người nộp' },
        { id: 'sourceOfCash', title: 'Hình thức' },
        { id: 'amount', title: 'Số tiền' },
        { id: 'transactionsAmount', title: 'Tổng tiền giao dịch' },
        { id: 'differenceAmount', title: 'Tiền còn lại' },
        { id: 'transactions', title: 'Transactions' },
        { id: 'updated_date', title: 'Ngày tạo' }
    ];

    const rows = deposits?.map(item => {
        return {
            id: item.id,
            importer_id: item.importer_id,
            sourceOfCash: item.source_of_cash?.name,
            amount: formatNumber(item.amount),
            transactionsAmount: item.transactions_amount,
            differenceAmount: formatNumber(item.difference_amount),
            transactions: item.transactions?.map((transaction, idx) => (
                <div key={idx}>
                    <b>{transaction.user_id}</b>: {transaction.amount}{' '}
                    {transaction.currency?.name}
                </div>
            )),
            updated_date: item.created_at
        };
    });

    const loading = isLoading || isActionLoading;

    return (
        <>
            <>
                {loading && <Loading />}
                <TopHeader title={trans('ACCOUNTING.DEPOSIT')}>
                    <Button
                        color="primary"
                        onClick={() => setOpenDeposit(true)}
                    >
                        {' '}
                        <FormattedMessage id="ACCOUNTING.CARD.PAYMENT" />{' '}
                    </Button>
                </TopHeader>

                <div className="px-8 pb-8">
                    <Card>
                        <CardBody>
                            <TopFilter onSearch={handleSubmitSearch} />
                            <AccountingTable
                                width="1000px"
                                columns={columns}
                                rows={rows}
                                isIndex={false}
                                page={pagination.currentPage}
                                lastpage={pagination.lastPage}
                                isDelete={false}
                                onViewEdit={handleViewDetail}
                                onPageChange={handlePageChange}
                            />
                        </CardBody>
                    </Card>
                </div>
            </>
            <DialogDeposit
                open={openDeposit}
                onHide={() => setOpenDeposit(false)}
                onSuccess={handleNewSuccessDeposit}
            />

            <DialogDetail
                open={openDetail}
                onHide={() => setOpenDetail(false)}
                deposit={deposit}
                onSuccess={() => handleNewSuccessDeposit('updated_at', 'desc')}
            />
        </>
    );
}

export default DepositPage;
