import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import useTrans from 'helper/useTrans';

import { Alert, AlertTitle } from '@material-ui/lab';
import Button from 'app/components/Button';
import ModalConfirm from 'app/modules/Warehouse/components/ModalConfirm';

import './index.scss';

AlertSelectRow.propTypes = {
    selectedRow: PropTypes.array,
    onDelete: PropTypes.func,
};

function AlertSelectRow({ selectedRow, onDelete }) {

    const [loading, setLoading] = useState(false);
    const [trans] = useTrans();
    const modalConfirmRef = useRef();

    const handleDeleteMultiRow = () => {
        setLoading(true);
        onDelete(selectedRow)
            .finally(() => {
                setLoading(false)
            })
    }

    const openModalConfirm = () => {
        modalConfirmRef.current.open({
            title: trans("common.table.row.delete.title"),
            description: trans("common.table.row.delete.description", { length: selectedRow.length })
        });
    }

    if (!selectedRow.length || !onDelete) return <></>;

    return (
        <>
            <ModalConfirm ref={modalConfirmRef} onOk={handleDeleteMultiRow} />
            <Alert
                severity="error"
                action={
                    <Button
                        type="outline-danger"
                        icon="General/Trash.svg"
                        onClick={openModalConfirm}
                        loading={loading}
                    >
                        {trans("common.delete_selected")}
                    </Button>
                }
                className="mb-10 alert-delete-multi-row"
            >
                <AlertTitle>{trans("common.table.row.delete.title")}</AlertTitle>
                {trans("common.table.row.delete.description", { length: selectedRow.length })}
            </Alert>
        </>
    );
}

export default AlertSelectRow;