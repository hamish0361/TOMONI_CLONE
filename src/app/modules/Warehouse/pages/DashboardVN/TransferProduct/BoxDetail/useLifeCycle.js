import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import getBoxDetail from 'app/modules/Warehouse/selector/DashboardVN/getBoxDetail';
import warehouseApi from 'apis/warehouse';
import useTrans from 'helper/useTrans';
import _ from 'lodash';

export default function useLifeCycle() {
    const boxDetail = useSelector(getBoxDetail);
    const [loading, setLoading] = useState(false);
    const [trans] = useTrans();
    const [lifeCycle, setLifeCycle] = useState([]);

    useEffect(() => {
        if (boxDetail?.id) {
            getBoxLifeCycle();
        }
    }, [boxDetail]); // eslint-disable-line

    const getBoxLifeCycle = () => {
        setLoading(true);
        return Promise.all([
            getInitialData(),
            getDataInContainerPickers(),
            getDataOutContainerPickers()
        ])
            .then(
                ([initialBoxData, inContainerPickers, outContainerPickers]) => {
                    setLifeCycle(
                        _.compact([
                            ...initialBoxData,
                            inContainerPickers,
                            outContainerPickers
                        ])
                    );
                }
            )
            .catch(() => {
                setLifeCycle([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const getInitialData = () => {
        return new Promise(resolve => {
            // Đẩy dữ liệu đã có vào life_cycle
            let initialBoxCycle = [];

            if (boxDetail?.created_at) {
                initialBoxCycle.push({
                    idx: 1,
                    type: 'created_at',
                    label: trans('warehouse.dashboard_vn.created_box'),
                    value: boxDetail?.created_at,
                    content: (
                        <div>
                            {trans(
                                'warehouse.dashboard_vn.transfer_product.sku.created'
                            )}{' '}
                            {boxDetail?.created_at}
                        </div>
                    )
                });
            }

            if (boxDetail?.out_bound_pickers?.length) {
                boxDetail.out_bound_pickers.forEach(outboundPicker => {
                    initialBoxCycle.push({
                        idx: 4,
                        type: 'outbound',
                        label: trans('warehouse.dashboard_vn.outbound_picker'),
                        value: outboundPicker.created_at,
                        deliveryPartner:
                            outboundPicker?.goods_delivery?.delivery_partner
                                ?.name,
                        quantity: outboundPicker.quantity,
                        content: (
                            <div>
                                <div>
                                    {trans(
                                        'warehouse.dashboard_vn.transfer_product.sku.outbound'
                                    )}{' '}
                                    {outboundPicker.created_at}
                                </div>
                                <div>
                                    {trans('warehouse.delivery_partner.title')}:{' '}
                                    {
                                        outboundPicker?.goods_delivery
                                            ?.delivery_partner?.name
                                    }
                                </div>
                                <div>
                                    {trans('common.quantity')}:{' '}
                                    {outboundPicker.quantity}
                                </div>
                            </div>
                        )
                    });
                });
            }

            resolve(initialBoxCycle);
        });
    };

    const getDataInContainerPickers = () => {
        return warehouseApi.inContainerPicker
            .fetchInContainerPickers({
                search: `box_id:${boxDetail.id}`,
                searchFields: 'box_id:='
            })
            .then(res => {
                if (res?.data?.length) {
                    return {
                        idx: 2,
                        type: 'inContainer',
                        label: trans('warehouse.dashboard_vn.in_container'),
                        value: _.last(res.data)?.created_at,
                        content: (
                            <div>
                                {trans(
                                    'warehouse.dashboard_vn.transfer_product.sku.in_container'
                                )}{' '}
                                {_.last(res.data)?.created_at}
                            </div>
                        )
                    };
                }

                return undefined;
            });
    };

    const getDataOutContainerPickers = () => {
        return warehouseApi.outContainerPicker
            .fetchOutContainerPickers({
                search: `box_id:${boxDetail.id}`,
                searchFields: 'box_id:='
            })
            .then(res => {
                if (res?.data?.length) {
                    return {
                        idx: 3,
                        type: 'outContainer',
                        label: trans('warehouse.dashboard_vn.out_container'),
                        value: _.last(res.data)?.created_at,
                        content: (
                            <div>
                                {trans(
                                    'warehouse.dashboard_vn.transfer_product.sku.out_container'
                                )}{' '}
                                {_.last(res.data)?.created_at}
                            </div>
                        )
                    };
                }

                return undefined;
            });
    };

    return [lifeCycle, loading];
}
