import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';

import useTrans from 'helper/useTrans';
import getShipmentMethodFromTrackingInfo from 'helper/getShipmentMethodFromTrackingInfo';
import { toAbsoluteUrl } from '_metronic/_helpers';
import clsx from 'clsx';
import { useTracking } from 'app/modules/Warehouse/components/context/trackingContext';

import { Card, CardBody } from '_metronic/_partials/controls';
import ProductItem from '../ProductItem';
import SVG from 'react-inlinesvg';

import './index.scss';

BoxItem.propTypes = {
    box: PropTypes.any
};

function BoxItem({ box }) {

    const [trans] = useTrans();
    const tracking = useTracking(box?.sfa?.tracking);
    const history = useHistory();

    const shipmentMethodSuggestion = useMemo(() => {
        return getShipmentMethodFromTrackingInfo(tracking?.data);
    }, [tracking]);

    const goToDetail = () => {
        history.push(`/warehouse/classify-box/${box.sfa_id}/${box.id}`);
    }

    return (
        <Card className="order-box-item">
            <CardBody>
                <div className="section-box">
                    <div className="order-box-item__head" onClick={goToDetail}>
                        <div className="order-box-item__title">
                            {box.id}
                        </div>
                        <div className="redirect-wrapper">
                            <span className="svg-icon svg-icon-primary svg-icon-2x redirect-icon">
                                <SVG
                                    src={toAbsoluteUrl(
                                        '/media/svg/icons/Navigation/Arrow-right.svg'
                                    )}
                                ></SVG>
                            </span>
                        </div>
                    </div>

                    <div className="order-box-item__properties">

                        <div className="order-box-item__propertyItem">
                            <div className="propertyItem__label">Tracking</div>
                            <div className="propertyItem__value">{box?.sfa?.tracking}</div>
                        </div>

                        <div className="order-box-item__propertyItem shipment_method">
                            <div className="propertyItem__label">{trans("warehouse.shipment_method.title")}</div>
                            <div className={clsx("propertyItem__value", shipmentMethodSuggestion === 'sea' ? 'text-primary' : 'text-danger')}>{shipmentMethodSuggestion || '---'}</div>
                        </div>

                    </div>

                    <div className="order-box-item__boxItems">
                        <ProductItem products={box.items} />
                    </div>
                </div>

                <div className="order-box-item__owners section-owners">
                    {box.owners.map((owner, idx) => (
                        <div className="owner-box-item" key={`owner-box-item-${idx}`}>
                            <div className="owner-box-item__orderObj">{owner.objectable_id}</div>
                            <div className="owner-box-item__quantity">{owner.quantity}</div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}

export default BoxItem;