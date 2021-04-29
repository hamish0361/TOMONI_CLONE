import useDebounce from 'helper/useDebounce';
import useTrans from 'helper/useTrans';
import { DateRangePicker } from 'materialui-daterange-picker';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router';
import { Button } from 'reactstrap';

TopFilter.propTypes = {
    onSearch: PropTypes.func
};

function TopFilter({ onSearch }) {
    const [trans] = useTrans();
    const { id, currencyId } = useParams();

    const [prepare, setPrepare] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(null);

    const [openDate, setOpenDate] = useState(false);

    const prepareDebounce = useDebounce(prepare);
    const amountDebounce = useDebounce(amount);
    const descriptionDebounce = useDebounce(description);

    useEffect(() => {
        handleSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date, prepareDebounce, amountDebounce, descriptionDebounce]);

    const handleDateChange = ({ startDate, endDate }) => {
        const start = moment(startDate).format('yyyy-MM-DD');
        const end = moment(endDate).format('yyyy-MM-DD');

        setDate({
            startDate: start,
            endDate: end
        });
        setOpenDate(false);
    };

    const handleSearch = () => {
        var searchs = [
            `user_id:${id}`,
            `currency_id:${currencyId}`,
            'type_id:deposit'
        ];
        var fields = [`user_id:=`, `currency_id:=`, 'type_id:='];
        if (date) {
            searchs.push(`created_at:${date?.startDate},${date?.endDate}`);
            fields.push('created_at:between');
        }
        if (prepareDebounce) {
            searchs.push(`prepared_by_id:${prepareDebounce}`);
            fields.push('prepared_by_id:like');
        }
        if (amountDebounce) {
            searchs.push(`amount:${amountDebounce}`);
            fields.push('amount:like');
        }
        if (descriptionDebounce) {
            searchs.push(`desctiption:${descriptionDebounce}`);
            fields.push('description:like');
        }
        const params = {
            search: searchs.join(';'),
            searchFields: fields.join(';'),
            searchJoin: 'and'
        };

        onSearch(params);
    };

    const handleReset = () => {
        setPrepare('');
        setAmount('');
        setDescription('');
        setDate(null);
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
                        value={prepare}
                        onChange={e => setPrepare(e.target.value)}
                    />
                </div>
                {/* end prepare */}
                {/* begin amount */}
                <div className="col-md-3 form-group">
                    <label>
                        <FormattedMessage id="ACCOUNTING.AMOUNT" />
                    </label>
                    <input
                        className="form-control"
                        placeholder={trans(
                            'ACCOUNTING.ACCOUNT.PLACEHOLDER.AMOUNT'
                        )}
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
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
                        onChange={e => setDescription(e.target.value)}
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
