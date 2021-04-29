import {
    Box,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '_metronic/_helpers';
import NeedPermission from '../NeedPermission';
import AlertDeleteRows from './AlertDeleteRows';

import './index.scss';

const useStyles = makeStyles(theme => ({
    root: {},
    pagination: {
        display: 'flex',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        justifyContent: 'flex-end'
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1
    }
}));

function CustomTable(props) {
    const {
        columns,
        rows,
        page,
        lastpage,
        onPageChange,
        onDelete,
        onViewEdit,
        isPagination,
        additionalActions,
        onSort = null,
        rowKey,
        className,
        noSTT,
        permissions,
        onRowClick,
        selectable,
        onSelectRow,
        selectedRow = [],
        onDeleteMulti
    } = props;
    const classes = useStyles();

    const handlePageChange = (e, newPage) => {
        if (onPageChange) onPageChange(newPage);
    };

    const handleDelete = id => {
        if (onDelete) onDelete(id);
    };

    const handleViewEdit = (id, row) => {
        if (onViewEdit) onViewEdit(id, row);
    };

    const getCellElement = (row, column) => {
        if (column.render) return column.render(_.get(row, column.id), row);

        return _.get(row, column.id);
    };

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = useState('');

    const handleSort = property => {
        const isAsc = orderBy === property && order === 'asc';
        const orderByTemp = isAsc ? 'desc' : 'asc';
        setOrder(orderByTemp);
        setOrderBy(property);
        if (onSort) onSort(property, orderByTemp);
    };

    const tableRowKey = useMemo(() => {
        return rowKey || columns[0].id;
    }, [columns, rowKey]);

    const isAction = useMemo(() => {
        return !!onDelete || !!onViewEdit || !!additionalActions?.length;
    }, [onDelete, onViewEdit, additionalActions]);

    const handleSelectRow = useCallback(
        (e, row, rowIdx) => {
            let newSelectedRow = [...selectedRow];

            let matchedRow = _.indexOf(newSelectedRow, _.get(row, tableRowKey));

            if (matchedRow === -1) {
                newSelectedRow.push(_.get(row, tableRowKey));
            } else {
                newSelectedRow.splice(matchedRow, 1);
            }

            onSelectRow && onSelectRow(newSelectedRow);
        },
        [tableRowKey, selectedRow, onSelectRow]
    );

    const handleSelectAllRow = useCallback(
        e => {
            if (!e.target.checked) {
                onSelectRow && onSelectRow([]);
            } else {
                onSelectRow &&
                    onSelectRow(rows.map(r => _.get(r, tableRowKey)));
            }
        },
        [rows, onSelectRow, tableRowKey]
    );

    return (
        <div className="tmn-custom-table">
            <AlertDeleteRows selectedRow={selectedRow} onDelete={onDeleteMulti} />
            <div className="tmn-custom-table__wrapper">
                <Box minWidth={1050}>
                    <Table className={className}>
                        <TableHead>
                            <TableRow>
                                {!!selectable && (
                                    <TableCell>
                                        <input
                                            className="form-control"
                                            type="checkbox"
                                            onChange={handleSelectAllRow}
                                        />
                                    </TableCell>
                                )}

                                {!noSTT && (
                                    <TableCell>
                                        <span>STT</span>
                                    </TableCell>
                                )}

                                {columns.map(column => (
                                    <TableCell key={column.id}>
                                        {column.isSort ? (
                                            <TableSortLabel
                                                active={orderBy === column.id}
                                                direction={
                                                    orderBy === column.id
                                                        ? order
                                                        : 'asc'
                                                }
                                                onClick={() =>
                                                    handleSort(column.id)
                                                }
                                            >
                                                {column.title}
                                                {orderBy === column.id &&
                                                column.disablePadding ? (
                                                    <span
                                                        className={
                                                            classes.visuallyHidden
                                                        }
                                                    >
                                                        {order === 'desc'
                                                            ? 'sorted descending'
                                                            : 'sorted ascending'}
                                                    </span>
                                                ) : null}
                                            </TableSortLabel>
                                        ) : (
                                            column.title
                                        )}
                                    </TableCell>
                                ))}

                                {isAction && (
                                    <TableCell className="text-center">
                                        <span className={classes.title}>#</span>
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow
                                    hover
                                    key={index}
                                    onClick={() =>
                                        onRowClick && onRowClick(row, index)
                                    }
                                >
                                    {!!selectable && (
                                        <TableCell>
                                            <input
                                                className="form-control"
                                                type="checkbox"
                                                onChange={e =>
                                                    handleSelectRow(
                                                        e,
                                                        row,
                                                        index
                                                    )
                                                }
                                                checked={selectedRow.includes(
                                                    _.get(row, tableRowKey)
                                                )}
                                            />
                                        </TableCell>
                                    )}

                                    {!noSTT && (
                                        <TableCell>{index + 1}</TableCell>
                                    )}

                                    {columns.map(column => (
                                        <TableCell key={column.id}>
                                            {getCellElement(row, column)}
                                        </TableCell>
                                    ))}

                                    {isAction && (
                                        <TableCell style={{ width: '12%' }}>
                                            {additionalActions.map(
                                                (action, idx) => (
                                                    <React.Fragment
                                                        key={`action-item-${idx}`}
                                                    >
                                                        {action(row)}
                                                    </React.Fragment>
                                                )
                                            )}
                                            {!!onViewEdit && (
                                                <NeedPermission
                                                    need={permissions?.update}
                                                >
                                                    <button
                                                        className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                                                        onClick={() =>
                                                            handleViewEdit(
                                                                _.get(row, tableRowKey),
                                                                row
                                                            )
                                                        }
                                                    >
                                                        <span className="svg-icon svg-icon-md svg-icon-primary">
                                                            <SVG
                                                                src={toAbsoluteUrl(
                                                                    '/media/svg/icons/Communication/Write.svg'
                                                                )}
                                                            ></SVG>
                                                        </span>
                                                    </button>
                                                </NeedPermission>
                                            )}
                                            {!!onDelete && (
                                                <NeedPermission
                                                    need={permissions?.delete}
                                                >
                                                    <button
                                                        className="btn btn-icon btn-light btn-hover-danger btn-sm"
                                                        onClick={() =>
                                                            handleDelete(
                                                                _.get(row, tableRowKey)
                                                            )
                                                        }
                                                    >
                                                        <span className="svg-icon svg-icon-md svg-icon-danger">
                                                            <SVG
                                                                src={toAbsoluteUrl(
                                                                    '/media/svg/icons/General/Trash.svg'
                                                                )}
                                                            ></SVG>
                                                        </span>
                                                    </button>
                                                </NeedPermission>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </div>

            {isPagination && (
                <Pagination
                    className={classes.pagination}
                    count={lastpage}
                    page={page}
                    shape="rounded"
                    onChange={handlePageChange}
                />
            )}
        </div>
    );
}

CustomTable.propTypes = {
    className: PropTypes.string,
    columns: PropTypes.array,
    rows: PropTypes.array,
    onPageChange: PropTypes.func,
    onDelete: PropTypes.func,
    onViewEdit: PropTypes.func,
    page: PropTypes.number,
    lastpage: PropTypes.number,
    isPagination: PropTypes.bool,
    additionalActions: PropTypes.array,
    rowKey: PropTypes.any,
    noSTT: PropTypes.bool,
    permissions: PropTypes.any
};

CustomTable.defaultProps = {
    className: '',
    columns: [],
    rows: [],
    onPageChange: null,
    onDelete: null,
    onViewEdit: null,
    page: 1,
    lastpage: 1,
    isPagination: true,
    additionalActions: [],
    rowKey: undefined,
    noSTT: false,
    permissions: {}
};

export { AlertDeleteRows };

export default CustomTable;
