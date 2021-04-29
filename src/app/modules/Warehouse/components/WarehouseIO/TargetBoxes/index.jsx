import React, { useCallback, useMemo } from 'react';

import formatNumber from 'helper/formatNumber';
import _ from 'lodash';
import { toAbsoluteUrl } from '_metronic/_helpers';
import useTrans from 'helper/useTrans';
import useGroupByPallet from './useGroupByPallet';

import SVG from 'react-inlinesvg';
import ListTargetBox from './ListTargetBox';
import Loading from 'app/components/Loading';

import './index.scss';
import ListTargetBoxSorted from './ListTargetBoxSorted';

const listColors = ["#f5222d", "#fa541c", "#fa8c16", "#faad14", "#d4b106", "#a0d911", "#52c41a", "#13c2c2", "#1890ff", "#2f54eb", "#722ed1", "#eb2f96", "#bfbfbf"]

const TargetBoxes = ({
    targetBoxes = {},
    currentContainer,
    countRendering = (v) => `${formatNumber(v.count || 0)} / ${formatNumber(v.quantity)}`,
    labelPrefix = "Invoice",
    onRemoveTarget,
    showPalletPackaging = false,
    onRemoveBoxFromPallet,
    classNameFunc = () => '',
    canGroupPallet = false,
}) => {

    const [trans] = useTrans();
    const { groupBoxesByPallets, loading, result: palletGroupedData } = useGroupByPallet(targetBoxes);

    const shuffleColorList = useMemo(() => {
        return _.shuffle(listColors);
    }, []);

    const getBGColor = (idx) => {
        const rIdx = idx % listColors.length;

        return hexToRgba(shuffleColorList[rIdx]) || shuffleColorList[rIdx];
    }

    function hexToRgba(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if (result)
            return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, .5)`;

        return null;
    }

    const handleRemoveInvoice = (c) => {
        onRemoveTarget && onRemoveTarget(c);
    }

    const getColorTargetItem = useCallback((v) => {

        let mainV = v.out;

        if (mainV === undefined) mainV = v.count || 0;
        const quantity = v.quantity || 0;

        if (quantity === mainV) return 'success';
        if (mainV > quantity) return 'warning';

        return '';

    }, []); // eslint-disable-line

    const getReducePallets = useCallback((pallets) => {
        if (!pallets) return {};

        return pallets.reduce((p, c) => {

            if (p[c] !== undefined) p[c] += 1;
            else p = { ...p, [c]: 1 };

            return p;
        }, {});
    }, []); // eslint-disable-line

    if (!currentContainer) return <></>;

    return (
        <div className="target-boxes shadow-sm">
            <div className="invoice-item" style={{ background: getBGColor(currentContainer.id) }}>

                <div className="invoice-item-head position-relative">
                    {loading && <Loading absolute={false} hideLoadingText />}
                    - {labelPrefix} {currentContainer.name} -
                    {onRemoveTarget && (
                        <span aria-hidden="true" className="remove-btn" onClick={() => handleRemoveInvoice(currentContainer)}>&times;</span>
                    )}
                </div>

                {!palletGroupedData.length && canGroupPallet && (
                    <div className="invoice-item__actions">
                        <span
                            className="invoice-item__sortBy--pallet"
                            onClick={groupBoxesByPallets}
                        >
                            <SVG
                                src={toAbsoluteUrl(
                                    '/media/svg/icons/Design/Interselect.svg'
                                )}
                            ></SVG>

                            <span>{trans("warehouse.io.sort_by.pallet.title")}</span>
                        </span>
                    </div>
                )}

                {!palletGroupedData.length ? (
                    <ListTargetBox
                        targetBoxes={targetBoxes}
                        showPalletPackaging={showPalletPackaging}
                        onRemoveBoxFromPallet={onRemoveBoxFromPallet}
                        countRendering={countRendering}
                        getColorTargetItem={getColorTargetItem}
                        classNameFunc={classNameFunc}
                        getReducePallets={getReducePallets}
                    />
                ) : (
                    <ListTargetBoxSorted
                        palletGroupedData={palletGroupedData}
                        countRendering={countRendering}
                        getColorTargetItem={getColorTargetItem}
                        classNameFunc={classNameFunc}
                    />
                )}
            </div>
        </div>
    );
};

TargetBoxes.propTypes = {

};

export default TargetBoxes;