import EmptyData from 'app/components/EmptyData';
import Loading from 'app/components/Loading';
import TopHeader from 'app/components/TopHeader';
import { fetchOrderItem } from 'app/modules/Order/order-redux/orderItemSlice';
import {
    fetchProduct,
    initProduct
} from 'app/modules/Product/product-redux/productSlice';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Button } from 'reactstrap';
import { Card, CardBody, CardHeader } from '_metronic/_partials/controls';
import { fetchPurchaseItem } from '../../redux/purchaseItemSlice';
import './index.scss';
import ProductItem from './ProductItem';

CheckGoodsPage.propTypes = {};

function CheckGoodsPage(props) {
    const dispatch = useDispatch();

    // store
    const { products, orderItems, purchaseItems } = useSelector(
        ({ product, order, purchase }) => ({
            products: product.list.productList,
            orderItems: order.item.itemList,
            purchaseItems: purchase.purchaseItem.list
        }),
        shallowEqual
    );

    const [productSelected, setProductSelected] = useState(null);

    const searchProduct = {
        with: 'origin;suppliers;unit;tax;package;embargoes',
        page: 1,
        search: '',
        searchFields: '',
        orderBy: 'updated_at',
        sortedBy: 'desc'
    };

    // fetch product
    useEffect(() => {
        dispatch(initProduct());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatch(fetchProduct(searchProduct));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchProduct]);

    const handleProductDetail = productSelected => {
        setProductSelected(productSelected);

        dispatch(fetchOrderItem({ search: `product_id:${productSelected}` }));
        dispatch(
            fetchPurchaseItem({ search: `product_id:${productSelected}` })
        );
    };

    const loading = false;

    return (
        <>
            {loading && <Loading />}

            <TopHeader title="Kiểm tra hàng tồn kho" />

            <div className="px-8 pb-8">
                <div className="row">
                    <div className="col-md-12">
                        <Card>
                            <CardHeader title="Hàng hoá" />
                        </Card>
                        <div
                            className={clsx([
                                'row',
                                !productSelected || 'card-hide'
                            ])}
                        >
                            {products?.map((product, index) => (
                                <div key={index} className="col-md-6">
                                    <ProductItem
                                        product={product}
                                        onProductClick={handleProductDetail}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="row">
                    {productSelected && (
                        <div className="col-md-4 product-item-select">
                            <ProductItem product={productSelected} />
                            <Button
                                color="primary"
                                className="button-delete"
                                size="sm"
                                onClick={() => setProductSelected(null)}
                            >
                                X
                            </Button>
                        </div>
                    )}
                    {productSelected && (
                        <div className="col-md-8">
                            <Card>
                                <CardHeader title="Order items" />
                                <CardBody>
                                    {orderItems?.length > 0 ? (
                                        orderItems?.map((item, index) => (
                                            <div className="p-4" key={index}>
                                                {item.id}
                                            </div>
                                        ))
                                    ) : (
                                        <EmptyData />
                                    )}
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader title="Purchase items" />
                                <CardBody>
                                    {purchaseItems?.length > 0 ? (
                                        purchaseItems?.map((item, index) => (
                                            <div className="p-4" key={index}>
                                                {item.id}
                                            </div>
                                        ))
                                    ) : (
                                        <EmptyData />
                                    )}
                                </CardBody>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default CheckGoodsPage;
