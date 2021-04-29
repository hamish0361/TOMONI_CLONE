import EmptyData from 'app/components/EmptyData';
import 'assets/css/order.scss';
import formatNumber from 'helper/formatNumber';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardHeader } from '_metronic/_partials/controls';

function TransactionCard({ transactions, intl, height = 'h-100' }) {
    return (
        <Card className={height}>
            <CardHeader
                title={intl.formatMessage({ id: 'ORDER.TRANSACTION' })}
            />
            <div className="pb-4">
                {transactions?.length > 0 ? (
                    <div className="order-card-transaciton mt-2">
                        {transactions?.map((transaction, index) => (
                            <div key={index} className="item px-4 py-2">
                                <div className="row">
                                    <div className="col-6 order-title">
                                        <b>
                                            <FormattedMessage id="ORDER.EXECUTION_DATE" />
                                        </b>
                                        : {transaction.create_at || '-'}
                                    </div>
                                    <div className="col-6 order-title">
                                        <b>
                                            <FormattedMessage id="ORDER.AMOUNT" />
                                        </b>
                                        :{' '}
                                        {formatNumber(transaction.amount) ||
                                            '-'}
                                    </div>
                                    <div className="col-6 order-title">
                                        <b>
                                            <FormattedMessage id="ORDER.PERFORMER" />
                                        </b>
                                        : {transaction.prepared_by_id || '-'}
                                    </div>
                                    <div className="col-6 order-title">
                                        <b>
                                            <FormattedMessage id="ORDER.CONTENT" />
                                        </b>
                                        : {transaction.description || '-'}
                                    </div>
                                    <div className="col-12 order-title d-flex">
                                        <b>Files</b>:{' '}
                                        <div>
                                            {transaction?.receipts?.map(
                                                (receipt, index) => (
                                                    <div key={index}>
                                                        <a
                                                            className="text-ellipsis-line"
                                                            href={`${process.env.REACT_APP_API_URL_ACCOUNTING}/files/${receipt?.path_file}`}
                                                            download
                                                        >
                                                            {receipt?.path_file}
                                                        </a>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyData />
                )}
            </div>
        </Card>
    );
}

export default TransactionCard;
