import { combineReducers } from 'redux';
import transactionSlice from './transactionSlice';
import cardSlice from './cardSlice';
import receiptSlice from './receiptSlice';
import userCurrencySlice from './userCurrencySlice';
import depositSlice from './depositSlice';

const accountingReducer = combineReducers({
    transaction: transactionSlice.reducer,
    card: cardSlice.reducer,
    receipt: receiptSlice.reducer,
    userCurrency: userCurrencySlice.reducer,
    deposit: depositSlice.reducer
});

export default accountingReducer;
