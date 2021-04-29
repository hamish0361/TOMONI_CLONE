import React from 'react';

import useTrans from 'helper/useTrans';

import Layout from '../../components/Layout';
import SimpleTabs, { TabPanel } from 'app/components/Tabs/Simple';
import TableSFAs from './TableSFAs';
import StoragePallet from './StoragePallet';
import NeedPermission from 'app/components/NeedPermission';
import StorageBox from './StorageBox';

const StorageSFAPage = props => {

    const [trans] = useTrans();

    return (
        <Layout title={trans("warehouse.storage_goods")}>
            <SimpleTabs labels={[
                trans("warehouse.sfa.list"),
                trans("warehouse.storage_sfa.direct_storage.title"),
                trans("warehouse.storage_sfa.storage_box.title")
            ]}>
                <TabPanel>
                    <TableSFAs />
                </TabPanel>
                
                <TabPanel>
                    <NeedPermission need={['pallets.update']}>
                        <StoragePallet />
                    </NeedPermission>
                </TabPanel>
                
                <TabPanel>
                    <StorageBox />
                </TabPanel>
            </SimpleTabs>
        </Layout>
    );
};

StorageSFAPage.propTypes = {

};

export default StorageSFAPage;