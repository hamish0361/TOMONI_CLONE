import getTargetBoxes from "./targetBoxesSelector";

const { createSelector } = require("reselect");

const selectPallets = state => state.warehouse.packagingLoadUpContainer.pallets.data;

const getPackagingTargetBoxes = createSelector(
    [getTargetBoxes, selectPallets],
    (targetBoxes, pallets) => {
        let packagingTargetBoxes = {...targetBoxes};

        pallets.forEach((pallet) => {
            pallet.boxes.forEach((box_id) => {
                if(packagingTargetBoxes[box_id]?.pallets) {
                    packagingTargetBoxes[box_id]?.pallets.push(pallet.palletId)
                } else {
                    packagingTargetBoxes[box_id] = {
                        ...packagingTargetBoxes[box_id],
                        pallets: [pallet.palletId]
                    }
                }
            })
        });

        return packagingTargetBoxes;
    }
)

export default getPackagingTargetBoxes;