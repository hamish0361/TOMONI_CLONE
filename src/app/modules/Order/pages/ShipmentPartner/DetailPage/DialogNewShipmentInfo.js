import { dialog } from 'app/components/DialogNotify';
import Loading from 'app/components/Loading';
import {
    fetchShipmentInfoDistrict,
    fetchShipmentInfoProvince,
    fetchShipmentInfoWard
} from 'app/modules/Order/order-redux/shipmentInfoSlice';
import useTrans from 'helper/useTrans';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

DialogNewShipmentInfo.propTypes = {
    onNewSubmit: PropTypes.func,
    onHide: PropTypes.func,
    open: PropTypes.bool
};

function DialogNewShipmentInfo({ onNewSubmit, onHide, open }) {
    const dispatch = useDispatch();
    const [trans] = useTrans();
    const { handleSubmit, register, control, reset, getValues } = useForm();

    const { provinces, districts, wards, isLoading } = useSelector(
        ({ order }) => ({
            provinces: order.shipmentInfo.provinces,
            districts: order.shipmentInfo.districts,
            wards: order.shipmentInfo.wards,
            isLoading: order.shipmentInfo.isLoading
        }),
        shallowEqual
    );

    const handleSelectProvince = province => {
        reset({ ...getValues(), ward_id: null, district_id: null });
        const body = {
            id: province?.value,
            params: {
                with: 'districts'
            }
        };
        dispatch(fetchShipmentInfoDistrict(body));
    };

    const handleSelectDistrict = district => {
        reset({ ...getValues(), ward_id: null });
        const body = {
            id: district.value,
            params: {
                with: 'wards'
            }
        };
        dispatch(fetchShipmentInfoWard(body));
    };

    const provinceOptions = provinces?.map(item => ({
        value: item?.id,
        label: item?.name
    }));

    const districtOptions = districts?.map(item => ({
        value: item?.id,
        label: item?.name
    }));

    const wardOptions = wards?.map(item => ({
        value: item?.id,
        label: item?.name
    }));

    const handleNewSubmit = data => {
        if (data.consignee.length < 3) {
            dialog.warning(trans('ORDER.SHIPMENT.WARNING.CONSIGNEE'));
        } else if (data.tel.length < 8) {
            dialog.warning(trans('ORDER.SHIPMENT.WARNING.TEL'));
        } else {
            const body = {
                consignee: data.consignee || '',
                address: data.address || '',
                tel: data.tel || '',
                ward_id: data.ward_id?.value || ''
            };

            onNewSubmit(body);
        }
    };

    useEffect(() => {
        dispatch(fetchShipmentInfoProvince());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (open) reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    return (
        <Modal isOpen={open} style={{ minWidth: '850px' }}>
            {isLoading && <Loading />}
            <ModalHeader>
                <FormattedMessage id="PURCHASE.UPDATE.ITEM.TITLE" />
            </ModalHeader>
            <ModalBody>
                <div>
                    <form
                        onSubmit={handleSubmit(handleNewSubmit)}
                        id="add-shipment-info"
                    >
                        <div className="mb-4">
                            <label>
                                {trans('CUSTOMER.CREATE.WHOLESALE.USER')}
                            </label>
                            <input
                                name="consignee"
                                className="form-control w-100 px-4 text-left"
                                placeholder={trans(
                                    'CUSTOMER.CREATE.WHOLESALE.PLACEHOLER.USER'
                                )}
                                ref={register}
                            />
                        </div>
                        <div className="row mb-4">
                            <div className="col-6">
                                <label>
                                    <FormattedMessage id="ORDER.SHIPMENT.CITY" />
                                </label>
                                <Controller
                                    name="province_id"
                                    defaultValue=""
                                    control={control}
                                    render={({ onChange }) => (
                                        <Select
                                            onChange={province => {
                                                onChange(province);
                                                handleSelectProvince(province);
                                            }}
                                            value={getValues('province_id')}
                                            options={provinceOptions}
                                            placeholder={trans(
                                                'GLOBAL.SEARCH.PLACEHOLER_SELECT'
                                            )}
                                        />
                                    )}
                                />
                            </div>
                            <div className="col-6">
                                <label>
                                    <FormattedMessage id="ORDER.SHIPMENT.DISTRICT" />
                                </label>
                                <Controller
                                    name="district_id"
                                    control={control}
                                    defaultValue=""
                                    render={({ onChange }) => (
                                        <Select
                                            onChange={district => {
                                                onChange(district);
                                                handleSelectDistrict(district);
                                            }}
                                            value={getValues('district_id')}
                                            options={districtOptions}
                                            placeholder={trans(
                                                'GLOBAL.SEARCH.PLACEHOLER_SELECT'
                                            )}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-6">
                                <label>
                                    <FormattedMessage id="ORDER.SHIPMENT.WARD" />
                                </label>
                                <Controller
                                    name="ward_id"
                                    as={Select}
                                    options={wardOptions}
                                    defaultValue=""
                                    control={control}
                                    placeholder={trans(
                                        'GLOBAL.SEARCH.PLACEHOLER_SELECT'
                                    )}
                                />
                            </div>
                            <div className="col-6">
                                <label>
                                    {trans('ORDER.SHIPMENT.ADDRESS_DETAIL')}
                                </label>
                                <input
                                    name="address"
                                    className="form-control w-100 px-4 text-left"
                                    placeholder={trans(
                                        'CUSTOMER.CREATE.WHOLESALE.PLACEHOLER.ADDRESS'
                                    )}
                                    ref={register}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label>
                                {trans('CUSTOMER.CREATE.WHOLESALE.TELEPHONE')}
                            </label>
                            <input
                                name="tel"
                                className="form-control w-100 px-4 text-left"
                                placeholder={trans(
                                    'CUSTOMER.CREATE.WHOLESALE.PLACEHOLER.TEL'
                                )}
                                ref={register}
                                type="number"
                            />
                        </div>
                    </form>
                </div>
            </ModalBody>
            <ModalFooter>
                <div className="d-flex justify-content-end">
                    <Button type="button" variant="light" onClick={onHide}>
                        {trans('GLOBAL.BUTTON.CANCEL')}
                    </Button>
                </div>
                <div className="d-flex justify-content-end">
                    <Button
                        type="submit"
                        variant="primary"
                        form="add-shipment-info"
                    >
                        <FormattedMessage id="GLOBAL.BUTTON.ADD" />
                    </Button>
                </div>
            </ModalFooter>
        </Modal>
    );
}

export default DialogNewShipmentInfo;
