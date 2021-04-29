import axiosClient from '../axiosClient';

const provinceApi = {
    fetchProvince: (params) => {
        const url = '/api/provinces/';
        return axiosClient.get(url, {
            params,
            baseURL: process.env.REACT_APP_API_URL_NOTIFICATION
        });
    },
    fecthDistrict: (province_id, params) => {
        const url = `/api/provinces/${province_id}`;
        return axiosClient.get(url, {
            params: { with: 'districts', ...params },
            baseURL: process.env.REACT_APP_API_URL_NOTIFICATION
        }).then((r) => r.districts);
    },
    fetchWard: (district_id, params) => {
        const url = `/api/districts/${district_id}`;
        return axiosClient.get(url, {
            params: { with: 'wards', ...params },
            baseURL: process.env.REACT_APP_API_URL_NOTIFICATION
        }).then((e) => e.wards);
    }
};

export default provinceApi;
