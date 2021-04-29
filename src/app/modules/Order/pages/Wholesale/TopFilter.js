import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import ReactDatePicker from 'react-datepicker';
import Select from 'react-select';
import moment from 'moment';
import 'assets/css/formatSelectDate.scss';

TopFilter.propTypes = {
    onSearch: PropTypes.func
};

function TopFilter({ onSearch, intl }) {
    const ref = useRef(null);
    const { statusList } = useSelector(
        ({ order }) => ({ statusList: order.status.list }),
        shallowEqual
    );
    const [startDate, setStartDate] = useState('');

    const options = [
        {
            value: 'all',
            label: intl.formatMessage({ id: 'GLOBAL.FILTER.ALL' })
        },
        {
            value: 'id',
            label: intl.formatMessage({ id: 'GLOBAL.FILTER.ORDER_ID' })
        },
        {
            value: 'note',
            label: intl.formatMessage({ id: 'GLOBAL.FILTER.NOTE' })
        },
        {
            value: 'customer',
            label: intl.formatMessage({ id: 'GLOBAL.FILTER.CUSTOMER' })
        },
        {
            value: 'status',
            label: intl.formatMessage({ id: 'GLOBAL.FILTER.STATUS' })
        },
        {
            value: 'created_at',
            label: intl.formatMessage({ id: 'GLOBAL.FILTER.CREATE_DATE' })
        },
        {
            value: 'product',
            label: intl.formatMessage({ id: 'GLOBAL.FILTER.JANCODE' })
        }
    ];

    const [values, setValues] = useState({
        type: 'all',
        status: '',
        search: ''
    });

    const handleChangeSearch = e => {
        const value = e.target.value;
        setValues({
            ...values,
            search: value
        });
        if (ref.current) {
            clearTimeout(ref.current);
        }
        ref.current = setTimeout(() => {
            if (onSearch && value.length > 0) {
                switch (values.type) {
                    case 'id':
                        onSearch({
                            search: `director.type.id:wholesale;id:${value}`,
                            searchFields: 'id:like;director.type.id:='
                        });
                        break;
                    case 'customer':
                        onSearch({
                            search: `director.type.id:wholesale;customer_id:${value}`,
                            searchFields: 'customer_id:like;director.type.id:='
                        });
                        break;
                    case 'note':
                        onSearch({
                            search: `director.type.id:wholesale;note:${value}`,
                            searchFields: 'note:like;director.type.id:='
                        });
                        break;
                    case 'product':
                        onSearch({
                            search: `director.type.id:wholesale;items.product_id:${value}`,
                            searchFields: `items.product_id:like;director.type.id:=`
                        });
                        break;
                    default:
                        onSearch({
                            search: `director.type.id:wholesale;${value}`,
                            searchFields: `director.type.id:=`
                        });
                        break;
                }
            } else {
                onSearch({
                    search: `director.type.id:wholesale`
                });
            }
        }, 500);
    };

    const handleSelectType = type => {
        setValues({
            ...values,
            type: type.value,
            search: ''
        });
        if (type.value === 'all') {
            onSearch({ search: `director.type.id:wholesale` });
        }
    };

    const handleSelectStatus = status => {
        if (status.value === 'all') {
            onSearch({
                search: `director.type.id:wholesale`,
                searchFields: `director.status.name:like`
            });
        } else {
            onSearch({
                search: `director.type.id:wholesale;director.status.id:${status.value}`,
                searchFields: `director.type.id:=;director.status.id:=`
            });
        }
    };
    const converDate = date => {
        return moment(date).format('yyyy-MM-DD');
    };

    const handleSelectDate = day => {
        setStartDate(day);
        const date = converDate(day);

        if (date === 'all') {
            onSearch({
                search: `director.type.id:wholesale`
            });
        } else {
            onSearch({
                search: `director.type.id:wholesale;created_at:${date}`
            });
        }
    };

    const statusOptions = statusList.map(item => {
        return {
            value: item.id,
            label: item.name
        };
    });

    return (
        <>
            <div className="form-group row">
                <div className="col-lg-2 col-md-3">
                    <Select
                        defaultValue={options[0]}
                        options={options}
                        onChange={handleSelectType}
                    />
                </div>
                {values.type === 'status' ? (
                    <div className="col-lg-10 col-md-9">
                        <Select
                            options={statusOptions}
                            onChange={handleSelectStatus}
                            placeholder={intl.formatMessage({
                                id: 'GLOBAL.SEARCH.PLACEHOLER_SELECT'
                            })}
                        />
                    </div>
                ) : values.type === 'created_at' ? (
                    <div className="col-lg-10 col-md-9">
                        <ReactDatePicker
                            className="react-datepicker-wrapper form-control "
                            style={{ width: '100%' }}
                            onChange={handleSelectDate}
                            placeholderText={intl.formatMessage({
                                id: 'GLOBAL.SEARCH.PLACEHOLER_SELECT_DATE'
                            })}
                            selected={startDate}
                        />
                    </div>
                ) : (
                    <div className="col-lg-10 col-md-9">
                        <input
                            type="text"
                            name="search"
                            value={values.search}
                            className="form-control"
                            placeholder={intl.formatMessage({
                                id: 'GLOBAL.SEARCH.PLACEHOLER_INPUT'
                            })}
                            onChange={handleChangeSearch}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default TopFilter;
