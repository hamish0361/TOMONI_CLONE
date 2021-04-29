import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchShelveFromArea, fetchShelvesForWHModel, whModelAction } from 'app/modules/Warehouse/warehouse-redux/whModelSlice';

import { Card, CardBody } from '_metronic/_partials/controls';
import SelectArea from 'app/modules/Warehouse/components/SelectArea';
import SelectShelve from 'app/components/Select/SelectShelve';
import SelectPallet from 'app/components/Select/SelectPallet';
import SelectLocation from 'app/components/Select/SelectLocation';

const FilterSection = props => {

    const defaultArea = useSelector(state => state.warehouse.settings.default_area);
    const filter = useSelector(state => state.warehouse.whModel.filter);
    const dispatch = useDispatch();
    const isMounted = useRef(false);

    useEffect(() => {
        if (defaultArea && !isMounted.current) {
            dispatch(whModelAction.changeFilter({ area_id: defaultArea }));
            dispatch(fetchShelvesForWHModel());
        }

        isMounted.current = true;
    }, [defaultArea]); // eslint-disable-line

    const handleChangeFilter = (newFP) => {
        dispatch(whModelAction.changeFilter(newFP));
    }

    const handleResetFilter = () => {
        dispatch(whModelAction.resetFilter());
        dispatch(fetchShelveFromArea());
    }

    const handleFilter = () => {
        dispatch(fetchShelvesForWHModel());
    }

    return (
        <Card>
            <CardBody>
                <div className="row">
                    <div className="col-lg-4 col-sm-6 p-3">
                        <SelectArea value={filter['area_id'] || ''} onChange={(v) => handleChangeFilter({ 'area_id': v })} />
                    </div>
                    <div className="col-lg-4 col-sm-6 p-3">
                        <SelectShelve value={filter['id'] || ''} onChange={(v) => handleChangeFilter({ 'id': v })} />
                    </div>
                    <div className="col-lg-4 col-sm-6 p-3">
                        <SelectLocation value={filter['locations.id'] || ''} onChange={(v) => handleChangeFilter({ 'locations.id': v })} />
                    </div>
                    <div className="col-lg-4 col-sm-6 p-3">
                        <SelectPallet value={filter['locations.pallets.id'] || ''} onChange={(v) => handleChangeFilter({ 'locations.pallets.id': v })} />
                    </div>
                    <div className="col-lg-4 col-sm-6 p-3">
                        <div className="form-group">
                            <label htmlFor="">SKU</label>
                            <input
                                value={filter['locations.pallets.pivotBoxes.box_id'] || ''}
                                className="form-control"
                                onChange={(e) => { handleChangeFilter({ 'locations.pallets.pivotBoxes.box_id': e.target.value }) }}
                            />
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <button className="btn btn-secondary" onClick={handleResetFilter}>Bỏ lọc</button>
                    <button className="btn btn-primary ml-3" onClick={handleFilter}>Lọc</button>
                </div>
            </CardBody>
        </Card>
    );
};

FilterSection.propTypes = {

};

export default FilterSection;