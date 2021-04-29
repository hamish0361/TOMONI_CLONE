import { dialog } from 'app/components/DialogNotify';
import DropFile from 'app/modules/Accounting/components/DropFile';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { ModalBody } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import NumberFormat from 'react-number-format';
import { shallowEqual, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import {
    Button,
    Form,
    FormGroup,
    Label,
    Modal,
    ModalFooter,
    ModalHeader
} from 'reactstrap';

DialogPayment.propTypes = {
    onHide: PropTypes.func,
    onDeposit: PropTypes.func,

    show: PropTypes.bool
};

const DEPOSIT_TYPE = 'deposit';

function DialogPayment({ onHide, onDeposit, show, intl }) {
    const { handleSubmit, register, control } = useForm();
    const [files, setFiles] = useState(null);

    const { id, currencyId } = useParams();
    const { currencies } = useSelector(
        ({ home }) => ({
            currencies: home.home.currencyList
        }),
        shallowEqual
    );

    const handleDeposit = ({ amount, description }) => {
        const amountNumber =
            typeof amount === 'string' && amount.includes(',')
                ? amount.replaceAll(',', '')
                : amount;

        if (!amount) {
            dialog.warning(
                intl.formatMessage({ id: 'ACCOUNTING.DEPOSIT.AMOUNT.WARNING' })
            );
        } else {
            const formData = new FormData();
            if (files?.length > 0) {
                formData.append('receipts[0][file]', files[0], files[0]?.name);
            }
            const req = {
                params: {
                    amount: amountNumber,
                    description,
                    type_id: DEPOSIT_TYPE,
                    user_id: id,
                    currency_id: currencyId
                },
                body: files?.length > 0 ? formData : ''
            };
            onDeposit && onDeposit(req);
        }
    };

    const handleCurrency = () => {
        const index = currencies?.findIndex(x => x.id === currencyId);

        if (index !== -1) {
            return currencies[index].name;
        }
        return;
    };

    return (
        <Modal
            returnFocusAfterClose={true}
            isOpen={show}
            className="dialog-common"
        >
            <ModalHeader>
                <FormattedMessage id="ACCOUNTING.PAYMENT.TITLE" />
            </ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit(handleDeposit)} id="deposit-form">
                    <FormGroup>
                        <Label className="font-size-h6 text-dark">
                            <FormattedMessage id="ACCOUNTING.ACCOUNT.CURRENCY" />
                        </Label>
                        <div className="form-control bg-light">
                            {handleCurrency()}
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label className="font-size-h6 text-dark">
                            <FormattedMessage id="ACCOUNTING.AMOUNT" />
                        </Label>
                        <Controller
                            name="amount"
                            control={control}
                            defaultValue={null}
                            as={NumberFormat}
                            className="form-control"
                            placeholder="Nhập số tiền"
                            thousandSeparator
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label className="font-size-h6 text-dark">
                            <FormattedMessage id="ACCOUNTING.DESCRIPTION" />
                        </Label>
                        <input
                            name="description"
                            type="textarea"
                            className="form-control"
                            placeholder={intl.formatMessage({
                                id: 'GLOBAL.PLACEHOLER.INPUT'
                            })}
                            ref={register}
                        />
                    </FormGroup>
                </Form>
                <FormGroup>
                    <Label className="font-size-h6 text-dark">
                        <FormattedMessage id="ACCOUNTING.PAYMENT.CHOOSE_RECEIPT" />
                    </Label>
                    <DropFile onFileDrop={files => setFiles(files)} />
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onHide} color="secondary">
                    <FormattedMessage id="GLOBAL.BUTTON.CANCEL" />
                </Button>
                <Button
                    type="submit"
                    color="primary"
                    className="font-weight-bolder"
                    form="deposit-form"
                >
                    <FormattedMessage id="GLOBAL.BUTTON.MONEY" />
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default DialogPayment;
