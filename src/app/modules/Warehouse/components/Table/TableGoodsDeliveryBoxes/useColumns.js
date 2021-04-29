import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import _ from 'lodash';
import warehouseApi from 'apis/warehouse';
import { dialog } from 'app/components/DialogNotify';
import useTrans from 'helper/useTrans';

import NeedPermission from 'app/components/NeedPermission';
import EditableText from 'app/components/EditableText';
import formatNumber from 'helper/formatNumber';
import { getBoxOutBoundPicker } from 'app/modules/Warehouse/pages/GoodsDelivery/hooks/useOutboundPicker';
import Button from 'app/components/Button';

export default function useColumns({ onRefresh, disabled, outboundPickers }) {

    const dataTable = useSelector(
        state => state.warehouse.goodsDelivery.detail.data?.pivot_boxes
    );
    const params = useParams();
    const inputQuantityRef = useRef([]);
    const [trans] = useTrans();

    useEffect(() => {
        if (dataTable?.length) {
            dataTable.forEach(d => {
                if (inputQuantityRef.current[d.id])
                    inputQuantityRef.current[d.id].value = d?.quantity;
            });
        }
    }, [dataTable]);

    const handleChangeQuantity = (value, row) => {
        dispatchUpdateQuantity(value, row);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const dispatchUpdateQuantity = useCallback(
        _.debounce((quantity, row) => {
            if (!params?.id) return;

            let availableQuantity =
                row.quantity +
                row.box_lading_bill.quantity_avaliable_in_goods_delivery;

            if (quantity > availableQuantity) {
                dialog.warning(
                    trans('validation.message.max_sku_quantity_available', {
                        max: availableQuantity
                    })
                );

                if (inputQuantityRef?.current?.[row.id])
                    inputQuantityRef.current[row.id].value = row.quantity;

                return;
            }

            warehouseApi.goodsDeliveryBoxes
                .update(row?.id, { quantity })
                .then(() => {
                    onRefresh && onRefresh();
                    dialog.success(
                        trans(
                            'warehouse.sku.pivot.lading_bill.update_quantity.success'
                        )
                    );
                })
                .catch(err => {
                    let errMessage = trans(
                        'warehouse.sku.pivot.lading_bill.update_quantity.failure'
                    );

                    if (err?.response?.data?.errors?.message)
                        errMessage = err.response.data.errors.message;
                    dialog.error(errMessage);
                });
        }, 700),
        []
    );

    const getBoxStatusDelivery = (box_id) => {
        let outboundPicker = getBoxOutBoundPicker(box_id, outboundPickers);

        return outboundPicker?.quantity || 0;

    }

    const goToBoxDetail = (box) => {
        window.open(`/warehouse/inbound/step-2/${box.sfa_id}/${box.id}`, '_blank');
    }

    const columns = useMemo(
        () => [
            {
                id: ['box_lading_bill', 'owning_box', 'box'],
                title: trans('warehouse.sku.title'),
                render: (box, row) => (
                    <>
                        <Button type="link" className="sku-title" onClick={() => goToBoxDetail(box)}>{box.id}</Button>
                        <div className="outbound-picker-status">{getBoxStatusDelivery(box.id)} / {row.quantity}</div>
                    </>
                )
            },
            {
                id: ['box_lading_bill', 'owning_box', 'objectable_id'],
                title: trans('warehouse.sku.owner.title'),
                render: (objectable_id, { box_lading_bill }) => (
                    <div className="owner-object">
                        <span className="object-type">
                            {box_lading_bill.owning_box.objectable_type ===
                            'user'
                                ? trans('common.customer')
                                : trans('common.the_order')}
                        </span>
                        <span> - </span>
                        <span className="object-id">
                            {trans('common.code')}: {objectable_id}
                        </span>
                    </div>
                )
            },
            {
                id: ['quantity'],
                title: trans('common.quantity'),
                render: (quantity, row) => {
                    if (disabled) return formatNumber(quantity);

                    return (
                        <NeedPermission
                            need={['goods-deliveries.update']}
                            fallback={quantity}
                        >
                            <EditableText
                                value={quantity}
                                text={formatNumber(quantity)}
                                onChange={value =>
                                    handleChangeQuantity(value, row)
                                }
                            />
                        </NeedPermission>
                    );
                }
            },
        ],
        [disabled] // eslint-disable-line
    ); 

    return [columns];
}
