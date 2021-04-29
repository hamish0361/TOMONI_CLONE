import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import warehouseApi from 'apis/warehouse';
import _ from 'lodash';

export const fetchOutContainerPicker = createAsyncThunk(
    'warehouse/fetchOutContainerPicker',
    (params, thunkAPI) => {

        const currentState = thunkAPI.getState();
        const filter = currentState.warehouse.dashboard_vn.boxes.filter;

        let myParams = {
            orderBy: 'created_at',
            sortedBy: 'desc',
            search: [],
            searchFields: [],
            with: 'outBoundPickers.goodsDelivery.deliveryPartner'
        }

        Object.entries(filter).forEach(([key, value]) => {
            myParams.search.push(`${key}:${value}`);
            myParams.searchFields.push(`${key}:=`);
        })

        myParams.search = myParams.search.join(';');
        myParams.searchFields = myParams.searchFields.join(';');

        return warehouseApi.box.fetchBoxs(myParams).then((res) => {
            if(res.last_page > 1) {
                return Promise.all(_.range(2, res.last_page + 1).map(page => {
                    return warehouseApi.box.fetchBoxs({...myParams, page});
                })).then(allRes => {
                    let allData = allRes.reduce((p, c) => {
                        return [...p, ...c.data]
                    }, []);

                    return [...allData, ...res.data]
                })
            }

            return [...res.data];
        })
    }
);

export const fetchVNSFA = createAsyncThunk(
    'warehouse/dashboard_fetchBoxes',
    (params, thunkAPI) => {

        const currentState = thunkAPI.getState();
        const defaultAgency = currentState.warehouse.settings.default_agency;
        const pagination = currentState.warehouse.dashboard_vn.sfa.pagination;

        let myParams = {
            orderBy: 'created_at',
            sortedBy: 'desc',
            search: [`agency_id:${defaultAgency}`],
            searchFields: [`agency_id:=`],
            page: pagination.page
        }

        myParams.search = myParams.search.join(';');
        myParams.searchFields = myParams.searchFields.join(';');

        return warehouseApi.invoice.fetchInvoices(myParams);
    }
);

const initialState = {
    boxes: {
        data: [],
        filter: {},
        loading: false
    },
    boxDetailIdx: undefined,
    sfa: {
        data: [],
        filter: {},
        pagination: {
            page: 1,
            limit: 15,
            total: 0,
            lastPage: 0,
        },
        loading: []
    },
    sfaDetail: {
        data: undefined,
        loading: false
    }
};

const dashboardVNSlice = createSlice({
    name: 'dashboard_vn',
    initialState,
    reducers: {
        setBoxDetailIdx(state, action) {
            state.boxDetailIdx = action.payload;
        },
        changeFilterBoxes(state, action) {
            state.boxes.filter = {
                ...state.boxes.filter,
                ...action.payload
            }
        }
    },
    extraReducers: {
        [fetchOutContainerPicker.pending]: (state, action) => {
            state.boxes.loading = true;
        },
        [fetchOutContainerPicker.fulfilled]: (state, action) => {
            state.boxes.loading = false;
            state.boxes.data = action.payload;

            return;
        },
        [fetchOutContainerPicker.rejected]: (state, action) => {
            state.boxes.loading = false;
            state.boxes.data = [];

            return;
        },
    },
});

const dashboardVNReducer = dashboardVNSlice.reducer;

export const dashboardVNAction = dashboardVNSlice.actions;

export default dashboardVNReducer;
