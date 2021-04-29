import React, { useMemo, useState } from 'react';

import { useField, useFormikContext } from "formik";
import SelectOrderForm from 'app/components/Select/SelectOrder/SelectOrderForm';
import SelectCustomer from 'app/components/Select/SelectCustomer';
import clsx from 'clsx';

const SelectObjValue = ({ name, showLabel = true, ...props }) => {

    const [customerId, setCustomerId] = useState();
    const [field, meta, helper] = useField(name); // eslint-disable-line
    const { values } = useFormikContext();

    const handleSelectCustomer = (v) => {
        setCustomerId(v);
        helper.setValue('');
    }

    const defaultParams = useMemo(() => {
        return customerId ? {
            search: `customer_id:${customerId}`,
            searchFields: `customer_id:=`,
            searchJoin: 'and'
        } : undefined
    }, [customerId]);

    return (
        <div className={clsx(values?.objectable_type === 'user' && 'd-none')}>
            <SelectCustomer
                value={customerId}
                onChange={handleSelectCustomer}
            />

            <SelectOrderForm
                name={name}
                defaultParams={defaultParams}
                disabled={!customerId}
                className="mt-3"
            />
        </div>
    );
};

SelectObjValue.propTypes = {

};

export default SelectObjValue;