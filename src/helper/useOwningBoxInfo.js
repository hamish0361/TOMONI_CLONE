import warehouseApi from 'apis/warehouse';
import { useEffect, useState } from 'react';

export default function useOwningBoxInfo(boxes, isWork = true) {
    const [owningBoxInfo, setOwningBoxInfo] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (boxes && isWork) {
            getBoxInfo();
        }
    }, [boxes]); // eslint-disable-line

    const getBoxInfo = () => {
        setLoading(true);

        warehouseApi.ladingBill
            .fetchLadingBills({
                search: `owningBoxes.box_id:${boxes.map(i => i.id).join(',')}`,
                searchFields: `owningBoxes.box_id:in`,
                with: 'containers'
            })
            .then(res => {
                setOwningBoxInfo(res.data);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return {
        data: owningBoxInfo,
        loading
    };
}
