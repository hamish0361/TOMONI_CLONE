import React from 'react';

import './index.scss';

export default function VerticalLinearStepper({
    steps = []
}) {
    return (
        <div className="stepper">
            {steps.map(({ label, content }) => (
                <div key={label} className="stepper-item">
                    <div className="stepper-item__label">{label}</div>
                    <div className="stepper-item__content">{content}</div>
                </div>
            ))}
        </div>
    );
}
