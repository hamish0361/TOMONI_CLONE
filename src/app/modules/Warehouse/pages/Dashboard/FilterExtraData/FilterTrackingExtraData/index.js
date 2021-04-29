import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';

import queryString from 'query-string';
import warehouseApi from 'apis/warehouse';
import useTrans from 'helper/useTrans';

import { Card, CardBody } from '_metronic/_partials/controls';
import Loading from 'app/components/Loading';

import './index.scss';

function FilterTrackingExtraData(props) {
    const [sfas, setSFAs] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [trans] = useTrans();

    const locationSearch = useMemo(() => {
        return queryString.parse(location.search);
    }, [location]);

    useEffect(() => {
        if (locationSearch?.['sfa.tracking']) {
            setLoading(true);
            warehouseApi.SFA.fetchSFAs({
                search: `tracking:${locationSearch?.['sfa.tracking']}`,
                searchFields: `tracking:=`
            })
                .then(res => {
                    setSFAs(res.data);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [locationSearch]);

    return (
        <Card>
            <CardBody className="position-relative">
                {loading && <Loading local />}

                {sfas.map(sfa => (
                    <div className="sfa-item" key={`sfa-item-${sfa?.id}`}>
                        <div className="sfa-item__title text-primary">
                            {trans('warehouse.sfa.title')}
                        </div>
                        <div className="sfa-item__property">
                            <div className="sfa-item__property--item">
                                <span>{trans('warehouse.sfa.id')}</span>:{' '}
                                <span>{sfa?.id}</span>
                            </div>
                            <div className="sfa-item__property--item">
                                <span>{trans('warehouse.sfa.tracking')}</span>:{' '}
                                <span>{sfa?.tracking}</span>
                            </div>
                            <div className="sfa-item__property--item">
                                <span>{trans('common.quantity')}</span>:{' '}
                                <span>{sfa?.quantity}</span>
                            </div>
                            <div className="sfa-item__property--item">
                                <span>
                                    {trans('warehouse.cost.shipping_inside')}
                                </span>
                                : <span>{sfa?.shipping_inside}</span>
                            </div>
                            <div className="sfa-item__property--item">
                                <span>{trans('common.created_at')}</span>:{' '}
                                <span>{sfa?.created_at}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </CardBody>
        </Card>
    );
}

export default FilterTrackingExtraData;
