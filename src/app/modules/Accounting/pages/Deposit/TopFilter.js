import useTrans from 'helper/useTrans';
import { DateRangePicker } from 'materialui-daterange-picker';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';
import { shallowEqual, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button } from 'reactstrap';

TopFilter.propTypes = {
    onSearch: PropTypes.func
};

function TopFilter({ onSearch }) {
    const [trans] = useTrans();
    const { sourceOfCashes } = useSelector(
        ({ accounting }) => ({
            sourceOfCashes: accounting.deposit.sourceOfCashList
        }),
        shallowEqual
    );

    const [search, setSearch] = useState({
        sourceOfCash: '',
        user: '',
        date: ''
    });

    const [searchFields, setSearchFields] = useState({
        sourceOfCash: '',
        user: '',
        date: ''
    });

    const [sourceOfCash, setSourceOfCash] = useState(null);
    const [user, setUser] = useState('');
    const [openDate, setOpenDate] = useState(false);
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');

    const [date, setDate] = useState(null);

    const handleDateChange = ({ startDate, endDate }) => {
        const start = moment(startDate).format('yyyy-MM-DD');
        const end = moment(endDate).format('yyyy-MM-DD');
        setDate({
            startDate: start,
            endDate: end
        });
        setOpenDate(false);

        var cloneSearch = {
            ...search,
            date: `created_at:${start},${end}`
        };
        var cloneSearchField = {
            ...searchFields,
            date: 'created_at:between'
        };
        handleSearch(cloneSearch, cloneSearchField);
    };

    const handleSourceOfCashChange = sourceOfCash => {
        setSourceOfCash(sourceOfCash);

        var cloneSearch = {
            ...search,
            sourceOfCash: `source_of_cash_id:${sourceOfCash?.value}`
        };
        var cloneSearchField = {
            ...searchFields,
            sourceOfCash: 'source_of_cash_id:='
        };
        handleSearch(cloneSearch, cloneSearchField);
    };

    const userRef = useRef(null);
    const handleUserChange = e => {
        const value = e.target.value;
        setUser(value);

        if (userRef.current) {
            clearTimeout(userRef.current);
        }

        userRef.current = setTimeout(() => {
            var cloneSearch = { ...search, user: `importer_id:${value}` };
            var cloneSearchField = {
                ...searchFields,
                user: 'importer_id:like'
            };
            handleSearch(cloneSearch, cloneSearchField);
        }, 500);
    };

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
                var cloneSearch = {
                    ...search,
                    amount: `amount:${minNumber},${maxNumber}`
                };
                var cloneSearchField = {
                    ...searchFields,
                    amount: 'amount:between'
                };
                handleSearch(cloneSearch, cloneSearchField);
            }
        }, 500);
    };

    const handleSearch = (search, searchField) => {
        setSearch(search);
        setSearchFields(searchField);
        const searchArr = Object.values(search).filter(x => x !== '');
        const searchFieldArr = Object.values(searchField).filter(x => x !== '');

        const params = {
            search: searchArr.join(';'),
            searchFields: searchFieldArr.join(';'),
            searchJoin: 'and'
        };
        onSearch(params);
    };

    const sourceOfCashesOptions = sourceOfCashes?.map(item => {
        return {
            value: item.id,
            label: item.name
        };
    });

    const handleReset = () => {
        setSourceOfCash(null);
        setMinAmount('');
        setMaxAmount('');
        setUser('');
        setDate(null);
        onSearch({ search: '', searchFields: '', searchJoin: '' });
    };

    return (
        <div className="d-flex align-items-end">
            <div className="row" style={{ flex: '1 0' }}>
                <div className="col-md-3 form-group">
                    <label>
                        <FormattedMessage id="ACCOUNTING.ACCOUNT.CREATED_AT" />
                    </label>
                    <div className="position-absolute">
                        <DateRangePicker
                            open={openDate}
                            toggle={() => setOpenDate(!openDate)}
                            onChange={handleDateChange}
                        />
                    </div>
                    <div className="form-control d-flex justify-content-between align-items-center">
                        <span
                            onClick={() => setOpenDate(true)}
                            className="w-100"
                        >
                            {date
                                ? `${date?.startDate} - ${date?.endDate}`
                                : trans('GLOBAL.SEARCH.PLACEHOLER_SELECT')}
                        </span>
                        <div className="d-flex align-items-center">
                            {date && (
                                <i
                                    className="flaticon2-delete icon-sm text-bolder text-dark opacity-30 mr-4 p-2"
                                    onClick={() => setDate(null)}
                                />
                            )}
                            <i
                                className="flaticon-event-calendar-symbol"
                                onClick={() => setOpenDate(true)}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-3 form-group">
                    <label>
                        <FormattedMessage id="ACCOUNTING.SOURCE_OF_CASH" />
                    </label>
                    <Select
                        options={sourceOfCashesOptions}
                        onChange={handleSourceOfCashChange}
                        isClearable={true}
                        placeholder={trans(
                            'ACCOUNTING.ACCOUNT.PLACEHOLDER.CURRENCY'
                        )}
                        value={sourceOfCash}
                    />
                </div>
                <div className="col-md-3 form-group">
                    <label>
                        <FormattedMessage id="ACCOUNTING.DEPOSIT_NAME" />
                    </label>
                    <input
                        className="form-control"
                        placeholder={trans(
                            'ACCOUNTING.PLACEHOLDER.DEPOSIT_NAME'
                        )}
                        onChange={handleUserChange}
                        value={user}
                    />
                </div>
                {/* begin amount */}
                <div className="col-md-3 form-group">
                    <label>
                        <FormattedMessage id="ACCOUNTING.AMOUNT" />
                    </label>
                    <div className="d-flex align-items-center">
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
                {/* end amount */}
            </div>
            <Button
                color="primary"
                className="form-group ml-4"
                onClick={handleReset}
            >
                Reset
            </Button>
        </div>
    );
}

export default TopFilter;
