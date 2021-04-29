import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import formatNumber from 'helper/formatNumber';
import { currenyUnit } from 'config/currency';
import _ from 'lodash';
import warehouseApi from 'apis/warehouse';
import { dialog } from 'app/components/DialogNotify';
import useTrans from 'helper/useTrans';

import EditableText from 'app/components/EditableText';
import NeedPermission from 'app/components/NeedPermission';
import CellBoxID from './CellBoxID';
import useLadingBillClosed from '../useLadingBillClosed';

export default function useColumns({ onRefresh }) {
    const dataTable = useSelector(
        state => state.warehouse.ladingBill.detail.data?.box_lading_bills
    );
    const params = useParams();
    const inputQuantityRef = useRef([]);
    const [trans] = useTrans();
    const isLadingBillClosed = useLadingBillClosed();

    useEffect(() => {
        if (dataTable?.length) {
            dataTable.forEach(d => {
                if (inputQuantityRef.current[d.id])
                    inputQuantityRef.current[d.id].value = d?.quantity;
            });
        }
    }, [dataTable]);

    const handleChangeQuantity = (value, row) => {
        if (Number(value || 0) === row.quantity) return;

        dispatchUpdateQuantity(value, row);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const dispatchUpdateQuantity = useCallback(
        _.debounce((quantity, row) => {
            if (!params?.id) return;

            let availableQuantity =
                row.quantity + row.owning_box.box.quantity_avaliable_for_owners;

            if (quantity > availableQuantity) {
                dialog.warning(
                    trans('validation.message.max_sku_quantity_available', {
                        max: availableQuantity
                    })
                );

                return;
            }

            warehouseApi.boxLadingBill
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

    const handlePressInputStorageCost = (value, row) => {
        warehouseApi.boxLadingBill
            .update(row.id, { storage_cost: value })
            .then(() => {
                onRefresh && onRefresh();
                dialog.success(
                    trans(
                        'warehouse.sku.pivot.lading_bill.update_storage_cost.success'
                    )
                );
            })
            .catch(() => {
                dialog.error(
                    trans(
                        'warehouse.sku.pivot.lading_bill.update_storage_cost.failure'
                    )
                );
            });
    };

    const handlePressInputAdditionalCost = (value, row) => {
        warehouseApi.boxLadingBill
            .update(row.id, { additional_cost: value })
            .then(() => {
                onRefresh && onRefresh();
                dialog.success(
                    trans(
                        'warehouse.sku.pivot.lading_bill.update_storage_cost.success'
                    )
                );
            })
            .catch(() => {
                dialog.error(
                    trans(
                        'warehouse.sku.pivot.lading_bill.update_storage_cost.failure'
                    )
                );
            });
    };

    const columns = useMemo(
        () => [
            {
                id: ['owning_box', 'box_id'],
                title: trans('warehouse.sku.title'),
                render: (box_id, row) => <CellBoxID box_id={box_id} row={row} />
            },
            {
                id: ['owning_box', 'objectable_id'],
                title: trans('warehouse.sku.owner.title'),
                render: objectable_id => (
                    <div className="owner-object">
                        <span className="object-id">{objectable_id}</span>
                    </div>
                )
            },
            {
                id: ['storage_cost'],
                title: trans('warehouse.cost.storage'),
                render: (storage_cost, row) => (
                    <div className="pivot-storage-cost">
                        <div className="d-flex align-items-end">
                            <NeedPermission
                                need={'box-lading-bills.update'}
                                fallback={
                                    <span>
                                        {formatNumber(Number(storage_cost), {
                                            round: 2
                                        })}{' '}
                                        {currenyUnit}
                                    </span>
                                }
                            >
                                <EditableText
                                    text={`${formatNumber(
                                        Number(storage_cost),
                                        { round: 2 }
                                    )} ${currenyUnit}`}
                                    value={Number(storage_cost)}
                                    type="number"
                                    onChange={value =>
                                        handlePressInputStorageCost(value, row)
                                    }
                                    disabled={isLadingBillClosed}
                                />
                            </NeedPermission>
                        </div>

                        <div>
                            <small className="text-primary d-flex align-items-end">
                                <NeedPermission
                                    need={'box-lading-bills.update'}
                                    fallback={
                                        <span>
                                            ($
                                            {trans('warehouse.cost.additional')}
                                            :{' '}
                                            {formatNumber(
                                                Number(row.additional_cost),
                                                { round: 2 }
                                            )}{' '}
                                            {currenyUnit})
                                        </span>
                                    }
                                >
                                    <EditableText
                                        text={`(${trans(
                                            'warehouse.cost.additional'
                                        )}: ${formatNumber(
                                            Number(row.additional_cost),
                                            { round: 2 }
                                        )} ${currenyUnit})`}
                                        value={Number(row.additional_cost)}
                                        type="number"
                                        onChange={value =>
                                            handlePressInputAdditionalCost(
                                                value,
                                                row
                                            )
                                        }
                                        disabled={isLadingBillClosed}
                                    />
                                </NeedPermission>
                            </small>
                        </div>
                    </div>
                )
            },
            {
                id: ['quantity'],
                title: trans('common.quantity'),
                render: (quantity, row) => {
                    return (
                        <NeedPermission
                            need={'box-lading-bills.update'}
                            fallback={<span>{quantity}</span>}
                        >
                            <EditableText
                                text={formatNumber(quantity)}
                                value={quantity}
                                type="number"
                                onChange={value =>
                                    handleChangeQuantity(value, row)
                                }
                                disabled={isLadingBillClosed}
                            />
                        </NeedPermission>
                    );
                }
            }
        ],
        [isLadingBillClosed] // eslint-disable-line
    ); // eslint-disable-line

    return [columns];
}
