import React from 'react';
import PropTypes from 'prop-types';

const AdditionalTypeOrder = ({ sfa }) => {

    return (
        <div className="sfa-list-box">
            {!!sfa?.boxes?.length && sfa.boxes.map((box) => (
                <div className="sfa-box-item" key={`box-${box.id}`}>
                    <div className="sfa-box-item--id">{box.id}</div>

                    <div>
                        {!!box?.owners?.length && box.owners.map((owner) => (
                            <div className="sfa-box-item--owner" key={`owner-${owner.id}`}>
                                <div className="sfa-box-item--user">{owner.objectable_id}</div>
                                <div className="sfa-box-item--quantity">{owner.quantity}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

AdditionalTypeOrder.propTypes = {
    sfa: PropTypes.any
};

export default AdditionalTypeOrder;