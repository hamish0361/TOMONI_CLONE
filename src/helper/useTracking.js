import trackingApi from "apis/order/trackingApi";
import { useEffect, useState } from "react";

export default function useTracking(tracking, isWork = true) {
    const [trackingInfo, setTrackingInfo] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (tracking && isWork) {
            getTrackingInfo();
        }
    }, [tracking, isWork]); // eslint-disable-line

    const getTrackingInfo = () => {
        setLoading(true);
        return trackingApi.fetchTrackingById(tracking, { with: 'orders' })
            .then(res => {
                setTrackingInfo(res);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return {
        data: trackingInfo,
        loading
    };
}