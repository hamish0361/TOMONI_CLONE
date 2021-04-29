import { Divider } from '@material-ui/core';
import { dialog } from 'app/components/DialogNotify';
import InputField from 'app/modules/Order/components/InputField';
import { fetchShipmentInfo } from 'app/modules/Order/order-redux/shipmentInfoSlice';
import { FastField, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Prompt } from 'react-router-dom';
import Select from 'react-select';
import { Card, CardBody } from '_metronic/_partials/controls';
import './styles.scss';

NewForm.propTypes = {
    onSearchCustomer: PropTypes.func,
    onSearchTracking: PropTypes.func,
    onSubmit: PropTypes.func,

    isSuccessNew: PropTypes.bool
};

function NewForm({
    onSearchCustomer = null,
    onSubmit = null,
    btnRef,
    isSuccessNew,
    intl
}) {
    const dispatch = useDispatch();
    const { customerList, shipmentMethodList, shipmentList } = useSelector(
        ({ authService, home, order }) => ({
            customerList: authService.user.userList,
            shipmentMethodList: home.home.shipmentMethodList,
            shipmentList: order.shipmentInfo.shipmentInfoList
        }),
        shallowEqual
    );

    // state
    const [values, setValues] = useState({
        typeTracking: 'id',
        typeCustomer: 'email',

        shipmentSelected: null,
        methodSelected: null,
        trackingList: [],
        code: ''
    });
    const [check, setCheck] = useState(true);
    const [customerSelected, setCustomerSelected] = useState(null);
    // customer
    const customerRef = useRef(null);
    const handleSearchCustomer = value => {
        if (customerRef.current) {
            clearTimeout(customerRef.current);
        }
        customerRef.current = setTimeout(() => {
            if (value.length > 0) {
                const params = {
                    text: value,
                    type: values.typeCustomer
                };
                if (onSearchCustomer) onSearchCustomer(params);
            }
        }, 500);
    };

    const handleSelectCustomer = customer => {
        setCustomerSelected(customer);
        const params = {
            search: `user_id:${customer.value}`
        };
        dispatch(fetchShipmentInfo(params)).then(res => {
            if (res.type.includes('fulfilled')) {
                const list = res.payload.data;
                if (res.payload.data.length > 0) {
                    const option = {
                        value: list[0]?.id,
                        label: list[0]?.consignee,
                        address: list[0]?.full_address,
                        tel: list[0]?.tel
                    };
                    setValues({
                        ...values,
                        shipmentSelected: option
                    });
                } else {
                    setValues({
                        ...values,
                        shipmentSelected: null
                    });
                }
                dialog.success(
                    `${list.length} ${intl.formatMessage({
                        id: 'ORDER.CONSIGNEE_INFO'
                    })}`
                );
            } else {
                dialog.success(
                    intl.formatMessage({ id: 'ORDER.CONSIGNEE_INFO_NO_DATA' })
                );
            }
            setCheck(false);
        });
    };

    //method
    const handleSelectMethod = methodSelected => {
        setValues({
            ...values,
            methodSelected
        });
    };

    // shipment
    const handleSelectShipment = shipmentSelected => {
        setValues({
            ...values,
            shipmentSelected
        });
    };

    // submit new
    const handleSubmit = formValue => {
        const params = {
            tracking: values.code,
            methodId: values.methodSelected?.value || methodOptions[0].value,
            shipmentId:
                values.shipmentSelected?.value ||
                shipmentOptions[0]?.value ||
                '',
            note: formValue.note,
            customer_id: customerSelected?.value,
            sender_name: formValue.sender_name,
            sender_tel: formValue.sender_tel
        };
        if (onSubmit) onSubmit(params);
    };

    const handleChange = e => {
        const check = e.target.value;
        if (!check) return;

        setValues({
            ...values,
            code: e.target.value
        });
    };

    const initValues = {
        note: ''
    };

    const customerOptions = customerList?.map(item => {
        return {
            value: item.id,
            label: item.email
        };
    });

    const methodOptions = shipmentMethodList?.map(item => {
        return {
            value: item.id,
            label: item.name
        };
    });

    const shipmentOptions = shipmentList.map(item => {
        return {
            value: item.id,
            label: item.consignee,
            address: item.full_address,
            tel: item.tel
        };
    });

    const formIsHalfFilledOut = !isSuccessNew
        ? !!values.shipmentSelected
        : false;

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={initValues}
                innerRef={btnRef}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form>
                        {/* Tracking */}
                        <div className="form-group row ">
                            <div className="col-xl-6 mb-8">
                                <Card>
                                    <CardBody>
                                        <div className="form-group row align-items-center mb-0 pl-3">
                                            <div className="form-group row align-items-center align-items-center">
                                                <div className="col-md-12">
                                                    <h4 className=" text-dark font-weight-bold mb-2">
                                                        <FormattedMessage id="ORDER.SHIPMENT.SENDER" />
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row align-items-center">
                                            <div className="col-md-3">
                                                <label>
                                                    <FormattedMessage id="ORDER.SHIPMENT.SENDER_NAME" />
                                                </label>
                                            </div>
                                            <div className="col-md-9">
                                                <FastField
                                                    name="sender_name"
                                                    component={InputField}
                                                    placeholder={intl.formatMessage(
                                                        {
                                                            id:
                                                                'GLOBAL.PLACEHOLER.INPUT'
                                                        }
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row align-items-center">
                                            <div className="col-md-3">
                                                <label>
                                                    <FormattedMessage id="ORDER.SHIPMENT.SENDER_PHONE" />
                                                </label>
                                            </div>
                                            <div className="col-md-9">
                                                <FastField
                                                    name="sender_tel"
                                                    component={InputField}
                                                    placeholder={intl.formatMessage(
                                                        {
                                                            id:
                                                                'GLOBAL.PLACEHOLER.INPUT'
                                                        }
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                                <Card className="card-stretch">
                                    <CardBody>
                                        <div className="form-group row align-items-center align-items-center">
                                            <div className="col-md-12">
                                                <h4 className=" text-dark font-weight-bold mb-2">
                                                    <FormattedMessage id="ORDER.TRACKING" />
                                                </h4>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="form-group input-group">
                                                <input
                                                    className="form-control input-group-prepend"
                                                    type="text"
                                                    value={values.code}
                                                    onChange={handleChange}
                                                    placeholder={intl.formatMessage(
                                                        {
                                                            id:
                                                                'GLOBAL.TRACKING.PLACEHOLER.INPUT'
                                                        }
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <Divider className="mb-8" />
                                        <div className="form-group row align-items-center">
                                            <div className="col-md-3">
                                                <label>
                                                    <FormattedMessage id="ORDER.SHIPMENT_METHOD" />
                                                </label>
                                            </div>
                                            <div className="col-md-9">
                                                <Select
                                                    placeholder={intl.formatMessage(
                                                        {
                                                            id:
                                                                'GLOBAL.SEARCH.PLACEHOLER_INPUT'
                                                        }
                                                    )}
                                                    defaultValue={
                                                        methodOptions[0]
                                                    }
                                                    options={methodOptions}
                                                    onChange={
                                                        handleSelectMethod
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row align-items-center">
                                            <div className="col-md-3">
                                                <label>
                                                    <FormattedMessage id="ORDER.NOTE_ORDER" />
                                                </label>
                                            </div>
                                            <div className="col-md-9">
                                                <FastField
                                                    name="note"
                                                    component={InputField}
                                                    placeholder={intl.formatMessage(
                                                        {
                                                            id:
                                                                'GLOBAL.PLACEHOLER.INPUT'
                                                        }
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>

                            {/* Thong tin nhan hang */}
                            <div className="col-xl-6 mb-8">
                                <Card className="card-stretch">
                                    <CardBody>
                                        <div className="form-group row align-items-center  align-items-center">
                                            <div className="col-md-6">
                                                <h4 className=" text-dark font-weight-bold mb-2">
                                                    <FormattedMessage id="ORDER.CUSTOMER_INFO" />
                                                </h4>
                                            </div>
                                            <div className="col-md-6">
                                                <Select
                                                    placeholder={intl.formatMessage(
                                                        {
                                                            id:
                                                                'GLOBAL.SEARCH.PLACEHOLER_INPUT'
                                                        }
                                                    )}
                                                    options={customerOptions}
                                                    onInputChange={
                                                        handleSearchCustomer
                                                    }
                                                    onChange={
                                                        handleSelectCustomer
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <Divider className="mb-9" />
                                        <div className="form-group row align-items-center  align-items-center">
                                            <div className="col-md-6">
                                                <h4 className=" text-dark font-weight-bold mb-2">
                                                    <FormattedMessage id="ORDER.CONSIGNEE_INFO" />
                                                </h4>
                                            </div>
                                            <div className="col-md-6">
                                                <Select
                                                    placeholder={intl.formatMessage(
                                                        {
                                                            id:
                                                                'GLOBAL.PLACEHOLER.SELECT'
                                                        }
                                                    )}
                                                    value={
                                                        values.shipmentSelected
                                                    }
                                                    options={shipmentOptions}
                                                    onChange={
                                                        handleSelectShipment
                                                    }
                                                    isDisabled={check}
                                                />
                                            </div>
                                        </div>
                                        <Divider className="mb-9" />
                                        <div className="form-group row align-items-center">
                                            <div className="col-md-3">
                                                <label>
                                                    <FormattedMessage id="ORDER.CONSIGNEE" />
                                                </label>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="form-control bg-light">
                                                    {values.shipmentSelected
                                                        ?.label || ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row align-items-center">
                                            <div className="col-md-3">
                                                <label>
                                                    <FormattedMessage id="ORDER.ADDRESS" />
                                                </label>
                                            </div>
                                            <div className="col-md-9">
                                                <div
                                                    className="form-control bg-light"
                                                    style={{ overflow: 'auto' }}
                                                >
                                                    {values.shipmentSelected
                                                        ?.address || ''}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row align-items-center">
                                            <div className="col-md-3">
                                                <label>
                                                    <FormattedMessage id="ORDER.TEL" />
                                                </label>
                                            </div>
                                            <div className="col-md-9">
                                                <div className="form-control bg-light">
                                                    {values.shipmentSelected
                                                        ?.tel || ''}
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
            <Prompt
                when={formIsHalfFilledOut}
                message={intl.formatMessage({
                    id: 'GLOBAL.MESSAGE.FILLED_OUT'
                })}
            />
        </>
    );
}

export default NewForm;
