import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button } from 'reactstrap';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar
} from '_metronic/_partials/controls';
import useDebounce from 'helper/useDebounce';
import { fetchShipmentInfo } from '../../order-redux/shipmentInfoSlice';

ShipmentInfoCard.propTypes = {
    shipment: PropTypes.object,
    onUpdate: PropTypes.func,
    shipmentInfoRes: PropTypes.number,
    userId: PropTypes.string
};

function ShipmentInfoCard({
    shipment = {},
    onUpdate = null,
    shipmentInfoRes,
    userId,
    intl
}) {
    const dispatch = useDispatch();
    const [isShow, setShow] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const { shipmentList } = useSelector(
        ({ order }) => ({
            shipmentList: order.shipmentInfo.shipmentInfoList
        }),
        shallowEqual
    );
    const [searchCustomer, setSearchCustomer] = useState('');
    const searchCustomerDebounce = useDebounce(searchCustomer);

    const handleSearchCustomer = value => {
        setSearchCustomer(value);
    };

    useEffect(() => {
        if (searchCustomerDebounce) {
            const params = {
                search: `user_id:${userId};consignee:${searchCustomerDebounce}`,
                searchFields: `user_id:=;consignee:like`,
                searchJoin: `and`
            };
            dispatch(fetchShipmentInfo(params));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchCustomerDebounce]);

    const shipmentOptions = shipmentList?.map(item => {
        return {
            value: item.id,
            label: item.consignee,
            address: item.full_address,
            tel: item.tel
        };
    });

    const handleUpdate = () => {
        if (onUpdate && selectedShipment) onUpdate(selectedShipment?.value);
    };

    const handleSelectShipment = shipment => {
        setSelectedShipment(shipment);
    };

    useEffect(() => {
        setShow(false);
        setSelectedShipment(null);
    }, [shipmentInfoRes]);

    const shipmentObj = shipmentList?.find(x => x.id === shipmentInfoRes);

    return (
        <Card className="h-100">
            <CardHeader
                title={intl.formatMessage({ id: 'ORDER.SHIPMENT_INFO' })}
            >
                <CardHeaderToolbar>
                    {isShow && (
                        <div style={{ width: '200px' }}>
                            <Select
                                options={shipmentOptions}
                                className="w-100"
                                onChange={handleSelectShipment}
                                placeholder={intl.formatMessage({
                                    id: 'GLOBAL.SEARCH.PLACEHOLER_SELECT'
                                })}
                                onInputChange={handleSearchCustomer}
                            />
                        </div>
                    )}
                    <Button
                        className="ml-2"
                        color="secondary"
                        onClick={() => {
                            setShow(!isShow);
                            setSelectedShipment(null);
                        }}
                    >
                        <i
                            style={{ paddingRight: 0 }}
                            className={
                                isShow ? 'flaticon-cancel' : 'flaticon-edit'
                            }
                        />
                    </Button>
                    <Button
                        className="ml-2"
                        color="primary"
                        onClick={handleUpdate}
                        disabled={!selectedShipment}
                    >
                        <FormattedMessage id="GLOBAL.BUTTON.UPDATE" />
                    </Button>
                </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
                <div className="form-group row align-items-center">
                    <div className="col-3">
                        <span className="order-title">
                            <FormattedMessage id="ORDER.CUSTOMER" />
                        </span>
                    </div>
                    <div className="col-9">
                        <div className="form-control bg-light">
                            {selectedShipment?.label ||
                                shipmentObj?.consignee ||
                                shipment?.consignee}
                        </div>
                    </div>
                </div>
                <div className="form-group row align-items-center">
                    <div className="col-3">
                        <span className="order-title">
                            <FormattedMessage id="ORDER.ADDRESS" />
                        </span>
                    </div>
                    <div className="col-9">
                        <div
                            className="form-control bg-light"
                            style={{ overflow: 'auto' }}
                        >
                            {selectedShipment?.address ||
                                shipmentObj?.full_address ||
                                shipment?.full_address}
                        </div>
                    </div>
                </div>
                <div className="form-group row align-items-center">
                    <div className="col-3">
                        <span className="order-title">
                            <FormattedMessage id="ORDER.TEL" />
                        </span>
                    </div>
                    <div className="col-9">
                        <div
                            className="form-control bg-light"
                            style={{ overflow: 'auto' }}
                        >
                            {selectedShipment?.tel ||
                                shipmentObj?.tel ||
                                shipment?.tel}
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

export default ShipmentInfoCard;
