import React, { useEffect, useState } from 'react';

import useTrans from 'helper/useTrans';
import { useSelector } from 'react-redux';
import warehouseApi from 'apis/warehouse';

import SimpleTabs, { TabPanel } from 'app/components/Tabs/Simple';
import TransferProduct from './TransferProduct';
import GeneralInfo from './GeneralInfo';
import Layout from '../../components/Layout';

import './index.scss';

const WHDashboard = props => {

    const defaultArea = useSelector(state => state.warehouse.settings.default_area);
    const [trans] = useTrans();
    const [layoutTitle, setLayoutTitle] = useState(trans("warehouse.dashboard_vn.unindentify_area"));

    useEffect(() => {
        if (defaultArea) {
            warehouseApi.area.fetchArea(defaultArea)
                .then((res) => {
                    setLayoutTitle(res.name)
                })
        }
    }, [defaultArea]);

    return (
        <Layout title={layoutTitle}>
            <div className="p-4 wh-dashboard-vn">
                <SimpleTabs labels={[
                    trans("warehouse.dashboard_vn.general_info.title"),
                    trans("warehouse.dashboard_vn.transfer_product.title"),
                ]}>

                    <TabPanel>
                        <GeneralInfo />
                    </TabPanel>

                    <TabPanel>
                        <TransferProduct />
                    </TabPanel>

                </SimpleTabs>
            </div>
        </Layout>
    );
};

WHDashboard.propTypes = {

};

export default WHDashboard;