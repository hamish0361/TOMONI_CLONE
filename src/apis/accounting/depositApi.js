import axiosClient from 'apis/axiosClient';

const depositApi = {
    fetchAll: params => {
        const url = '/api/deposits';
        return axiosClient.get(url, {
            params: params,
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    },

    create: body => {
        const url = '/api/deposits';
        return axiosClient.post(url, body, {
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    },

    update: ({ body, id }) => {
        const url = `/api/deposits/${id}`;
        return axiosClient.put(url, body, {
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    },

    updateFile: ({ body, id, params }) => {
        const url = `/api/deposits/${id}`;
        return axiosClient.post(url, body, {
            params,
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    },

    fetchSourceOfCashes: params => {
        const url = '/api/source-of-cashes';
        return axiosClient.get(url, {
            params: params,
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    }
};

export default depositApi;
