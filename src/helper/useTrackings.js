import trackingApi from 'apis/order/trackingApi';
import { useEffect, useState } from 'react';

export default function useTrackings(trackings) {
    const [trackingInfo, setTrackingInfo] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (trackings) {
            getTrackingInfo();
        }
    }, [trackings]); // eslint-disable-line

    const getTrackingInfo = () => {
        setLoading(true);
        return trackingApi
            .fetchTracking({ search: `id:${trackings.join(',')}`, searchFields: 'id:in', with: 'orders' })
            .then(res => {
                setTrackingInfo(res);
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return {
        data: trackingInfo,
        loading
    };
}
