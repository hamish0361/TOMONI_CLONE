import { dialog } from 'app/components/DialogNotify';
import Loading from 'app/components/Loading';
import { create, fetchLogs } from 'app/modules/Notification/redux/logSlice';
import LadingBillCard from 'app/modules/Order/components/cards/LandingBillCard';
import TransactionCard from 'app/modules/Order/components/cards/TransactionCard';
import TopHeader from 'app/modules/Order/components/TopHeader';
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
import InfoCard from './InfoCard';
import LogCard from './LogCard';
import ShipmentInfoCard from './ShipmentInfoCard';
import SenderInfoCard from './SenderInfoCard';

function ShipmentPartnerDetailPage({
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
        isActionLoadingCost,
        statusList
    } = useSelector(
        ({ order, home }) => ({
            orderDetail: order.list.orderDetail,
            isLoadingDetail: order.list.isLoading,
            isActionLoadingDetail: order.list.isActionLoading,
            isActionLoadingCost: order.cost.isActionLoading,
            statusList: home.home.statusList
        }),
        shallowEqual
    );

    const paramDetail = {
        id: id,
        params: {
            with: 'items.trackings;trackings;shipmentInfor',
            appends: 'customer;shipmentMethod;transactions.receipts'
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
        search: `logable_type:App\\\\Entities\\\\Order;logable_id:${id}`
    };

    useEffect(() => {
        dispatch(resetOrderDetail());
        dispatch(fetchOrderById(paramDetail)).then(res => {
            if (res.type.includes('fulfilled')) {
                const params = {
                    search: `user_id:${res.payload.customer_id}`
                };
                dispatch(fetchShipmentInfo(params));
            }
        });
        dispatch(fetchLadingBills(paramLadingBill));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // info
    const handleUpdateInfo = ({ note, shipment_method_id }) => {
        const params = {
            id: id,
            body: {
                note,
                shipment_method_id
            }
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
    const stepList = stepRes || orderDetail?.steps || [];
    const steps = stepList.map(value => {
        const statusObj = statusList.find(x => x.id === value);
        return statusObj;
    });

    const loading =
        isLoadingDetail || isActionLoadingDetail || isActionLoadingCost;

    return (
        <>
            {loading && <Loading />}
            <TopHeader
                title={intl.formatMessage({
                    id: 'ORDER.SHIPMENT.DETAIL.TITLE'
                })}
            >
                <Button
                    className="btn btn-light ml-2"
                    onClick={() => history.push('/ban-hang/don-van-chuyen-ho')}
                >
                    <i className="fa fa-arrow-left"></i>
                    <FormattedMessage id="GLOBAL.BUTTON.BACK" />
                </Button>
                {steps?.length > 0
                    ? steps?.map((step, index) => (
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
                <div className="form-group row mb-0">
                    <div className="col-md-6">
                        <InfoCard
                            statusRes={statusRes}
                            order={orderDetail}
                            onUpdate={handleUpdateInfo}
                            intl={intl}
                        />
                    </div>
                    <div className="col-md-6">
                        <ShipmentInfoCard
                            height={{ height: '46.5%' }}
                            shipmentInfoRes={shipmentInfoRes}
                            shipment={orderDetail.shipment_infor}
                            onUpdate={handleUpdateShipmentInfo}
                            intl={intl}
                            userId={orderDetail?.customer_id}
                        />
                        <SenderInfoCard
                            height={{ height: '46.5%' }}
                            shipmentInfoRes={shipmentInfoRes}
                            shipment={orderDetail.shipment_infor}
                            onUpdate={handleUpdateShipmentInfo}
                            intl={intl}
                            userId={orderDetail?.customer_id}
                        />
                    </div>
                </div>
                <TransactionCard
                    height="h-50"
                    transactions={orderDetail.transactions || []}
                    intl={intl}
                />

                <div className="form-group row">
                    <div className="col-md-6">
                        <LadingBillCard
                            onView={handleViewLanding}
                            intl={intl}
                        />
                    </div>
                    <div className="col-md-6">
                        <LogCard onLog={handleNewLog} intl={intl} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default injectIntl(connect(null, null)(ShipmentPartnerDetailPage));
