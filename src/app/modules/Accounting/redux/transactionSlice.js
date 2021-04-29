import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import accountingApi from 'apis/accounting';

export const fetchTransactions = createAsyncThunk(
    'transaction/fetchTransactions',
    async params => {
        const res = await accountingApi.transaction.fetchAll(params);
        return res;
    }
);
export const fetchTransactionsById = createAsyncThunk(
    'transaction/fetchTransactionsById',
    async body => {
        const res = await accountingApi.transaction.fetchTransactionsById(body);
        return res;
    }
);

export const deleteReceipt = createAsyncThunk(
    'transaction/deleteReceipt',
    async id => {
        const res = await accountingApi.transaction.deleteReceipt(id);
        return res;
    }
);

export const uploadFileReceipt = createAsyncThunk(
    'transaction/uploadFileReceipt',
    async (params, thunkAPI) => {
        const res = await accountingApi.transaction.uploadFileReceipt(params);

        return res;
    }
);

export const fetchTransactionType = createAsyncThunk(
    'transaction/fetchTransactionType',
    async params => {
        const res = await accountingApi.transaction.fetchAllType(params);
        return res;
    }
);

export const createTransaction = createAsyncThunk(
    'transaction/createTransaction',
    async req => {
        const res = await accountingApi.transaction.create(req);
        return res;
    }
);
export const fetchAllTransaction = createAsyncThunk(
    'transaction/fetchAllTransaction',
    async params => {
        const res = await accountingApi.transaction.fetchAllTransaction(params);
        return res;
    }
);

export const createReceipt = createAsyncThunk(
    'transaction/createReceipt',
    async params => {
        const res = await accountingApi.transaction.createReceipt(params);
        return res;
    }
);

export const updateTransaction = createAsyncThunk(
    'transaction/updateTransaction',
    async body => {
        const res = await accountingApi.transaction.update(body);
        return res;
    }
);

export const updateFileTransaction = createAsyncThunk(
    'transaction/updateFileTransaction',
    async body => {
        const res = await accountingApi.transaction.updateFile(body);
        return res;
    }
);

export const createNewPaymentSale = createAsyncThunk(
    'transaction/createNewPaymentSale',
    async params => {
        const res = await accountingApi.transaction.createNewPaymentSale(
            params
        );
        return res;
    }
);

export const deleteTransaction = createAsyncThunk(
    'transaction/deleteTransaction',
    async id => {
        const res = await accountingApi.transaction.deleteTransaction(id);
        return res;
    }
);

const initialState = {
    list: [],
    detailTransaction: {},
    typeList: [],
    detail: {},
    isLoading: false,
    isLoadingDetail: false,
    isActionLoading: false,
    pagination: {
        total: 0,
        lastPage: 1,
        currentPage: 1
    },
    error: '',
    listTransaction: []
};

const transactionSlice = createSlice({
    name: 'transaction',
    initialState: initialState,
    reducers: {
        resetTransaction: state => {
            state.list = [];
            state.pagination = {
                total: 0,
                lastPage: 0
            };
        }
    },
    extraReducers: {
        // fetch all
        [fetchTransactions.pending]: state => {
            state.isLoading = true;
            state.error = '';
        },
        [fetchTransactions.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.list = action.payload.data;
            state.pagination = {
                total: action.payload.total,
                lastPage: action.payload.last_page,
                currentPage: action.payload.current_page
            };
        },
        [fetchTransactions.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        },
        // fetch all
        [fetchTransactionsById.pending]: state => {
            state.isLoadingDetail = true;
            state.error = '';
            state.detailTransaction = {};
        },
        [fetchTransactionsById.fulfilled]: (state, action) => {
            state.isLoadingDetail = false;
            state.detailTransaction = action.payload;
        },
        [fetchTransactionsById.rejected]: (state, action) => {
            state.isLoadingDetail = false;
            state.error = action.error;
        },
        //delete reccipt
        [deleteReceipt.pending]: state => {
            state.isActionLoading = true;
        },

        [deleteReceipt.fulfilled]: (state, action) => {
            state.isActionLoading = false;
        },
        [deleteReceipt.rejected]: (state, action) => {
            state.error = action.error;
            state.isActionLoading = false;
        },
        //update image  receipt
        [uploadFileReceipt.pending]: state => {
            state.isActionLoading = true;
        },
        [uploadFileReceipt.fulfilled]: (state, action) => {
            state.isActionLoading = false;
        },
        [uploadFileReceipt.rejected]: (state, action) => {
            state.error = action.error;
            state.isActionLoading = false;
        },
        // fetch type
        [fetchTransactionType.pending]: state => {
            state.typeList = [];
        },
        [fetchTransactionType.fulfilled]: (state, action) => {
            state.typeList = action.payload;
        },
        // create
        [createTransaction.pending]: state => {
            state.isActionLoading = true;
            state.error = '';
        },
        [createTransaction.fulfilled]: (state, action) => {
            state.isActionLoading = false;
        },
        [createTransaction.rejected]: (state, action) => {
            state.isActionLoading = false;
            state.error = action.error;
        },
        // fetch all
        [fetchAllTransaction.pending]: state => {
            state.error = '';
        },
        [fetchAllTransaction.fulfilled]: (state, action) => {
            state.listTransaction = action.payload;
        },
        [fetchAllTransaction.rejected]: (state, action) => {
            state.error = action.error;
        },
        // create
        [createReceipt.pending]: state => {
            state.isActionLoading = true;
            state.error = '';
        },
        [createReceipt.fulfilled]: (state, action) => {
            state.isActionLoading = false;
        },
        [createReceipt.rejected]: (state, action) => {
            state.isActionLoading = false;
            state.error = action.error;
        },
        //createNewPaymentSale
        [createNewPaymentSale.pending]: state => {
            state.isActionLoading = true;
        },

        [createNewPaymentSale.fulfilled]: (state, action) => {
            state.isActionLoading = false;
        },
        [createNewPaymentSale.rejected]: (state, action) => {
            state.error = action.error;
            state.isActionLoading = false;
        },
        //update transaciton
        [updateTransaction.pending]: state => {
            state.isActionLoading = true;
        },

        [updateTransaction.fulfilled]: (state, action) => {
            state.isActionLoading = false;
        },
        [updateTransaction.rejected]: (state, action) => {
            state.error = action.error;
            state.isActionLoading = false;
        },
        //update transaciton
        [updateFileTransaction.pending]: state => {
            state.isActionLoading = true;
        },

        [updateFileTransaction.fulfilled]: (state, action) => {
            state.isActionLoading = false;
        },
        [updateFileTransaction.rejected]: (state, action) => {
            state.error = action.error;
            state.isActionLoading = false;
        },
        //update transaciton
        [deleteTransaction.pending]: state => {
            state.isActionLoading = true;
        },

        [deleteTransaction.fulfilled]: (state, action) => {
            state.isActionLoading = false;
        },
        [deleteTransaction.rejected]: (state, action) => {
            state.error = action.error;
            state.isActionLoading = false;
        }
    }
});

export const { resetTransaction } = transactionSlice.actions;

export default transactionSlice;
