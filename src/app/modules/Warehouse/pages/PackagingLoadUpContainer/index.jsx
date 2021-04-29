import React from 'react';

import Layout from 'app/modules/Warehouse/components/Layout';
import TargetSection from './TargetSection';
import useTrans from 'helper/useTrans';
import PalletManagement from './PalletManagement';
import DownloadCSV from './DownloadCSV';

const PackagingLoadUpContainer = props => {

    const [trans] = useTrans();

    return (
        <Layout title={trans("MENU.WAREHOUSE.PACKAGING_LOAD_UP_CONTAINER")}>
            <div className="load-up-container">
                <DownloadCSV />
                <div className="row">
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <TargetSection />
                    </div>
                    <div className="col-lg-8 col-md-8 col-sm-12">
                        <PalletManagement />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

PackagingLoadUpContainer.propTypes = {

};

export default PackagingLoadUpContainer;