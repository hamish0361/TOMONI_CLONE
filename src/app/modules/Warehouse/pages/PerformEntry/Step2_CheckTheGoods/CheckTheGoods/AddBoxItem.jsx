import React, { useRef } from 'react';
import { useSelector } from 'react-redux';

import useBoxItem from './useBoxItem';
import getBoxCloseState from 'app/modules/Warehouse/selector/PerformEntry/getBoxCloseState';

import FormAddBoxItem from 'app/modules/Warehouse/components/Form/FormAddBoxItem';
import ModalConfirm from 'app/modules/Warehouse/components/ModalConfirm';

const AddBoxItem = props => {

    const isBoxClosed = useSelector(getBoxCloseState);

    const modalConfirmRef = useRef();
    const { handleAddBoxItem, continueAddProduct } = useBoxItem(modalConfirmRef);

    if (isBoxClosed) return <></>;

    return (
        <div className="add-box-item">
            <ModalConfirm ref={modalConfirmRef} onOk={continueAddProduct} />
            <div className="add-box-item__content">
                <FormAddBoxItem onSubmit={handleAddBoxItem} />
            </div>
        </div>
    );
};

AddBoxItem.propTypes = {

};

export default React.memo(AddBoxItem);