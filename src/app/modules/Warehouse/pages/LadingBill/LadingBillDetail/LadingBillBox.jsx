import React, { useMemo, useRef, useState } from 'react';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';

import warehouseApi from 'apis/warehouse';
import useLadingBillClosed from './useLadingBillClosed';

import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar
} from '_metronic/_partials/controls';
import AddBoxToLadingBill from './AddBoxToLadingBill';
import TableBoxInLadingBill from './TableBoxInLadingBill';
import useTrans from 'helper/useTrans';
import NeedPermission from 'app/components/NeedPermission';
import ModalConfirm from 'app/modules/Warehouse/components/ModalConfirm';
import Button from 'app/components/Button';
import { dialog } from 'app/components/DialogNotify';

const LadingBillBox = ({ onRefresh }) => {

    const [loading, setLoading] = useState(false);
    const dataTable = useSelector(state => state.warehouse.ladingBill.detail.data?.box_lading_bills);
    const ladingBill = useSelector(state => state.warehouse.ladingBill.detail?.data);
    const isLadingBillClosed = useLadingBillClosed();
    const match = useRouteMatch();
    const history = useHistory();
    const [trans] = useTrans();
    const modalConfirmRef = useRef();

    const totalBox = useMemo(() => {

        if (!dataTable?.length) return 0;

        return dataTable.reduce((p, c) => p + c.quantity, 0);
    }, [dataTable]);

    const handleCutOff = () => {
        setLoading(true);
        warehouseApi.ladingBill.cutOff(ladingBill?.id)
            .then(() => {
                dialog.success(trans("warehouse.lading_bill.cut_off.success"));
            })
            .catch((err) => {
                console.error(err);

                dialog.error(trans("warehouse.lading_bill.cut_off.failure"));
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const handleConfirmCutOff = () => {
        modalConfirmRef.current.open({
            title: trans("warehouse.lading_bill.cut_off.title"),
            description: trans("warehouse.lading_bill.cut_off.description")
        })
    }

    return (
        <>
            <NeedPermission need={['box-lading-bills.create']}>
                <Route path={`${match.path}/add-box-to-lading-bill`}>
                    {({ match }) => (
                        <AddBoxToLadingBill
                            show={match !== null}
                            onSuccess={onRefresh}
                        />
                    )}
                </Route>
            </NeedPermission>

            <ModalConfirm ref={modalConfirmRef} onOk={handleCutOff} />

            <Card className="lading-bill-box">
                <CardHeader title={`${trans("warehouse.sku.pivot.lading_bill.title")} - ${trans("warehouse.sku.total")}: ${totalBox}`}>
                    {!isLadingBillClosed && (
                        <CardHeaderToolbar>

                            <NeedPermission need={['lading-bills.update']}>
                                <Button
                                    type="outline-danger"
                                    onClick={handleConfirmCutOff}
                                    loading={loading}
                                >
                                    {trans("warehouse.lading_bill.cut_off.title")}
                                </Button>
                            </NeedPermission>

                            <NeedPermission need={['box-lading-bills.create']}>
                                <button
                                    className="btn btn-primary ml-3"
                                    onClick={() =>
                                        history.push(
                                            `${match.url}/add-box-to-lading-bill`
                                        )
                                    }
                                >
                                    {trans("warehouse.sku.pivot.lading_bill.create.title")}
                                </button>
                            </NeedPermission>

                        </CardHeaderToolbar>
                    )}

                </CardHeader>
                <CardBody className="position-relative">
                    <TableBoxInLadingBill onRefresh={onRefresh} />
                </CardBody>
            </Card>
        </>
    );
};

LadingBillBox.propTypes = {};

export default LadingBillBox;
