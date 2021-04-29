import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import shipmentInfoApi from 'apis/order/shipmentInfoApi';

// fetch order type
export const fetchShipmentInfo = createAsyncThunk(
    'shipmentInfo/fetchShipmentInfo',
    async params => {
        const res = await shipmentInfoApi.fetchShipmentInfo(params);
        return res;
    }
);

// fetch order type by id
export const fetchShipmentInfoById = createAsyncThunk(
    'shipmentInfo/fetchShipmentInfoById',
    async body => {
        const { id, params } = body;
        const res = await shipmentInfoApi.fetchShipmentInfoById(id, params);
        return res;
    }
);

// create order type
export const createShipmentInfo = createAsyncThunk(
    'shipmentInfo/createShipmentInfo',
    async params => {
        const res = await shipmentInfoApi.createShipmentInfo(params);
        return res;
    }
);

// update order type
export const updateShipmentInfo = createAsyncThunk(
    'shipmentInfo/updateShipmentInfo',
    async body => {
        const { id, params } = body;
        const res = await shipmentInfoApi.updateShipmentInfo(id, params);
        return res;
    }
);

// delete order type
export const deleteShipmentInfo = createAsyncThunk(
    'shipmentInfo/deleteShipmentInfo',
    async id => {
        const res = await shipmentInfoApi.deleteShipmentInfo(id);
        return res;
    }
);

//get shipment info province
export const fetchShipmentInfoProvince = createAsyncThunk(
    'shipmentInfo/fetchShipmentInfoProvince',
    async params => {
        const res = await shipmentInfoApi.fetchShipmentInfoProvince(params);
        return res;
    }
);
//get shipment info district
export const fetchShipmentInfoDistrict = createAsyncThunk(
    'shipmentInfo/fetchShipmentInfoDistrict',
    async body => {
        const res = await shipmentInfoApi.fetchShipmentInfoDistrict(body);
        return res;
    }
);
//get shipment info ward
export const fetchShipmentInfoWard = createAsyncThunk(
    'shipmentInfo/fetchShipmentInfoWard',
    async body => {
        const res = await shipmentInfoApi.fetchShipmentInfoWard(body);
        return res;
    }
);

const initialState = {
    shipmentInfoList: [],
    shipmentInfoDetail: undefined,
    pagination: {
        total: 0,
        lastPage: 0
    },
    isLoading: false,
    isActionLoading: false,
    provinces: [],
    districts: [],
    wards: [],
    error: ''
};

const shipmentInfoSlice = createSlice({
    name: 'shipmentInfo',
    initialState: initialState,
    reducers: {},
    extraReducers: {
        // fetch
        [fetchShipmentInfo.pending]: state => {
            state.isLoading = true;
            state.shipmentInfoList = [];
            state.pagination = {
                total: 0,
                lastPage: 0
            };
            state.error = '';
        },
        [fetchShipmentInfo.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.shipmentInfoList = action.payload.data;
            state.pagination = {
                total: action.payload.total,
                lastPage: action.payload.last_page
            };
        },
        [fetchShipmentInfo.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        },
        // fetch by id
        [fetchShipmentInfoById.pending]: state => {
            state.isLoading = true;
            state.shipmentInfoDetail = {};
            state.error = '';
        },
        [fetchShipmentInfoById.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.shipmentInfoDetail = action.payload;
        },
        [fetchShipmentInfoById.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        },
        // delete
        [deleteShipmentInfo.pending]: state => {
            state.isActionLoading = true;
            state.error = '';
        },
        [deleteShipmentInfo.fulfilled]: (state, action) => {
            state.isActionLoading = false;
        },
        [deleteShipmentInfo.rejected]: (state, action) => {
            state.isActionLoading = false;
            state.error = action.error;
        },
        // update
        [updateShipmentInfo.pending]: state => {
            state.isActionLoading = true;
            state.error = '';
        },
        [updateShipmentInfo.fulfilled]: (state, action) => {
            state.isActionLoading = false;
        },
        [updateShipmentInfo.rejected]: (state, action) => {
            state.isActionLoading = false;
            state.error = action.error;
        },
        // create
        [createShipmentInfo.pending]: state => {
            state.isActionLoading = true;
            state.error = '';
        },
        [createShipmentInfo.fulfilled]: (state, action) => {
            state.isActionLoading = false;
        },
        [createShipmentInfo.rejected]: (state, action) => {
            state.isActionLoading = false;
            state.error = action.error;
        },
        // fetch province
        [fetchShipmentInfoProvince.pending]: state => {
            state.isLoading = true;
            state.provinces = [];
            state.error = '';
        },
        [fetchShipmentInfoProvince.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.provinces = action.payload;
        },
        [fetchShipmentInfoProvince.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        },
        // fetch district
        [fetchShipmentInfoDistrict.pending]: state => {
            state.isLoading = true;
            state.districts = [];
            state.error = '';
        },
        [fetchShipmentInfoDistrict.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.districts = action.payload.districts;
        },
        [fetchShipmentInfoDistrict.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        },
        // fetch ward
        [fetchShipmentInfoWard.pending]: state => {
            state.isLoading = true;
            state.wards = [];
            state.error = '';
        },
        [fetchShipmentInfoWard.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.wards = action.payload.wards;
        },
        [fetchShipmentInfoWard.rejected]: (state, action) => {
            state.isLoading = false;
            state.error = action.error;
        }
    }
});

export default shipmentInfoSlice;
