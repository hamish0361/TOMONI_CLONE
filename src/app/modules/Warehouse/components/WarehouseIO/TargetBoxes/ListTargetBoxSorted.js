import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import useTrans from 'helper/useTrans';

ListTargetBoxSorted.propTypes = {
    countRendering: PropTypes.func,
    palletGroupedData: PropTypes.any,
    getColorTargetItem: PropTypes.func,
    classNameFunc: PropTypes.func
};

function ListTargetBoxSorted({
    palletGroupedData,
    countRendering,
    getColorTargetItem,
    classNameFunc
}) {
    return (
        <div className="list-group-pallet">
            {palletGroupedData.map((pallet, palletIdx) => (
                <PalletItem
                    pallet={pallet}
                    key={`pallet-group-${palletIdx}`}
                    countRendering={countRendering}
                    getColorTargetItem={getColorTargetItem}
                    classNameFunc={classNameFunc}
                />
            ))}
        </div>
    );
}

function PalletItem({
    pallet,
    countRendering,
    getColorTargetItem,
    classNameFunc
}) {
    const [showBox, setShowBox] = useState(true);
    const [trans] = useTrans();

    const toggleShowBox = () => setShowBox(!showBox);

    return (
        <div className={clsx("pallet-group", !showBox && 'hidden-body')}>
            <div className="pallet-group__head">
                <span className="pallet-group__head--title">{pallet.id === 'undefinedPallet' ? trans("common.undefined") : pallet.id}</span>
                <span
                    className="pallet-group__head--location"
                    onClick={toggleShowBox}
                >
                    {pallet?.location?.name || '---'}
                </span>
            </div>

            <div className={clsx("pallet-group__body", !showBox && 'd-none')}>
                {pallet.boxes.map((box, bIdx) => (
                    <div
                        className={clsx(
                            `box-data`,
                            getColorTargetItem(box.target),
                            classNameFunc(box.id, box.target)
                        )}
                        key={`box-data-${bIdx}`}
                    >
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="box-id">{box.id}</div>
                            <div className="count">
                                {countRendering(box.target)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListTargetBoxSorted;
