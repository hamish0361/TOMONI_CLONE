import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { settingsAction } from 'app/modules/Warehouse/warehouse-redux/settingSlice';
import useTrans from 'helper/useTrans';

import SelectArea from 'app/modules/Warehouse/components/SelectArea';

import './index.scss';

const DefaultArea = props => {
    const default_area = useSelector(
        state => state.warehouse.settings.default_area
    );

    const dispatch = useDispatch();
    const [trans] = useTrans();

    const handleChange = (selectedOptions) => {
        dispatch(settingsAction.changeDefaultArea(selectedOptions))
    };

    return (
        <div className="row default-area mt-3">
            <div className="col-lg-4 custom-label">{trans("warehouse.settings.default_area")}:</div>
            <div className="col-lg-6">
                <SelectArea 
                    value={default_area}
                    onChange={handleChange}
                    showLabel={false}
                />
            </div>
        </div>
    );
};

DefaultArea.propTypes = {};

export default DefaultArea;
