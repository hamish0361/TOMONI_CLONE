import formatNumber from 'helper/formatNumber';
import useTrans from 'helper/useTrans';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';
import { Card, CardBody, CardHeader } from '_metronic/_partials/controls';

function InfoCard(props) {
    const [trans] = useTrans();

    // store
    const { users } = useSelector(
        ({ accounting }) => ({
            users: accounting.userCurrency.list
        }),
        shallowEqual
    );

    return (
        <Card className="h-100">
            <CardHeader title={trans('ACCOUNTING.ACCOUNT.INFO.TITLE')} />
            <CardBody>
                <div className="row form-group">
                    {/* begin colum */}
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>
                                <FormattedMessage id="ACCOUNTING.ACCOUNT.USER" />
                            </label>
                            <div className="form-control bg-light">
                                {users[0]?.user_id}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>
                                <FormattedMessage id="ACCOUNTING.ACCOUNT.CURRENCY" />
                            </label>
                            <div className="form-control bg-light">
                                {users[0]?.currency?.name}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>
                                <FormattedMessage id="ACCOUNTING.ACCOUNT.BALANCE" />
                            </label>
                            <div className="form-control bg-light">
                                {formatNumber(users[0]?.balance)}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>
                                <FormattedMessage id="ACCOUNTING.ACCOUNT.DEPOSIT" />
                            </label>
                            <div className="form-control bg-light">
                                {formatNumber(users[0]?.deposit)}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>
                                <FormattedMessage id="ACCOUNTING.ACCOUNT.CREATED_AT" />
                            </label>
                            <div className="form-control bg-light">
                                {users[0]?.created_at}
                            </div>
                        </div>
                    </div>
                    {/* end colum */}

                    {/* begin colum */}
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>
                                <FormattedMessage id="ACCOUNTING.ACCOUNT.ORDER" />
                            </label>
                            <div className="form-control bg-light">
                                {formatNumber(users[0]?.payment_sales_order)}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>
                                <FormattedMessage id="ACCOUNTING.ACCOUNT.PURCHASE" />
                            </label>
                            <div className="form-control bg-light">
                                {formatNumber(users[0]?.payment_purchase_order)}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>
                                <FormattedMessage id="ACCOUNTING.ACCOUNT.PAYMENT_SERVICE" />
                            </label>
                            <div className="form-control bg-light">
                                {formatNumber(users[0]?.payment_service)}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>
                                <FormattedMessage id="ACCOUNTING.ACCOUNT.TOTAL_PAYMENT" />
                            </label>
                            <div className="form-control bg-light">
                                {formatNumber(users[0]?.total_payment)}
                            </div>
                        </div>
                    </div>
                    {/* end colum */}
                </div>
            </CardBody>
        </Card>
    );
}

export default InfoCard;
