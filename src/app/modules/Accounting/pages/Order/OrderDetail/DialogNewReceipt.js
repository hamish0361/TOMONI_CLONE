import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import CustomModal from 'app/components/CustomModal';
import { Modal } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import _ from 'lodash';
import { fetchOrder } from 'app/modules/Order/order-redux/orderSlice';

DialogNewReceipt.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func,
    onNewOrder: PropTypes.func,
    customerId: PropTypes.string
};

function DialogNewReceipt({ show, onHide, onNewOrder, intl, customerId }) {
    const dispatch = useDispatch();
    const { handleSubmit, control, reset } = useForm({});
    const orderList = useSelector(state => state.order.list.orderList);

    const optionOrderList = orderList?.map(item => {
        return {
            label: `${item?.id} - ${item?.customer_id} - ${item?.status?.name}`,
            value: item?.id
        };
    });

    // eslint-disable-next-line
    const handleSearchOrder = useCallback(
        _.debounce((e, fetchData) => {
            if (e.length > 0) {
                const params = {
                    search: `id:${e};customer_id:${customerId}`,
                    searchFields: `id:like;customer_id:like`
                };
                dispatch(fetchData(params));
            }
        }, 200),
        []
    );

    const onSubmit = data => {
        onNewOrder(data);
        reset();
        onHide();
    };
    return (
        <div>
            <>
                {/*Modal*/}
                <CustomModal
                    show={show}
                    title={intl.formatMessage({
                        id: 'ACCOUNTING.CREATE.NEW_PAYMENT_SALE.TITLE'
                    })}
                    onHide={onHide}
                    size="lg"
                    backdrop="static"
                    aria-labelledby="contained-modal-title-vcenter"
                >
                    <Modal.Body className="overlay overlay-block cursor-default">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="row">
                                <div className="form-group col-lg-6">
                                    <label className="modal-title font-size-h6 text-dark">
                                        {intl.formatMessage({
                                            id:
                                                'ACCOUNTING.CREATE.NEW_PAYMENT_SALE.RECIEPT'
                                        })}
                                    </label>
                                    <div className="form-control bg-light">
                                        Order
                                    </div>
                                </div>
                                <div className="form-group col-lg-6">
                                    <label className="modal-title font-size-h6 text-dark">
                                        {intl.formatMessage({
                                            id: 'DASHBOARD.ORDER.ID'
                                        })}
                                    </label>
                                    <Controller
                                        name="receiptable_id"
                                        control={control}
                                        defaultValue={''}
                                        as={
                                            <Select
                                                options={optionOrderList}
                                                placeholder={intl.formatMessage(
                                                    {
                                                        id:
                                                            'GLOBAL.PLACEHOLER.SELECT'
                                                    }
                                                )}
                                                onInputChange={e =>
                                                    handleSearchOrder(
                                                        e,
                                                        fetchOrder
                                                    )
                                                }
                                            />
                                        }
                                    />
                                </div>
                            </div>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type="button"
                            onClick={onHide}
                            className="btn btn-light btn-elevate modal-title font-size-h6 text-dark"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            className="btn btn-primary btn-elevate modal-title font-size-h6"
                        >
                            {intl.formatMessage({
                                id: `ACCOUNTING.CREATE.NEW_PAYMENT_SALE.BUTTON`
                            })}
                        </button>
                    </Modal.Footer>
                </CustomModal>
            </>
        </div>
    );
}

export default DialogNewReceipt;
