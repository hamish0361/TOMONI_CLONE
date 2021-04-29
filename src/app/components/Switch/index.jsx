import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Switch from '@material-ui/core/Switch';

BaseSwitch.propTypes = {
    defaultChecked: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func
};

function BaseSwitch({ defaultChecked = false, label = '', onChange, ...props }) {

    const [checked, setChecked] = useState(defaultChecked);

    const handleChange = (e) => {
        setChecked(!checked);

        onChange && onChange(!checked);
    }

    return (
        <div className="base-switch">
            <Switch
                checked={checked}
                onChange={handleChange}
                {...props}
            />

            <span className="base-switch__label">{label}</span>
        </div>
    );
}

export default BaseSwitch;