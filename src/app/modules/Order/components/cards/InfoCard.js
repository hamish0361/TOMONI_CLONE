import formatNumber from 'helper/formatNumber';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';
import { Button } from 'reactstrap';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar
} from '_metronic/_partials/controls';
import Select from 'react-select';
import { shallowEqual, useSelector } from 'react-redux';

InfoCard.propTypes = {
    order: PropTypes.object,
    statusRes: PropTypes.object,
    onUpdate: PropTypes.func
};

function InfoCard({ order = {}, onUpdate = null, statusRes, intl }) {
    const [note, setNote] = useState('');
    const [additionalCost, setAdditionalCost] = useState('');
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
        // notePrev.current = order?.note;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order?.note, order?.shipment_method]);

    useEffect(() => {
        setAdditionalCost(order?.additional_cost);
        // notePrev.current = order?.note;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order?.id]);

    const handleUpdate = () => {
        const body = {
            note: note,
            additional_cost:
                typeof additionalCost === 'string' &&
                additionalCost?.includes(',')
                    ? additionalCost?.replace(/\D/g, '')
                    : additionalCost,
            shipment_method_id: shipment?.value
        };
        if (onUpdate) onUpdate(body);
    };

    const handleInputChangeNote = e => {
        setNote(e.target.value);
    };

    const handleInputChangeAdditionalCost = e => {
        setAdditionalCost(e.target.value);
    };

    const handleChangeShipment = shipment => {
        setShipment(shipment);
    };

    const shipmentOption = shipmentMethodList?.map(item => {
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
        <Card className="h-100">
            <CardHeader title={intl.formatMessage({ id: 'ORDER.INFO' })}>
                <CardHeaderToolbar>
                    <Button
                        color="primary"
                        form="form-info-update"
                        onClick={handleUpdate}
                    >
                        <FormattedMessage id="GLOBAL.BUTTON.UPDATE" />
                    </Button>
                </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
                <div className="row form-group">
                    <div className="col-md-6 pr-12">
                        <div className="row align-items-center">
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
                    </div>
                    <div className="col-md-6 pl-12">
                        <div>
                            <div className="row align-items-center">
                                <div className="col-4">
                                    <span className="order-title">
                                        <FormattedMessage id="ORDER.TOTAL_MONEY" />
                                    </span>
                                </div>
                                <div className="col-8">
                                    <div className="form-control bg-light">
                                        {formatNumber(order?.balance)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row form-group">
                    <div className="col-md-6 pr-12">
                        <div className="row align-items-center">
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
                    </div>
                    <div className="col-md-6 pl-12">
                        <div className="row align-items-center">
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
                    </div>
                </div>

                <div className="row form-group">
                    <div className="col-md-6 pr-12">
                        <div className="row align-items-center">
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
                    </div>
                    <div className="col-md-6 pl-12">
                        <div className="row align-items-center">
                            <div className="col-4">
                                <span className="order-title">
                                    <FormattedMessage id="ORDER.SURCHARGE" />
                                </span>
                            </div>
                            <div className="col-8">
                                <NumberFormat
                                    thousandSeparator={true}
                                    className="form-control"
                                    name="additional_cost"
                                    placeholder={intl.formatMessage({
                                        id: 'ORDER.UPDATE.ADDITIONAL.COST'
                                    })}
                                    value={additionalCost}
                                    onChange={handleInputChangeAdditionalCost}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row form-group">
                    <div className="col-md-6 pr-12">
                        <div className="row align-items-center">
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
                    </div>
                    <div className="col-md-6 pl-12">
                        <div className="row align-items-center">
                            <div className="col-4">
                                <span className="order-title">
                                    <FormattedMessage id="ORDER.NOTE" />
                                </span>
                            </div>
                            <div className="col-8">
                                <input
                                    name="note"
                                    className="form-control"
                                    placeholder={intl.formatMessage({
                                        id: 'ORDER.UPDATE.ADDITIONAL.NOTE'
                                    })}
                                    value={note || ''}
                                    onChange={handleInputChangeNote}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row form-group">
                    <div className="col-md-6 pr-12">
                        <div className="row align-items-center">
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
                    </div>
                    <div className="col-md-6 pl-12">
                        <div className="row align-items-center">
                            <div className="col-4">
                                <span className="order-title">
                                    <FormattedMessage id="ORDER.SHIPMENT_METHOD" />
                                </span>
                            </div>
                            <div className="col-8">
                                <Select
                                    options={shipmentOption}
                                    value={shipment}
                                    onChange={handleChangeShipment}
                                    placeholder={intl.formatMessage({
                                        id: 'GLOBAL.PLACEHOLER.SELECT'
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row form-group">
                    <div className="col-md-6 pr-12">
                        <div className="row align-items-center">
                            <div className="col-4 pr-12">
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
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

export default InfoCard;
