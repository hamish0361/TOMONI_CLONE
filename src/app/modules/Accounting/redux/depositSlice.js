import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import depositApi from 'apis/accounting/depositApi';

export const createDeposit = createAsyncThunk(
    'deposit/createDeposit',
    async body => {
        const res = await depositApi.create(body);
        return res;
    }
);

export const updateDeposit = createAsyncThunk(
    'deposit/updateDeposit',
    async params => {
        const res = await depositApi.update(params);
        return res;
    }
);

export const updateDepositFile = createAsyncThunk(
    'deposit/updateDepositFile',
    async reqParams => {
        const res = await depositApi.updateFile(reqParams);
        return res;
    }
);

export const fetchDeposit = createAsyncThunk(
    'deposit/fetchDeposit',
    async params => {
        const res = await depositApi.fetchAll(params);
        return res;
    }
);

export const fetchSourceOfCashes = createAsyncThunk(
    'deposit/fetchSourceOfCashes',
    async params => {
        const res = await depositApi.fetchSourceOfCashes(params);
        return res;
    }
);

const initialState = {
    list: [],
    sourceOfCashList: [],
    isLoading: false,
    isActionLoading: false,
    pagination: {
        lastPage: 0,
        currentPage: 0,
        total: 0
    },
    error: ''
};

const depositSlice = createSlice({
    name: 'deposit',
    initialState: initialState,
    reducers: {
        resetDeposit: state => {
            state.list = [];
            state.pagination = {
                lastPage: 1,
                currentPage: 1,
                total: 0
            };
        }
    },
    extraReducers: {
        // fetch
        [fetchDeposit.pending]: state => {
            state.isLoading = true;
        },
        [fetchDeposit.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.list = action.payload.data;
            state.pagination = {
                lastPage: action.payload.last_page,
                currentPage: action.payload.current_page,
                total: action.payload.total
            };
        },
        [fetchDeposit.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        },
        // fetch
        [fetchSourceOfCashes.pending]: state => {
            state.isLoading = true;
            state.sourceOfCashList = [];
        },
        [fetchSourceOfCashes.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.sourceOfCashList = action.payload;
        },
        [fetchSourceOfCashes.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        },
        // create
        [createDeposit.pending]: state => {
            state.isActionLoading = true;
            state.error = '';
        },
        [createDeposit.fulfilled]: (state, action) => {
            state.isActionLoading = false;
        },
        [createDeposit.rejected]: (state, action) => {
            state.isActionLoading = false;
            state.error = action.error;
        },
        // update
        [updateDeposit.pending]: state => {
            state.isActionLoading = true;
            state.error = '';
        },
        [updateDeposit.fulfilled]: (state, action) => {
            state.isActionLoading = false;
        },
        [updateDeposit.rejected]: (state, action) => {
            state.isActionLoading = false;
            state.error = action.error;
        },
        // update
        [updateDepositFile.pending]: state => {
            state.isActionLoading = true;
            state.error = '';
        },
        [updateDepositFile.fulfilled]: (state, action) => {
            state.isActionLoading = false;
        },
        [updateDepositFile.rejected]: (state, action) => {
            state.isActionLoading = false;
            state.error = action.error;
        }
    }
});

export const { resetDeposit } = depositSlice.actions;

export default depositSlice;
