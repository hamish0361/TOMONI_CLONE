import React, { useImperativeHandle, useRef, useState } from 'react';
import { useHistory } from 'react-router';

import { startPrinter } from 'app/components/PrinterModal';
import { printerTemplate } from 'helper/printerTemplateData';
import handleApiError from 'helper/handleApiError';
import warehouseApi from 'apis/warehouse';
import useTrans from 'helper/useTrans';

import CustomModal from 'app/components/CustomModal';
import { Modal } from 'react-bootstrap';
import FormAddLocation from 'app/modules/Warehouse/components/Form/FormAddLocation';
import Button from 'app/components/Button';

const ModalAddLocation = ({ show, onHide, onSuccess, id }, ref) => {

    const [loading, setLoading] = useState();
    const history = useHistory();
    const formRef = useRef();
    const [trans] = useTrans();
    const [initialValues, setInitialValues] = useState();

    useImperativeHandle(ref, () => ({
        setInitialData: (data) => {
            setInitialValues(data)
        }
    }));

    const handleSaveLocation = (values, form) => {
        if(!id) createLocation(values, form);
        else updateLocation(values, form);
    }

    const createLocation = (values, form) => {
        setLoading(true);
        warehouseApi.location.create(values)
            .then((res) => {
                startPrinter(printerTemplate.location(res));

                onSuccess && onSuccess(res);
                closeModal();
            })
            .catch((err) => {
                console.error(err);
                handleApiError(err, form);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const updateLocation = (values, form) => {
        setLoading(true);
        warehouseApi.location.update(id, values)
            .then((res) => {
                startPrinter(printerTemplate.location(res));

                onSuccess && onSuccess(res);
                closeModal();
            })
            .catch((err) => {
                console.error(err);
                handleApiError(err, form);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const closeModal = () => {
        if (onHide) onHide();
        else history.goBack();
    }

    const triggerSubmit = () => {
        formRef.current.submitForm();
    }

    return (
        <CustomModal
            show={show}
            onHide={closeModal}
            title={trans("warehouse.location.create.title")}
            actionsLoading={loading}
        >
            <Modal.Body>
                <FormAddLocation
                    initialValues={initialValues}
                    onSubmit={handleSaveLocation}
                    ref={formRef}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button type="secondary" loading={loading} onClick={closeModal} className="btn-large">{trans("common.back")}</Button>
                <Button type="primary" loading={loading} onClick={triggerSubmit} className="btn-large">{trans("common.save")}</Button>
            </Modal.Footer>
        </CustomModal>
    );
};

export default React.forwardRef(ModalAddLocation);