import React, { useCallback, useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { useSelector } from 'react-redux';

import _ from 'lodash';
import useTrans from 'helper/useTrans';

import TMNBaseSelect from 'app/components/Select/BaseSelect';

import './index.scss';
import Loading from 'app/components/Loading';

const BoxFilter = ({ onSearch, loading }, ref) => {

    const [searchText, setSearchText] = useState('');
    const [searchField, setSearchField] = useState('sfa.tracking');
    const [trans] = useTrans();
    const agencies = useSelector(state => state.warehouse.agency.list);

    const options = useMemo(() => ([
        { value: 'id', label: trans("warehouse.sku.title") },
        { value: 'sfa.tracking', label: trans("warehouse.tracking.id") },
        { value: 'sfa', label: trans("warehouse.sfa.id") },
        { value: 'owners.objectable_id', label: trans("common.the_order") },
    ]), [trans]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const dispatchSearch = useCallback(_.debounce((_searchText, _searchField) => {

        let mySearchField = _searchField === 'all' ? '' : _searchField;

        if (mySearchField.length && _searchText.length) {
            onSearch && onSearch({ search: `${mySearchField}:${_searchText}`, searchFields: `${mySearchField}:like` });
        } else {
            onSearch && onSearch({ search: _searchText });
        }
    }, 1000), []);

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

    const getSearchFieldCpn = useMemo(() => {
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
        <div className="d-flex custom-filter-warehouse-sku">
            <div className="position-relative d-flex align-items-center">
                {loading && <Loading absolute={false} hideLoadingText />}
            </div>
            <TMNBaseSelect
                value={searchField}
                options={options}
                onChange={handleSearchFieldChange}
                className="p-3"
                loading={loading}
            />
            <div className="p-3 flex-grow-1">
                {getSearchFieldCpn}
            </div>
        </div>
    );
};

export default forwardRef(BoxFilter);