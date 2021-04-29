import React, { useCallback, useState, useRef } from 'react';

import _ from 'lodash';
import productApi from 'apis/product-api/productApi';
import { currenyUnit } from 'config/currency';
import formatNumber from 'helper/formatNumber';
import useClickOutside from 'helper/useClickOutSide';
import { useScanBarcode } from 'helper/useScanBarcode';

import { FieldFeedbackLabel } from '_metronic/_partials/controls';
import Loading from 'app/components/Loading';
import EmptyData from 'app/components/EmptyData';
import { Waypoint } from 'react-waypoint';

import './ACProductInput.scss';

function isParsedNumber(str) {
    return !isNaN(Number(str));
}

const ACProductInput = ({
    field, // { name, value, onChange, onBlur }
    form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
    label,
    withFeedbackLabel = true,
    customFeedbackLabel,
    type = 'text',
    autoFocus = false,
    ...props
}) => {
    const [prevSearchText, setPrevSearchText] = useState('');
    const [visibleAC, setVisibleAC] = useState(false);
    const [loadingAC, setLoadingAC] = useState(false);
    const [dataAC, setDataAC] = useState([]);
    const containerRef = useRef();
    const inputRef = useRef();
    const [pagination, setPagination] = useState({
        page: 1,
        lastPage: 0,
        total: 0
    });

    const { touched, errors, setFieldValue, submitForm } = form;

    useClickOutside(containerRef, () => {
        setVisibleAC(false);
    });

    useScanBarcode({
        onEnter: (v, e) => handleScanEnter(v, e)
    });

    const handleScanEnter = (v, e) => {
        setFieldValue(field.name, v);
        submitForm();
        e.preventDefault();
    }

    const handleChangeInput = (e) => {
        if (!isParsedNumber(e.target.value)) {
            setVisibleAC(true);
            callApiGetProduct();
        } else {
            setVisibleAC(false);
        }

        setFieldValue(field.name, e.target.value);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const callApiGetProduct = useCallback(_.debounce(() => {
        setPrevSearchText(inputRef.current.value);
        setDataAC([]);

        fetchProductData(1)
    }, 700), []);

    const handleClickInput = () => {
        if (dataAC.length > 0) setVisibleAC(true);
        if (inputRef.current.value.length && prevSearchText !== inputRef.current.value.length && !isParsedNumber(inputRef.current.value)) {
            callApiGetProduct();
        }
    }

    const handleClickProduct = (product) => {
        setInputData(product.id);
    }

    const handleKeyPressInput = (e) => {

        if (e.charCode !== 13) setDataAC([]);

        if (e.charCode === 13 && visibleAC && dataAC.length) {
            e.preventDefault();

            if (visibleAC && dataAC.length) {
                setInputData(dataAC[0]?.id);
            }

            if (inputRef.current.value.length) {
                submitForm();
            }
        }
    }

    const setInputData = (data) => {
        setVisibleAC(false);
        setFieldValue(field.name, data).then(() => {
            submitForm();
        });
    }

    const handleWaypointEnter = () => {

        if (loadingAC) return;

        if (pagination.page >= pagination.lastPage) return;

        fetchProductData(pagination.page + 1);
    }

    const fetchProductData = (page = 1) => {
        setLoadingAC(true);
        productApi.fetchProduct({
            page, search: inputRef.current.value, searchFields: 'name:like'
        }).then((res) => {
            setDataAC([...dataAC, ...res.data]);
            setPagination({
                page: res.current_page,
                lastPage: res.last_page,
                total: res.total
            })
        }).finally(() => { setLoadingAC(false) });
    }

    return (
        <div className="ac-product-input" ref={containerRef} >
            {label && <label>{label}</label>}
            <input value={field.value} className="form-control" onChange={handleChangeInput} onClick={handleClickInput} ref={inputRef} onKeyPress={handleKeyPressInput} />
            {visibleAC && (
                <div className="auto-complete-container">
                    <div className="position-relative">
                        {loadingAC && <Loading local />}
                        {!!dataAC.length ? (
                            <div className="list-product-item-wrapper">
                                {dataAC.map((product) => (
                                    <div className="product-item" key={`product-${product.id}`} onClick={() => handleClickProduct(product)}>
                                        <div className="jancode">{product.id} - <span className="product-name">{product.name}</span></div>
                                        <div className="price">{formatNumber(product.price)} {currenyUnit}</div>
                                    </div>
                                ))}

                                {!loadingAC && (
                                    <Waypoint
                                        onEnter={handleWaypointEnter}
                                    />
                                )}
                            </div>
                        ) : (
                            <EmptyData />
                        )}
                    </div>
                </div>
            )}
            {withFeedbackLabel && (
                <FieldFeedbackLabel
                    error={errors[field.name]}
                    touched={touched[field.name]}
                    label={label}
                    type={type}
                    customFeedbackLabel={customFeedbackLabel}
                />
            )}
        </div>
    );
};

ACProductInput.propTypes = {

};

export default ACProductInput;