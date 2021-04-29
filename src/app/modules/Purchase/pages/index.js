import DialogNotify from 'app/components/DialogNotify';
import React from 'react';
import { Switch, useRouteMatch } from 'react-router-dom';
import ErrorPage from '../../Error/ErrorPage';
import DivisionGoods from './DivisionGoods';
import DivisionGoodsDetailPage from './DivisionGoods/DivisionGoodsDetailPage';
import OrderPurchasePage from './Purchase';
import CreatePurchasePage from './Purchase/Create';
import PurchaseDetailPage from './Purchase/Detail';
import PurchaseItemDetail from './Purchase/PurchaseItemDetail';
import TrackingPage from './Tracking';
import TrackingDetailPage from './Tracking/Detail';
import { ContentRoute } from '../../../../_metronic/layout';
import CheckGoodsPage from './CheckGoods';

export default function PurchasePage() {
    const match = useRouteMatch();

    return (
        <>
            <DialogNotify
                variant="default"
                size="large"
                position={{ vertical: 'top', horizontal: 'right' }}
            />
            <Switch>
                <ContentRoute
                    exact={true}
                    path={`${match.url}/phan-hang/:purchaseId/:purchaseItemId`}
                    component={DivisionGoodsDetailPage}
                    need={['orders', 'orders.payment', 'orders.purchase']}
                />
                <ContentRoute
                    path={`${match.url}/phan-hang`}
                    component={DivisionGoods}
                    need={['orders', 'orders.payment', 'orders.purchase']}
                />
                <ContentRoute
                    path={`${match.url}/don-mua-hang/:id/chi-tiet/:itemId`}
                    component={PurchaseItemDetail}
                    need={['orders', 'orders.payment', 'orders.purchase']}
                />
                <ContentRoute
                    path={`${match.url}/don-mua-hang/:id/chi-tiet`}
                    component={PurchaseDetailPage}
                    need={['orders', 'orders.payment', 'orders.purchase']}
                />
                <ContentRoute
                    path={`${match.url}/don-mua-hang/tao-don`}
                    component={CreatePurchasePage}
                    need={['orders', 'orders.payment', 'orders.purchase']}
                />
                <ContentRoute
                    path={`${match.url}/don-mua-hang`}
                    component={OrderPurchasePage}
                    need={['orders', 'orders.payment', 'orders.purchase']}
                />
                <ContentRoute
                    path={`${match.url}/tracking/:id/chi-tiet`}
                    component={TrackingDetailPage}
                    need={['orders', 'orders.payment', 'trackings']}
                />
                <ContentRoute
                    path={`${match.url}/tracking`}
                    component={TrackingPage}
                    need={['orders', 'orders.payment', 'trackings']}
                />
                <ContentRoute
                    path={`${match.url}/kiem-hang`}
                    component={CheckGoodsPage}
                    need={['orders.payment', 'orders.purchase']}
                />
                <ContentRoute component={ErrorPage} />
            </Switch>
        </>
    );
}
