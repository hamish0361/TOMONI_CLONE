import React from 'react';
import { Form, useFormikContext } from 'formik';
import ListBox from './ListBox';
import useInvoiceBoxes from './useInvoiceBoxes';
import SelectInvoiceForm from 'app/components/Select/SelectInvoice/SelectInvoiceForm';

const FormContent = props => {

    const { values } = useFormikContext();
    const { loading, boxes } = useInvoiceBoxes(values.invoice_id);

    return (
        <Form className="form form-add-box-to-lading-bill">
            <SelectInvoiceForm name="invoice_id" />

            <ListBox boxes={boxes} loading={loading}/>
        </Form>
    );
};

FormContent.propTypes = {

};

export default FormContent;