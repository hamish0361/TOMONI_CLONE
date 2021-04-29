import _ from 'lodash';
const { createSelector } = require("reselect");

const selectBoxItems = state => state.warehouse.performEntry.checking_goods.box_items;

/**
 * return true ==> thùng đã đóng
 * return false ==> thùng chưa đóng
 */
const getBoxCloseState = createSelector(
    [selectBoxItems],
    (listBoxItems) => {
        let matchBoxItemServer = _.findIndex(listBoxItems, ({id}) => typeof id === 'number');

        return matchBoxItemServer !== -1;
    }
)

export default getBoxCloseState;