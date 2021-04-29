import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import warehouseApi from 'apis/warehouse';
import useTrans from 'helper/useTrans';

import FormAddOrder from 'app/modules/Warehouse/components/Form/FormAddBoxOrder';
import { dialog } from 'app/components/DialogNotify';
import handleApiError from 'helper/handleApiError';

import './index.scss';

const AddOrder = ({ onSuccess }) => {

    const [loading, setLoading] = useState(false);
    const [trans] = useTrans();
    const params = useParams();

    const handleCreateBoxOwning = (values, form) => {
        setLoading(true);
        warehouseApi.boxOwner.create({ ...values, box_id: params?.box_id })
            .then((res) => {
                dialog.success(trans("warehouse.sku.owner.create.success"));
                onSuccess && onSuccess(res);
            })
            .catch((err) => {
                dialog.error(trans("warehouse.sku.owner.create.failure"));
                handleApiError(err, form);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <div className="add-order">
            <FormAddOrder onSubmit={handleCreateBoxOwning} loading={loading}/>
        </div>
    );
};

AddOrder.propTypes = {
    onSuccess: PropTypes.func
};

export default AddOrder;