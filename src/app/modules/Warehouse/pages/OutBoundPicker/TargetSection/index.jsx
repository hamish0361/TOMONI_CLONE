import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import useTrans from 'helper/useTrans';
import getTargetBoxes from 'app/modules/Warehouse/selector/outBoundPicker/targetBoxesSelector';

import { Card } from '_metronic/_partials/controls';
import InputAddGoodsDelivery from './InputAddGoodsDelivery';
import TargetBoxes from 'app/modules/Warehouse/components/WarehouseIO/TargetBoxes';
import Loading from 'app/components/Loading';

import './index.scss';

const TargetSection = props => {
    const targetBoxes = useSelector(getTargetBoxes);
    const goodsDelivery = useSelector(state => state.warehouse.outBoundPicker.goodsDelivery.data);
    const loading = useSelector(state => state.warehouse.outBoundPicker.goodsDelivery.loading);
    const [trans] = useTrans();

    const currentContainer = useMemo(() => {

        if(!goodsDelivery) return undefined;

        return {
            ...goodsDelivery,
            name: goodsDelivery?.id
        }
    }, [goodsDelivery]);

    return (
        <Card className="target-section position-relative">
            {loading && <Loading local />}
            <InputAddGoodsDelivery />
            <TargetBoxes
                targetBoxes={targetBoxes}
                currentContainer={currentContainer}
                labelPrefix={trans("warehouse.goods_delivery.title")}
                canGroupPallet
            />
        </Card>
    );
};

TargetSection.propTypes = {

};

export default TargetSection;