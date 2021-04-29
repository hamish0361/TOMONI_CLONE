import CustomModal from 'app/components/CustomModal';
import PropTypes from 'prop-types';
import React from 'react';
import { Modal } from 'react-bootstrap';
import '@pathofdev/react-tag-input/build/index.css';
import { ModalProgressBar } from '_metronic/_partials/controls';
import { Divider } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import { useHistory } from 'react-router-dom';
import DialogNewReceipt from './DialogNewReceipt';

DialogDetailTransaction.propTypes = {
    detailTransaction: PropTypes.object,
    onHide: PropTypes.func,
    show: PropTypes.bool,
    onFilesReceipt: PropTypes.func,
    onDeleteReceipt: PropTypes.func,
    listTransaction: PropTypes.array,
    isActionLoading: PropTypes.bool,
    isLoadingDetail: PropTypes.bool,
    onFilesReceiptNew: PropTypes.func,
    showNew: PropTypes.bool,
    onHideNew: PropTypes.func,
    onNewOrderReceipt: PropTypes.func,
    onShowModalNewOrder: PropTypes.func
};

function DialogDetailTransaction({
    detailTransaction = {},
    show = false,
    onHide = null,
    onFilesReceipt,
    onDeleteReceipt,
    isActionLoading,
    isLoadingDetail,
    onFilesReceiptNew,
    intl,
    showNew,
    onHideNew,
    onNewOrderReceipt,
    onShowModalNewOrder
}) {
    const RETAIL_ID = 'OR';
    const WHOLESALE_ID = 'OW';
    const PAYMENT_ID = 'OP';
    const SHIPMENT_ID = 'OS';
    const history = useHistory();

    const navigateOrderPage = orderId => {
        if (orderId.includes(RETAIL_ID)) {
            history.push(`/ban-hang/don-le/${orderId}/chi-tiet`);
        } else if (orderId.includes(SHIPMENT_ID)) {
            history.push(`/ban-hang/don-van-chuyen-ho/${orderId}/chi-tiet`);
        } else if (orderId.includes(PAYMENT_ID)) {
            history.push(`/ban-hang/don-thanh-toan-ho/${orderId}/chi-tiet`);
        } else if (orderId.includes(WHOLESALE_ID)) {
            history.push(`/ban-hang/don-si/${orderId}/chi-tiet`);
        } else {
            return;
        }
    };
    const handleNewOrderReceipt = data => {
        onNewOrderReceipt(data);
    };
    return (
        <>
            {/*Modal*/}
            <CustomModal
                show={show}
                title={intl.formatMessage({
                    id: 'ACCOUNTING.ORDER.DETAIL.TRANSACTION.TITLE'
                })}
                onHide={onHide}
            >
                {(isLoadingDetail || isActionLoading) && <ModalProgressBar />}
                <Modal.Body className="overlay overlay-block cursor-default">
                    <div className="row">
                        <div className="form-group col-lg-6">
                            <label className="modal-title font-size-h6 mt-5 text-dark">
                                {intl.formatMessage({
                                    id: 'ACCOUNTING.ORDER.EXECUTION_DATE'
                                })}
                            </label>
                            <div className="input-group input-group-solid">
                                <input
                                    name="update_at"
                                    type="text"
                                    className="form-control"
                                    value={detailTransaction?.created_at || ''}
                                    disabled={true}
                                />
                            </div>
                        </div>
                        <div className="form-group col-lg-6">
                            <label className="modal-title font-size-h6 mt-5 text-dark">
                                {intl.formatMessage({
                                    id: 'ACCOUNTING.ORDER.TYPE'
                                })}
                            </label>
                            <div className="input-group input-group-solid">
                                <input
                                    name="update_at"
                                    type="text"
                                    className="form-control"
                                    value={detailTransaction?.type?.name || ''}
                                    disabled={true}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-lg-6">
                            <label className="modal-title font-size-h6 mt-5 text-dark">
                                {intl.formatMessage({
                                    id: 'ACCOUNTING.ORDER.AMOUNT_OF_MONEY'
                                })}
                            </label>
                            <div className="form-control bg-light">
                                {detailTransaction?.amount || ''}
                            </div>
                        </div>
                        <div className="form-group col-lg-6">
                            <label className="modal-title font-size-h6 mt-5 text-dark">
                                {intl.formatMessage({
                                    id: 'ACCOUNTING.ORDER.USER'
                                })}
                            </label>
                            <div className="form-control bg-light">
                                {detailTransaction?.user?.id || ''}
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="form-group col-lg-6">
                            <label className="modal-title font-size-h6 mt-5 text-dark">
                                {intl.formatMessage({
                                    id: 'ACCOUNTING.ORDER.USER'
                                })}
                            </label>
                            <div className="form-control bg-light">
                                {detailTransaction?.user_id || ''}
                            </div>
                        </div>
                        <div className="form-group col-lg-6">
                            <label className="modal-title font-size-h6 mt-5 text-dark">
                                {intl.formatMessage({
                                    id: 'ACCOUNTING.ORDER.PERFORMER'
                                })}
                            </label>
                            <div className="form-control bg-light">
                                {detailTransaction?.prepared_by_id || ''}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-group col-lg-6">
                            <label className="modal-title font-size-h6 mt-5 text-dark">
                                {intl.formatMessage({
                                    id: 'ACCOUNTING.ORDER.DESCRIPTION'
                                })}
                            </label>
                            <div className="form-control bg-light">
                                {detailTransaction?.description || ''}
                            </div>
                        </div>
                        <div className="form-group col-lg-6">
                            <label className="modal-title font-size-h6 mt-5 text-dark">
                                {intl.formatMessage({
                                    id: 'ACCOUNTING.ORDER.UPDATE_DATE'
                                })}
                            </label>
                            <div className="form-control bg-light">
                                {detailTransaction?.updated_at || ''}
                            </div>
                        </div>
                    </div>
                    <Divider />
                    <div>
                        <div className="row px-4 justify-content-between d-flex align-items-center">
                            <div
                                className="modal-title h4 mt-5 modal-title font-size-h6 mt-5 text-dark"
                                id="example-modal-sizes-title-lg"
                            >
                                {intl.formatMessage({
                                    id:
                                        'ACCOUNTING.ORDER.DETAIL.TRANSACTION.RECEIPT'
                                })}
                            </div>
                            <button
                                className="btn btn-primary float-right btn-sm mt-5"
                                onClick={() => onShowModalNewOrder()}
                            >
                                Thêm đơn
                            </button>
                        </div>
                        <div>
                            <div className="row pt-5">
                                {detailTransaction?.receipts?.map(
                                    (transaction, index) => (
                                        <div
                                            key={index}
                                            className="form-group col-lg-3"
                                        >
                                            <Chip
                                                style={{
                                                    fontSize: 'large',
                                                    backgroundColor: '#ff6464',
                                                    color: '#fff'
                                                }}
                                                label={
                                                    transaction?.receiptable_id
                                                }
                                                onDelete={() =>
                                                    onDeleteReceipt(
                                                        transaction.id,
                                                        detailTransaction?.id
                                                    )
                                                }
                                                onClick={() =>
                                                    navigateOrderPage(
                                                        transaction?.receiptable_id
                                                    )
                                                }
                                                size={'medium'}
                                            ></Chip>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type="button"
                        onClick={onHide}
                        className="btn btn-light btn-elevate modal-title font-size-h6 mt-5 text-dark"
                    >
                        Cancel
                    </button>
                </Modal.Footer>
            </CustomModal>
            <DialogNewReceipt
                show={showNew}
                onHide={onHideNew}
                onNewOrder={handleNewOrderReceipt}
                intl={intl}
            />
        </>
    );
}

export default DialogDetailTransaction;
