import React, { useEffect, useState } from 'react';

import warehouseApi from 'apis/warehouse';
import useTrans from 'helper/useTrans';
import formatNumber from 'helper/formatNumber';

import Loading from 'app/components/Loading';

const PivotPalletsCell = ({ box_id }) => {

    const [pivotPallets, setPivotPallets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [trans] = useTrans();

    useEffect(() => {
        if (box_id) {
            setLoading(true);
            warehouseApi.box.fetchBox(box_id, {
                with: 'pivotPallets.pallet.location'
            }).then((response) => {
                setPivotPallets(response.pivot_pallets);
            }).finally(() => {
                setLoading(false);
            })
        }
    }, [box_id]);

    if (loading) return <div className="position-relative"><Loading local hideLoadingText /></div>

    if (!pivotPallets?.length)
        return (
            <span className="empty-text">
                {trans('warehouse.sku.not_storage')}
            </span>
        );

    return pivotPallets.map((pivotPallet, idx) => (
        <div
            className="pallet-wrapper split-with-other-vertical"
            key={`pallet-${idx}`}
        >
            <div className="d-flex align-items-center justify-content-between">
                <div className="pallet-id">
                    {trans('warehouse.pallet.id')}:{' '}
                    <span className="font-weight-bold">
                        {pivotPallet.pallet.id}
                    </span>
                </div>
                <div className="pallet-position">
                    {pivotPallet.pallet?.location?.name || '---'}
                </div>
            </div>
            <div className="d-flex align-items-center justify-content-between mt-3">
                <div className="pallet-quantity">
                    {trans(
                        'warehouse.quantity.on_pallet.shorthand'
                    )}
                                :{' '}
                    <span className="font-weight-bold">
                        {formatNumber(pivotPallet.current_quantity)}
                    </span>
                </div>
            </div>
        </div>
    ));
};

export default PivotPalletsCell;