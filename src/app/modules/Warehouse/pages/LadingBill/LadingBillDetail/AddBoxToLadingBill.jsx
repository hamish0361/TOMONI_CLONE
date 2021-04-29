import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import warehouseApi from 'apis/warehouse';
import handleApiError from 'helper/handleApiError';

import CustomModal from 'app/components/CustomModal';
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import FormAddBoxLadingBill from 'app/modules/Warehouse/components/Form/FormAddBoxLadingBill';
import useTrans from 'helper/useTrans';
import Button from 'app/components/Button';
import { dialog } from 'app/components/DialogNotify';

const AddBoxToLadingBill = ({ show, onSuccess }) => {
    const ladingBillDetail = useSelector(
        state => state.warehouse.ladingBill.detail.data
    );
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const formRef = useRef();
    const [trans] = useTrans();

    const closeModal = () => {
        history.goBack();
    };

    const handleAddBox = (values, form) => {

        let boxes = Object.values(values.boxes).filter(i => i.checked && Number(i.currentQuantity) > 0);

        if(!boxes.length) {
            dialog.warning(trans("warehouse.lading_bill.add_box.empty_box"));

            return;
        }

        setLoading(true);

        return Promise.all(boxes.map(b => {
            let body = {
                lading_bill_id: ladingBillDetail.id,
                owning_box_id: b.id,
                quantity: b.currentQuantity
            }

            return warehouseApi.boxLadingBill.create(body)
        })).then(() => {
            closeModal();
            onSuccess && onSuccess();
        }).catch(err => {
            handleApiError(err, form);
        }).finally(() => {
            setLoading(false);
        });
    };

    const triggerSubmit = () => {
        formRef.current.submitForm();
    }

    return (
        <CustomModal
            show={show}
            title={trans("warehouse.sku.pivot.lading_bill.create.title")}
            onHide={closeModal}
            actionsLoading={loading}
            className="modal-add-box-to-lading-bill"
        >
            <Modal.Body>
                <FormAddBoxLadingBill
                    initialValues={{
                        customer_id: ladingBillDetail?.customer_id || '',
                        boxes: {}
                    }}
                    onSubmit={handleAddBox}
                    ref={formRef}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button type="secondary" loading={loading} onClick={closeModal}>
                    {trans("common.cancel")}
                </Button>
                <Button type="primary" loading={loading} onClick={triggerSubmit}>
                    {trans("common.save")}
                </Button>
            </Modal.Footer>
        </CustomModal>
    );
};

AddBoxToLadingBill.propTypes = {
    show: PropTypes.bool,
    onSuccess: PropTypes.func
};

export default AddBoxToLadingBill;
