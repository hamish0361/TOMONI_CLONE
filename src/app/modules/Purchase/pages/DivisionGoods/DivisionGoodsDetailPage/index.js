import { dialog } from 'app/components/DialogNotify';
import Loading from 'app/components/Loading';
import TopHeader from 'app/modules/Order/components/TopHeader';
import {
    fetchOrderItem,
    resetOrderItem
} from 'app/modules/Order/order-redux/orderItemSlice';
import {
    createPurchaseItem,
    deletePurchaseDivisionItem,
    deletePurchaseItem,
    fetchPurchaseItemById,
    updatePurchaseDivisionItem
} from 'app/modules/Order/order-redux/purchaseItemSlice';
import { fetchProduct } from 'app/modules/Product/product-redux/productSlice';
import {
    createPurchaseItemOrder,
    updatePurchaseItem
} from 'app/modules/Purchase/redux/purchaseItemSlice';
import { fetchPurchaseById } from 'app/modules/Purchase/redux/purchaseSlice';
import { fetchTracking } from 'app/modules/Purchase/redux/trackingSlice';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Button } from 'reactstrap';
import DialogNewPurchaseItem from './DialogNewPurchaseItem';
import DialogUpdateDivisionItem from './DialogUpdateDivisionItem';
import DivisionItemCard from './DivisionItemCard';
import InfoCard from './InfoCard';
import PurchaseItemCard from './PurchaseItemCard';

DivisionGoodsDetail.propTypes = {};

