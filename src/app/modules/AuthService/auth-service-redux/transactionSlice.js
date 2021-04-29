import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import transactionApi from 'apis/accounting/transactionApi';

// fetch user
export const fetchTransaction = createAsyncThunk(
    'authService/fetchTransaction',
    async (params, thunkAPI) => {
        const res = await transactionApi.fetchAll(params);
        return res;
    }
);
export const updatePassword = createAsyncThunk(
    'transaction/updatePassword',
    async (body, thunkAPI) => {
        try {
            const res = await transactionApi.updatePassword(body);
            return res;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data.errors.message);
        }
    }
);

const initialState = {
    transactionList: [],
    isLoading: true,
    isActionLoading: false,
    error: '',
    pagination: {
        total: 0,
        lastPage: 0
    }
};

export const transactionSlice = createSlice({
    name: 'transaction',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        // fetch order
        [fetchTransaction.pending]: state => {
            state.isLoading = true;
            state.transactionList = [];
            state.error = '';
        },
        [fetchTransaction.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.transactionList = action.payload.data;
            state.pagination = {
                total: action.payload.data.total,
                lastPage: action.payload.data.from
            };
        },
        [fetchTransaction.rejected]: (state, action) => {
            state.error = action.error;
            state.isLoading = false;
        },
        //update password
        [updatePassword.pending]: state => {
            state.isActionLoading = true;
            state.error = '';
        },
        [updatePassword.fulfilled]: (state, action) => {
            state.isActionLoading = false;
        },
        [updatePassword.rejected]: (state, action) => {
            state.isActionLoading = false;
            state.error = action.error;
        }
    }
});

export default transactionSlice;
