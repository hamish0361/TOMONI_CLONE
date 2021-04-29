import React, { useEffect, useMemo, useState } from 'react';

import warehouseApi from 'apis/warehouse';

import BoxItem from '../BoxItem';
import Loading from 'app/components/Loading';
import BoxFilter from 'app/modules/Warehouse/components/Filter/BoxFilter';
import { Card } from '_metronic/_partials/controls';
import { Pagination } from '@material-ui/lab';
import { TrackingProvider } from 'app/modules/Warehouse/components/context/trackingContext';

const ListBoxForOrder = props => {

    const [loading, setLoading] = useState(false);
    const [boxes, setBoxes] = useState([]);
    const [pagination, setPagination] = useState({
        limit: 15,
        lastPage: 0,
        total: 0
    });

    const [params, setParams] = useState({
        with: 'sfa;items;owners',
        orderBy: 'owning_boxes:id,box_id|owning_boxes.id;created_at',
        sortedBy: 'asc',
        page: 1,
    });

    useEffect(() => {
        getBoxData();
    }, [params]); // eslint-disable-line

    const getBoxData = () => {
        setLoading(true);
        warehouseApi.box.fetchBoxs({
            ...params,
        })
            .then((response) => {
                setBoxes(response.data);
                setPagination({
                    limit: response.per_page,
                    lastPage: response.last_page,
                    total: response.total
                })
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const handleSearch = (dataSearch) => {
        setParams({
            ...params,
            ...dataSearch,
            page: 1
        })
    }

    const handlePageChange = (e, page) => {
        setParams({
            ...params,
            page
        });
    }

    const trackingIds = useMemo(() => {
        return boxes.filter(b => b?.sfa?.tracking).map(b => b.sfa.tracking);
    }, [boxes]);

    return (
        <div className="list-box-for-order">

            <Card className="position-relative">
                <BoxFilter onSearch={handleSearch} loading={loading} />
                <div className="p-3 d-flex justify-content-end">
                    <Pagination
                        count={pagination.lastPage}
                        page={pagination.page}
                        shape="rounded"
                        onChange={handlePageChange}
                    />
                </div>
            </Card>

            <div className="row position-relative">
                {loading && !boxes && <Loading local />}

                <TrackingProvider trackingIds={trackingIds}>
                    {boxes.map((box, idx) => (
                        <div className="col-lg-6 col-sm-12" key={`box-item-${idx}`}>
                            <BoxItem box={box} />
                        </div>
                    ))}
                </TrackingProvider>
            </div>
        </div>
    );
};

export default ListBoxForOrder;