import React, { useEffect, useState } from 'react';

import warehouseApi from 'apis/warehouse';
import useTrans from 'helper/useTrans';
import formatNumber from 'helper/formatNumber';

import Loading from 'app/components/Loading';

const OwnerCell = ({ box_id }) => {

    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [trans] = useTrans();

    useEffect(() => {
        if (box_id) {
            setLoading(true);
            warehouseApi.box.fetchBox(box_id, {
                with: 'owners'
            }).then((response) => {
                setOwners(response.owners);
            }).finally(() => {
                setLoading(false);
            })
        }
    }, [box_id]);

    if (loading) return <div className="position-relative"><Loading local hideLoadingText /></div>

    if (!owners?.length)
        return (
            <span className="empty-text">
                {trans('warehouse.sku.inventory_crate')}
            </span>
        );

    return owners.map((owner, idx) => (
        <div
            className="owner-wrapper split-with-other-vertical"
            key={`owner-${idx}`}
        >
            <div className="owner-type">
                {owner.objectable_type === 'user'
                    ? `${trans('common.customer')}`
                    : `${trans('common.the_order')}:`}
                <span className="font-weight-bold ml-5">
                    {owner.objectable_id}
                </span>
            </div>
            <div className="owner-quantity">
                {trans('common.quantity')}:{' '}
                <span className="font-weight-bold">
                    {formatNumber(owner.quantity)}
                </span>
            </div>
        </div>
    ));
};

OwnerCell.propTypes = {

};

export default OwnerCell;