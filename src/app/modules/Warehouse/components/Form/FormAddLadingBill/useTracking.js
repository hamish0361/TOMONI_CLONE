import trackingApi from "apis/order/trackingApi";
import usePrevious from "helper/usePrevious";
import { useEffect, useState } from "react";

export default function useTracking(tracking, isWork = true) {
    const [trackingInfo, setTrackingInfo] = useState();
    const [loading, setLoading] = useState(false);
    const prevTracking = usePrevious(tracking);

    useEffect(() => {
        if (tracking && isWork && prevTracking !== tracking) {
            getTrackingInfo();
        }
    }, [tracking, isWork, prevTracking]); // eslint-disable-line

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