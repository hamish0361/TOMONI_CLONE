import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import accountingApi from 'apis/accounting';

export const fetchReceipt = createAsyncThunk(
    'receipt/fetchReceipt',
    async params => {
        const res = await accountingApi.receipt.fetchAll(params);
        return res;
    }
);

export const updateReceipt = createAsyncThunk(
    'receipt/updateReceipt',
    async req => {
        const res = await accountingApi.receipt.update(req);
        return res;
    }
);

const initialState = {
    isLoadingReceipt: false,
    isActionLoading: false,
    listReceipt: [],
    paginationReceipt: {
        total: 0,
        lastPage: 1,
        currentPage: 1
    },
    error: ''
};

const receiptSlice = createSlice({
    name: 'receipt',
    initialState: initialState,
    reducers: {
        resetTransaction: state => {
            state.listReceipt = [];
            state.paginationReceipt = {
                total: 0,
                lastPage: 0
            };
        }
    },
    extraReducers: {
        // fetch
        [fetchReceipt.pending]: state => {
            state.isLoadingReceipt = true;
            state.listReceipt = [];
        },
        [fetchReceipt.fulfilled]: (state, action) => {
            state.isLoadingReceipt = false;
            state.listReceipt = action.payload.data;
            state.paginationReceipt = {
                total: action.payload.total,
                lastPage: action.payload.last_page,
                currentPage: action.payload.current_page
            };
        },
        [fetchReceipt.rejected]: (state, action) => {
            state.isLoadingReceipt = false;
            state.error = action.error;
        },
        // fetch
        [updateReceipt.pending]: state => {
            state.isActionLoading = true;
        },
        [updateReceipt.fulfilled]: (state, action) => {
            state.isActionLoading = false;
        },
        [updateReceipt.rejected]: (state, action) => {
            state.isActionLoading = false;
        }
    }
});
export const { resetReceipt } = receiptSlice.actions;

export default receiptSlice;
