import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '_metronic/_helpers';

ListTargetBox.propTypes = {
    showPalletPackaging: PropTypes.bool,
    onRemoveBoxFromPallet: PropTypes.func,
    countRendering: PropTypes.func,
    targetBoxes: PropTypes.any,
    getColorTargetItem: PropTypes.func,
    classNameFunc: PropTypes.func,
    getReducePallets: PropTypes.func
};

function ListTargetBox({
    targetBoxes,
    showPalletPackaging,
    onRemoveBoxFromPallet,
    countRendering,
    getColorTargetItem,
    classNameFunc,
    getReducePallets
}) {
    return (
        <div className="list-boxes">
            {Object.entries(targetBoxes).map(([boxId, v], bIdx) => (
                <div
                    className={clsx(
                        `box-data`,
                        getColorTargetItem(v),
                        classNameFunc(boxId, v)
                    )}
                    key={`box-data-${bIdx}`}
                >
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="box-id">{boxId}</div>
                        <div className="count">{countRendering(v)}</div>
                    </div>
                    {showPalletPackaging && !!v?.pallets?.length && (
                        <div className="box-data__pallets">
                            {Object.entries(getReducePallets(v?.pallets)).map(
                                ([palletId, quantity]) => (
                                    <div
                                        className="box-data__palletItem"
                                        key={`pallet-item-${palletId}`}
                                    >
                                        Pallet{' '}
                                        <b className="ml-3">{palletId}</b>: SL-
                                        {quantity}
                                        <span
                                            className="box-data__removePalletItem"
                                            onClick={() =>
                                                onRemoveBoxFromPallet &&
                                                onRemoveBoxFromPallet(
                                                    boxId,
                                                    palletId
                                                )
                                            }
                                        >
                                            <SVG
                                                src={toAbsoluteUrl(
                                                    '/media/svg/icons/Navigation/Close.svg'
                                                )}
                                            ></SVG>
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ListTargetBox;
