import { dialog } from 'app/components/DialogNotify';
import {
    updateShipmentInfo,
    fetchShipmentInfo
} from 'app/modules/Order/order-redux/shipmentInfoSlice';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import {
    Card,
    CardBody,
    CardHeader,
    CardHeaderToolbar
} from '_metronic/_partials/controls';
import { FastField, Form, Formik } from 'formik';
import { Button } from 'reactstrap';
import { Input } from '_metronic/_partials/controls';

ShipmentInfoCard.propTypes = {
    shipment: PropTypes.object,
    onUpdate: PropTypes.func,
    shipmentInfoRes: PropTypes.number,
    userId: PropTypes.string,
    height: PropTypes.object
};

function ShipmentInfoCard({
    shipment = {},
    onUpdate = null,
    userId,
    height = { height: '100%' },
    intl
}) {
    const dispatch = useDispatch();
    const [isShow, setShow] = useState(true);

    const paramsShipmentInfo = {
        search: `user_id:${shipment?.user_id}`
    };

    const initialValues = {
        sender_name: shipment?.sender_name || '',
        sender_tel: shipment?.sender_tel
    };

    const btnRef = useRef();

    const handleEditClick = () => {
        if (btnRef && btnRef.current) {
            btnRef.current.handleSubmit();
        }
    };

    const handleSaveInfo = data => {
        const id = shipment?.id;
        const body = {
            id,
            params: {
                sender_name: data?.sender_name,
                sender_tel: data?.sender_tel
            }
        };

        dispatch(updateShipmentInfo(body)).then(res => {
            if (res.type.includes('fulfilled')) {
                dialog.success(
                    `${intl.formatMessage({
                        id: 'ORDER.CREATE.SHIPMENT_INFO.SUCCESS'
                    })}`
                );
                dispatch(fetchShipmentInfo(paramsShipmentInfo));
                onUpdate(res.payload?.id);
                setShow(!isShow);
            } else {
                dialog.error(
                    `${intl.formatMessage({
                        id: 'ORDER.CREATE.SHIPMENT_INFO.FAIL'
                    })}`
                );
            }
        });
    };
    return (
        <>
            <Card className="card-stretch card-stretch-half" style={height}>
                <CardHeader
                    title={intl.formatMessage({
                        id: 'ORDER.SHIPMENT_INFO.SENDER'
                    })}
                >
                    <CardHeaderToolbar>
                        <Button
                            className="ml-2"
                            color="secondary"
                            onClick={() => setShow(!isShow)}
                        >
                            <i
                                style={{ paddingRight: 0 }}
                                className="flaticon-edit"
                            />
                        </Button>
                        <Button
                            className="ml-2"
                            color="primary"
                            onClick={handleEditClick}
                            disabled={isShow}
                        >
                            <FormattedMessage id="GLOBAL.BUTTON.UPDATE" />
                        </Button>
                    </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                    <Formik
                        enableReinitialize={true}
                        initialValues={(initialValues && initialValues) || {}}
                        onSubmit={handleSaveInfo}
                        innerRef={btnRef}
                    >
                        {({ handleSubmit }) => (
                            <>
                                <Form className="form form-label-right">
                                    <div>
                                        <div className="form-group row align-items-center">
                                            <div className="col-3">
                                                <span className="order-title">
                                                    <FormattedMessage id="ORDER.SHIPMENT_INFO.SENDER_NAME" />
                                                </span>
                                            </div>
                                            <div className="col-9">
                                                <FastField
                                                    name="sender_name"
                                                    component={Input}
                                                    disabled={isShow}
                                                    shouldUpdate={() => true}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row align-items-center">
                                            <div className="col-3">
                                                <span className="order-title">
                                                    <FormattedMessage id="ORDER.SHIPMENT_INFO.SENDER_TEL" />
                                                </span>
                                            </div>
                                            <div className="col-9">
                                                <FastField
                                                    name="sender_tel"
                                                    component={Input}
                                                    disabled={isShow}
                                                    shouldUpdate={() => true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </>
                        )}
                    </Formik>
                </CardBody>
            </Card>
        </>
    );
}

export default ShipmentInfoCard;
