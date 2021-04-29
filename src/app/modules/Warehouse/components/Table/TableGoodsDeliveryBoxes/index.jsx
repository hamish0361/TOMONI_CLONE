import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import warehouseApi from 'apis/warehouse';
import { dialog } from 'app/components/DialogNotify';

import CustomTable from 'app/components/CustomTable';
import EmptyData from 'app/components/EmptyData';
import ModalConfirm from 'app/modules/Warehouse/components/ModalConfirm';
import useTrans from 'helper/useTrans';
import useColumns from './useColumns';

import './index.scss';
import handleApiError from 'helper/handleApiError';

function TableGoodsDeliveryBoxes({ onRefresh, outboundPickers }) {

    const [selectedRow, setSelectedRow] = useState([]);
    const dataTable = useSelector(state => state.warehouse.goodsDelivery.detail.data?.pivot_boxes);
    const status_id = useSelector(state => state.warehouse.goodsDelivery.detail.data?.status_id);
    const modalConfirmRef = useRef();
    const [trans] = useTrans();
    const [columns] = useColumns({ onRefresh, disabled: status_id !== 'waiting_shipment', outboundPickers });

    const deleteBox = ({ id }) => {
        warehouseApi.goodsDeliveryBoxes.delete(id)
            .then(() => {
                onRefresh && onRefresh();
                dialog.success(trans("warehouse.goods_delivery.pivot.box_lading_bill.delete.success"));
            })
            .catch((err) => {
                handleApiError(err, null, trans("warehouse.goods_delivery.pivot.box_lading_bill.delete.failure"));
            })
    }

    const confirmDeleteBoxItem = id => {
        modalConfirmRef.current.open({
            title: `${trans(
                'warehouse.sku.pivot.lading_bill.update_quantity.title'
            )}?`,
            id
        });
    };

    const handleDeleteMultiRow = (ids) => {
        return Promise.all(ids.map(id => warehouseApi.goodsDeliveryBoxes.delete(id)))
            .then(() => {
                onRefresh && onRefresh();
                dialog.success(trans("warehouse.goods_delivery.pivot.box_lading_bill.delete.success"));
                setSelectedRow([]);
            })
            .catch((err) => {
                handleApiError(err, null, trans("warehouse.goods_delivery.pivot.box_lading_bill.delete.failure"));
            })
    }

    const handleSelectRow = (newSelectedRow) => {
        setSelectedRow(newSelectedRow);
    }

    if (!dataTable?.length) return <EmptyData emptyText={trans("warehouse.goods_delivery.pivot.box_lading_bill.empty")} />

    return (
        <div>
            <ModalConfirm ref={modalConfirmRef} onOk={deleteBox} />
            <CustomTable
                columns={columns}
                rows={dataTable}
                rowKey="id"
                className="table-list-box-in-goods-delivery"
                onDelete={confirmDeleteBoxItem}
                onDeleteMulti={handleDeleteMultiRow}
                permissions={{
                    delete: 'goods-deliveries.delete'
                }}
                selectable
                selectedRow={selectedRow}
                onSelectRow={handleSelectRow}
            />
        </div>
    );
}

export default TableGoodsDeliveryBoxes;
