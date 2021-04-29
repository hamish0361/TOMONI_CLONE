import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import './index.scss';

const Owner = ({ objectable_id, object, objectable_type }) => {
    if (objectable_type === 'order')
        return (
            <div className="owner-object">
                <div className="object-id">{object?.id}</div>
                <div className="customer-id">{object?.customer_id}</div>
                {object?.shipment_method_id && (
                    <div
                        className={clsx(
                            'shipment-method',
                            object.shipment_method_id.toLowerCase() === 'sea'
                                ? 'text-primary'
                                : 'text-danger'
                        )}
                    >
                        {object.shipment_method_id}
                    </div>
                )}
            </div>
        );

    return (
        <div className="owner-object">
            <span className="object-id">{objectable_id}</span>
        </div>
    );
};

Owner.propTypes = {
    objectable_id: PropTypes.string,
    objectable_type: PropTypes.string,
    object: PropTypes.any
};

export default Owner;
