import ItemTable from './ItemTable';
import PropTypes from 'prop-types';
import React from 'react';
import { CardBody, CardHeader, Card } from '_metronic/_partials/controls';

OrderCard.propTypes = {
    orders: PropTypes.array
};

function OrderCard({ orders = [], intl }) {
    const columns = [
        { id: 'id', title: intl.formatMessage({ id: 'TRACKING.ID' }) },
        {
            id: 'order_id',
            title: intl.formatMessage({ id: 'TRACKING.ORDER_ID' })
        },
        {
            id: 'customer',
            title: intl.formatMessage({ id: 'TRACKING.CUSTOMER' })
        },
        { id: 'status', title: intl.formatMessage({ id: 'TRACKING.STATUS' }) },
        { id: 'type', title: intl.formatMessage({ id: 'TRACKING.TYPE' }) },
        {
            id: 'consignee',
            title: intl.formatMessage({ id: 'ORDER.CONSIGNEE_INFO' })
        }
    ];

    const rows = orders?.map(order => {
        return {
            id: order.id,
            order_id: order.id,
            customer: order.customer_id,
            status: order.status?.name,
            type: order.type?.name,
            consignee: (
                <div>
                    <div>Người nhận: {order.shipment_infor?.consignee}</div>
                    <div>Địa chỉ: {order.shipment_infor?.full_address}</div>
                    <div>Số điện thoại: {order.shipment_infor?.tel}</div>
                </div>
            )
        };
    });

    return (
        <Card>
            <CardHeader
                title={intl.formatMessage({
                    id: 'TRACKING.DETAIL.ORDER.TITLE'
                })}
            />
            <CardBody>
                <ItemTable
                    columns={columns}
                    rows={rows}
                    isAction={false}
                    page={1}
                    lastpage={1}
                />
            </CardBody>
        </Card>
    );
}

export default OrderCard;
