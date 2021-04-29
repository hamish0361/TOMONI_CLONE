import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { useFormikContext } from 'formik';
import _ from 'lodash';

import Loading from 'app/components/Loading';
import BoxListForSelect from '../BoxListForSelect';
import SelectedBoxList from '../SelectedBoxList';
import EmptyData from 'app/components/EmptyData';

import './index.scss';

const ListBox = ({ boxes = [], loading }) => {

    const { values, setFieldValue } = useFormikContext();
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        let valueBoxes = [];
        if (!boxes?.length) valueBoxes = [];
        else {
            valueBoxes = boxes
                .filter(box => (Number(box.quantity_available_in_goods_delivery)) > 0)
                .map((box) => {
                    return {
                        ...box,
                        avalableQuantity: Number(box.quantity_available_in_goods_delivery),
                        currentQuantity: Number(box.quantity_available_in_goods_delivery),
                        checked: false
                    }
                })
                .reduce((p, c) => {
                    p[c?.owning_box?.box_id] = c;

                    return p;
                }, {});
        }

        setFieldValue('boxes', valueBoxes);
    }, [boxes]); // eslint-disable-line

    const handleChangeItem = (item,) => {
        let valuesBox = { ...values.boxes };

        if (valuesBox[item?.owning_box?.box_id]) valuesBox[item?.owning_box?.box_id] = item;

        setFieldValue('boxes', valuesBox);
    };

    const sortedBoxes = useMemo(() => {
        let boxes = Object.values(values.boxes);

        if (searchText) return boxes.sort((a) => {
            if (a.owning_box.box_id.includes(searchText)) return -1;

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

    return (
        <div className="list-box-for-form w-100">
            <div className="position-relative select-box-section">
                {loading && <Loading local />}

                <div className="select-box-status my-3">
                    <input
                        className="form-control"
                        placeholder="Find SKU"
                        value={searchText}
                        onChange={handleChangeSearchText}
                    />

                    <div className="count-selected-box">{countItemChecked}</div>
                </div>

                {Object.values(values.boxes).length ? (
                    <div className="row h-100">
                        <div className="col-lg-4 col-sm-6">
                            <BoxListForSelect
                                dataList={sortedBoxes}
                                onChangeItem={handleChangeItem}
                            />
                        </div>
                        <div className="col-lg-8 col-sm-6">
                            <SelectedBoxList
                                dataList={sortedBoxes}
                                onChangeItem={handleChangeItem}
                            />
                        </div>
                    </div>
                ) : (
                    <EmptyData />
                )}


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