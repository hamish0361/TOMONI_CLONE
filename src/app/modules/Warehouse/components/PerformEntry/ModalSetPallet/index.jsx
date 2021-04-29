import React, { useImperativeHandle, useRef, useState } from 'react';

import useTrans from 'helper/useTrans';
import { useScanBarcode, isPalletCode } from 'helper/useScanBarcode';
import { toAbsoluteUrl } from '_metronic/_helpers';
import useAddPallet from './useAddPallet';
import clsx from 'clsx';

import SVG from 'react-inlinesvg';
import { Modal } from 'react-bootstrap';
import CustomModal from 'app/components/CustomModal';
import SelectPalletType from 'app/components/Select/SelectPalletType';
import { ProgressBar } from 'react-bootstrap';
import AlertNotify from './AlertNotify';
import Button from 'app/components/Button';

import './index.scss';

const ModalSetPallet = (props, ref) => {

    const [show, setShow] = useState(false);
    const [trans] = useTrans();
    const inputRef = useRef();

    const toggleModal = () => setShow(!show);

    const { onAddPallet, onAddNewPallet, listPallets, onChangePalletType, isEnoughPallet, savePalletBoxes, loading } = useAddPallet(toggleModal);

    useImperativeHandle(ref, () => ({
        open: () => {
            toggleModal();
        }
    }))

    const handleKeyPress = (e) => {
        if (e.charCode === 13) handleAddPallet();
    }

    useScanBarcode({
        condition: isPalletCode,
        onEnter: (v, e) => handleScanEnter(v)
    });

    const handleScanEnter = (v) => {
        inputRef.current.value = v;
        handleAddPallet(v);

        setTimeout(() => {
            inputRef.current.value = '';
        }, 200);
    }

    const handleAddPallet = () => {

        const palletId = inputRef.current.value;

        if (!palletId?.length) return;

        setTimeout(() => {
            inputRef.current.value = '';
            inputRef.current.blur();
        }, 200);

        onAddPallet && onAddPallet(palletId);
    }

    return (
        <CustomModal
            show={show}
            title={trans("warehouse.sku.pivot.pallet.pick.title")}
            actionsLoading={false}
            onHide={toggleModal}
            className="custom-modal-add-pallet"
        >
            <Modal.Body>

                {!!listPallets.length && (
                    <div className="quantity-pallet-box">
                        {trans("common.quantity")}: <span className="quantity">{isEnoughPallet.quantity} / {isEnoughPallet.duplicate}</span>
                    </div>
                )}

                <div className="input-add-pallet mt-3">
                    <input className="form-control" ref={inputRef} placeholder={trans("warehouse.pallet.id")} onKeyPress={handleKeyPress} />
                    <span className="svg-icon svg-icon-primary custom-button" onClick={onAddNewPallet}>
                        <SVG src={toAbsoluteUrl(
                            '/media/svg/icons/Code/Plus.svg'
                        )} />
                    </span>
                </div>

                <AlertNotify isEnoughPallet={isEnoughPallet.result} listPallets={listPallets} />

                <div className="pallet-lists-in-modal">
                    {!!listPallets?.length && listPallets.map((pallet, idx) => (
                        <div className={clsx("pallet-item")} key={`pallet-item-${idx}`}>
                            <div>
                                <div className="d-flex align-items-center">
                                    <div className="pallet-item--info">
                                        <div className="pallet-item--id">
                                            {pallet.id}
                                        </div>
                                        <div className="pallet-item--quantity_box">{trans("warehouse.sku.quantity")}: {pallet.quantity_boxes || 0}</div>
                                    </div>

                                    <SelectPalletType showLabel={false} value={pallet?.type_id} onChange={(type_id) => onChangePalletType(type_id, pallet)} />

                                </div>
                                <div className="progress-pallet">
                                    <div className="progress-pallet--item">
                                        <span className="text-success">V: </span>
                                        <ProgressBar variant="success" now={pallet?.boxes_volume} max={pallet?.type?.max_volume} />
                                    </div>

                                    <div className="progress-pallet--item">
                                        <span className="text-primary">W: </span>
                                        <ProgressBar variant="info" now={pallet?.boxes_weight} max={pallet?.type?.max_weight} />
                                    </div>
                                </div>
                            </div>
                            <div className="avalable-box-quantity">
                                <div className="avalable-box-quantity__title">
                                    {trans("warehouse.sku.pivot.pallet.available_quantity.box.title")}
                                </div>
                                <div className="avalable-box-quantity__quantity">
                                    <input
                                        className="form-control"
                                        value={pallet.availableBoxQuantity}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button type="secondary" onClick={toggleModal}>{trans("common.cancel")}</Button>
                <Button type="primary" onClick={savePalletBoxes} loading={loading}>{trans("common.save")}</Button>
            </Modal.Footer>
        </CustomModal>
    );
};

export default React.forwardRef(ModalSetPallet);