import { Pagination } from '@material-ui/lab';
import { dialog } from 'app/components/DialogNotify';
import Loading from 'app/components/Loading';
import TopHeader from 'app/modules/Order/components/TopHeader';
import { fetchOrderItem } from 'app/modules/Order/order-redux/orderItemSlice';
import { fetchOrderStatus } from 'app/modules/Order/order-redux/orderStatusSlice';
import { createPurchaseItem } from 'app/modules/Order/order-redux/purchaseItemSlice';
import { fetchProduct } from 'app/modules/Product/product-redux/productSlice';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router';
import { Button } from 'reactstrap';
import { Card, CardBody } from '_metronic/_partials/controls';
import { fetchPurchase, resetPurchase } from '../../redux/purchaseSlice';
import { fetchTracking } from '../../redux/trackingSlice';
import DialogNewPurchaseItem from './DialogNewPurchaseItem';
import DivisionItem from './DivisionItem';
import TopFilter from './TopFilter';

function DivisionGoods({ intl }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const match = useRouteMatch();

    const { purchases, pagination, isLoading } = useSelector(
        ({ purchase }) => ({
            purchases: purchase.list.purchaseList,
            isLoading: purchase.list.isLoading,
            pagination: purchase.list.pagination
        }),
        shallowEqual
    );

    const [searchParams, setSearchParams] = useState({
        page: 1,
        search: '',
        appends: 'supplier',
        with: 'items',
        searchFields: '',
        orderBy: 'created_at',
        sortedBy: 'desc'
    });

    const [open, setOpen] = useState(false);
    const [purchaseIdSelected, setPurchaseIdSelected] = useState(0);

    useEffect(() => {
        dispatch(fetchPurchase(searchParams));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams.page, searchParams.search]);

    const paramsStatus = {
        search: 'directors.type_id:Purchase'
    };

    useEffect(() => {
        dispatch(resetPurchase());
        dispatch(fetchOrderStatus(paramsStatus));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmitSearch = ({ search, searchFields }) => {
        setSearchParams({
            ...searchParams,
            page: 1,
            search,
            searchFields
        });
    };

    const handlePageChange = (e, newPage) => {
        setSearchParams({
            ...searchParams,
            page: newPage
        });
    };

    const handlePurchaseDetail = purchase => {
        setPurchaseIdSelected(purchase.id);
        if (purchase?.items?.length > 0) {
            history.push(
                `${match.url}/${purchase.id}/${purchase?.items[0]?.id}`
            );
        } else {
            dialog.warning(intl.formatMessage({ id: 'PURCHASE.ITEM.WARNING' }));
            setOpen(true);
        }
    };

    // begin dialog
    const handleSearchProduct = ({ value, type }) => {
        const params = {
            search: value,
            searchFields: `${type}:like`
        };
        dispatch(fetchProduct(params));
    };

    const handleSearchOrderItem = value => {
        const params = {
            search: `product_id:${value}`,
            searchFields: 'product_id:like'
        };
        dispatch(fetchOrderItem(params));
    };

    const handleSearchTracking = value => {
        const params = {
            search: value,
            searchFields: `id:like`
        };
        dispatch(fetchTracking(params));
    };

    const handleNewSubmit = ({
        productId,
        trackingId,
        price,
        quantity,
        amount,
        order_product_id,
        tax
    }) => {
        const body = {
            product_id: productId,
            tracking_id: trackingId,
            purchase_id: purchaseIdSelected,
            price,
            quantity,
            amount,
            order_product_id,
            tax_percent: tax
        };
        if (!productId) {
            dialog.warning(
                intl.formatMessage({ id: 'PURCHASE.CREATE.ITEM.WARNING1' })
            );
        } else if (quantity <= 0) {
            dialog.warning(
                intl.formatMessage({ id: 'PURCHASE.CREATE.ITEM.WARNING2' })
            );
        } else {
            dispatch(createPurchaseItem(body)).then(res => {
                if (res.type.includes('fulfilled')) {
                    dialog.success(
                        intl.formatMessage({
                            id: 'PURCHASE.CREATE.ITEM.SUCCESS'
                        })
                    );
                    history.push(
                        `${match.url}/${purchaseIdSelected}/${res.payload?.id}`
                    );
                } else {
                    dialog.error(
                        intl.formatMessage({ id: 'PURCHASE.CREATE.ITEM.FAIL' })
                    );
                }
            });
        }
    };

    return (
        <>
            <>
                {isLoading && <Loading />}
                <TopHeader
                    title={intl.formatMessage({ id: 'MENU.PURCHASE.DIVISION' })}
                >
                    <Button
                        style={{ minWidth: '100px' }}
                        color="primary"
                        onClick={() => {
                            history.push('/mua-hang/don-mua-hang/tao-don');
                        }}
                    >
                        <FormattedMessage id="GLOBAL.BUTTON.CREATE_ORDER" />
                    </Button>
                </TopHeader>

                <div className="px-8 pb-8">
                    <Card>
                        <CardBody>
                            <TopFilter
                                intl={intl}
                                onSearch={handleSubmitSearch}
                            />
                            <Pagination
                                className="d-flex justify-content-end"
                                count={pagination?.lastPage || 1}
                                page={searchParams.page}
                                shape="rounded"
                                onChange={handlePageChange}
                            />
                        </CardBody>
                    </Card>
                    <div className="row">
                        {purchases?.map((purchase, index) => (
                            <div key={index} className="col-md-6">
                                <DivisionItem
                                    purchase={purchase}
                                    onClickDetail={handlePurchaseDetail}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </>

            <DialogNewPurchaseItem
                show={open}
                onHide={() => setOpen(false)}
                onSearchProductAll={handleSearchProduct}
                onSearchProduct={handleSearchOrderItem}
                onSearchTracking={handleSearchTracking}
                onSubmitNew={handleNewSubmit}
            />
        </>
    );
}

export default injectIntl(connect(null, null)(DivisionGoods));
