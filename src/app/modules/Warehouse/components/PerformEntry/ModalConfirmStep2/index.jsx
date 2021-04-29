import React, { useState, useMemo, useImperativeHandle } from 'react';
import { useHistory, useParams } from 'react-router';
import { useSelector } from 'react-redux';

import useTrans from 'helper/useTrans';

import CustomModal from 'app/components/CustomModal';
import { Button, Modal } from 'react-bootstrap';

import './index.scss';

const ModalConfirmNextStep = (props, ref) => {

    const currentBox = useSelector(state => state.warehouse.box.detail.data);
    const sfa = useSelector(state => state.warehouse.sfa.detail.data);
    const [show, setShow] = useState(false);
    const [url, setUrl] = useState('');
    const [trans] = useTrans();
    const history = useHistory();
    const params = useParams();

    const isShowPromptLeavePage = useMemo(() => {

        if (!currentBox || !sfa || !params?.box_id) return { status: false };

        if (!currentBox?.items?.length)
            return {
                status: true,
                message: trans("warehouse.confirm.on_leave.step2.items")
            }

        let totalSku = sfa.boxes.reduce((prevV, curV) => prevV + curV.duplicate, 0);
        if (totalSku < sfa?.quantity)
            return {
                status: true,
                message: trans("warehouse.confirm.on_leave.step2.quantity_sku")
            }

        return {
            status: false
        }
    }, [sfa, currentBox, trans, params?.box_id]);

    useImperativeHandle(ref, () => ({
        open: (newURL) => {
            setUrl(newURL);
            if(isShowPromptLeavePage.status) setShow(true);
            else history.push(newURL);
        }
    }))

    const toggleModal = () => { setShow(!show) }

    const handleBack = () => {
        toggleModal();
    }

    const handleContinue = () => {
        history.push(url);
    }

    return (
        <CustomModal
            show={show}
            onHide={toggleModal}
            title={trans("common.leave_page")}
            className="modal-confirm-next-step"
        >
            <Modal.Body>
                <div className="confirm-data">
                    {isShowPromptLeavePage.message}
                </div>

                <div className="actions">
                    <Button variant="primary" onClick={handleBack}>{trans("common.stay_here")}</Button>
                    <Button variant="warning" onClick={handleContinue}>{trans("common.continue")}</Button>
                </div>
            </Modal.Body>
        </CustomModal>
    );
};

export default React.forwardRef(ModalConfirmNextStep);