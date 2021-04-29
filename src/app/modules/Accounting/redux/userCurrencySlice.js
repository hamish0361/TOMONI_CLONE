import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import accountingApi from 'apis/accounting';

export const fetchUserCurrency = createAsyncThunk(
    'userCurrency/fetchUserCurrency',
    async params => {
        const res = await accountingApi.userCurrency.fetchAll(params);
        return res;
    }
);

export const fetchUserCurrencyById = createAsyncThunk(
    'userCurrency/fetchUserCurrencyById',
    async ({ id, params }) => {
        const res = await accountingApi.userCurrency.fetchById(id, params);
        return res;
    }
);

export const fetchCurrency = createAsyncThunk(
    'userCurrency/fetchCurrency',
    async params => {
        const res = await accountingApi.userCurrency.fetchCurrency(params);
        return res;
    }
);

export const createUserAccounting = createAsyncThunk(
    'userCurrency/fetchCurrency',
    async body => {
        const res = await accountingApi.userCurrency.createUserAccounting(body);
        return res;
    }
);

const initialState = {
    list: [],
    detail: undefined,
    isLoading: true,
    error: '',
    pagination: {
        total: 0,
        lastPage: 0
    },
    listCurrencies: []
};

const userCurrencySlice = createSlice({
    name: 'userCurrency',
    initialState: initialState,
    reducers: {
        resetUserCurrency: state => {
            state.list = [];
            state.pagination = {
                total: 0,
                lastPage: 0
            };
        }
    },
    extraReducers: {
        // fetch
        [fetchUserCurrency.pending]: state => {
            state.isLoading = true;
            state.error = '';
        },
        [fetchUserCurrency.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.list = action.payload.data;
            state.pagination = {
                total: action.payload.total,
                lastPage: action.payload.last_page
            };
        },
        [fetchUserCurrency.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        },
        // fetch by id
        [fetchUserCurrencyById.pending]: state => {
            state.isLoading = true;
            state.error = '';
            state.detail = undefined;
        },
        [fetchUserCurrencyById.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.detail = action.payload;
        },
        [fetchUserCurrencyById.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        },
        // fetchCurrency
        [fetchCurrency.pending]: state => {
            state.isLoading = true;
            state.error = '';
        },
        [fetchCurrency.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.listCurrencies = action.payload;
        },
        [fetchCurrency.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        },
        // fetchCurrency
        [createUserAccounting.pending]: state => {
            state.isLoading = true;
            state.error = '';
        },
        [createUserAccounting.fulfilled]: (state, action) => {
            state.isLoading = false;
        },
        [createUserAccounting.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        }
    }
});

export const { resetUserCurrency } = userCurrencySlice.actions;

export default userCurrencySlice;
