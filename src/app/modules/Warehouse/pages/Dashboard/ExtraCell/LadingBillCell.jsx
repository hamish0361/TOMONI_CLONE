import React, { useEffect, useMemo, useState } from 'react';

import warehouseApi from 'apis/warehouse';
import useTrans from 'helper/useTrans';
import formatNumber from 'helper/formatNumber';

import Loading from 'app/components/Loading';

const LadingBillCell = ({ box_id }) => {

    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [trans] = useTrans();

    useEffect(() => {
        if (box_id) {
            setLoading(true);
            warehouseApi.box.fetchBox(box_id, {
                with: 'owners.pivotLadingBills.ladingBill.containers'
            }).then((response) => {
                setOwners(response.owners);
            }).finally(() => {
                setLoading(false);
            })
        }
    }, [box_id]);

    const gotoLadingBill = lading_bill => {
        window.open(`/warehouse/lading-bills/${lading_bill.id}`, '_blank');
    };

    const gotoContainer = container => {
        window.open(`/warehouse/container/detail/${container.id}`, '_blank');
    };

    const ladingBillsList = useMemo(() => {
        return owners.reduce((prevValue, curOwner) => {
            if (!curOwner?.pivot_lading_bills?.length) return prevValue;
    
            let listLadingBillsOfCurOwner = curOwner.pivot_lading_bills.map(i => ({ ...i.lading_bill, quantity: i.quantity }));
    
            return [...prevValue, ...listLadingBillsOfCurOwner];
        }, []);
    }, [owners]);

    if (loading) return <div className="position-relative"><Loading local hideLoadingText /></div>

    if (!ladingBillsList?.length)
        return (
            <span className="empty-text">
                {trans('warehouse.sku.not_have.lading_bill')}
            </span>
        );

    return ladingBillsList.map((l_lb, idx) => (
        <div
            className="lading-bill-wrapper split-with-other-vertical"
            key={`lading-bill-${idx}`}
        >
            <div className="lading-bill-info">
                <div
                    className="lading-bill-id cursor-pointer"
                    onClick={() => gotoLadingBill(l_lb)}
                >
                    {trans('warehouse.lading_bill.id')}:{' '}
                    <span className="font-weight-bold text-primary">
                        {l_lb.id}
                    </span>
                </div>
                <div className="lading-bill-quantity">
                    SL:{' '}
                    <span className="font-weight-bold">
                        {formatNumber(l_lb.quantity)}
                    </span>
                </div>
            </div>

            <div className="container-list mt-3">
                {l_lb.containers.map((container, cIdx) => (
                    <div
                        className="container-wrapper"
                        key={`container-${cIdx}`}
                    >
                        <div
                            className="container-id cursor-pointer"
                            onClick={() => gotoContainer(container)}
                        >
                            {trans('warehouse.invoice.title')}:{' '}
                            <span className="font-weight-bold text-primary">
                                {container.id}
                            </span>
                        </div>
                        <div className="container-shipping_date">
                            {container.shipping_date
                                ? `Ngày giao hàng: ${container.shipping_date}`
                                : '---'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ));
};

LadingBillCell.propTypes = {

};

export default LadingBillCell;