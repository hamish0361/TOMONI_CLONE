import { DateRangePicker } from 'materialui-daterange-picker';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button } from 'reactstrap';

TopFilter.propTypes = {
    onSearch: PropTypes.func
};

function TopFilter({ onSearch, intl }) {
    const { currency } = useSelector(
        ({ home }) => ({
            currency: home.home.currencyList
        }),
        shallowEqual
    );

    const [search, setSearch] = useState({
        currency: '',
        user: '',
        date: ''
    });

    const [searchFields, setSearchFields] = useState({
        currency: '',
        user: '',
        date: ''
    });

    const [currencySelected, setCurrencySelected] = useState(null);
    const [user, setUser] = useState('');
    const [date, setDate] = useState(null);
    const [openDate, setOpenDate] = useState(false);

    const handleCurrencyChange = currency => {
        setCurrencySelected(currency);

        var cloneSearch = {
            ...search,
            currency: `currency_id:${currency?.value}`
        };
        var cloneSearchField = {
            ...searchFields,
            currency: 'currency_id:='
        };
        handleSearch(cloneSearch, cloneSearchField);
    };

    const currencyOptions = currency?.map(item => {
        return {
            value: item.id,
            label: item.name
        };
    });

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

    const userRef = useRef(null);
    const handleUserChange = e => {
        const value = e.target.value;
        setUser(value);

        if (userRef.current) {
            clearTimeout(userRef.current);
        }

        userRef.current = setTimeout(() => {
            var cloneSearch = { ...search, user: `user_id:${value}` };
            var cloneSearchField = {
                ...searchFields,
                user: 'user_id:like'
            };
            handleSearch(cloneSearch, cloneSearchField);
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

    const handleReset = () => {
        setCurrencySelected(null);
        setUser('');
        setDate(null);
        onSearch({ search: '', searchFields: '', searchJoin: '' });
    };

    return (
        <div className="d-flex align-items-end">
            <div className="row" style={{ flex: '1 0' }}>
                <div className="col-md-4 form-group">
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
                                : intl.formatMessage({
                                      id: 'GLOBAL.SEARCH.PLACEHOLER_SELECT'
                                  })}
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
                <div className="col-md-4 form-group">
                    <label>
                        <FormattedMessage id="ACCOUNTING.ACCOUNT.CURRENCY" />
                    </label>
                    <Select
                        options={currencyOptions}
                        onChange={handleCurrencyChange}
                        value={currencySelected}
                        isClearable={true}
                        placeholder={intl.formatMessage({
                            id: 'ACCOUNTING.ACCOUNT.PLACEHOLDER.CURRENCY'
                        })}
                    />
                </div>
                <div className="col-md-4 form-group">
                    <label>
                        <FormattedMessage id="ACCOUNTING.USERNAME" />
                    </label>
                    <input
                        className="form-control"
                        placeholder={intl.formatMessage({
                            id: 'ACCOUNTING.ACCOUNT.PLACEHOLDER.USERNAME'
                        })}
                        onChange={handleUserChange}
                        value={user}
                    />
                </div>
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
