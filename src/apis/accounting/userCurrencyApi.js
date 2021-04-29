import axiosClient from 'apis/axiosClient';

const userCurrencyApi = {
    fetchAll: params => {
        const url = '/api/accounts';
        return axiosClient.get(url, {
            params: params,
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    },

    fetchById: (id, params) => {
        const url = `/api/accounts/${id}`;
        return axiosClient.get(url, {
            params,
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    },

    fetchCurrency: params => {
        const url = '/api/currencies';
        return axiosClient.get(url, {
            params: params,
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    },

    createUserAccounting: body => {
        const url = '/api/accounts';
        return axiosClient.post(url, body, {
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    }
};

export default userCurrencyApi;
