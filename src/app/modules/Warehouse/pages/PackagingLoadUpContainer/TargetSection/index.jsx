import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { loadUpContainerAction } from 'app/modules/Warehouse/warehouse-redux/loadUpContainerSlice';
import getCurrentContainer from 'app/modules/Warehouse/selector/LoadUpContainer/getCurrentContainer';
import getPackagingTargetBoxes from 'app/modules/Warehouse/selector/LoadUpContainer/packagingTargetBoxesSelector';
import { packagingLoadUpContainerAction } from 'app/modules/Warehouse/warehouse-redux/packagingLoadUpContainerSlice';

import { Card } from '_metronic/_partials/controls';
import InputAddInvoice from './InputAddInvoice';
import TargetBoxes from 'app/modules/Warehouse/components/WarehouseIO/TargetBoxes';
import Loading from 'app/components/Loading';

import './index.scss';

const TargetSection = props => {

    const loading = useSelector(state => state.warehouse.loadUpContainer.listInvoices.loading);
    const pallets = useSelector(state => state.warehouse.packagingLoadUpContainer.pallets.data);
    const palletSelectedIdx = useSelector(state => state.warehouse.packagingLoadUpContainer.palletSelectedIdx);
    const targetBoxes = useSelector(getPackagingTargetBoxes);
    const currentContainer = useSelector(getCurrentContainer);
    const dispatch = useDispatch();

    const handleRemoveInvoice = (c) => {
        dispatch(loadUpContainerAction.removeInvoiceByIdx(c));
    }

    const handleRemoveBoxOnPallet = (box_id, pallet_id) => {
        dispatch(packagingLoadUpContainerAction.removeBoxFromPallet({ box_id, pallet_id }));
    }

    const getRowClass = (boxId) => {
        const selectedPallet = pallets[palletSelectedIdx];

        if(selectedPallet && selectedPallet.boxes.includes(boxId)) {
            return 'selected';
        }

        return '';
    }

    return (
        <Card className="target-section position-relative">
            {loading && <Loading local />}
            <InputAddInvoice />
            <TargetBoxes
                targetBoxes={targetBoxes}
                currentContainer={currentContainer}
                onRemoveTarget={handleRemoveInvoice}
                showPalletPackaging
                onRemoveBoxFromPallet={handleRemoveBoxOnPallet}
                classNameFunc={getRowClass}
            />
        </Card>
    );
};

TargetSection.propTypes = {

};

export default TargetSection;