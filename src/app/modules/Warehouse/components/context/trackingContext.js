import React, { useContext, useMemo, useState } from 'react';
import trackingApi from 'apis/order/trackingApi';
import _ from 'lodash';

const initialValues = {
    trackings: [],
    loading: false
};

const TrackingContext = React.createContext(initialValues);

export const TrackingProvider = ({ children, trackingIds }) => {
    const [trackings, setTrackings] = useState([]);
    const [loading, setLoading] = useState(false);

    const getTrackingInfo = () => {
        if (!trackingIds?.length) return;

        setLoading(true);
        return trackingApi
            .fetchTracking({
                search: `id:${_.uniq(trackingIds).join(',')}`,
                searchFields: 'id:in',
                with: 'orders'
            })
            .then(response => {
                if(response.last_page > 1) {
                    return Promise.all(_.range(2, response.last_page + 1).map(page => trackingApi
                        .fetchTracking({
                            search: `id:${_.uniq(trackingIds).join(',')}`,
                            searchFields: 'id:in',
                            with: 'orders',
                            page
                        }))).then((responseAll) => {
                            return [...responseAll, response];
                        })
                }

                return [response];
            })
            .then((listTrackingApiResponse) => {
                return listTrackingApiResponse.map(d => d.data);
            })
            .then((data) => {
                setTrackings(_.flatten(data));
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useMemo(() => {
        setTrackings([]);
        getTrackingInfo();
    }, [trackingIds]); // eslint-disable-line

    const values = useMemo(() => {
        return { trackings, loading };
    }, [trackings, loading]);

    return (
        <TrackingContext.Provider value={values}>
            {children}
        </TrackingContext.Provider>
    );
};

export const useTracking = tracking => {
    const { trackings, loading } = useContext(TrackingContext);

    const trackingInfo = useMemo(() => {
        return _.find(trackings, ['id', tracking]);
    }, [trackings, tracking]);

    return { data: trackingInfo, loading };
};
