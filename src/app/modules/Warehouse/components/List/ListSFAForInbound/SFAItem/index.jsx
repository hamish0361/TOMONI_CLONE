import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import useTrans from 'helper/useTrans';
import { toAbsoluteUrl } from '_metronic/_helpers';
import useTracking from './useTracking';
import getShipmentMethodFromTrackingInfo from 'helper/getShipmentMethodFromTrackingInfo';
import _ from 'lodash';

import SVG from 'react-inlinesvg';
import { Card, CardBody } from '_metronic/_partials/controls';
import AdditionalTypeBox from './AdditionalTypeBox';
import AdditionalTypeStorage from './AdditionalTypeStorage';
import AdditionalTypeOrder from './AdditionalTypeOrder';

import './index.scss';

const SFAItem = ({
    sfa,
    type,
    onRedirect,
    showShipmentMethod,
    showBoxItems = 0,
    showOwningBox = false,
    ...props
}) => {

    const [trans] = useTrans();
    const tracking = useTracking(sfa?.tracking, showShipmentMethod);

    const totalSku = useMemo(() => {

        if (!sfa?.boxes?.length) return 0;

        return sfa.boxes.reduce((prevV, curV) => prevV + curV.duplicate, 0);
    }, [sfa]);

    const totalBoxOnPallet = useMemo(() => {
        if (!sfa?.boxes?.length) return 0;

        return totalSku - sfa.boxes.reduce((prevV, curV) => {

            return prevV + curV.quantity_available_in_pallet;
        }, 0);
    }, [sfa, totalSku]);

    const totalHaveOrder = useMemo(() => {
        if (!sfa?.boxes?.length) return 0;

        return sfa.boxes.reduce((prevV, curV) => {
            return prevV + Number(curV.quantity_of_owners);
        }, 0);
    }, [sfa]);

    const handleRedirect = () => {
        onRedirect && onRedirect(sfa.id);
    }

    const quantityRender = useMemo(() => {
        if (type === 'box')
            return (
                <div className="sfa-info--quantity-status">
                    <span className={clsx(totalSku < sfa?.quantity ? 'text-danger' : 'text-success')}>{totalSku}</span> / <span className="text-success">{sfa?.quantity}</span>
                </div>
            )

        if (type === 'storage')
            return (
                <div className="sfa-info--quantity-status">
                    <span className={clsx(totalBoxOnPallet < totalSku ? 'text-danger' : 'text-success')}>{totalBoxOnPallet}</span> / <span className="text-success">{totalSku}</span>
                </div>
            )

        if (type === 'order')
            return (
                <div className="sfa-info--quantity-status">
                    <span className={clsx(totalHaveOrder < totalSku ? 'text-danger' : 'text-success')}>{totalHaveOrder}</span> / <span className="text-success">{totalSku}</span>
                </div>
            )

        return <></>
    }, [type, sfa?.quantity, totalSku, totalBoxOnPallet, totalHaveOrder]);

    const addionalRender = useMemo(() => {
        if (type === 'box') return <AdditionalTypeBox sfa={sfa} />;

        if (type === 'storage') return <AdditionalTypeStorage sfa={sfa} />;

        if (type === 'order') return <AdditionalTypeOrder sfa={sfa} />;

        return <></>
    }, [type, sfa]);

    const shipmentMethodSuggestion = useMemo(() => {
        return getShipmentMethodFromTrackingInfo(tracking?.data);
    }, [tracking]);

    const sfaBoxItems = useMemo(() => {
        try {
            if (!sfa || !showBoxItems || !sfa?.boxes?.length) return [];

            let listBoxItems = sfa.boxes.reduce((prevB, curB) => {
                return [...prevB, ...(curB.items || [])];
            }, []);

            listBoxItems = _.uniqBy(listBoxItems, ['product_id'])

            return listBoxItems.slice(0, showBoxItems);
        } catch (err) {
            console.error(err)
        }

    }, [sfa, showBoxItems]);

    return (
        <Card className="sfa-item">
            <CardBody>
                <div className="sfa-info">
                    <div className="sfa-head" onClick={handleRedirect}>
                        <div className="sfa-info--id">
                            {sfa?.id}
                            <span className="svg-icon svg-icon-primary svg-icon-2x redirect-icon">
                                <SVG
                                    src={toAbsoluteUrl(
                                        '/media/svg/icons/Navigation/Arrow-right.svg'
                                    )}
                                ></SVG>
                            </span>
                        </div>
                    </div>

                    <div className="sfa-info--arrival_date">{trans("warehouse.sfa.arrival_date.title")}: <b>{sfa?.arrival_date}</b></div>
                    <div className="sfa-info--tracking">{trans("warehouse.tracking.title")}: <b>{sfa?.tracking}</b></div>
                    {!!sfa?.shipping_inside && (
                        <div className="sfa-info--shipping">{trans("warehouse.cost.shipping_inside")}: <b>{sfa?.shipping_inside}</b></div>
                    )}

                    {!!sfa?.coupon && (
                        <div className="sfa-info--coupon">{trans("common.coupon_code")}: <b>{sfa?.coupon}</b></div>
                    )}

                    {showShipmentMethod && (
                        <>
                            <div className="sfa-info--tracking">{trans("common.account")}: <b>
                                {!!tracking?.data?.orders?.length ? _.uniq(tracking.data.orders.map(c => c.customer_id)).join(', ') : '---'}
                            </b></div>
                            <div className="sfa-info--suggest-shipment-method">
                                {trans("warehouse.shipment_method.title")}: <b className={clsx(shipmentMethodSuggestion === 'sea' ? 'text-primary' : 'text-danger')}>{shipmentMethodSuggestion || '---'}</b>
                            </div>
                        </>
                    )}

                    <div className="d-flex justify-content-between">
                        <div style={{ flexGrow: 1 }}>
                            {!!sfaBoxItems.length && (
                                <div className="sfa-info--product-items">
                                    <div className="sfa-info--product-items--title">Items</div>
                                    <div className="sfa-info--product-items--wrapper">
                                        {sfaBoxItems.map(({ product_id }, idx) => (
                                            <div className="sfa-info--product-item" key={`sfa-info--product-item-${idx}`}>
                                                <div className="sfa-info--product-id">{product_id}</div>
                                            </div>
                                        ))}

                                        <div className="sfa-info--product-item">
                                            <div className="sfa-info--product-id">...</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {quantityRender}
                    </div>
                </div>

                {addionalRender}
            </CardBody>
        </Card>
    );
};

SFAItem.propTypes = {
    sfa: PropTypes.any
};

export default SFAItem;