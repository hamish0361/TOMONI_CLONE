import React, { useCallback, useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { useSelector } from 'react-redux';

import _ from 'lodash';
import useTrans from 'helper/useTrans';

import TMNBaseSelect from 'app/components/Select/BaseSelect';

import './index.scss';

const SFAFilter = ({ onSearch }, ref) => {

    const [searchText, setSearchText] = useState('');
    const [searchField, setSearchField] = useState('tracking');
    const [trans] = useTrans();
    const agencies = useSelector(state => state.warehouse.agency.list);

    const options = useMemo(() => ([
        { value: 'all', label: trans("common.all") },
        { value: 'id', label: trans("warehouse.sfa.id") },
        { value: 'tracking', label: trans("warehouse.tracking.id") },
        { value: 'agency_id', label: trans("common.agency") },
    ]), [trans]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const dispatchSearch = useCallback(_.debounce((_searchText, _searchField) => {

        let mySearchField = _searchField === 'all' ? '' : _searchField;

        if (mySearchField.length && _searchText.length) {
            onSearch && onSearch({ search: `${mySearchField}:${_searchText}`, searchFields: `${mySearchField}:like` });
        } else {
            onSearch && onSearch({ search: _searchText });
        }
    }, 700), []);

    useImperativeHandle(ref, () => ({
        reset: () => {
            setSearchText('');
            setSearchField('');
        }
    }))

    const handleSearchTextChange = (e) => {
        setSearchText(e.target.value);

        dispatchSearch(e.target.value, searchField);
    }

    const handleSearchFieldChange = (option) => {
        setSearchField(option.value);

        if (searchText.length) {
            setSearchText('');
            dispatchSearch('', option.value);
        }
    }

    const handleAgencyChange = (option) => {
        setSearchText(option.value);

        dispatchSearch(option.value, searchField);
    }

    const getSearchFieldCpn = useMemo(() => {
        if (searchField === 'agency_id')
            return (
                <TMNBaseSelect
                    value={searchText}
                    options={agencies.map(a => ({ value: a.id, label: a.name }))}
                    onChange={handleAgencyChange}
                />
            )

        return (
            <input
                type="text"
                className="form-control search-input"
                placeholder="Search"
                onChange={handleSearchTextChange}
                value={searchText}
            />
        )
    }, [searchField, searchText, agencies]); // eslint-disable-line

    return (
        <div className="d-flex custom-filter-warehouse-sfa">
            <TMNBaseSelect
                value={searchField}
                options={options}
                onChange={handleSearchFieldChange}
                className="p-3"
            />
            <div className="p-3 flex-grow-1">
                {getSearchFieldCpn}
            </div>
        </div>
    );
};

export default forwardRef(SFAFilter);