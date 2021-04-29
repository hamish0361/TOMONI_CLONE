import TrackingTable from 'app/modules/Purchase/components/TrackingTable';
import React from 'react';
import { Card, CardBody, CardHeader } from '_metronic/_partials/controls';
import PropTypes from 'prop-types';

TrackingOrder.propTypes = {
    columns: PropTypes.array,
    rows: PropTypes.array
};

function TrackingOrder({ columns, rows, intl }) {
    return (
        <Card>
            <CardHeader
                title={intl.formatMessage({
                    id: 'ORDER.ITEM.TRACKING_LIST'
                })}
            />
            <CardBody>
                <TrackingTable columns={columns} rows={rows} isAction={false} />
            </CardBody>
        </Card>
    );
}

export default TrackingOrder;
