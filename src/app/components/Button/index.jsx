import React, { useMemo } from 'react';

import clsx from 'clsx';
import usePermission from '../NeedPermission/usePermission';
import { toAbsoluteUrl } from '_metronic/_helpers';

import SVG from 'react-inlinesvg';

import './index.scss';

const TMNButton = ({
    type = "secondary",
    loading = false,
    htmlType = "button",
    disabled = false,
    className = "",
    children,
    need,
    permissionJoin = 'or',
    icon,
    ...props
}, ref) => {

    const isActiveByPermission = usePermission(need, permissionJoin);

    const getLoadingClassName = useMemo(() => {
        if (!loading) return '';

        if (type === 'light-success') return "spinner spinner-darker-success spinner-left";
        if (type === 'secondary') return "spinner spinner-dark spinner-left";
        if (type === 'outline-danger') return "spinner spinner-darker-danger spinner-left";

        return "spinner spinner-white spinner-left";

    }, [type, loading]);

    return (
        <button
            ref={ref}
            type={htmlType}
            className={clsx(`base-btn btn btn-${type}`, className, getLoadingClassName)}
            disabled={disabled || loading || !isActiveByPermission}
            {...props}
        >
            {!!icon && (
                <SVG
                    src={toAbsoluteUrl(`/media/svg/icons/${icon}`)}
                    className="mr-3"
                ></SVG>
            )}
            {children}
        </button>
    );
};

export default React.forwardRef(TMNButton);