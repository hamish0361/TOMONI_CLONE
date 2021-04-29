import { useEffect } from 'react';
import useTrans from 'helper/useTrans';
import { useDispatch, useSelector } from 'react-redux';

import getCurrentContainer from 'app/modules/Warehouse/selector/DownContainer/getCurrentContainer';
import {
    loadUpBox
} from 'app/modules/Warehouse/warehouse-redux/downContainerSlice';

import { dialog } from 'app/components/DialogNotify';
import { fetchPalletTypes } from 'app/modules/Warehouse/warehouse-redux/palletTypeSlice';
import playAudio from 'helper/playAudio';

export default function useInputAdd() {
    const listPalletType = useSelector(state => state.warehouse.palletType.list.data);
    const currentContainer = useSelector(getCurrentContainer);
    const [trans] = useTrans();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!listPalletType?.length) dispatch(fetchPalletTypes());
    }, []); // eslint-disable-line

    const loadBox = box_id => {
        /** Nếu chưa có container --> WARNING */
        if (!currentContainer) {
            playAudio("/media/audio/wrong-answer.mp3");
            dialog.warning(trans('warehouse.container.warning.less_invoice'));

            return;
        }

        /** Gọi api load-out box */
        dispatch(loadUpBox({ id: box_id })).then(res => {
            if (!res.type.includes('fulfilled')) {
                playAudio("/media/audio/wrong-answer.mp3");
                dialog.error(
                    trans('warehouse.container.add_box.failure', {
                        data: box_id
                    })
                );
            } else {
                playAudio("/media/audio/worf.mp3");
            }
        });
    };

    return { loadBox };
}
