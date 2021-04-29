import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { boxOwnerAction } from 'app/modules/Warehouse/warehouse-redux/boxOwnerSlice';

import { Form } from 'formik';
import FormStatus from '../FormStatus';
import SelectCustomer from 'app/components/Select/SelectCustomer/SelectCustomerForm';

const FormContent = props => {

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(boxOwnerAction.resetParams());
        }
    }, []); // eslint-disable-line

    return (
        <Form className="form form-label-right form-add-lading-bill">

            <div className="row">
                {/* <div className="col-lg-6 col-sm-12">
                    <FastField
                        name="name"
                        component={Input}
                        placeholder={trans("warehouse.lading_bill.name")}
                        label={trans("warehouse.lading_bill.name")}
                    />
                </div> */}
                <div className="col-lg-12 col-sm-12">
                    <SelectCustomer
                        name="customer_id"
                    />
                </div>
            </div>

            <FormStatus />
        </Form>
    );
};

FormContent.propTypes = {

};

export default FormContent;