import formatNumber from 'helper/formatNumber';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button } from 'reactstrap';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar
} from '_metronic/_partials/controls';

InfoCard.propTypes = {
    order: PropTypes.object,
    statusRes: PropTypes.object,
    onUpdate: PropTypes.func
};

function InfoCard({ order = {}, onUpdate = null, statusRes, intl }) {
    const [note, setNote] = useState('');
    const [shipment, setShipment] = useState(null);
    const { shipmentMethodList } = useSelector(
        ({ home }) => ({ shipmentMethodList: home.home.shipmentMethodList }),
        shallowEqual
    );

    useEffect(() => {
        setNote(order?.note || '');
        setShipment({
            value: order?.shipment_method?.id,
            label: order?.shipment_method?.name
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order?.note, order?.shipment_method]);

    const handleInputChange = e => {
        setNote(e.target.value);
    };

    const handleUpdate = () => {
        if (onUpdate) onUpdate({ note, shipment_method_id: shipment?.value });
    };

    const handleChangeShipment = shipment => {
        setShipment(shipment);
    };

    const shipmentOptions = shipmentMethodList?.map(item => {
        return {
            value: item.id,
            label: item.name
        };
    });

    const totalAmountTransaction = () => {
        const sumAmount = order?.transactions?.reduce(
            (sum, val) => sum + val.amount,
            0
        );
        return sumAmount;
    };

    return (
        <Card className="">
            <CardHeader title={intl.formatMessage({ id: 'ORDER.INFO' })}>
                <CardHeaderToolbar>
                    <Button color="primary" onClick={handleUpdate}>
                        <FormattedMessage id="GLOBAL.BUTTON.UPDATE" />
                    </Button>
                </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
                <div className="form-group row align-items-center">
                    <div className="col-4">
                        <span className="order-title">
                            <FormattedMessage id="ORDER.ID" />
                        </span>
                    </div>
                    <div className="col-8">
                        <div className="form-control bg-light">
                            {order?.id || ''}
                        </div>
                    </div>
                </div>

                <div className="form-group row align-items-center">
                    <div className="col-4">
                        <span className="order-title">
                            <FormattedMessage id="ORDER.CUSTOMER" />
                        </span>
                    </div>
                    <div className="col-8">
                        <div className="form-control bg-light">
                            {order?.customer_id || ''}
                        </div>
                    </div>
                </div>
                <div className="form-group row align-items-center">
                    <div className="col-4">
                        <span className="order-title">
                            <FormattedMessage id="GLOBAL.FILTER.TRACKING" />
                        </span>
                    </div>
                    <div className="col-8">
                        {order?.trackings?.length > 0 && (
                            <span
                                className={`label font-weight-bold label-lg label-inline m-1 ${
                                    order?.trackings?.[0]?.checked
                                        ? 'label-light-success'
                                        : 'label-light-danger'
                                }`}
                            >
                                {order?.trackings?.[0]?.id}
                            </span>
                        )}
                    </div>
                </div>
                <div className="form-group row align-items-center">
                    <div className="col-4">
                        <span className="order-title">
                            <FormattedMessage id="ORDER.STATUS" />
                        </span>
                    </div>
                    <div className="col-8">
                        <div className="form-control bg-light">
                            {statusRes?.name || order?.status?.name}
                        </div>
                    </div>
                </div>
                <div className="form-group row align-items-center">
                    <div className="col-4">
                        <span className="order-title">
                            <FormattedMessage id="ORDER.TYPE" />
                        </span>
                    </div>
                    <div className="col-8">
                        <div className="form-control bg-light">
                            {order?.type?.name || ''}
                        </div>
                    </div>
                </div>
                <div className="row form-group align-items-center">
                    <div className="col-4">
                        <span className="order-title">
                            <FormattedMessage id="ORDER.TOTAL_TRANSACTION" />
                        </span>
                    </div>
                    <div className="col-8">
                        <div className="form-control bg-light">
                            {formatNumber(totalAmountTransaction())}
                        </div>
                    </div>
                </div>

                <div className="form-group row align-items-center">
                    <div className="col-4">
                        <span className="order-title">
                            <FormattedMessage id="ORDER.SHIPMENT_METHOD" />
                        </span>
                    </div>
                    <div className="col-8">
                        <Select
                            options={shipmentOptions}
                            value={shipment}
                            onChange={handleChangeShipment}
                            placeholder={intl.formatMessage({
                                id: 'GLOBAL.PLACEHOLER.SELECT'
                            })}
                        />
                    </div>
                </div>
                <div className="form-group row align-items-center">
                    <div className="col-4">
                        <span className="order-title">
                            <FormattedMessage id="ORDER.NOTE" />
                        </span>
                    </div>
                    <div className="col-8">
                        <input
                            value={note}
                            className="form-control"
                            placeholder="Nhập ghi chú tại đây"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group row align-items-center">
                    <div className="col-4">
                        <span className="order-title">
                            <FormattedMessage id="ORDER.ORDER_DATE" />
                        </span>
                    </div>
                    <div className="col-8">
                        <div className="form-control bg-light">
                            {order?.create_at || ''}
                        </div>
                    </div>
                </div>
                <div className="row align-items-center">
                    <div className="col-4">
                        <span className="order-title">
                            <FormattedMessage id="ORDER.LAST_UPDATE" />
                        </span>
                    </div>
                    <div className="col-8">
                        <div className="form-control bg-light">
                            {order?.updated_at || ''}
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

export default InfoCard;
