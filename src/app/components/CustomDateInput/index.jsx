import React, { useCallback, useMemo, useState } from 'react';

import clsx from 'clsx';
import moment from 'moment';

import NumberFormat from 'react-number-format';

import './index.scss';
import useTrans from 'helper/useTrans';

export default function CustomDateInput({
    className = '',
    loading = false,
    value,
    label,
    onChange,
    disabled = false,
    formatter = "DD-MM-YYYY",
    ...props
}) {

    const [error, setError] = useState();
    const [trans] = useTrans();

    const localValidate = useCallback((formattedValue, value) => {
        if (!value.length) return true;

        let isValid = moment(formattedValue, formatter).isValid();

        if (!isValid) {
            setError(trans("validation.message.invalid_date"));
        } else {
            setError(undefined);
        }

        return isValid;
    }, [formatter]); // eslint-disable-line

    const handleChangeInput = (inputData) => {

        if (!inputData.value.length) {
            onChange && onChange('');
        }

        if (inputData.value.length === 8 && inputData.formattedValue !== value) {
            let isValid = localValidate(inputData.formattedValue, inputData.value);

            isValid && onChange && onChange(inputData.formattedValue);
        }
    }

    const getValue = useMemo(() => {
        if (!value) return '';

        let isValueValid = moment(value, formatter).isValid();

        if (!isValueValid) return '';

        return moment(value, formatter).format(formatter);
    }, [value, formatter]); // eslint-disable-line

    return (
        <div className={clsx("tomoni-custom-date-input", className, !!error && 'invalid')}>
            <div className="form-group mb-0">
                {label && <label htmlFor="">{label}</label>}

                <NumberFormat
                    format="##-##-####"
                    placeholder={!disabled ? formatter : 'N/A'}
                    mask={['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y']}
                    className={clsx("form-control custom-date-input", disabled && 'disabled')}
                    onValueChange={handleChangeInput}
                    value={getValue}
                    disabled={disabled}
                    {...props}
                />
            </div>
            {!!error && <span className="local-err">{error}</span>}
        </div>
    );
};