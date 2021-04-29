import React from 'react';

import { Formik } from 'formik';
import FormContent from './FormContent';

import './index.scss';

const FormAddBoxLadingBill = ({
    initialValues = {
        customer_id: '', 
        boxes: {}
    },
    onSubmit
}, ref) => {

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            innerRef={ref}
            enableReinitialize
        >
            <FormContent />
        </Formik>

    );
};

export default React.forwardRef(FormAddBoxLadingBill);
