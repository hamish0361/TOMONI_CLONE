import React, { useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import warehouseApi from 'apis/warehouse';
import { dialog } from 'app/components/DialogNotify';
import useLadingBillClosed from '../useLadingBillClosed';
import handleApiError from 'helper/handleApiError';

import CustomTable from 'app/components/CustomTable';
import EmptyData from 'app/components/EmptyData';
import ModalConfirm from 'app/modules/Warehouse/components/ModalConfirm';
import useTrans from 'helper/useTrans';
import useColumns from './useColumns';
import NeedPermission from 'app/components/NeedPermission';
import { TrackingProvider } from 'app/modules/Warehouse/components/context/trackingContext';

import './index.scss';

function TableBoxInLadingBill({ onRefresh }) {

    const [selectedRow, setSelectedRow] = useState([]);
    const dataTable = useSelector(state => state.warehouse.ladingBill.detail.data?.box_lading_bills);
    const isLadingBillClosed = useLadingBillClosed();
    const [trans] = useTrans();
    const [columns] = useColumns({ onRefresh });
    const modalConfirmRef = useRef();

    const deleteBoxLadingBill = ({ id }) => {
        warehouseApi.boxLadingBill.delete(id)
            .then(() => {
                onRefresh && onRefresh();
                dialog.success(trans("warehouse.sku.pivot.lading_bill.delete.success"));
            })
            .catch((err) => {
                handleApiError(err, null, trans("warehouse.sku.pivot.lading_bill.delete.failure"))
            })
    }

    const handleDeleteMultiRow = (ids) => {
        return Promise.all(ids.map(id => warehouseApi.boxLadingBill.delete(id)))
            .then(() => {
                onRefresh && onRefresh();
                dialog.success(trans("warehouse.sku.pivot.lading_bill.delete.success"));
                setSelectedRow([]);
            })
            .catch((err) => {
                handleApiError(err, null, trans("warehouse.sku.pivot.lading_bill.delete.failure"))
            })
    }

    const handleSelectRow = (newSelectedRow) => {
        setSelectedRow(newSelectedRow);
    }

    const confirmDeleteBoxItem = id => {
        modalConfirmRef.current.open({
            title: `${trans(
                'warehouse.sku.pivot.lading_bill.update_quantity.title'
            )}?`,
            id
        });
    };

    const trackingIds = useMemo(() => {
        if (!dataTable?.length) return [];
        return dataTable.filter(b => b?.owning_box?.box?.sfa?.tracking).map(b => b.owning_box.box.sfa.tracking)
    }, [dataTable]);

    if (!dataTable?.length) return <EmptyData emptyText={trans("warehouse.sku.pivot.lading_bill.empty")} />

    return (
        <div>
            <ModalConfirm ref={modalConfirmRef} onOk={deleteBoxLadingBill} />
            <NeedPermission need={['box-lading-bills.index']}>
                <TrackingProvider trackingIds={trackingIds}>
                    <CustomTable
                        columns={columns}
                        rows={dataTable}
                        rowKey="id"
                        isViewEdit={false}
                        isDelete={false}
                        onDelete={!isLadingBillClosed && confirmDeleteBoxItem}
                        isAction={false}
                        className="table-list-box-in-lading-bill"
                        selectable
                        selectedRow={selectedRow}
                        onSelectRow={handleSelectRow}
                        permissions={{
                            delete: ['box-lading-bills.delete']
                        }}
                        onDeleteMulti={handleDeleteMultiRow}
                    />
                </TrackingProvider>
            </NeedPermission>
        </div>
    );
}

export default TableBoxInLadingBill;
