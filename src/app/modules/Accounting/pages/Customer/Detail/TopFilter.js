import useTrans from 'helper/useTrans';
import { DateRangePicker } from 'materialui-daterange-picker';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';
import { useParams } from 'react-router';
import { Button } from 'reactstrap';

TopFilter.propTypes = {
    onSearch: PropTypes.func
};

const DEPOSIT_TYPE = 'deposit';
const PAYMENT_SALE_TYPE = 'payment-sale';

function TopFilter({ onSearch }) {
    const [trans] = useTrans();
    const { id, currencyId } = useParams();

    const [search, setSearch] = useState({
        currency: `currency_id:${currencyId}`,
        user: `user_id:${id}`,
        prepare: '',
        type: `type_id:${DEPOSIT_TYPE},${PAYMENT_SALE_TYPE}`,
        date: '',
        description: '',
        amount: ''
    });

    const [searchFields, setSearchFields] = useState({
        currency: 'currency_id:=',
        user: 'user_id:=',
        type: 'type_id:in',
        date: '',
        prepare: '',
        description: '',
        amount: ''
    });

    const [user, setUser] = useState('');

    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');

    const [description, setDescription] = useState('');
    const [date, setDate] = useState(null);

    const [openDate, setOpenDate] = useState(false);

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
            var cloneSearch = { ...search, prepare: `prepared_by_id:${value}` };
            var cloneSearchField = {
                ...searchFields,
                prepare: 'prepared_by_id:like'
            };
            handleSearch(cloneSearch, cloneSearchField);
        }, 500);
    };

    const descriptionRef = useRef(null);
    const handleDescriptionChange = e => {
        const value = e.target.value;
        setDescription(value);

        if (descriptionRef.current) {
            clearTimeout(descriptionRef.current);
        }

        descriptionRef.current = setTimeout(() => {
            var cloneSearch = {
                ...search,
                description: `description:${value}`
            };
            var cloneSearchField = {
                ...searchFields,
                description: 'description:like'
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

    const handleReset = () => {
        setUser('');
        setMinAmount('');
        setMaxAmount('');
        setDescription('');
        setDate(null);
        onSearch({
            search: `user_id:${id};currency_id:${currencyId};type_id:${DEPOSIT_TYPE},${PAYMENT_SALE_TYPE}`,
            searchFields: `user_id:=;currency_id:=;type_id:in`,
            searchJoin: 'and'
        });
    };

    return (
        <div className="input-group align-items-center">
            <div className="row mr-4" style={{ flex: '1 0' }}>
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
                {/* begin prepare */}
                <div className="col-md-3 form-group">
                    <label>
                        <FormattedMessage id="ACCOUNTING.PERFORMER" />
                    </label>
                    <input
                        className="form-control"
                        placeholder={trans(
                            'ACCOUNTING.ACCOUNT.PLACEHOLDER.PERFORMER'
                        )}
                        value={user}
                        onChange={handleUserChange}
                    />
                </div>
                {/* end prepare */}
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
                {/* begin description */}
                <div className="col-md-3 form-group">
                    <label>
                        <FormattedMessage id="ACCOUNTING.DESCRIPTION" />
                    </label>
                    <input
                        className="form-control"
                        placeholder={trans('GLOBAL.SEARCH.PLACEHOLER_INPUT')}
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                </div>
                {/* end description */}
            </div>
            <Button color="primary" onClick={handleReset}>
                Reset
            </Button>
        </div>
    );
}

export default TopFilter;
