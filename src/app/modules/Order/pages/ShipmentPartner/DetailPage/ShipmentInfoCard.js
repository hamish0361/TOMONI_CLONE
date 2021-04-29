import { dialog } from 'app/components/DialogNotify';
import {
    createShipmentInfo,
    fetchShipmentInfo
} from 'app/modules/Order/order-redux/shipmentInfoSlice';
import useDebounce from 'helper/useDebounce';
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
import DialogNewShipmentInfo from './DialogNewShipmentInfo';

ShipmentInfoCard.propTypes = {
    shipment: PropTypes.object,
    onUpdate: PropTypes.func,
    shipmentInfoRes: PropTypes.number,
    userId: PropTypes.string,
    height: PropTypes.object
};

const SALE_SEIKO_ID = 'sale.se';

function ShipmentInfoCard({
    shipment = {},
    onUpdate = null,
    shipmentInfoRes,
    userId,
    height = { height: '100%' },
    intl
}) {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [isShow, setShow] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const { shipmentList } = useSelector(
        ({ order }) => ({
            shipmentList: order.shipmentInfo.shipmentInfoList
        }),
        shallowEqual
    );

    const shipmentOptions = shipmentList.map(item => {
        return {
            value: item.id,
            label: item.consignee,
            full_address: item.full_address,
            tel: item.tel
        };
    });

    const handleUpdate = () => {
        if (onUpdate && selectedShipment) {
            onUpdate(selectedShipment?.value);
        }
    };

    const handleSelectShipment = shipment => {
        setSelectedShipment(shipment);
    };

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

    useEffect(() => {
        setShow(false);
        setSelectedShipment(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shipmentInfoRes]);

    const paramsShipmentInfo = {
        search: `user_id:${shipment?.user_id}`
    };

    const handleNewShipmentInfo = body => {
        const params = {
            ...body,
            user_id: userId
        };
        if (!body.consignee) {
            dialog.warning(
                `${intl.formatMessage({
                    id: 'CUSTOMER.CREATE.WHOLESALE.DIALOG.WARNING.USER'
                })}`
            );
        } else if (!body.address) {
            dialog.warning(
                `${intl.formatMessage({
                    id: 'CUSTOMER.CREATE.WHOLESALE.DIALOG.WARNING.ADDRESS'
                })}`
            );
        } else if (!body.tel) {
            dialog.warning(
                `${intl.formatMessage({
                    id: 'CUSTOMER.CREATE.WHOLESALE.DIALOG.WARNING.TELEPHONE'
                })}`
            );
        } else {
            dispatch(createShipmentInfo(params)).then(res => {
                if (res.type.includes('fulfilled')) {
                    dialog.success(
                        `${intl.formatMessage({
                            id: 'ORDER.CREATE.SHIPMENT_INFO.SUCCESS'
                        })}`
                    );
                    setOpen(false);
                    dispatch(fetchShipmentInfo(paramsShipmentInfo));
                    onUpdate(res.payload?.id);
                } else {
                    dialog.error(
                        `${intl.formatMessage({
                            id: 'ORDER.CREATE.SHIPMENT_INFO.FAIL'
                        })}`
                    );
                }
            });
        }
    };

    const shipmentObj = shipmentList.find(x => x.id === shipmentInfoRes);

    const isSaleSE = userId === SALE_SEIKO_ID;

    return (
        <>
            <Card className="card-stretch card-stretch-half" style={height}>
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
                                    onInputChange={handleSearchCustomer}
                                />
                            </div>
                        )}
                        {isSaleSE && !isShow && (
                            <Button
                                className="ml-2"
                                color="secondary"
                                onClick={() => {
                                    setOpen(true);
                                }}
                            >
                                <i
                                    style={{ paddingRight: 0 }}
                                    className="flaticon-add-circular-button"
                                />
                            </Button>
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
                    <div>
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
                                    {selectedShipment?.full_address ||
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
                    </div>
                </CardBody>
            </Card>

            <DialogNewShipmentInfo
                open={open}
                onHide={() => setOpen(false)}
                onNewSubmit={handleNewShipmentInfo}
            />
        </>
    );
}

export default ShipmentInfoCard;
