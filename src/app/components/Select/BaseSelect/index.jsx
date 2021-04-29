import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import _ from 'lodash';
import useTrans from 'helper/useTrans';
import clsx from 'clsx';
import merge2Objects from 'helper/merge2Objects';

import Select from 'react-select';

import './index.scss';

const TMNBaseSelect = ({
    className = '',
    options = [],
    loading = false,
    onFetchData,
    value,
    typeSearch = 'id',
    label,
    onChange,
    dispatchFirstOption = false,
    defaultParams,
    disabled = false,
    isDisabled = false,
    isMulti = false,
    ...props
}) => {
    const [prevSearch, setPrevSearch] = useState('');
    const [trans] = useTrans();
    const isDispatchedFirstOption = useRef(false);

    /** Xử lý cho trường hợp có value && có options nhưng không nhận được optionSelected */
    useEffect(() => {
        if (value) {
            if (!optionSelected) {
                let params = merge2Objects(defaultParams, {
                    search: typeSearch ? `${typeSearch}:${value}` : value,
                    searchFields: typeSearch && `${typeSearch}:like`
                });

                fetchData(params);
            }
        } else {
            fetchData(defaultParams);
        }

    }, [value, optionSelected, defaultParams]); // eslint-disable-line

    /** Xử lý cho trường hợp nhận option đầu tiên làm giá trị */
    useEffect(() => {
        if (options.length && dispatchFirstOption && !isDispatchedFirstOption.current) {
            onChange && onChange(options?.[0]);
            isDispatchedFirstOption.current = true;
        }
    }, [options, dispatchFirstOption, isDispatchedFirstOption, onChange]);

    /** 
     * Value nhận được là 1 string hoặc 1 chuỗi string ==> handle cho ra option để hiển thị
     */
    const optionSelected = useMemo(() => {
        if (value === undefined || value === null) return '';

        if (isMulti) {
            return options.filter(c => value.includes(c.value)) || '';
        }

        return options.filter(c => c.value == value)[0] || ''; // eslint-disable-line
    }, [value, options, isMulti]); // eslint-disable-line

    /** Xử lý khi thay đổi search text */
    const handleInputSeachChange = value => {
        if (value)
            search({ value, type: typeSearch });
    };

    /** Xử lý khi select 1 option */
    const handleSelect = option => {
        onChange && onChange(option);
    };

    /** Xử lý search cho select */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const search = useCallback(
        _.debounce(({ value, type }) => {

            if (value === prevSearch) return;

            setPrevSearch(value);

            let params = merge2Objects(defaultParams, {
                search: type ? `${type}:${value}` : value,
                searchFields: type && `${type}:like`
            });

            fetchData(params);
        }, 700),
        [prevSearch, defaultParams]
    );

    const fetchData = (params) => {
        onFetchData && onFetchData(params);
    }

    return (
        <div className={clsx("tomoni-base-select", className)}>
            <div className="form-group mb-0">
                {label && <label htmlFor="">{label}</label>}
                <Select
                    value={optionSelected}
                    placeholder={trans("common.select_here")}
                    options={options}
                    onInputChange={handleInputSeachChange}
                    onChange={handleSelect}
                    isLoading={loading}
                    isDisabled={disabled || isDisabled}
                    isMulti={isMulti}
                    {...props}
                />
            </div>
        </div>
    );
};

export default TMNBaseSelect;