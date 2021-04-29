import DialogNotify from 'app/components/DialogNotify';
import ErrorPage from 'app/modules/Error/ErrorPage';
import React from 'react';
import { Switch, useRouteMatch } from 'react-router-dom';
import { ContentRoute } from '../../../../_metronic/layout';
import CardPage from './Card';
import CustomerPage from './Customer';
import CustomerDetailPage from './Customer/Detail';
import DepositPage from './Deposit';
import OrderPage from './Order';
import PurchasePage from './Purchase';

function AccountingPage() {
    const match = useRouteMatch();

    return (
        <>
            <DialogNotify />
            <Switch>
                <ContentRoute
                    path={`${match.url}/kt-ban-hang`}
                    component={OrderPage}
                    need={['transactions']}
                />
                <ContentRoute
                    path={`${match.url}/kt-mua-hang`}
                    component={PurchasePage}
                    need={['transactions']}
                />
                {/* begin kho */}
                <ContentRoute
                    path={`${match.url}/dich-vu`}
                    component={CardPage}
                    need={['cards']}
                />
                {/* end kho */}
                {/* begin customer */}
                <ContentRoute
                    path={`${match.url}/tai-khoan-tien/:id/:currencyId/chi-tiet`}
                    component={CustomerDetailPage}
                    need={['banks']}
                />
                <ContentRoute
                    path={`${match.url}/tai-khoan-tien`}
                    component={CustomerPage}
                    need={['banks']}
                />
                <ContentRoute
                    path={`${match.url}/nop-tien`}
                    component={DepositPage}
                    need={['transactions']}
                />
                {/* end customer */}
                <ContentRoute component={ErrorPage} />
            </Switch>
        </>
    );
}

export default AccountingPage;
