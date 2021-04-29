import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import warehouseApi from 'apis/warehouse';
import _ from 'lodash';
import usePrevious from 'helper/usePrevious';

export default function useGroupByPallet(targetBoxes) {
    const [listBoxPallets, setListBoxPallets] = useState([]);
    const [loading, setLoading] = useState(false);
    const prevTargetBoxesKeys = usePrevious(Object.keys(targetBoxes));
    const isGrouped = useRef(false);

    useEffect(() => {
        if (!_.isEqual(Object.keys(targetBoxes), prevTargetBoxesKeys)) {
            setListBoxPallets([]);
            isGrouped.current = false;
        }
    }, [targetBoxes]); // eslint-disable-line

    const groupBoxesByPallets = useCallback(() => {
        if (isGrouped.current) return;

        isGrouped.current = true;

        getAllBoxPallets().then(listBoxWithPallets => {
            console.log(listBoxWithPallets, 'listBoxWithPallets');
            setListBoxPallets(listBoxWithPallets);
        });
    }, [targetBoxes, getAllBoxPallets]); // eslint-disable-line

    const getAllBoxPallets = useCallback(() => {
        const boxIds = Object.keys(targetBoxes);

        setLoading(true);
        return warehouseApi.box
            .fetchBoxs({
                search: `id:${boxIds.join(',')}`,
                searchFields: `id:in`,
                with: 'pallets.location'
            })
            .then(response => {
                if (response.last_page > 1) {
                    return Promise.all(
                        _.range(2, response.last_page + 1).map(page =>
                            warehouseApi.box.fetchBoxs({
                                search: `id:${boxIds.join(',')}`,
                                searchFields: `id:in`,
                                with: 'pallets.location',
                                page
                            })
                        )
                    ).then(promiseAllResponse => {
                        return [...promiseAllResponse, response];
                    });
                }

                return [response];
            })
            .then(listResponse => {
                let nestedListData = listResponse.map(i => i.data);
                return _.flatten(nestedListData);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [targetBoxes]);

    const result = useMemo(() => {
        let objPallets = {};

        listBoxPallets.forEach(box => {
            let boxData = {
                ..._.pick(box, ['id']),
                target: {
                    ...(targetBoxes[box.id] || {})
                }
            };

            if (box?.pallets?.length) {
                box.pallets.forEach(pallet => {
                    if (objPallets[pallet.id]) {
                        objPallets[pallet.id].boxes.push(boxData);
                    } else {
                        objPallets[pallet.id] = {
                            ...pallet,
                            boxes: [boxData]
                        };
                    }
                });
            } else {
                if (objPallets['undefinedPallet']) {
                    objPallets['undefinedPallet'].boxes.push(boxData);
                } else {
                    objPallets['undefinedPallet'] = {
                        id: 'undefinedPallet',
                        boxes: [boxData]
                    };
                }
            }
        });

        return Object.values(objPallets);
    }, [listBoxPallets, targetBoxes]);

    return {
        groupBoxesByPallets,
        loading,
        result
    };
}
