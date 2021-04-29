import React from 'react';
import PropTypes from 'prop-types';
import { Route, useHistory, useRouteMatch } from 'react-router';

import useTrans from 'helper/useTrans';
import useColumns from './useColumns';
import warehouseApi from 'apis/warehouse';

import CustomTable from 'app/components/CustomTable';
import EmptyData from 'app/components/EmptyData';
import { dialog } from 'app/components/DialogNotify';
import ModalConfirmDelete from '../../ModalConfirmDelete';
import NeedPermission from 'app/components/NeedPermission';

import './index.scss';

const TableShelve = ({ data = [], onRefresh, onViewEdit }) => {
    const columns = useColumns();
    const [trans] = useTrans();
    const history = useHistory();
    const match = useRouteMatch();

    const handleConfirmDelete = (id) => {
        history.push(`${match.url}/delete-shelve/${id}`);
    }

    const handleDelete = (id) => {
        warehouseApi.shelve.delete(id)
            .then(() => {
                onRefresh && onRefresh();

                dialog.success(trans("warehouse.shelve.delete.success"));
            })
            .catch((err) => {
                console.error(err);

                dialog.error(trans("warehouse.shelve.delete.failure"));
            })
    }

    if (!data.length) return <EmptyData emptyText={trans("warehouse.shelve.list.empty")} />;

    return (
        <div className="table-goods-deliveries">

            <NeedPermission need={['shelves.delete']}>
                <Route path={`${match.path}/delete-shelve/:shelve_id`}>
                    {({ match }) => (
                        <ModalConfirmDelete
                            id={match?.params?.shelve_id}
                            show={match != null}
                            onConfirmed={handleDelete}
                            title={trans("warehouse.shelve.delete.title")}
                        />
                    )}
                </Route>
            </NeedPermission>

            <CustomTable
                columns={columns}
                rows={data}
                onDelete={handleConfirmDelete}
                onViewEdit={onViewEdit}
                rowKey="id"
                noSTT
                permissions={{
                    update: 'shelves.update',
                    delete: 'shelves.delete',
                }}
                isPagination={false}
            />
        </div>
    );
};

TableShelve.propTypes = {
    onRefresh: PropTypes.func
};

export default TableShelve;
