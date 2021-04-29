import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import warehouseApi from 'apis/warehouse';
import _ from 'lodash';
import useTrans from 'helper/useTrans';
import { fetchPalletTypes } from 'app/modules/Warehouse/warehouse-redux/palletTypeSlice';

import { dialog } from 'app/components/DialogNotify';
import handleApiError from 'helper/handleApiError';

export default function useAddPallet(toggleModal) {
    const boxDetail = useSelector(state => state.warehouse.box.detail.data);
    const palletTypes = useSelector(
        state => state.warehouse.palletType.list.data
    );
    const [listPallets, setListPallet] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [trans] = useTrans();

    useEffect(() => {
        if (!palletTypes?.length) {
            dispatch(fetchPalletTypes());
        }
    }, []); // eslint-disable-line

    const onAddPallet = palletId => {
        let matchedPalletIdx = _.findIndex(listPallets, ['id', palletId]);

        warehouseApi.pallet
            .fetchPallet(palletId, { with: 'type' })
            .then(res => {
                let palletData = calculateAvailableBoxesOnPallet(res);

                if (matchedPalletIdx === -1)
                    setListPallet([...listPallets, palletData]);
                else {
                    let newListPallets = [...listPallets];
                    newListPallets[matchedPalletIdx] = palletData;
                    setListPallet(newListPallets);
                }
            });
    };

    const onAddNewPallet = () => {
        if (!palletTypes) {
            dialog.warning(
                trans('warehouse.sku.pivot.pallet.pick.warning.pallet_type')
            );

            return;
        }

        warehouseApi.pallet.create({ type_id: palletTypes[0].id }).then(res => {
            onAddPallet(res.id);
        });
    };

    const onChangePalletType = (type_id, pallet) => {
        let matchedPalletIdx = _.findIndex(listPallets, ['id', pallet.id]);

        if (matchedPalletIdx === -1) return;

        // call api change pallet type
        warehouseApi.pallet.update(pallet.id, { type_id }).then(res => {
            onAddPallet(res.id);
        });
    };

    const calculateAvailableBoxesOnPallet = useCallback(
        pallet => {
            let {
                duplicate,
                volume_per_box,
                weight_per_box,
                boxes_volume,
                boxes_weight
            } = boxDetail;

            let spaceAvailableOnPallet = {
                volume: pallet.type.max_volume - boxes_volume,
                weight: pallet.type.max_weight - boxes_weight
            };

            let availableBoxQuantity = duplicate;

            let availableVolumeQuantity =
                spaceAvailableOnPallet.volume / volume_per_box;
            let availableWeightQuantity =
                spaceAvailableOnPallet.weight / weight_per_box;

            availableBoxQuantity = _.min([
                availableBoxQuantity,
                availableVolumeQuantity,
                availableWeightQuantity
            ]);

            return {
                ...pallet,
                availableBoxQuantity
            };
        },
        [boxDetail]
    );

    let isEnoughPallet = useMemo(() => {
        if (!boxDetail)
            return {
                result: true,
                duplicate: 0,
                quantity: 0
            };

        let { duplicate } = boxDetail;

        let totalAvailableBoxes = listPallets.reduce((a, b) => {
            return a + b.availableBoxQuantity;
        }, []);

        if (totalAvailableBoxes < duplicate)
            return {
                result: false,
                duplicate,
                quantity: totalAvailableBoxes
            };

        return {
            result: true,
            duplicate,
            quantity: totalAvailableBoxes
        };
    }, [boxDetail, listPallets]);

    const savePalletBoxes = useCallback(() => {

        if(!boxDetail || !listPallets.length) return;

        setLoading(true);
        Promise.all(
            listPallets.map(pallet =>
                warehouseApi.palletBoxes.create({
                    box_id: boxDetail?.id,
                    pallet_id: pallet.id,
                    quantity: pallet.availableBoxQuantity
                })
            )
        )
            .then(() => {
                dialog.success(
                    trans('warehouse.sku.pivot.pallet.create.success')
                );

                toggleModal();
            })
            .catch(err => {
                handleApiError(
                    err,
                    null,
                    trans('warehouse.sku.pivot.pallet.create.failure')
                );
            })
            .finally(() => {
                setLoading(false);
            });
    }, [listPallets, boxDetail, trans, toggleModal]);

    return {
        onAddPallet,
        onAddNewPallet,
        listPallets,
        onChangePalletType,
        isEnoughPallet,
        savePalletBoxes,
        loading
    };
}
