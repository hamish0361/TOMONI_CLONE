import { dialog } from 'app/components/DialogNotify';
import Loading from 'app/components/Loading';
import { create, fetchLogs } from 'app/modules/Notification/redux/logSlice';
import InfoCard from 'app/modules/Order/components/cards/InfoCard';
import ItemCard from 'app/modules/Order/components/cards/ItemCard';
import LandingBillCard from 'app/modules/Order/components/cards/LandingBillCard';
import LogCard from 'app/modules/Order/components/cards/LogCard';
import ShipmentInfoCard from 'app/modules/Order/components/cards/ShipmentInfoCard';
import TransactionCard from 'app/modules/Order/components/cards/TransactionCard';
import DialogUpdateItem from 'app/modules/Order/components/DialogUpdateItem';
import TopHeader from 'app/modules/Order/components/TopHeader';
import {
    fetchOrderItem,
    resetOrderItem,
    updateOrderItem
} from 'app/modules/Order/order-redux/orderItemSlice';
import {
    fetchOrderById,
    resetOrderDetail,
    updateOrder
} from 'app/modules/Order/order-redux/orderSlice';
import { fetchShipmentInfo } from 'app/modules/Order/order-redux/shipmentInfoSlice';
import { fetchLadingBills } from 'app/modules/Warehouse/warehouse-redux/ladingBillSlice';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect, shallowEqual, useDispatch, useSelector } from 'react-redux';

