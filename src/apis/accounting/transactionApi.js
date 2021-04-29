import axiosClient from 'apis/axiosClient';

const transactionApi = {
    fetchAll: params => {
        const url = '/api/transactions';
        return axiosClient.get(url, {
            params: params,
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    },
    fetchTransactionsById: body => {
        const url = `/api/transactions/${body.id}`;
        return axiosClient.get(url, {
            params: body.params,
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    },
    /**
     * METHOD: POST
     * @param {
     *   amount,
     *   description,
     *   user_id,
     *   type_id,
     *   payment_method_id,
     *   receipt,
     * }
     */
    create: ({ body, params }) => {
        const url = '/api/transactions';
        return axiosClient.post(url, body, {
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING,
            params,
            headers: { 'Content-type': 'application/json' }
        });
    },

    update: ({ id, params }) => {
        const url = `/api/transactions/${id}`;
        return axiosClient.put(url, null, {
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING,
            params
        });
    },

    updateFile: ({ body, id, params }) => {
        const url = `/api/transactions/${id}`;
        return axiosClient.post(url, body, {
            params,
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    },

    fetchAllType: params => {
        const url = '/api/transaction-types';
        return axiosClient.get(url, {
            params: params,
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    },
    deleteReceipt: id => {
        const url = `/api/receipts/${id}`;
        return axiosClient.delete(url, {
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    },
    uploadFileReceipt: params => {
        const url = `/api/receipts/${params.id}`;
        return axiosClient.post(url, params.data, {
            params: { _method: 'PUT' },
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING,
            headers: {
                'Contain-Type ': 'multipart/form-data'
            }
        });
    },
    fetchAllTransaction: params => {
        const url = '/api/transaction-types';
        return axiosClient.get(url, {
            params: params,
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    },
    createReceipt: body => {
        const url = '/api/receipts';
        return axiosClient.post(url, body.data, {
            params: body.param,
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    },
    createNewPaymentSale: body => {
        const url = '/api/transactions';
        return axiosClient.post(url, body, {
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    },
    deleteTransaction: id => {
        const url = `/api/transactions/${id}`;
        return axiosClient.delete(url, {
            baseURL: process.env.REACT_APP_API_URL_ACCOUNTING
        });
    },
    updatePassword: body => {
        const url = `/api/me/password`;
        return axiosClient.put(url, body, {});
    }
};

export default transactionApi;
