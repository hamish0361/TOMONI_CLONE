import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, useHistory, useRouteMatch } from 'react-router';
import useOutboundPicker from '../hooks/useOutboundPicker';

import useTrans from 'helper/useTrans';
import warehouseApi from 'apis/warehouse';
import useGoodsDeliveryDetail, { useGoodsDeliveryStatus } from '../hooks/useGoodsDeliveryDetail';

import { Card, CardBody, CardHeader, CardHeaderToolbar } from '_metronic/_partials/controls';
import TableGoodsDeliveryBoxes from 'app/modules/Warehouse/components/Table/TableGoodsDeliveryBoxes';
import AddBoxToGoodsDelivery from './AddBoxToGoodsDelivery';
import NeedPermission from 'app/components/NeedPermission';
import Button from 'app/components/Button';
import { dialog } from 'app/components/DialogNotify';

const GoodsDeliveryBoxes = props => {

    const goodDelivery = useSelector(state => state.warehouse.goodsDelivery.detail.data);
    const [loading, setLoading] = useState(false);
    const [trans] = useTrans();
    const getGoodsDeliveryDetail = useGoodsDeliveryDetail();
    const history = useHistory();
    const match = useRouteMatch();
    const outboundPickers = useOutboundPicker(match?.params?.id);

    const goodDeliveryStatus = useGoodsDeliveryStatus();

    const openModalAddBox = () => {
        history.push(`${match.url}/add-box-to-goods-delivery`);
    }

    const acceptDeliveryRequest = () => {
        setLoading(true);

        warehouseApi.goodsDelivery.update(goodDelivery.id, { status_id: 'shipping' })
            .then(() => {
                getGoodsDeliveryDetail();

                dialog.success(trans("warehouse.goods_delivery.accept_request.success"))
            })
            .catch(err => {
                console.error(err);

                dialog.error(trans("warehouse.goods_delivery.accept_request.failure"))
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <>
            <NeedPermission need={['goods-deliveries.update']}>
                <Route path={`${match.path}/add-box-to-goods-delivery`}>
                    {({ match }) => (
                        <AddBoxToGoodsDelivery
                            show={match !== null}
                            onSuccess={getGoodsDeliveryDetail}
                        />
                    )}
                </Route>
            </NeedPermission>

            <Card>
                <CardHeader title={trans("warehouse.sku.list.title")}>
                    <NeedPermission need={['goods-deliveries.update']}>
                        <CardHeaderToolbar>
                            {goodDeliveryStatus.isWaiting ? (
                                <>
                                    <Button
                                        type="success"
                                        onClick={acceptDeliveryRequest}
                                        icon="Navigation/Double-check.svg"
                                        className="mr-5"
                                        loading={loading}
                                        need={['goods-deliveries.update']}
                                    >
                                        {trans("warehouse.goods_delivery.accept_request.title")}
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={openModalAddBox}
                                        need={['goods-deliveries.update']}
                                        icon="Navigation/Plus.svg"
                                    >
                                        {trans("warehouse.goods_delivery.pivot.box_lading_bill.create.title")}
                                    </Button>
                                </>
                            ) : (
                                <div className="text-primary font-weight-bold">{goodDelivery?.goods_delivery_status?.name}</div>
                            )}
                        </CardHeaderToolbar>
                    </NeedPermission>
                </CardHeader>

                <CardBody>
                    <TableGoodsDeliveryBoxes
                        onRefresh={getGoodsDeliveryDetail}
                        outboundPickers={outboundPickers}
                    />
                </CardBody>
            </Card>
        </>
    );
};

GoodsDeliveryBoxes.propTypes = {

};

export default GoodsDeliveryBoxes;