function DivisionGoodsDetail({ intl }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { purchaseId, purchaseItemId } = useParams();

    // state dialog update purchase item
    const [showEdit, setShowEdit] = useState(false);
    const [divisionItem, setDivisionItem] = useState(null);
    const [quantityItem, setQuantityItem] = useState(0);
    const [productId, setProductId] = useState('');

    const [newOpen, setNewOpen] = useState(false);

    // store
    const {
        purchaseDetail,
        purchaseItemDetail,
        isLoadingPurchaseItem,
        isActionLoadingPurchaseItem,
        isLoadingPurchase,
        isActionLoadingPurchase,
        isLoadingDelete,
        isLoadingOrderItem
    } = useSelector(
        ({ purchase, order }) => ({
            purchaseDetail: purchase.list.purchaseDetail,
            isLoadingDelete: purchase.purchaseItem.isActionLoading,
            purchaseItemDetail: order.purchaseItem.purchaseItemDetail,
            isLoadingPurchaseItem: order.purchaseItem.isLoading,
            isActionLoadingPurchaseItem: order.purchaseItem.isActionLoading,
            isLoadingPurchase: order.list.isLoading,
            isActionLoadingPurchase: order.list.isActionLoading,
            isLoadingOrderItem: order.item.isLoading
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(resetOrderItem());
        dispatch(
            fetchPurchaseById({ id: purchaseId, params: { with: 'items' } })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const paramsPurchaseItem = {
        with:
            'orderItems;tracking;orderProductPurchases;orderProductPurchases.orderItem'
    };

    useEffect(() => {
        dispatch(
            fetchPurchaseItemById({
                id: purchaseItemId,
                params: paramsPurchaseItem
            })
        ).then(res => {
            if (res.type.includes('fulfilled')) {
                setProductId(res.payload?.product_id);
                dispatch(
                    fetchOrderItem({
                        search: `product_id:${res.payload?.product_id}`,
                        searchFields: `product_id:=`,
                        with: 'order'
                    })
                );
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [purchaseItemId]);

    const handleSearchOrder = ({ value, type }) => {
        const params = {
            search: `product_id:${productId};order_id:${value}`,
            searchFields: `product_id:=;order_id:like`,
            searchJoin: 'and',
            with: 'order'
        };
        dispatch(fetchOrderItem(params));
    };

    const handleNewDivisionItem = ({ quantity, price, order_product_id }) => {
        const body = {
            purchase_product_id: purchaseItemId,
            order_product_id,
            quantity,
            price
        };
        dispatch(createPurchaseItemOrder(body)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({
                        id: 'PURCHASE.DIVISION.ITEM.SUCCESSFUL.DIALOG'
                    })
                );
                fetchPurchase();
                dispatch(resetOrderItem());
            } else {
                dialog.error(
                    intl.formatMessage({
                        id: 'PURCHASE.DIVISION.ITEM.ERROR.DIALOG'
                    })
                );
            }
        });
    };

    const handleDeleteDivisionItem = divisionItemId => {
        dispatch(deletePurchaseDivisionItem(divisionItemId)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({
                        id: 'PURCHASE.DIVISION.ITEM.DELETE.SUCCESS'
                    })
                );
                fetchPurchase();
            } else {
                dialog.error(
                    intl.formatMessage({
                        id: 'PURCHASE.DIVISION.ITEM.DELETE.FAIL'
                    })
                );
            }
        });
    };

    const fetchPurchase = () => {
        dispatch(
            fetchPurchaseById({ id: purchaseId, params: { with: 'items' } })
        );
        dispatch(
            fetchPurchaseItemById({
                id: purchaseItemId,
                params: paramsPurchaseItem
            })
        );
    };

    // product
    const handleSearchProduct = ({ value, type }) => {
        const params = {
            search: value,
            searchFields: `${type}:like`
        };
        dispatch(fetchProduct(params));
    };

    // new item
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
            purchase_id: purchaseId,
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
                    setNewOpen(false);
                    dispatch(
                        fetchPurchaseById({
                            id: purchaseId,
                            params: { with: 'items' }
                        })
                    );
                } else {
                    dialog.error(
                        intl.formatMessage({ id: 'PURCHASE.CREATE.ITEM.FAIL' })
                    );
                }
            });
        }
    };

    const handleDeletePurchaseItem = objectId => {
        dispatch(deletePurchaseItem(objectId)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({
                        id: 'PURCHASE.DIVISION.ITEM.DELETE.SUCCESS'
                    })
                );
                dispatch(
                    fetchPurchaseById({
                        id: purchaseId,
                        params: { with: 'items' }
                    })
                ).then(res => {
                    if (res.payload?.items?.length > 0) {
                        history.push(
                            `/mua-hang/phan-hang/${purchaseId}/${res.payload?.items[0]?.id}`
                        );
                        dispatch(
                            fetchPurchaseItemById({
                                id: res.payload?.items[0]?.id,
                                params: paramsPurchaseItem
                            })
                        );
                    } else {
                        setNewOpen(true);
                    }
                });
            } else {
                dialog.error(
                    intl.formatMessage({
                        id: 'PURCHASE.DIVISION.ITEM.DELETE.FAIL'
                    })
                );
            }
        });
    };

    const handleUpdateInfo = body => {
        const params = {
            id: purchaseItemId,
            body
        };
        dispatch(updatePurchaseItem(params)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({ id: 'PURCHASE.UPDATE.ITEM.SUCCESS' })
                );
                fetchPurchase();
            } else {
                dialog.error(
                    intl.formatMessage({ id: 'PURCHASE.UPDATE.ITEM.FAIL' })
                );
            }
        });
    };

    const handleViewItemClick = itemId => {
        dispatch(resetOrderItem());
        const index = purchaseItemDetail?.order_product_purchases?.findIndex(
            x => x.id === itemId
        );
        if (index !== -1) {
            setDivisionItem(purchaseItemDetail?.order_product_purchases[index]);
            setQuantityItem(purchaseItemDetail?.order_items[index]?.quantity);
        }
        setShowEdit(true);
    };

    const handleUpdateDivisionItem = paramsItem => {
        dispatch(updatePurchaseDivisionItem(paramsItem)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({
                        id: 'PURCHASE.DIVISION.ITEM.UPDATE.SUCCESS'
                    })
                );
                setShowEdit(false);
                fetchPurchase();
            } else {
                dialog.error(
                    intl.formatMessage({
                        id: 'PURCHASE.DIVISION.ITEM.UPDATE.FAIL'
                    })
                );
            }
        });
    };

    const handleHideNewDialog = () => {
        if (purchaseDetail?.items?.length > 0) {
            setNewOpen(false);
        } else {
            history.push('/mua-hang/phan-hang');
        }
    };

    const loading =
        isActionLoadingPurchaseItem ||
        isActionLoadingPurchase ||
        isLoadingPurchaseItem ||
        isLoadingPurchase ||
        isLoadingDelete ||
        isLoadingOrderItem;

    return (
        <>
            <>
                {loading && <Loading />}
                <TopHeader
                    title={`${intl.formatMessage({
                        id: 'MENU.PURCHASE.DIVISION'
                    })} - ${purchaseId}`}
                >
                    <Button
                        style={{ minWidth: '100px' }}
                        color="primary"
                        onClick={() => {
                            setNewOpen(true);
                        }}
                    >
                        <FormattedMessage id="GLOBAL.DIVISION.OF.GOOD" />
                    </Button>
                </TopHeader>

                <div className="px-8 pb-8">
                    <div className="row">
                        <div className="col-md-4">
                            <PurchaseItemCard
                                intl={intl}
                                items={purchaseDetail?.items}
                                onItemClick={objectId =>
                                    history.push(
                                        `/mua-hang/phan-hang/${purchaseId}/${objectId}`
                                    )
                                }
                                itemId={purchaseItemId}
                                onDeletePurchaseItem={handleDeletePurchaseItem}
                            />
                        </div>
                        <div className="col-md-8">
                            <InfoCard
                                intl={intl}
                                purchase={purchaseItemDetail}
                                onUpdate={handleUpdateInfo}
                                onSuccess={fetchPurchase}
                            />

                            <DivisionItemCard
                                intl={intl}
                                itemId={purchaseItemId}
                                onSearchOrder={handleSearchOrder}
                                onNewItem={handleNewDivisionItem}
                                onSuccess={fetchPurchase}
                                purchaseItem={purchaseItemDetail}
                                onDeleteDivisionItemClick={
                                    handleDeleteDivisionItem
                                }
                                onDivisionItemClick={handleViewItemClick}
                            />
                        </div>
                    </div>
                </div>
            </>

            <DialogNewPurchaseItem
                intl={intl}
                onSearchProductAll={handleSearchProduct}
                show={newOpen}
                onHide={handleHideNewDialog}
                onSearchProduct={handleSearchOrderItem}
                onSearchTracking={handleSearchTracking}
                onSubmitNew={handleNewSubmit}
            />

            <DialogUpdateDivisionItem
                intl={intl}
                quantity={quantityItem}
                show={showEdit}
                onHide={() => setShowEdit(false)}
                itemDetail={divisionItem}
                onUpdate={handleUpdateDivisionItem}
            />
        </>
    );
}

export default injectIntl(connect(null, null)(DivisionGoodsDetail));
