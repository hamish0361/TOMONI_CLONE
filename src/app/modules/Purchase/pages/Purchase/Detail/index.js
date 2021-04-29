import { dialog } from 'app/components/DialogNotify';
import Loading from 'app/components/Loading';
import TopHeader from 'app/modules/Order/components/TopHeader';
import { fetchOrderItem } from 'app/modules/Order/order-redux/orderItemSlice';
import {
    createPurchaseItem,
    deletePurchaseDivisionItem,
    deletePurchaseItem,
    updatePurchaseDivisionItem
} from 'app/modules/Order/order-redux/purchaseItemSlice';
import { fetchProduct } from 'app/modules/Product/product-redux/productSlice';
import { resetPurchaseItem } from 'app/modules/Purchase/redux/purchaseItemSlice';
import {
    fetchPurchaseById,
    updatePurchase,
    uploadPurchaseFile
} from 'app/modules/Purchase/redux/purchaseSlice';
import { fetchTracking } from 'app/modules/Purchase/redux/trackingSlice';
import 'assets/css/order.scss';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, shallowEqual, useDispatch, useSelector } from 'react-redux';
import DialogEditDivisionItem from './DialogEditDivisionItem';
import DialogNewDivisionItem from './DialogNewDivisionItem';
import DialogNewItem from './DialogNewItem';
import DivisionItemCard from './DivisionItemCard';
import './index.scss';
import InfoCard from './InfoCard';
import ItemCard from './ItemCard';
import SupplierCard from './SupplierCard';

