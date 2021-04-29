import React, { useImperativeHandle, useState } from 'react';
import { useSelector } from 'react-redux';

import useTrans from 'helper/useTrans';

import CustomModal from 'app/components/CustomModal';
import { Modal } from 'react-bootstrap';
import Button from 'app/components/Button';

import './index.scss';

const ModalConfirmPackaging = ({ onOk }, ref) => {

    const palletSelectedIdx = useSelector(state => state.warehouse.packagingLoadUpContainer.palletSelectedIdx);
    const [show, setShow] = useState(false);
    const [data, setData] = useState();
    const [trans] = useTrans();

    const toggleModal = () => setShow(!show);

    useImperativeHandle(ref, () => ({
        open: ({ ...refData }) => {
            setShow(true);
            setData(refData);
        }
    }));

    const handlePallet = () => {
        setShow(false);
        onOk && onOk({ ...data, type: "pallet" });
    }

    const handleSingleBox = () => {
        setShow(false);
        onOk && onOk({ ...data, type: "singleBox" });
    }

    return (
        <CustomModal
            show={show}
            onHide={toggleModal}
            title={trans("warehouse.load_up_container.packaging_mode.select")}
            className="modal-confirm-packaging"
        >
            <Modal.Body>
                <div className="d-flex align-items-center justify-content-center">
                    <Button onClick={handleSingleBox} type="warning">{trans("warehouse.load_up_container.packaging_mode.singleBox")}</Button>
                    {palletSelectedIdx !== undefined && (
                        <Button onClick={handlePallet} type="primary" className="ml-3">{trans("warehouse.load_up_container.packaging_mode.pallet")}</Button>
                    )}
                </div>
            </Modal.Body>
        </CustomModal>
    );
};

export default React.forwardRef(ModalConfirmPackaging);