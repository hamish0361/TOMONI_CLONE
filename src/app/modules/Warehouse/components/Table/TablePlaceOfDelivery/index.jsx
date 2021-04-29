import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Route, useHistory, useRouteMatch } from 'react-router';

import useTrans from 'helper/useTrans';
import useColumns from './useColumns';
import warehouseApi from 'apis/warehouse';
import { placeOfDeliveryAction } from 'app/modules/Warehouse/warehouse-redux/placeOfDeliverySlice';

import CustomTable from 'app/components/CustomTable';
import EmptyData from 'app/components/EmptyData';
import { dialog } from 'app/components/DialogNotify';
import NeedPermission from 'app/components/NeedPermission';
import ModalConfirmDelete from '../../ModalConfirmDelete';

import './index.scss';

const TablePlaceOfDelivery = ({ onRefresh, onViewEdit }) => {
    const dataTable = useSelector(
        state => state.warehouse.placeOfDelivery.list.data
    );
    const pagination = useSelector(
        state => state.warehouse.placeOfDelivery.list.pagination
    );

    const columns = useColumns();
    const [trans] = useTrans();
    const history = useHistory();
    const match = useRouteMatch();
    const dispatch = useDispatch();

    const handleConfirmDelete = (id) => {
        history.push(`${match.url}/delete-place-of-deliveries/${id}`);
    }

    const handleDelete = (id) => {
        warehouseApi.placeOfDelivery.delete(id)
            .then(() => {
                onRefresh && onRefresh();

                dialog.success(trans("warehouse.place_of_delivery.delete.success"));
            })
            .catch((err) => {
                console.error(err);

                dialog.error(trans("warehouse.place_of_delivery.delete.failure"));
            })
    }

    const handlePageChange = (page) => {
        dispatch(placeOfDeliveryAction.changePagination({ page }));
    }

    if (!dataTable.length) return <EmptyData emptyText={trans("warehouse.place_of_delivery.list.empty")} />;

    return (
        <div className="table-place-of-deliveries">

            <NeedPermission need={['place-of-deliveries.delete']}>
                <Route path={`${match.path}/delete-place-of-deliveries/:pOD_id`}>
                    {({ match }) => (
                        <ModalConfirmDelete
                            id={match?.params?.pOD_id}
                            show={match != null}
                            onConfirmed={handleDelete}
                            title={trans("warehouse.place_of_delivery.delete.title")}
                        />
                    )}
                </Route>
            </NeedPermission>

            <CustomTable
                columns={columns}
                rows={dataTable}
                onDelete={handleConfirmDelete}
                onViewEdit={onViewEdit}
                rowKey="id"
                noSTT
                permissions={{
                    delete: ['place-of-deliveries.delete']
                }}
                page={pagination.page}
                lastpage={pagination.lastPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

TablePlaceOfDelivery.propTypes = {
    onRefresh: PropTypes.func
};

export default TablePlaceOfDelivery;
