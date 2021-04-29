import { DateRangePicker } from 'materialui-daterange-picker';
import moment from 'moment';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { fetchUsers } from 'app/modules/AuthService/auth-service-redux/userSlice';
import NumberFormat from 'react-number-format';

TopFilter.propTypes = {
    onSearch: PropTypes.func
};

function TopFilter({ onSearch, intl }) {
    const [values, setValues] = useState();
    const [open, setOpen] = React.useState(false);
    const [dateRange, setDateRange] = useState(null);
    const [typeAmount, setTypeAmount] = useState(null);
    const [userId, setUserId] = useState(null);
    const dispatch = useDispatch();

    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');

    const { userList } = useSelector(state => state.authService.user);

    const { currencies } = useSelector(
        ({ home }) => ({
            currencies: home.home.currencyList
        }),
        shallowEqual
    );
    useEffect(() => {
        handleSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateRange, userId, typeAmount, values]);

    const handleChangeSearch = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    };

    const handleSelectTypeSearch = type => {
        setTypeAmount(type?.value);
    };
    const handleSelectUserSearch = type => {
        setUserId(type?.value);
    };

    // date range
    const handleDateChange = ({ startDate, endDate }) => {
        const start = moment(startDate).format('yyyy-MM-DD');
        const end = moment(endDate).format('yyyy-MM-DD');

        setDateRange({
            startDate: start,
            endDate: end
        });
        setOpen(false);
    };
    const typeCurrenciesOptions = currencies.map(item => {
        return {
            value: item.id,
            label: item.name
        };
    });
    const optionUser = userList?.map(item => {
        return {
            label: item?.email,
            value: item?.id
        };
    });

    // eslint-disable-next-line
    const handleSearchInput = useCallback(
        _.debounce((e, fetchData) => {
            if (e.length > 0) {
                const params = {
                    search: e,
                    searchFields: `email:like`
                };
                dispatch(fetchData(params));
            }
        }, 500),
        []
    );
    const handleMinAmountChange = e => {
        const value = e.target.value;
        setMinAmount(value);
    };

    const maxRef = useRef(null);
    const handleMaxAmountChange = e => {
        const max = e.target.value;
        setMaxAmount(max);

        if (maxRef.current) clearTimeout(maxRef.current);

        maxRef.current = setTimeout(() => {
            const maxNumber =
                typeof max === 'string' && max.includes(',')
                    ? max.replaceAll(',', '')
                    : max;

            const minNumber =
                typeof minAmount === 'string' && minAmount.includes(',')
                    ? minAmount.replaceAll(',', '')
                    : minAmount;
            if (+maxNumber >= +minNumber) {
                //search transaction
                var searchs = ['type_id:payment-sale'];
                var fields = ['type_id:='];
                //search receipt
                var searchReceipt = ['transaction.type_id:payment-sale'];
                var fieldReceipt = ['transaction.type_id:='];

                searchs.push(`amount:${minNumber},${maxNumber}`);
                fields.push('amount:between');
                searchReceipt.push(
                    `transaction.amount:${minNumber},${maxNumber}`
                );
                fieldReceipt.push('transaction.amount:between');

                const params = {
                    search: searchs.join(';'),
                    searchFields: fields.join(';'),
                    searchJoin: 'and'
                };
                const paramsReceipt = {
                    search: searchReceipt.join(';'),
                    searchFields: fieldReceipt.join(';'),
                    searchJoin: 'and'
                };
                onSearch(params, paramsReceipt);
            }
        }, 500);
    };
    const toggle = () => setOpen(!open);

    const handleSearch = () => {
        var searchs = ['type_id:payment-sale'];
        var fields = ['type_id:='];
        var searchReceipt = ['transaction.type_id:payment-sale'];
        var fieldReceipt = ['transaction.type_id:='];
        if (dateRange) {
            const start = moment(dateRange.startDate).format('yyyy-MM-DD');
            const end = moment(dateRange.endDate).format('yyyy-MM-DD');
            searchs.push(`created_at:${start},${end}`);
            fields.push('created_at:between');
            searchReceipt.push(`transaction.created_at:${start},${end}`);
            fieldReceipt.push('transaction.created_at:between');
        }
        if (typeAmount) {
            searchs.push(`currency_id:${typeAmount}`);
            fields.push('currency_id:=');
            searchReceipt.push(`transaction.currency_id:${typeAmount}`);
            fieldReceipt.push('transaction.currency_id:=');
        }
        if (userId) {
            searchs.push(`user_id:${userId}`);
            fields.push('user_id:like');
            searchReceipt.push(`transaction.user_id:${userId}`);
            fieldReceipt.push('transaction.user_id:like');
        }
        if (values?.prepared_by_id) {
            searchs.push(`prepared_by_id:${values?.prepared_by_id}`);
            fields.push('prepared_by_id:like');
            searchReceipt.push(
                `transaction.prepared_by_id:${values?.prepared_by_id}`
            );
            fieldReceipt.push('transaction.prepared_by_id:like');
        }
        if (values?.amount_1) {
            searchs.push(`amount:${values?.amount_1},100000000000`);
            fields.push('amount:between');
            searchReceipt.push(
                `transaction.amount:${values?.amount_1},100000000000`
            );
            fieldReceipt.push('transaction.amount:between');
        }
        if (values?.amount_2) {
            searchs.push(`amount:0,${values?.amount_2}`);
            fields.push('amount:between');
            searchReceipt.push(`transaction.amount:0,${values?.amount_2}`);
            fieldReceipt.push('transaction.amount:between');
        }
        if (values?.amount_1 && values?.amount_2) {
            searchs.push(`amount:${values?.amount_1},${values?.amount_2}`);
            fields.push('amount:between');
            searchReceipt.push(
                `transaction.amount:${values?.amount_1},${values?.amount_2}`
            );
            fieldReceipt.push('transaction.amount:between');
        }
        if (values?.type_order) {
            searchs.push(`receipts.receiptable_id:${values?.type_order}`);
            fields.push('receipts.receiptable_id:like');
            searchReceipt.push(`receiptable_id:${values?.type_order}`);
            fieldReceipt.push('receiptable_id:like');
        }
        if (values?.description) {
            searchs.push(`description:${values?.description}`);
            fields.push('description:like');
            searchReceipt.push(
                `transaction.description:${values?.description}`
            );
            fieldReceipt.push('transaction.description:like');
        }

        const params = {
            search: searchs.join(';'),
            searchFields: fields.join(';'),
            searchJoin: 'and'
        };
        const paramsReceipt = {
            search: searchReceipt.join(';'),
            searchFields: fieldReceipt.join(';'),
            searchJoin: 'and'
        };
        onSearch(params, paramsReceipt);
    };
    return (
        <>
            <div className="form-group row">
                <div className="col-lg-3 col-md-3">
                    <div className="position-absolute">
                        <DateRangePicker
                            open={open}
                            toggle={toggle}
                            onChange={handleDateChange}
                        />
                    </div>
                    <div
                        className="form-control d-flex justify-content-between align-items-center"
                        onClick={() => setOpen(true)}
                    >
                        <span>
                            {dateRange
                                ? `${dateRange?.startDate} - ${dateRange?.endDate}`
                                : 'Chọn thời gian tìm kiếm'}
                        </span>
                        <div className="d-flex align-items-center">
                            {dateRange && (
                                <i
                                    className="flaticon2-delete icon-sm text-bolder text-dark opacity-30 mr-4 p-2"
                                    onClick={() => setDateRange(null)}
                                />
                            )}
                            <i
                                className="flaticon-event-calendar-symbol"
                                onClick={() => setOpen(true)}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-lg-3 col-md-3">
                    <Select
                        placeholder="Chọn loại tiền tệ"
                        options={typeCurrenciesOptions}
                        onChange={handleSelectTypeSearch}
                        isClearable={true}
                    />
                </div>
                <div className="col-lg-3 col-md-3">
                    <Select
                        placeholder="Chọn người dùng"
                        options={optionUser}
                        onChange={handleSelectUserSearch}
                        isClearable={true}
                        onInputChange={e => handleSearchInput(e, fetchUsers)}
                    />
                </div>
                <div className="col-lg-3 col-md-3">
                    <input
                        type="text"
                        name="prepared_by_id"
                        className="form-control"
                        placeholder="Nhập nhập người thực hiện"
                        onChange={handleChangeSearch}
                    />
                </div>
            </div>
            <div className="form-group row pl-4">
                <div className="col-lg-3 col-md-3">
                    <div className="form-group row">
                        <NumberFormat
                            name="minAmount"
                            thousandSeparator
                            style={{ width: '45%' }}
                            className="form-control"
                            placeholder="MIN"
                            value={minAmount}
                            onChange={handleMinAmountChange}
                        />
                        <span className="m-2 font-weight-bolder">-</span>
                        <NumberFormat
                            name="maxAmount"
                            thousandSeparator
                            style={{ width: '45%' }}
                            className="form-control"
                            placeholder="MAX"
                            value={maxAmount}
                            onChange={handleMaxAmountChange}
                        />
                    </div>
                </div>
                <div className="col-lg-3 col-md-3">
                    <input
                        type="text"
                        name="type_order"
                        className="form-control"
                        placeholder="Nhập mã đơn bán"
                        onChange={handleChangeSearch}
                    />
                </div>
                <div className="col-lg-3 col-md-3">
                    <input
                        type="text"
                        name="description"
                        className="form-control"
                        placeholder="Nhập mô tả"
                        onChange={handleChangeSearch}
                    />
                </div>
            </div>
        </>
    );
}

export default TopFilter;
