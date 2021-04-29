import React from 'react';
import PropTypes from 'prop-types';

import useColumns from './useColumns';
import useTrans from 'helper/useTrans';

import CustomTable from 'app/components/CustomTable';
import EmptyData from 'app/components/EmptyData';

import './index.scss';

const TableOutPickers = ({ data = [], ...props }) => {

    const columns = useColumns();
    const [trans] = useTrans();

    if (!data.length) return <EmptyData emptyText={trans("warehouse.out_pickers.list.empty.title")} />;

    return (
        <div className="table-out-pickers">
            <CustomTable
                rows={data}
                columns={columns}
                rowKey="id"
                noSTT
                isPagination={false}
                {...props}
            />
        </div>
    );
};

TableOutPickers.propTypes = {
    data: PropTypes.array,
};

export default TableOutPickers;