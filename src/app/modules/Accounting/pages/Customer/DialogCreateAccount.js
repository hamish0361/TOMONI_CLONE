import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import useDebounce from 'helper/useDebounce';
import { fetchUsers } from 'app/modules/AuthService/auth-service-redux/userSlice';
import { dialog } from 'app/components/DialogNotify';
import useTrans from 'helper/useTrans';

DialogCreateAccount.propTypes = {
    open: PropTypes.bool,

    onHide: PropTypes.func,
    onNewAccount: PropTypes.func
};

function DialogCreateAccount({ open, onHide, onNewAccount }) {
    const dispatch = useDispatch();
    const [trans] = useTrans();
    const { handleSubmit, control } = useForm();
    const [searchCustomer, setSearchCustomer] = useState('');
    const searchCustomerDebounce = useDebounce(searchCustomer);

    const { currencies, users } = useSelector(
        ({ home, authService }) => ({
            currencies: home.home.currencyList,
            users: authService.user.userList
        }),
        shallowEqual
    );

    //options
    const userOptions = users?.map(user => {
        return {
            value: user.id,
            label: user.email
        };
    });

    const currencyOptions = currencies?.map(item => {
        return {
            value: item.id,
            label: item.name
        };
    });

    //handle
    const handleNewAccount = ({ user, currency }) => {
        if (!user) {
            dialog.warning(trans('ACCOUNTING.DEPOSIT.CREATE.USER.WARNING'));
        } else if (!currency) {
            dialog.warning(trans('ACCOUNTING.DEPOSIT.CREATE.CURRENCY.WARNING'));
        } else {
            const body = {
                user_id: user.value,
                currency_id: currency.value
            };
            onNewAccount(body);
        }
    };

    useEffect(() => {
        if (searchCustomerDebounce) {
            dispatch(
                fetchUsers({
                    search: searchCustomerDebounce,
                    searchFields: 'email:like'
                })
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchCustomerDebounce]);

    return (
        <Modal
            returnFocusAfterClose={true}
            isOpen={open}
            className="dialog-common"
        >
            <ModalHeader>
                <FormattedMessage id="ACCOUNTING.DEPOSIT.CREATE.DIALOG" />
            </ModalHeader>
            <ModalBody>
                <form
                    onSubmit={handleSubmit(handleNewAccount)}
                    id="new-account-form"
                >
                    <div className="form-group">
                        <label>
                            <FormattedMessage id="ACCOUNTING.ACCOUNT.USER" />
                        </label>
                        <Controller
                            name="user"
                            control={control}
                            defaultValue="null"
                            render={({ onChange }) => (
                                <Select
                                    onInputChange={val =>
                                        setSearchCustomer(val)
                                    }
                                    options={userOptions}
                                    onChange={onChange}
                                    placeholder="Nhập email người dùng"
                                />
                            )}
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            <FormattedMessage id="ACCOUNTING.ACCOUNT.CURRENCY" />
                        </label>
                        <Controller
                            name="currency"
                            control={control}
                            as={Select}
                            options={currencyOptions}
                            defaultValue="null"
                            placeholder="Nhập loại tiền"
                        />
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onHide} color="secondary">
                    <FormattedMessage id="GLOBAL.BUTTON.CANCEL" />
                </Button>
                <Button type="submit" form="new-account-form" color="primary">
                    <FormattedMessage id="GLOBAL.BUTTON.CREATE.ACCOUNT" />
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default DialogCreateAccount;
