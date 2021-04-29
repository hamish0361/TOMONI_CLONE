import React, { useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import warehouseApi from 'apis/warehouse';
import useTrans from 'helper/useTrans';
import formatNumber from 'helper/formatNumber';
import ModalConfirm from '../../ModalConfirm';

import {
    Box,
    makeStyles,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Pagination } from '@material-ui/lab';
import { dialog } from 'app/components/DialogNotify';
import EmptyData from 'app/components/EmptyData';
import NeedPermission from 'app/components/NeedPermission';
import EditableText from 'app/components/EditableText';

import './index.scss';
import Owner from './Owner';

const useStyles = makeStyles(theme => ({
    root: {},
    pagination: {
        display: 'flex',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        justifyContent: 'flex-end'
    }
}));

const TableBoxOrders = ({ onRefresh, data = [], pagination = {}, onPageChange }) => {
    const classes = useStyles();
    const [trans] = useTrans();
    const modalConfirmRef = useRef();

    const getCellElement = (row, column) => {
        if (column.render) return column.render(_.get(row, column.id), row);

        return _.get(row, column.id);
    };

    const handleDelete = ({ id }) => {
        warehouseApi.boxOwner
            .delete(id)
            .then(() => {
                dialog.success(trans("warehouse.sku.owner.delete.success"));
                onRefresh && onRefresh();
            })
            .catch(() => {
                dialog.error(trans("warehouse.sku.owner.delete.failure"));
            });
    };

    const confirmDeleteBoxItem = record => {
        modalConfirmRef.current.open({
            title: trans("warehouse.sku.owner.delete.title"),
            id: record.id
        });
    };

    const columns = useMemo(() => ([
        {
            id: 'objectable_id', title: trans("warehouse.sku.owner.title"), render: (objectable_id, { object, objectable_type }) => (
                <Owner objectable_id={objectable_id} object={object} objectable_type={objectable_type} />
            )
        },
        {
            id: 'quantity', title: trans("common.quantity"), render: (quantity, row) => {
                return (
                    <NeedPermission need={['owning-boxes.update']} fallback={(<span>{formatNumber(quantity)}</span>)}>
                        <EditableText
                            text={formatNumber(quantity)}
                            value={quantity}
                            type="number"
                            onChange={(value) => handleChangeQuantity(value, row)}
                        />
                    </NeedPermission>
                )
            }
        },
    ]), []); // eslint-disable-line

    const handleChangeQuantity = (value, row) => {
        dispatchToApi(value, row)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const dispatchToApi = useCallback(_.debounce((v, row) => {
        warehouseApi.boxOwner.update(row?.id, { quantity: v })
            .then(() => {
                dialog.success(trans("warehouse.sku.owner.update.success"));

                onRefresh && onRefresh();
            })
            .catch((err) => {

                let errMessage = trans("warehouse.sku.owner.update.failure");

                if (err?.response?.data?.errors?.quantity) errMessage = err.response.data.errors.quantity

                dialog.error(errMessage);
            })

    }, 700), []); // eslint-disable-line

    if (!data.length) return <EmptyData emptyText={trans("warehouse.sku.owner.empty")} />

    return (
        <>
            <ModalConfirm ref={modalConfirmRef} onOk={handleDelete} />

            <PerfectScrollbar>
                <Box>
                    <Table className="table-box-owners">
                        <TableHead>
                            <TableRow>
                                {columns.map(column => (
                                    <TableCell key={column.id}>
                                        {column.title}
                                    </TableCell>
                                ))}
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {data.map(row => (
                                <TableRow hover key={row[columns[0].id]}>
                                    {columns.map(column => (
                                        <TableCell key={column.id}>
                                            {getCellElement(row, column)}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <NeedPermission need={['owning-boxes.delete']}>
                                            <Button
                                                color="primary"
                                                size="small"
                                                onClick={() =>
                                                    confirmDeleteBoxItem(row)
                                                }
                                            >
                                                {trans("common.delete")}
                                            </Button>
                                        </NeedPermission>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination
                        className={classes.pagination}
                        count={pagination.lastPage}
                        page={pagination.page}
                        shape="rounded"
                        onChange={onPageChange}
                    />
                </Box>
            </PerfectScrollbar>
        </>
    );
};

TableBoxOrders.propTypes = {
    data: PropTypes.array,
    pagination: PropTypes.any,
    onPageChange: PropTypes.func,
    onRefresh: PropTypes.func
};

export default TableBoxOrders;
