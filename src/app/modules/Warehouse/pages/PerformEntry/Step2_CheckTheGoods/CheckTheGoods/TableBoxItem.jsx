import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchBoxItemsOfCurrentBox } from 'app/modules/Warehouse/warehouse-redux/performEntrySlice';
import useScrollIntoView from 'helper/useScrollIntoView';
import useBoxItem from './useBoxItem';
import getBoxCloseState from 'app/modules/Warehouse/selector/PerformEntry/getBoxCloseState';

import { Alert, AlertTitle } from '@material-ui/lab';
import ListBoxItems from 'app/modules/Warehouse/components/List/ListBoxItems';
import Button from 'app/components/Button';
import useTrans from 'helper/useTrans';
import Loading from 'app/components/Loading';
import NeedPermission from 'app/components/NeedPermission';
import ModalSetPallet from 'app/modules/Warehouse/components/PerformEntry/ModalSetPallet';

const TableBoxItem = props => {

    const data = useSelector(state => state.warehouse.performEntry.checking_goods.box_items);
    const isBoxClosed = useSelector(getBoxCloseState);
    const apiLoading = useSelector(state => state.warehouse.performEntry.checking_goods.loading);
    const isCheckingGoods = useSelector(state => state.warehouse.performEntry.checking_goods.is_checking);
    const currentBox = useSelector(state => state.warehouse.box.detail.data);
    const dispatch = useDispatch();
    const tableBoxItemRef = useRef();
    const modalSetPalletRef = useRef();
    const { updateBoxItem, deleteBoxItem, closeBoxItems, loading } = useBoxItem(null, modalSetPalletRef);
    const [trans] = useTrans();

    useScrollIntoView(tableBoxItemRef);

    useEffect(() => {
        if (currentBox?.id) dispatch(fetchBoxItemsOfCurrentBox());
    }, [currentBox?.id]); // eslint-disable-line

    return (
        <div className="table-box-items" ref={tableBoxItemRef}>

            {apiLoading ? (
                <div className="position-relative" style={{ minHeight: 300 }}>
                    <Loading local />
                </div>
            ) : (
                <>
                    {isCheckingGoods && (
                        <NeedPermission need={"box-items"}>
                            <Alert
                                severity="warning"
                                action={
                                    <Button type="secondary" onClick={closeBoxItems} loading={loading}>
                                        {trans("warehouse.sku.box_item.close.title")}
                                    </Button>
                                }
                                className="mb-10"
                            >
                                <AlertTitle>{trans("warehouse.sku.box_item.close.warning.title")}</AlertTitle>
                                {trans("warehouse.sku.box_item.close.warning.message")}
                            </Alert>
                        </NeedPermission>
                    )}

                    <ListBoxItems
                        data={data}
                        currentBox={currentBox}
                        onUpdate={!isBoxClosed ? updateBoxItem : undefined}
                        onDelete={!isBoxClosed ? deleteBoxItem : undefined}
                    />
                </>
            )}

            <ModalSetPallet ref={modalSetPalletRef} />
        </div>
    );
};

TableBoxItem.propTypes = {

};

export default TableBoxItem;