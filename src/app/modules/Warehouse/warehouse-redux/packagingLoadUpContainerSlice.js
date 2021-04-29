import { createSlice } from '@reduxjs/toolkit';
import { startPrinter } from 'app/components/PrinterModal';
import { printerTemplate } from 'helper/printerTemplateData';
import _ from 'lodash';

const initialState = {
    pallets: {
        data: [],
        loading: false
    },
    palletSelectedIdx: undefined
};

const packagingLoadUpContainerSlice = createSlice({
    name: 'packagingLoadUpContainer',
    initialState,
    reducers: {
        addPallet(state) {
            state.pallets.data.push({
                boxes: [],
                palletId: state.pallets.data.length + 1
            });
            state.palletSelectedIdx = state.pallets.data.length - 1;

            startPrinter(printerTemplate.command(state.pallets.data.length));
        },
        removePalletByIdx(state, action) {
            state.pallets.data.splice(action.payload, 1);
        },
        selectPallet(state, action) {
            state.palletSelectedIdx = action.payload;
        },
        addBoxToPallet(state, action) {
            if (action.payload.type === 'pallet') {
                if (!state.pallets.data[state.palletSelectedIdx]) return;

                state.pallets.data[state.palletSelectedIdx].boxes.push(
                    action.payload.box_id
                );
            } else {
                state.pallets.data.push({
                    boxes: [action.payload.box_id],
                    palletId: action.payload.box_id
                });

                startPrinter(printerTemplate.command(state.pallets.data.length));
            }
        },
        removeBoxFromPallet(state, action) {
            let { box_id, pallet_id } = action.payload;

            let matchedPalletIdx = _.findIndex(
                state.pallets.data,
                ({ palletId }) => palletId == pallet_id // eslint-disable-line
            );

            if (matchedPalletIdx !== -1) {
                state.pallets.data[matchedPalletIdx].boxes = state.pallets.data[
                    matchedPalletIdx
                ].boxes.filter(b => b !== box_id);

                if (matchedPalletIdx + 1 !== pallet_id) {
                    state.pallets.data = state.pallets.data.filter(
                        i => i.palletId !== pallet_id
                    );
                }
            }
        }
    },
    extraReducers: {}
});

const packagingLoadUpContainerReducer = packagingLoadUpContainerSlice.reducer;

export const packagingLoadUpContainerAction =
    packagingLoadUpContainerSlice.actions;

export default packagingLoadUpContainerReducer;
