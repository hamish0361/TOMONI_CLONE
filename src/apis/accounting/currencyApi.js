import axiosClient from '../axiosClient';

const currencyApi = {
    fetchCurrency: params => {
        const url = '/api/accounts';
        return axiosClient.get(url, {
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING,
            params
        });
    },
    fetchCurrenciesAccounting: params => {
        const url = '/api/currencies';
        return axiosClient.get(url, {
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING,
            params
        });
    }
};

export default currencyApi;
