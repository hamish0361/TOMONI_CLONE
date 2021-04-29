import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { toAbsoluteUrl } from '_metronic/_helpers';
import { packagingLoadUpContainerAction } from 'app/modules/Warehouse/warehouse-redux/packagingLoadUpContainerSlice';
import clsx from 'clsx';

import SVG from 'react-inlinesvg';

import './index.scss';

const PalletItem = ({ pallet, idx }) => {

    const pallets = useSelector(state => state.warehouse.packagingLoadUpContainer.pallets.data);
    const palletSelectedIdx = useSelector(state => state.warehouse.packagingLoadUpContainer.palletSelectedIdx);
    const dispatch = useDispatch();

    let palletsLength = pallets.length;

    const handleRemovePallet = (e) => {
        e.stopPropagation();

        dispatch(packagingLoadUpContainerAction.removePalletByIdx(idx));
    }

    const handleSelectPallet = () => {
        dispatch(packagingLoadUpContainerAction.selectPallet(idx));
    }

    return (
        <div className={clsx("packaging-pallet-item", palletSelectedIdx === idx && "selected")} onClick={handleSelectPallet}>
            <div className="packaging-pallet-item__key">{pallet.palletId}</div>
            <div className="packaging-pallet-item__countItem">{pallet.boxes.length}</div>
            <div className={clsx("packaging-pallet-item__closeIcon", (idx + 1 !== palletsLength || palletSelectedIdx === idx || pallet.boxes.length) && 'd-none')} onClick={handleRemovePallet}>
                <SVG
                    src={toAbsoluteUrl(
                        '/media/svg/icons/Navigation/Close.svg'
                    )}
                ></SVG>
            </div>
        </div>
    );
};

PalletItem.propTypes = {
    pallet: PropTypes.any,
    idx: PropTypes.number
};

export default PalletItem;