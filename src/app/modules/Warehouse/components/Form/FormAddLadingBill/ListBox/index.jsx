import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { fetchAllBoxOwnersAvailableForLadingBills } from 'app/modules/Warehouse/warehouse-redux/boxOwnerSlice';
import useTrans from 'helper/useTrans';
import { useFormikContext } from 'formik';
import _ from 'lodash';

import Loading from 'app/components/Loading';
import SelectOrder from '../SelectOrder';
import BoxListForSelect from '../BoxListForSelect';
import SelectedBoxList from '../SelectedBoxList';

import './index.scss';
import { TrackingProvider } from '../../../context/trackingContext';

const ListBox = ({ boxes = [], loading, customer_id }) => {

    const [searchText, setSearchText] = useState('');
    const { values, setFieldValue } = useFormikContext();
    const dispatch = useDispatch();
    const [trans] = useTrans();

    useEffect(() => {
        let valueBoxes = [];
        if (!boxes?.length) valueBoxes = [];
        else {
            valueBoxes = boxes
                .filter(box => (box.quantity - Number(box.quantity_in_lading_bills)) > 0)
                .map((box) => {
                    return {
                        ...box,
                        avalableQuantity: box.quantity - Number(box.quantity_in_lading_bills),
                        currentQuantity: box.quantity - Number(box.quantity_in_lading_bills),
                        checked: false
                    }
                })
                .reduce((p, c) => {
                    p[c.box_id] = c;

                    return p;
                }, {});
        }

        setFieldValue('boxes', valueBoxes);
    }, [boxes]); // eslint-disable-line

    // Khi orderSelected thay đổi thì lấy tất cả box
    const handleOrderChange = (orderSelected) => {

        const defaultParams = {
            searchJoin: 'and',
            with: 'box.sfa'
        };

        if (orderSelected && orderSelected === 'user') {
            dispatch(fetchAllBoxOwnersAvailableForLadingBills({
                search: `objectable_id:${customer_id};objectable_type:user`,
                ...defaultParams
            }))
        } else if (orderSelected && orderSelected !== 'user') {
            dispatch(fetchAllBoxOwnersAvailableForLadingBills({
                search: `objectable_id:${orderSelected};objectable_type:order`,
                ...defaultParams
            }))
        }
    }

    const handleChangeItem = (item) => {
        let valuesBox = { ...values.boxes };

        if (valuesBox[item.box_id]) valuesBox[item.box_id] = item;

        setFieldValue('boxes', valuesBox);
    };

    const handleSelectMultiItem = (items_id, checked) => {

        let valuesBox = { ...values.boxes };

        items_id.forEach((box_id) => {
            if (valuesBox[box_id]) valuesBox[box_id].checked = checked;
        });

        setFieldValue('boxes', valuesBox);
    }

    const sortedBoxes = useMemo(() => {
        let boxes = Object.values(values.boxes);

        if (searchText) return boxes.sort((a) => {
            if (a.box_id.includes(searchText)) return -1;

            return 1;
        });

        return _.orderBy(boxes, ['checked'], ['desc']);
    }, [values.boxes, searchText]);

    const countItemChecked = useMemo(() => {
        return sortedBoxes.filter(i => i.checked).length;
    }, [sortedBoxes]);

    const handleChangeSearchText = (e) => {
        setSearchText(e.target.value);
    }

    const trackingIds = useMemo(() => {
        return boxes.filter(i => i?.box?.sfa?.tracking).map(i => i.box.sfa.tracking);
    }, [boxes]);

    return (
        <div className="list-box-for-form w-100">
            <div className="custom-header">
                <div className="title">
                    {trans("warehouse.sku.of_customer")}
                </div>
                <div className="toolbar">
                    <SelectOrder
                        customer_id={customer_id}
                        onChange={handleOrderChange}
                    />
                </div>
            </div>
            <div className="select-box-status mt-3">
                <input
                    className="form-control"
                    placeholder="Find SKU"
                    value={searchText}
                    onChange={handleChangeSearchText}
                />

                <div className="count-selected-box">{countItemChecked}</div>
            </div>
            <div className="position-relative select-box-section">
                {loading && <Loading local />}

                <TrackingProvider trackingIds={trackingIds}>
                    <div className="row h-100">
                        <div className="col-lg-4 col-sm-6">
                            <BoxListForSelect
                                dataList={sortedBoxes}
                                onChangeItem={handleChangeItem}
                                onSelectMultiItem={handleSelectMultiItem}
                            />
                        </div>
                        <div className="col-lg-8 col-sm-6">
                            <SelectedBoxList
                                dataList={sortedBoxes}
                                onChangeItem={handleChangeItem}
                            />
                        </div>
                    </div>
                </TrackingProvider>
            </div>
        </div>
    );
};

ListBox.propTypes = {
    boxes: PropTypes.array,
    onChange: PropTypes.func,
    loading: PropTypes.bool,
    customer_id: PropTypes.any
};

export default ListBox;