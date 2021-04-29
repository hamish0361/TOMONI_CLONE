import DialogNotify from 'app/components/DialogNotify';
import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';
import ErrorPage from '../../Error/ErrorPage';
import AuctionPage from './Auction';
import AuctionDetailPage from './Auction/Detail';
import PaymentPartnerPage from './PaymentPartner';
import PaymentDetailPage from './PaymentPartner/DetailPage';
import PaymentPartnerNewPage from './PaymentPartner/NewPage';
import RetailPage from './Retail';
import RetailDetailPage from './Retail/Detail';
import ShipmentPartnerPage from './ShipmentPartner';
import ShipmentPartnerDetailPage from './ShipmentPartner/DetailPage';
import ShipmentPartnerNewPage from './ShipmentPartner/NewPage';
import WholesalePage from './Wholesale';
import WholesaleDetailPage from './Wholesale/DetailPage';
import WholesaleNewPage from './Wholesale/NewPage';
import { ContentRoute } from '../../../../_metronic/layout';

export default function OrderPage() {
    const match = useRouteMatch();

    return (
        <>
            <DialogNotify />
            <Switch>
                <Redirect
                    exact={true}
                    from={match.url}
                    to={`${match.url}/don-le`}
                />
                <ContentRoute
                    path={`${match.url}/don-si/:id/chi-tiet`}
                    component={WholesaleDetailPage}
                    need={['orders', 'orders.wholesale']}
                />
                <ContentRoute
                    path={`${match.url}/don-si/tao-moi`}
                    component={WholesaleNewPage}
                    need={['orders', 'orders.wholesale']}
                />
                <ContentRoute
                    path={`${match.url}/don-si`}
                    component={WholesalePage}
                    need={['orders', 'orders.wholesale']}
                />
                {/* Đơn lẻ */}
                <ContentRoute
                    path={`${match.url}/don-le/:id/chi-tiet`}
                    component={RetailDetailPage}
                    need={['orders', 'orders.retail']}
                />
                <ContentRoute
                    path={`${match.url}/don-le`}
                    component={RetailPage}
                    need={['orders', 'orders.retail']}
                />
                {/* Don dau gia */}
                <ContentRoute
                    path={`${match.url}/don-dau-gia/:id/chi-tiet`}
                    component={AuctionDetailPage}
                    need={['orders', 'orders.auction']}
                />
                <ContentRoute
                    path={`${match.url}/don-dau-gia`}
                    component={AuctionPage}
                    need={['orders', 'orders.auction']}
                />
                {/* Đơn thanh toán hộ */}
                <ContentRoute
                    path={`${match.url}/don-thanh-toan-ho/:id/chi-tiet`}
                    component={PaymentDetailPage}
                    need={['orders', 'orders.payment']}
                />
                <ContentRoute
                    path={`${match.url}/don-thanh-toan-ho/tao-moi`}
                    component={PaymentPartnerNewPage}
                    need={['orders', 'orders.payment']}
                />
                <ContentRoute
                    path={`${match.url}/don-thanh-toan-ho`}
                    component={PaymentPartnerPage}
                    need={['orders', 'orders.payment']}
                />
                {/* Don van chuyen ho */}
                <ContentRoute
                    path={`${match.url}/don-van-chuyen-ho/:id/chi-tiet`}
                    component={ShipmentPartnerDetailPage}
                    need={['orders', 'orders.shipment']}
                />
                <ContentRoute
                    path={`${match.url}/don-van-chuyen-ho/tao-moi`}
                    component={ShipmentPartnerNewPage}
                    need={['orders', 'orders.shipment']}
                />
                <ContentRoute
                    path={`${match.url}/don-van-chuyen-ho`}
                    component={ShipmentPartnerPage}
                    need={['orders', 'orders.shipment']}
                />
                <ContentRoute component={ErrorPage} />
            </Switch>
        </>
    );
}
