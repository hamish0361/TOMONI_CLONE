import formatNumber from 'helper/formatNumber';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

DialogTransactionDetail.propTypes = {
    open: PropTypes.bool,
    transaction: PropTypes.object,

    onHide: PropTypes.func,
    onUpdate: PropTypes.func
};

function DialogTransactionDetail({ open, transaction, onHide, onUpdate }) {
    const { handleSubmit, register, control } = useForm();

    const { types } = useSelector(
        ({ accounting }) => ({ types: accounting.transaction.typeList }),
        shallowEqual
    );

    const [type, setType] = useState(null);

    useEffect(() => {
        if (open) {
            setType({
                value: transaction?.type_id,
                label: transaction?.type?.name
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleChangeType = type => {
        setType(type);
    };

    const handleUpdate = ({ type, description }) => {
        const body = {
            id: transaction.id,
            params: {
                type: type?.value,
                description
            }
        };

        onUpdate(body);
    };

    const typeOptions = types?.map(item => {
        return {
            value: item.id,
            label: item.name
        };
    });

    const orders = transaction?.receipts?.map(transaction => {
        return transaction.receiptable_id;
    });

    return (
        <Modal
            isOpen={open}
            returnFocusAfterClose={true}
            className="dialog-common"
        >
            <ModalHeader>
                <FormattedMessage id="ACCOUNTING.DEPOSIT.SUCCESS" />
            </ModalHeader>
            <ModalBody>
                <div>
                    <div className="row form-group">
                        <div className="col-6">
                            <label>
                                <FormattedMessage id="ACCOUNTING.ACCOUNT.CREATED_AT" />
                            </label>
                            <div className="form-control bg-light">
                                {transaction?.created_at}
                            </div>
                        </div>
                        <div className="col-6">
                            <label>
                                <FormattedMessage id="ACCOUNTING.PERFORMER" />
                            </label>
                            <div className="form-control bg-light">
                                {transaction?.prepared_by_id}
                            </div>
                        </div>
                    </div>
                    <div className="row form-group">
                        <div className="col-6">
                            <label>
                                <FormattedMessage id="ACCOUNTING.AMOUNT" />
                            </label>
                            <div className="form-control bg-light">
                                {formatNumber(transaction?.amount)}
                            </div>
                        </div>
                        <div className="col-6">
                            <label>
                                <FormattedMessage id="ACCOUNTING.ACCOUNT" />
                            </label>
                            <div className="form-control bg-light">
                                {transaction?.user_id}
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit(handleUpdate)}
                        id="update-history-form"
                    >
                        <div className="row form-group">
                            <div className="col-6">
                                <label>
                                    <FormattedMessage id="ACCOUNTING.TYPE" />
                                </label>
                                <Controller
                                    name="type"
                                    control={control}
                                    defaultValue={null}
                                    render={({ onChange }) => (
                                        <Select
                                            options={typeOptions}
                                            value={type}
                                            onChange={type => {
                                                onChange(type);
                                                handleChangeType(type);
                                            }}
                                        />
                                    )}
                                />
                            </div>

                            <div className="col-6">
                                <label>
                                    <FormattedMessage id="ACCOUNTING.DESCRIPTION" />
                                </label>
                                <input
                                    name="description"
                                    ref={register}
                                    className="form-control"
                                    defaultValue={transaction?.description}
                                />
                            </div>
                        </div>
                    </form>
                    <div className="row form-group">
                        <div className="col-6">
                            <label>File</label>
                            <div className="form-control bg-light overflow-hidden">
                                <a
                                    href={`${process.env.REACT_APP_API_URL_ACCOUNTING}/files/${transaction?.receipts[0]?.path_file}`}
                                    download
                                >
                                    {transaction?.receipts[0]?.path_file}
                                </a>
                            </div>
                        </div>
                        {transaction?.type_id !== 'deposit' ? (
                            <div className="col-6">
                                <label>
                                    <FormattedMessage id="ACCOUNTING.ORDER" />
                                </label>
                                <div className="form-control bg-light">
                                    {orders?.join('; ')}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={onHide}>
                    <FormattedMessage id="GLOBAL.BUTTON.CANCEL" />
                </Button>
                <Button
                    type="submit"
                    color="primary"
                    form="update-history-form"
                >
                    <FormattedMessage id="GLOBAL.BUTTON.UPDATE" />
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default DialogTransactionDetail;
