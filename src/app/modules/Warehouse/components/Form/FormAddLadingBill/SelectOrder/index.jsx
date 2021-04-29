import React, { useCallback, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import _ from 'lodash';
import { fetchOrder } from 'app/modules/Order/order-redux/orderSlice';
import useTrans from 'helper/useTrans';

import Select from 'react-select';

const SelectOrder = ({ customer_id, onChange }) => {
    const [trans] = useTrans();

    const personalOption = { value: 'user', label: trans("warehouse.sku.of_customer") };
    const [orderSelected, setOrderSelected] = useState(personalOption);
    const orderList = useSelector(state => state.order.list.orderList)
    const isLoading = useSelector(state => state.order.list.isLoading)

    const dispatch = useDispatch();

    // Clear giá trị của cái select order khi close form
    useEffect(() => {
        return () => {
            setOrderSelected(personalOption);
        }
    }, []); // eslint-disable-line

    useEffect(() => {
        onChange && onChange(orderSelected.value);
    }, [orderSelected]); // eslint-disable-line

    // Call api lấy danh sách order khi customer_id thay đổi
    // Nếu lấy được giá trị thì dùng luôn giá trị đầu tiên làm value
    useEffect(() => {
        if (!customer_id) return;
        searchOrder({ search: `customer_id:${customer_id}` });
        setOrderSelected(personalOption);

    }, [customer_id]); // eslint-disable-line

    const searchOrder = useCallback((params) => {
        dispatch(fetchOrder({ orderBy: 'created_at', sortedBy: 'desc', ...params }));
    }, [dispatch]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleInputChange = useCallback(_.debounce(value => {
        if (value)
            searchOrder({
                search: `customer_id:${customer_id};id:${value}`,
                searchFields: `id:like;customer_id:like`,
                searchJoin: 'and'
            });
    }, 700), [customer_id]);

    const makeOption = (i) => ({
        value: i.id,
        label: trans("warehouse.order.option_title", { id: i.id, type_name: i.type.name, status_name: i.status.name })
    });

    const orderOptions = useMemo(() => {
        const orderOptions = orderList.map(order => makeOption(order));

        return [personalOption, ...orderOptions];
    }, [orderList]); // eslint-disable-line

    const handleSelectOrder = (option) => {
        setOrderSelected(option);
    }

    return (
        <Select
            isDisabled={!customer_id}
            isLoading={isLoading}
            placeholder={trans("warehouse.order.select_title")}
            options={orderOptions}
            onChange={
                handleSelectOrder
            }
            onInputChange={
                handleInputChange
            }
            value={orderSelected}
        />
    );
};

SelectOrder.propTypes = {
    customer_id: PropTypes.string,
    onChange: PropTypes.func
};

export default SelectOrder;