import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import formatNumber from 'helper/formatNumber';
import _, { find } from 'lodash';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import useTrans from 'helper/useTrans';
import PivotPalletsCell from '../ExtraCell/PivotPalletsCell';
import OwnerCell from '../ExtraCell/OwnerCell';
import LadingBillCell from '../ExtraCell/LadingBillCell';

export default function useColumns() {
    const columns = useSelector(state => state.warehouse.dashboard.columns);
    const location = useLocation();
    const [trans] = useTrans();

    const locationSearch = useMemo(() => {
        return queryString.parse(location.search);
    }, [location]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const COLUMNS = [
        {
            id: 'id',
            key: 'sku',
            title: trans('warehouse.sku.title'),
            render: (sku, row) => (
                <div className="sku-info">
                    <div
                        className="font-weight-bold sku cursor-pointer"
                        onClick={() => gotoPerformEntry(row)}
                    >
                        {sku}
                    </div>
                    <div className="sku-duplicate">
                        {trans('warehouse.quantity.total')}:{' '}
                        <span className="font-weight-bold">
                            {formatNumber(row.duplicate)}
                        </span>
                    </div>
                    <div className="sku-duplicate">
                        {trans('warehouse.quantity.in_stock')}:{' '}
                        <span className="font-weight-bold">
                            {formatNumber(getQuantityBoxInWarehouse(row))}
                        </span>
                    </div>

                    <div className="sku-info__extra-content">
                        <div className="sfa-id">
                            {trans('warehouse.sfa.title')}:{' '}
                            <span className="font-weight-bold">
                                {row.sfa_id}
                            </span>
                        </div>
                        <div className="tracking">
                            {trans('warehouse.tracking.title')}:{' '}
                            <span className="font-weight-bold">
                                {row.sfa?.tracking}
                            </span>
                        </div>
                        <div className="created_date">
                            {trans('common.created_at')}:{' '}
                            <span className="font-weight-bold">
                                {row.created_at || '---'}
                            </span>
                        </div>
                        {locationSearch['items.product_id'] && (
                            <>
                            <div className="search-jancode">
                                {trans('warehouse.jancode.title')} [
                                {locationSearch['items.product_id']}]:{' '}
                                <span className="font-weight-bold">
                                    {formatNumber(
                                        getQuantityProductInBox(row).inWH
                                    )}
                                    /
                                    {formatNumber(
                                        getQuantityProductInBox(row).total
                                    )}
                                </span>
                            </div>

                            <div className="search-jancode expiry_date">
                                {trans('common.expiry_date')} [
                                {locationSearch['items.product_id']}]:{' '}
                                <span className="font-weight-bold">
                                    {getQuantityProductInBox(row).expiry_date}
                                </span>
                            </div>
                            </>
                        )}
                    </div>
                </div>
            )
        },
        {
            id: 'pivot_pallets',
            key: 'pallets',
            title: trans('common.storage'),
            render: (pivot_pallets, row) => (<PivotPalletsCell box_id={row.id} />)
        },
        {
            id: 'owners',
            key: 'order',
            title: trans('common.the_order'),
            render: (owners, row) => (<OwnerCell box_id={row.id} />)
        },
        {
            id: 'box_lading_bills',
            key: 'lading_bills',
            title: trans('warehouse.lading_bill.title'),
            render: (boxLadingBills, row) => (<LadingBillCell box_id={row.id} />)
        }
    ];

    const getQuantityBoxInWarehouse = useCallback(row => {
        return row.quantity_inventory;
    }, []);

    const getQuantityProductInBox = useCallback(row => {
        let quantityProduct = 0;
        let expiry_date = '---';

        if (row?.items?.length) {
            quantityProduct = find(row.items, [
                    'product_id',
                    locationSearch['items.product_id']
                ])?.quantity || 0;

            expiry_date = find(row.items, [
                'product_id',
                locationSearch['items.product_id']
            ])?.expiry_date || '---';
        }

        return {
            total: quantityProduct * row.duplicate,
            inWH: getQuantityBoxInWarehouse(row) * quantityProduct,
            expiry_date
        };
    }, [getQuantityBoxInWarehouse, locationSearch]);

    const gotoPerformEntry = row => {
        window.open(
            `/warehouse/inbound/step-2/${row.sfa_id}/${row.id}`,
            '_blank'
        );
    };

    const activeColumns = useMemo(() => {
        return columns
            .filter(c => c.show)
            .map(c => {
                const matchedColumn = _.find(COLUMNS, ['key', c.id]);

                return matchedColumn;
            });
    }, [columns, COLUMNS]); // eslint-disable-line

    return [activeColumns];
}
