import React from 'react';
import PropTypes from 'prop-types';
import useTrans from 'helper/useTrans';

import { Alert, AlertTitle } from '@material-ui/lab';

AlertNotify.propTypes = {
    isEnoughPallet: PropTypes.bool,
    listPallets: PropTypes.array
};

function AlertNotify({ isEnoughPallet, listPallets }) {

    const [trans] = useTrans();

    if (!listPallets.length) return <></>;

    if (isEnoughPallet) return (
        <Alert
            severity="success"
            className="alert-status-pallet mb-3"
        >
            <AlertTitle>{trans("common.status")}</AlertTitle>
            {trans("warehouse.sku.pivot.pallet.available_quantity.box.enough")}
        </Alert>
    )

    return (
        <Alert
            severity="error"
            className="alert-status-pallet mb-3"
        >
            <AlertTitle>{trans("common.status")}</AlertTitle>
            {trans("warehouse.sku.pivot.pallet.available_quantity.box.not_enough")}
        </Alert>
    );
}

export default AlertNotify;