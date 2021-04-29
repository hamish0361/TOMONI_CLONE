import React from 'react';

import ListBoxForOrder from './ListBoxForOrder';
import Layout from 'app/modules/Warehouse/components/Layout';
import useTrans from 'helper/useTrans';

const TableSFAs = props => {
    const [trans] = useTrans();

    return (
        <Layout title={trans("MENU.WAREHOUSE.ASSIGN_BOXES")}>
            <ListBoxForOrder />
        </Layout>
    );
};

TableSFAs.propTypes = {

};

export default TableSFAs;