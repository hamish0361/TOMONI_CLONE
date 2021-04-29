import React from 'react';
import { Redirect, Switch, useRouteMatch } from 'react-router-dom';
import ErrorPage from '../../Error/ErrorPage';
import ProductDetailPage from './product-list/product-detail/ProductDetailPage';
import ProductListPage from './product-list/ProductListPage';
import ProductSupplierDetailPage from './product-supplier/product-supplier-detail/ProductSupplierDetailPage';
import ProductSupplierPage from './product-supplier/ProductSupplierPage';
import ProductTaxDetailPage from './product-tax/product-tax-detail/ProductTaxDetailPage';
import ProductTaxPage from './product-tax/ProductTaxPage';
import ProductUnitDetailPage from './product-unit/product-unit-detail/ProductUnitDetailPage';
import ProductUnitPage from './product-unit/ProductUnitPage';
import DialogNotify from 'app/components/DialogNotify';
import WholesaleNewPage from './product-list/product-detail/new-wholesale-card';
import PaymentPartnerNewPage from './product-list/product-detail/new-payment-card';
import ProductOriginDetailPage from './product-origin/product-origin-detail/ProductOriginDetailPage';
import ProductOriginPage from './product-origin';
import DialogNewProduct from './product-list/DialogNewProduct';
import WholesaleDetailPage from 'app/modules/Order/pages/Wholesale/DetailPage';
import PaymentDetailPage from 'app/modules/Order/pages/PaymentPartner/DetailPage';
import { ContentRoute } from '../../../../_metronic/layout';

export default function ProductPage() {
    const match = useRouteMatch();

    return (
        <>
            <DialogNotify />
            <Switch>
                {<Redirect exact={true} from="/product" to="/product/list" />}

                <ContentRoute
                    path={`${match.url}/tao-moi-san-pham`}
                    component={DialogNewProduct}
                    need={['products']}
                />
                <ContentRoute
                    path={`${match.url}/:id/detail`}
                    component={ProductDetailPage}
                    need={['products']}
                />
                <ContentRoute
                    path={`${match.url}/:id/create-wholesale`}
                    component={WholesaleNewPage}
                    need={['orders.payment', 'orders.purchase']}
                />
                <ContentRoute
                    path={`${match.url}/don-si/:id/chi-tiet`}
                    component={WholesaleDetailPage}
                    need={['orders.payment', 'orders.purchase']}
                />
                <ContentRoute
                    path={`${match.url}/:id/create-payment`}
                    component={PaymentPartnerNewPage}
                    need={['orders.payment', 'orders.purchase']}
                />
                <ContentRoute
                    path={`${match.url}/don-thanh-toan-ho/:id/chi-tiet`}
                    component={PaymentDetailPage}
                    need={['orders.payment', 'orders.purchase']}
                />
                <ContentRoute
                    path={`${match.url}/list`}
                    component={ProductListPage}
                    need={['products']}
                />

                <ContentRoute
                    path={`${match.url}/origin/:id/detail`}
                    component={ProductOriginDetailPage}
                    need={['origins']}
                />
                <ContentRoute
                    path={`${match.url}/origin`}
                    component={ProductOriginPage}
                    need={['origins']}
                />

                <ContentRoute
                    path={`${match.url}/supplier/:id/detail`}
                    component={ProductSupplierDetailPage}
                    need={['suppliers']}
                />
                <ContentRoute
                    path={`${match.url}/supplier`}
                    component={ProductSupplierPage}
                    need={['suppliers']}
                />

                <ContentRoute
                    path={`${match.url}/tax/:id/detail`}
                    component={ProductTaxDetailPage}
                    need={['taxes']}
                />
                <ContentRoute
                    path={`${match.url}/tax`}
                    component={ProductTaxPage}
                    need={['taxes']}
                />

                <ContentRoute
                    path={`${match.url}/unit/:id/detail`}
                    component={ProductUnitDetailPage}
                    need={['units']}
                />
                <ContentRoute
                    path={`${match.url}/unit`}
                    component={ProductUnitPage}
                    need={['units']}
                />

                <ContentRoute component={ErrorPage} />
            </Switch>
        </>
    );
}
