import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useTrans from 'helper/useTrans';
import { packagingLoadUpContainerAction } from 'app/modules/Warehouse/warehouse-redux/packagingLoadUpContainerSlice';
import getPackagingTargetBoxes from 'app/modules/Warehouse/selector/LoadUpContainer/packagingTargetBoxesSelector';
import { useScanBarcode } from 'helper/useScanBarcode';
import playAudio from 'helper/playAudio';

import { Card, CardBody } from '_metronic/_partials/controls';
import EmptyData from 'app/components/EmptyData';
import Button from 'app/components/Button';
import PalletItem from './PalletItem';
import { dialog } from 'app/components/DialogNotify';
import ModalConfirmPackaging from './ModalConfirmPackaging';

import './index.scss';

const PalletManagement = props => {

    const targetBoxes = useSelector(getPackagingTargetBoxes);
    const pallets = useSelector(state => state.warehouse.packagingLoadUpContainer.pallets.data);
    const [trans] = useTrans();
    const dispatch = useDispatch();
    const inputRef = useRef();
    const modalConfirmRef = useRef();

    useScanBarcode({
        condition: () => !pallets.length,
        onEnter: (v) => {
            inputRef.current.value = v;

            confirmBeforeAddBox();
        }
    })

    const handleCreatePallet = () => {
        dispatch(packagingLoadUpContainerAction.addPallet());
    }

    const confirmBeforeAddBox = () => {
        let box_id = inputRef.current.value;

        setTimeout(() => {
            inputRef.current.value = '';
        }, 100);

        modalConfirmRef.current.open({
            box_id
        });
    }

    const addBoxToPallet = ({ box_id, type }) => {

        /** Kiểm tra điều kiện khi add box
         * box phải tồn tại
         * không được vượt quá số lượng đã pick lên cont
         */

        if (!targetBoxes[box_id]) {
            dialog.warning(trans("warehouse.load_up_container.box_not_exist"));
            playAudio('/media/audio/wrong-answer.mp3');

            return;
        }

        if (targetBoxes[box_id]?.pallets && targetBoxes[box_id].pallets.length >= targetBoxes[box_id].count) {
            dialog.warning(trans("warehouse.load_up_container.box_over_quantity"));

            return;
        }

        dispatch(packagingLoadUpContainerAction.addBoxToPallet({ box_id, type }));
    }

    const handleKeyPress = (e) => {
        if (e.charCode === 13) confirmBeforeAddBox();
    }

    return (
        <Card className="pallet-management">
            <CardBody>
                <ModalConfirmPackaging ref={modalConfirmRef} onOk={addBoxToPallet} />
                <div className="d-flex align-items-center action-section">
                    <input
                        className="form-control"
                        placeholder="SKU"
                        ref={inputRef}
                        onKeyPress={handleKeyPress}
                    />
                    <Button type="primary" className="ml-3" onClick={handleCreatePallet} icon="/Navigation/Plus.svg">{trans("warehouse.pallet.create.title")}</Button>
                </div>
                {!pallets.length && <EmptyData />}

                <div className="packaging-pallet-item__wrapper mt-5">
                    {pallets.map((pallet, idx) => <PalletItem pallet={pallet} idx={idx} key={`packaging-pallet-item__${idx}`} />)}
                </div>
            </CardBody>
        </Card>
    );
};

export default PalletManagement;