import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import useTrans from 'helper/useTrans';
import getTargetBoxes from 'app/modules/Warehouse/selector/outBoundPicker/targetBoxesSelector';

import { Card, CardBody } from '_metronic/_partials/controls';

import './index.scss';

OutboundStatus.propTypes = {};

function OutboundStatus(props) {

    const targetBoxes = useSelector(getTargetBoxes);

    const [trans] = useTrans();

    const countBoxStatus = useMemo(() => {
        return Object.values(targetBoxes).reduce(
            (p, c) => {
                p.count += c.count;
                p.quantity += c.quantity;

                return p;
            },
            {
                count: 0,
                quantity: 0
            }
        );
    }, [targetBoxes]);

    return (
        <Card>
            <CardBody>
                <div className="count-box-status">
                    <div className="count-box-status__item quantity">
                        {trans('warehouse.io.status.quantity.title')}:{' '}
                        <span>{countBoxStatus.quantity}</span>
                    </div>

                    <div className="count-box-status__item count">
                        {trans('warehouse.io.status.outbound.title')}:{' '}
                        <span>{countBoxStatus.count}</span>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}

export default OutboundStatus;