function AuctionDetailPage({
    history,
    intl,
    match: {
        params: { id }
    }
}) {
    const dispatch = useDispatch();

    // store
    const {
        orderDetail,
        isLoadingDetail,
        isActionLoadingDetail,
        statusList,
        itemList
    } = useSelector(
        ({ order, home }) => ({
            orderDetail: order.list.orderDetail,
            isLoadingDetail: order.list.isLoading,
            isActionLoadingDetail: order.list.isActionLoading,
            statusList: home.home.statusList,
            itemList: order.item.itemList
        }),
        shallowEqual
    );

    const paramDetail = {
        id: id,
        params: {
            with: 'shipmentInfor',
            appends: 'customer;shipmentMethod;transactions.receipts;logs'
        }
    };

    const paramLadingBill = {
        search: `boxLadingBills.owningBox.objectable_type:order;boxLadingBills.owningBox.objectable_id:${id}`,
        searchFields:
            'boxLadingBills.owningBox.objectable_type:=;boxLadingBills.owningBox.objectable_id:=',
        searchJoin: 'and',
        with: 'boxLadingBills.owningBox.box'
    };

    const paramsLog = {
        search: `logable_type:App\\\\Entities\\\\Order;logable_id:${id}`,
        orderBy: 'created_at',
        sortedBy: 'desc'
    };

    useEffect(() => {
        dispatch(resetOrderDetail());
        dispatch(resetOrderItem());
        dispatch(fetchOrderById(paramDetail)).then(res => {
            if (res.type.includes('fulfilled')) {
                const pramsShipmentInfo = {
                    search: `user_id:${res.payload.customer_id}`
                };
                dispatch(fetchShipmentInfo(pramsShipmentInfo));
            }
        });
        dispatch(fetchLadingBills(paramLadingBill));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // items
    const [paramItems, setParamItems] = useState({
        page: 1,
        appends: 'product.unit;product.package;supplier',
        search: `order_id:${id}`
    });

    useEffect(() => {
        dispatch(fetchOrderItem(paramItems));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramItems]);

    const handleItemPageChange = newPage => {
        setParamItems({
            ...paramItems,
            page: newPage
        });
    };

    // info
    const handleUpdateInfo = body => {
        const params = {
            id: id,
            body
        };
        dispatch(updateOrder(params)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({ id: 'ORDER.UPDATE.INFO.SUCCESS' })
                );
                dispatch(fetchOrderById(paramDetail));
            } else {
                dialog.error(
                    intl.formatMessage({ id: 'ORDER.UPDATE.INFO.FAIL' })
                );
            }
        });
    };

    // shipment info
    const [shipmentInfoRes, setShipmentInfoRes] = useState(null);
    const handleUpdateShipmentInfo = shipmentId => {
        const params = {
            id: id,
            body: {
                shipment_infor_id: shipmentId
            }
        };
        dispatch(updateOrder(params)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({
                        id: 'ORDER.UPDATE.SHIPMENT_INFO.SUCCESS'
                    })
                );
                setShipmentInfoRes(res.payload?.shipment_infor_id);
            } else {
                dialog.error(
                    intl.formatMessage({
                        id: 'ORDER.UPDATE.SHIPMENT_INFO.FAIL'
                    })
                );
                setShipmentInfoRes(null);
            }
        });
    };

    // log
    useEffect(() => {
        dispatch(fetchLogs(paramsLog));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNewLog = content => {
        const body = {
            content,
            logable_id: id,
            logable_type: 'AppEntitiesOrder'
        };
        dispatch(create(body)).then(res => {
            if (res.type.includes('fulfilled')) {
                dispatch(fetchLogs(paramsLog));
                dialog.success(
                    intl.formatMessage({ id: 'ORDER.UPDATE.LOG.SUCCESS' })
                );
            } else {
                dialog.error(
                    intl.formatMessage({ id: 'ORDER.UPDATE.LOG.FAIL' })
                );
            }
        });
    };

    //item
    const [isShowItem, setShowItem] = useState(false);
    const [itemDetail, setItemDetail] = useState(false);

    const handleEditItem = id => {
        const index = itemList.findIndex(x => x.id === id);
        if (index !== -1) {
            const item = itemList[index];
            setItemDetail(item);
        }
        setShowItem(true);
    };

    const handleUpdateItem = ({
        price,
        quantity,
        box,
        property,
        note,
        tax_percent
    }) => {
        const params = {
            id: itemDetail.id,
            body: {
                price,
                quantity,
                note,
                properties: property,
                is_box: box,
                tax_percent
            }
        };
        setShowItem(false);
        dispatch(updateOrderItem(params)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({ id: 'ORDER.UPDATE.ITEM.SUCCESS' })
                );
                dispatch(fetchOrderItem(paramItems));
                dispatch(fetchOrderById(paramDetail));
            } else {
                dialog.error(
                    intl.formatMessage({ id: 'ORDER.UPDATE.ITEM.FAIL' })
                );
            }
        });
    };

    // lading bill
    const handleViewLanding = id => {
        history.push(`/warehouse/lading-bills/${id}`);
    };

    // status
    const [statusRes, setStatusRes] = useState(null);
    const [stepRes, setStepRes] = useState(null);
    const handleUpdateStatus = status => {
        const params = {
            id,
            body: {
                status
            }
        };
        dispatch(updateOrder(params)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    intl.formatMessage({ id: 'ORDER.UPDATE.STATUS.SUCCESS' })
                );
                setStatusRes(res.payload?.status);
                setStepRes(res.payload?.steps);
                dispatch(fetchLogs(paramsLog));
            } else {
                dialog.error(
                    intl.formatMessage({ id: 'ORDER.UPDATE.STATUS.FAIL' })
                );
            }
        });
    };

    // steps
    const stepList = stepRes || orderDetail.steps || [];
    const steps = stepList.map(value => {
        const statusObj = statusList.find(x => x.id === value);
        return statusObj;
    });

    const loading = isLoadingDetail || isActionLoadingDetail;

    return (
        <>
            {loading && <Loading />}
            <>
                <TopHeader
                    title={intl.formatMessage({
                        id: 'ORDER.AUCTION.DETAIL.TITLE'
                    })}
                >
                    <Button
                        className="btn btn-light ml-2"
                        onClick={() => history.push('/ban-hang/don-dau-gia')}
                    >
                        <i className="fa fa-arrow-left"></i>
                        <FormattedMessage id="GLOBAL.BUTTON.BACK" />
                    </Button>
                    {steps?.length > 0
                        ? steps.map((step, index) => (
                              <Button
                                  key={index}
                                  className="btn btn-primary ml-2"
                                  onClick={() => handleUpdateStatus(step?.id)}
                              >
                                  {step?.name}
                              </Button>
                          ))
                        : null}
                </TopHeader>

                <div className="px-8 pb-8">
                    <>
                        <div className="form-group row">
                            <div className="col-12">
                                <InfoCard
                                    statusRes={statusRes}
                                    order={orderDetail}
                                    onUpdate={handleUpdateInfo}
                                    intl={intl}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <ItemCard
                                    onEdit={handleEditItem}
                                    onPageChange={handleItemPageChange}
                                    intl={intl}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col-md-6">
                                <ShipmentInfoCard
                                    shipmentInfoRes={shipmentInfoRes}
                                    shipment={orderDetail.shipment_infor}
                                    onUpdate={handleUpdateShipmentInfo}
                                    intl={intl}
                                />
                            </div>
                            <div className="col-md-6">
                                <LandingBillCard
                                    onView={handleViewLanding}
                                    intl={intl}
                                />
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-md-6">
                                <TransactionCard
                                    transactions={
                                        orderDetail.transactions || []
                                    }
                                    intl={intl}
                                />
                            </div>
                            <div className="col-md-6">
                                <LogCard onLog={handleNewLog} intl={intl} />
                            </div>
                        </div>
                    </>
                </div>
            </>
            <DialogUpdateItem
                item={itemDetail || {}}
                open={isShowItem}
                onHide={() => setShowItem(false)}
                onUpdate={handleUpdateItem}
            />
        </>
    );
}

export default injectIntl(connect(null, null)(AuctionDetailPage));
