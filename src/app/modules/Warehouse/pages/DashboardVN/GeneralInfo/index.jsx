import React from 'react';
import { Card } from '_metronic/_partials/controls';
import EmptyData from 'app/components/EmptyData';

const GeneralInfo = props => {
    return (
        <div className="dashboard-vn__general-info">
            <Card>
                <EmptyData />
            </Card>
        </div>
    );
};

GeneralInfo.propTypes = {

};

export default GeneralInfo;