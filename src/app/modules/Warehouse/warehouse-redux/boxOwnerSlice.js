import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import warehouseApi from 'apis/warehouse';
import _ from 'lodash';

export const fetchBoxOwners = createAsyncThunk(
    'warehouse/fetchBoxOwners',
    async (params, thunkAPI) => {
        return warehouseApi.boxOwner.fetchBoxOwners(params);
    }
);

export const fetchAllBoxOwnersAvailableForLadingBills = createAsyncThunk(
    'warehouse/fetchAllBoxOwnersAvailableForLadingBills',
    async (params, thunkAPI) => {
        return warehouseApi.boxOwner.fetchBoxOwners(
            {
                ...params,
                orderBy: 'created_at',
                sortedBy: 'desc',
                criteria: 'OwningBoxAvailableForLadingBills'
            }).then((boxOwners) => {
                if (boxOwners.last_page > 1) {
                    return Promise.all(_.range(2, boxOwners.last_page + 1, 1).map((page) => {
                        return warehouseApi.boxOwner.fetchBoxOwners({
                            ...params,
                            orderBy: 'created_at',
                            sortedBy: 'desc',
                            criteria: 'OwningBoxAvailableForLadingBills',
                            page
                        })
                    })).then(([...res]) => ([boxOwners, ...res]))
                } else {
                    return [boxOwners]
                }
            }).then((rawServerData) => {
                return rawServerData.reduce((prevV, curV) => ([...prevV, ...curV.data]), []);
            });
    }
);

const initialState = {
    list: {
        data: [],
        pagination: {
            page: 1,
            limit: 10,
            total: 0,
            lastPage: 0
        },
        loading: true
    },
    listAll: {
        data: [],
        loading: true
    }
};

const boxOwnerSlice = createSlice({
    name: 'boxOwner',
    initialState,
    reducers: {
        changePagination(state, action) {
            state.list.pagination.page = action.payload.page;
        },
        resetParams(state) {
            state.list = { ...initialState.list };
        },
    },
    extraReducers: {
        [fetchBoxOwners.pending]: (state, action) => {
            state.list.loading = true;
        },
        [fetchBoxOwners.fulfilled]: (state, action) => {
            state.list.data = action.payload.data;

            state.list.loading = false;
            state.list.pagination.limit = action.payload.per_page;
            state.list.pagination.total = action.payload.total;
            state.list.pagination.lastPage = action.payload.last_page;

            return;
        },
        [fetchBoxOwners.rejected]: (state, action) => {
            state.list.data = [];
            state.list.loading = false;

            return;
        },

        [fetchAllBoxOwnersAvailableForLadingBills.pending]: (state, action) => {
            state.listAll.loading = true;
        },
        [fetchAllBoxOwnersAvailableForLadingBills.fulfilled]: (state, action) => {
            state.listAll.data = action.payload;

            state.listAll.loading = false;

            return;
        },
        [fetchAllBoxOwnersAvailableForLadingBills.rejected]: (state, action) => {
            state.listAll.data = [];
            state.listAll.loading = false;

            return;
        },
    }
});

const boxOwnerReducer = boxOwnerSlice.reducer;
export const boxOwnerAction = boxOwnerSlice.actions;

export default boxOwnerReducer;
