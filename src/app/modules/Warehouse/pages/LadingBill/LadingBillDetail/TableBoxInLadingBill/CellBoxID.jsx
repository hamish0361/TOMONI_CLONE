import { useTracking } from 'app/modules/Warehouse/components/context/trackingContext';
import clsx from 'clsx';
import getShipmentMethodFromTrackingInfo from 'helper/getShipmentMethodFromTrackingInfo';
import React, { useMemo } from 'react';

const CellBoxID = ({ box_id, row }) => {

    const tracking = useTracking(row?.owning_box?.box?.sfa?.tracking);

    const suggestShipmentMethod = useMemo(() => {
        return getShipmentMethodFromTrackingInfo(tracking.data);
    }, [tracking.data]);

    return (
        <div className="cell-box-id">
            <a target="_blank" rel="noreferrer" href={`/warehouse/inbound/step-2/${row.owning_box?.box?.sfa_id}/${box_id}`}>{box_id}</a>

            <div className={clsx("suggest-shipment-method", suggestShipmentMethod === 'sea' ? 'text-primary' : 'text-danger')}>{suggestShipmentMethod}</div>
        </div>
    );
};

export default CellBoxID;