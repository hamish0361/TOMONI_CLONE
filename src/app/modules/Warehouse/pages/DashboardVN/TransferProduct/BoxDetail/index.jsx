import React, { useImperativeHandle, useState } from 'react';
import { useSelector } from 'react-redux';

import getBoxDetail from 'app/modules/Warehouse/selector/DashboardVN/getBoxDetail';
import useTrans from 'helper/useTrans';
import useLifeCycle from './useLifeCycle';

import CustomModal from 'app/components/CustomModal';
import { Modal } from 'react-bootstrap';
import VerticalStepper from '../Stepper';
import Loading from 'app/components/Loading';

const BoxDetail = (props, ref) => {

    const [show, setShow] = useState(false);
    const boxDetail = useSelector(getBoxDetail);
    const [trans] = useTrans();

    const [lifeCycle, loading] = useLifeCycle();

    const toggleModal = () => setShow(!show);

    useImperativeHandle(ref, () => ({
        open: toggleModal
    }));

    return (
        <CustomModal
            show={show}
            title={`${trans("warehouse.sku.title")}: ${boxDetail?.id}`}
            onHide={toggleModal}
        >
            <Modal.Body className="position-relative">
                {loading && <Loading local />}
                <VerticalStepper steps={lifeCycle} />
            </Modal.Body>
        </CustomModal>
    );
};

export default React.forwardRef(BoxDetail);