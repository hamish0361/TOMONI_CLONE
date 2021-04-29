import { useDispatch, useSelector } from 'react-redux';

import warehouseApi from 'apis/warehouse';
import { loadUpContainerAction } from 'app/modules/Warehouse/warehouse-redux/loadUpContainerSlice';
import playAudio from 'helper/playAudio';
import handleApiError from 'helper/handleApiError';

export default function useLoadUp(modalSelectPalletRef) {
    const currentContainerIdx = useSelector(
        state => state.warehouse.loadUpContainer.currentContainer
    );
    const listInvoices = useSelector(
        state => state.warehouse.loadUpContainer.listInvoices.data
    );
    const dispatch = useDispatch();

    const loadUpBox = (id, pallet_id) => {
        let box_id = id;

        warehouseApi.inContainerPicker
            .create({
                container_id: listInvoices[currentContainerIdx].id,
                box_id,
                pallet_id
            })
            .then(res => {
                playAudio('/media/audio/worf.mp3');
                dispatch(loadUpContainerAction.loadUpBoxSuccess(res));
            })
            .catch(err => {
                console.error(err);

                handleApiError(err);

                playAudio('/media/audio/wrong-answer.mp3');
                dispatch(
                    loadUpContainerAction.loadUpBoxError({ box_id, pallet_id })
                );

                if (err.response.data.errors.pallet_id) {
                    modalSelectPalletRef.current.open({
                        id: box_id
                    });
                }
            });
    };

    return { loadUpBox };
}
