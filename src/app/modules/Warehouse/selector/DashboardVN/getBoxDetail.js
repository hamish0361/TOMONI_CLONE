const { createSelector } = require("reselect");

const getBoxes = state => state.warehouse.dashboard_vn.boxes.data;
const getBoxDetailIdx = state => state.warehouse.dashboard_vn.boxDetailIdx;

const getBoxDetail = createSelector(
    [getBoxes, getBoxDetailIdx],
    (boxes, boxDetailIdx) => {
        return boxes[boxDetailIdx];
    }
)

export default getBoxDetail;