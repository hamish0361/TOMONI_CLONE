import React, {useMemo} from 'react';
import { useLocation } from 'react-router-dom';

import queryString from 'query-string';

import FilterJancodeExtraData from './FilterJancodeExtraData';
import FilterTrackingExtraData from './FilterTrackingExtraData';

import './index.scss';

const FilterExtraData = props => {

    const location = useLocation();

    const locationSearch = useMemo(() => {
        return queryString.parse(location.search);
    }, [location]);

    if(locationSearch['items.product_id']) return <FilterJancodeExtraData />

    if(locationSearch['sfa.tracking']) return <FilterTrackingExtraData />

    return <></>;
};

FilterExtraData.propTypes = {
    
};

export default FilterExtraData;