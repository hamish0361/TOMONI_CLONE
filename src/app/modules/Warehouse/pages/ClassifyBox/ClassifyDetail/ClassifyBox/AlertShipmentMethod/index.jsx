import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import useTracking from 'helper/useTracking';
import getShipmentMethodFromTrackingInfo from 'helper/getShipmentMethodFromTrackingInfo';
import useTrans from 'helper/useTrans';

import { Alert, AlertTitle } from '@material-ui/lab';

import './index.scss';
import clsx from 'clsx';

const AlertShipmentMethod = props => {

    const sfa = useSelector(state => state.warehouse.sfa.detail.data);
    const { data } = useTracking(sfa?.tracking);
    const [trans] = useTrans();

    const shipmentMethodSuggestion = useMemo(() => {
        return getShipmentMethodFromTrackingInfo(data);
    }, [data]);

    if (!shipmentMethodSuggestion) return <></>;

    return (
        <Alert
            severity="success"
            className="my-10"
        >
            <AlertTitle>{trans("warehouse.tracking.lead.order.title")}: <b>{sfa?.tracking}</b></AlertTitle>
            <div className="tracking-order">{trans("warehouse.tracking.suggest.shipment_method")}: 
            <span className={clsx("tracking-order__shipmentMethod ml-3", shipmentMethodSuggestion === 'sea' ? 'text-primary' : 'text-danger')}>{shipmentMethodSuggestion}</span>
            </div>
        </Alert>
    );
};

export default AlertShipmentMethod;