function PurchaseDetailPage({
    history,
    intl,
    match: {
        params: { id }
    }
}) {
    const dispatch = useDispatch();

    // store
    const {
        purchase,
        isActionLoadingPurchase,
        isLoadingPurchase,

        statusList,
        trackings,
        orderItems,
        isActionLoadingItem
    } = useSelector(
        ({ home, purchase, order }) => ({
            purchase: purchase.list.purchaseDetail,
            isActionLoadingPurchase: purchase.list.isActionLoading,
            isLoadingPurchase: purchase.list.isLoading,

            statusList: home.home.statusList,
            trackings: purchase.tracking.trackingList,
            orderItems: order.item.itemList,
            isActionLoadingItem: purchase.purchaseItem.isActionLoading
        }),
        shallowEqual
    );

    // state
    const [isShowNewItem, setShowNewItem] = useState(false);
    const [openPurchaseItemChild, setOpenPuchaseItemChil] = useState(false);

    // product
    const handleSearchProduct = ({ value, type }) => {
        const params = {
            search: value,
            searchFields: `${type}:like`
        };
        dispatch(fetchProduct(params));
    };

    // param search
    const paramsDetail = {
        id: id,
        params: {
            appends: 'supplier;buyer',
            with: 'items.orderProductPurchases'
        }
    };

    // first fetch data
    useEffect(() => {
        dispatch(resetPurchaseItem());
        dispatch(fetchPurchaseById(paramsDetail));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // handle purchase
    const handleUpdateStatus = step => {
        const params = {
            id: id,
            body: {
                status: step
            }
        };
        dispatch(updatePurchase(params)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({ id: 'ORDER.UPDATE.STATUS.SUCCESS' })
                );
                dispatch(fetchPurchaseById(paramsDetail));
            } else {
                dialog.error(
                    intl.formatMessage({ id: 'ORDER.UPDATE.STATUS.FAIL' })
                );
            }
        });
    };

    // handle purchase item
    const handleEditItem = itemId => {
        history.push(`/mua-hang/don-mua-hang/${id}/chi-tiet/${itemId}`);
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
            purchase_id: id,
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
                    setShowNewItem(false);
                    dispatch(fetchPurchaseById(paramsDetail));
                } else {
                    dialog.error(
                        intl.formatMessage({ id: 'PURCHASE.CREATE.ITEM.FAIL' })
                    );
                }
            });
        }
    };
    const handleFileUpload = e => {
        const files = e.target.files;
        const formData = new FormData();
        formData.set('', files[0], files.name);
        const body = {
            id: id,
            data: formData
        };
        dispatch(uploadPurchaseFile(body)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    `${intl.formatMessage({
                        id: 'ACCOUNTING.RECEIPT.UPDATE.FILE.SUCCESS'
                    })}`
                );
            } else {
                dialog.error(
                    `${intl.formatMessage({
                        id: 'ACCOUNTING.RECEIPT.UPDATE.FILE.ERROR'
                    })}`
                );
            }
        });
    };

    const handleDeletePurchaseItem = itemId => {
        dispatch(deletePurchaseItem(itemId)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({
                        id: 'PURCHASE.DIVISION.ITEM.DELETE.SUCCESS'
                    })
                );
                dispatch(fetchPurchaseById(paramsDetail));
            } else {
                dialog.error(
                    intl.formatMessage({
                        id: 'PURCHASE.DIVISION.ITEM.DELETE.FAIL'
                    })
                );
            }
        });
    };

    const handleUpdatePuschaseItem = item => {
        const body = {
            id: id,
            params: { additional_cost: item?.replace(/\D/g, '') }
        };
        dispatch(updatePurchase(body)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({ id: 'ORDER.UPDATE.STATUS.SUCCESS' })
                );
                dispatch(fetchPurchaseById(paramsDetail));
            } else {
                dialog.error(
                    intl.formatMessage({ id: 'ORDER.UPDATE.STATUS.FAIL' })
                );
            }
        });
    };

    // begin purchase item child
    const [openItemChildDetail, setOpenItemChildDetail] = useState(false);
    const [purchaseItemChilDetail, setPurchaseItemChilDetail] = useState(null);

    const handleDeleteDivisionItem = id => {
        dispatch(deletePurchaseDivisionItem(id)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({
                        id: 'PURCHASE.DIVISION.ITEM.DELETE.SUCCESS'
                    })
                );
                dispatch(fetchPurchaseById(paramsDetail));
            } else {
                dialog.error(
                    intl.formatMessage({
                        id: 'PURCHASE.DIVISION.ITEM.DELETE.FAIL'
                    })
                );
            }
        });
    };

    const handleViewItemClick = itemId => {
        const index = purchaseItemChilds.findIndex(x => x.id === itemId);
        if (index !== -1) {
            setPurchaseItemChilDetail(purchaseItemChilds[index]);
        }
        setOpenItemChildDetail(true);
    };

    const handleUpdateDivisionItem = paramsItem => {
        dispatch(updatePurchaseDivisionItem(paramsItem)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({
                        id: 'PURCHASE.DIVISION.ITEM.UPDATE.SUCCESS'
                    })
                );
                setOpenItemChildDetail(false);
                dispatch(fetchPurchaseById(paramsDetail));
            } else {
                dialog.error(
                    intl.formatMessage({
                        id: 'PURCHASE.DIVISION.ITEM.UPDATE.FAIL'
                    })
                );
            }
        });
    };
    // end purchase item child

    // steps
    const steps = purchase?.steps?.map(value => {
        const statusObj = statusList.find(x => x.id === value);
        return statusObj;
    });

    const loading =
        isLoadingPurchase || isActionLoadingPurchase || isActionLoadingItem;

    const handlePurchaseItemChilds = () => {
        var purchaseItemChilds = [];
        const purchaseItems = purchase?.items || [];
        for (const purchaseItem of purchaseItems) {
            for (const purchaseItemChild of purchaseItem?.order_product_purchases ||
                []) {
                let obj = {
                    ...purchaseItemChild,
                    quantity_available: purchaseItem.quantity,
                    product_id: purchaseItem.product_id
                };
                purchaseItemChilds.push(obj);
            }
        }
        return purchaseItemChilds;
    };

    const purchaseItemChilds = handlePurchaseItemChilds();

    return (
        <>
            {loading && <Loading />}
            <>
                <TopHeader
                    title={intl.formatMessage({ id: 'PURCHASE.DETAIL.TITLE' })}
                >
                    <Button
                        className="btn btn-light ml-2"
                        onClick={() => history.push('/mua-hang/don-mua-hang')}
                    >
                        <i className="fa fa-arrow-left"></i>
                        <FormattedMessage id="GLOBAL.BUTTON.BACK" />
                    </Button>
                    <input
                        name="file"
                        className="input-flie"
                        id="contained-button-file"
                        type="file"
                        onChange={handleFileUpload}
                    />
                    <label
                        htmlFor="contained-button-file"
                        className="btn btn-danger ml-2 btn btn-primary button-uploadFlie"
                    >
                        <i className="fa fa-upload"></i>
                        <FormattedMessage id="GLOBAL.BUTTON.UPLOAD" />
                    </label>

                    {steps?.map((step, index) => (
                        <Button
                            key={index}
                            className="btn btn-primary ml-2"
                            onClick={() => handleUpdateStatus(step.id)}
                        >
                            {step.name}
                        </Button>
                    ))}
                </TopHeader>

                <div className="px-8 pb-8">
                    <>
                        <div className="form-group row">
                            <div className="col-6">
                                <InfoCard
                                    purchase={purchase}
                                    intl={intl}
                                    onUpdatePurchaseInfo={
                                        handleUpdatePuschaseItem
                                    }
                                />
                            </div>
                            <div className="col-6">
                                <SupplierCard
                                    supplier={purchase?.supplier || {}}
                                    intl={intl}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <ItemCard
                                items={purchase?.items}
                                onEdit={handleEditItem}
                                onNewItem={() => setShowNewItem(true)}
                                intl={intl}
                                onDelete={handleDeletePurchaseItem}
                            />
                        </div>

                        <div className="form-group">
                            <DivisionItemCard
                                intl={intl}
                                purchaseItems={purchaseItemChilds}
                                onDivisionClick={() =>
                                    setOpenPuchaseItemChil(true)
                                }
                                onDelete={handleDeleteDivisionItem}
                                onViewEdit={handleViewItemClick}
                            />
                        </div>
                    </>
                </div>
            </>
            <DialogNewItem
                intl={intl}
                onSearchProductAll={handleSearchProduct}
                show={isShowNewItem}
                onHide={() => setShowNewItem(false)}
                orderItems={orderItems}
                trackings={trackings}
                onSearchProduct={handleSearchOrderItem}
                onSearchTracking={handleSearchTracking}
                onSubmitNew={handleNewSubmit}
            />

            <DialogNewDivisionItem
                show={openPurchaseItemChild}
                onHide={() => setOpenPuchaseItemChil(false)}
            />

            <DialogEditDivisionItem
                intl={intl}
                show={openItemChildDetail}
                onHide={() => setOpenItemChildDetail(false)}
                itemDetail={purchaseItemChilDetail}
                onUpdate={handleUpdateDivisionItem}
            />
        </>
    );
}

export default injectIntl(connect(null, null)(PurchaseDetailPage));
