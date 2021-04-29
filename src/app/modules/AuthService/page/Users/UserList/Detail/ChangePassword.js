import React, { useState } from 'react';
import { Card, CardBody } from '_metronic/_partials/controls';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import './index.scss';
import _ from 'lodash';

ChangePassword.propTypes = {
    onChangePassword: PropTypes.func
};

function ChangePassword({ onChangePassword, intl }) {
    const { register, handleSubmit, errors, reset } = useForm();

    const [isShowPassword, setIsShowPassword] = useState(true);
    const [isShowCurrent, setIsShowCurrent] = useState(false);
    const [isShowConfirmation, setIsShowConfirmation] = useState(false);
    const [passNew, setPassNew] = useState('');
    const [passConfirmation, setPassConfirmation] = useState('');

    const handleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    };
    const handleShowCurrent = () => {
        setIsShowCurrent(!isShowCurrent);
    };
    const handleShowConfirmation = () => {
        setIsShowConfirmation(!isShowConfirmation);
    };
    const handleSubmitForm = data => {
        onChangePassword(data);
        reset();
    };
    return (
        <Card className="h-100">
            <div className="card-header">
                <div className="card-title card-label">
                    <h3 className="card-label">
                        {intl.formatMessage({
                            id: 'AUTH.CHANGE_PASS.TITLE'
                        })}
                    </h3>
                </div>
                <div className="card-toolbar">
                    {' '}
                    <button
                        className="btn btn-primary ml-2"
                        onClick={handleSubmit(handleSubmitForm)}
                        type="submit"
                    >
                        {intl.formatMessage({
                            id: 'GLOBAL.BUTTON.UPDATE'
                        })}
                    </button>
                </div>
            </div>
            <CardBody>
                <form>
                    <div className="form-group row align-items-center">
                        <div className="col-4">
                            <span className="order-title">
                                {' '}
                                {intl.formatMessage({
                                    id: 'AUTH.CHANGE_PASS.CURRENT_PASS'
                                })}
                            </span>
                        </div>
                        <div className="col-8">
                            <input
                                placeholder="******"
                                type={isShowPassword ? 'text' : 'password'}
                                className="form-control"
                                name="current_password"
                                ref={register}
                            />
                            <span
                                toggle="#password-field"
                                className={
                                    isShowPassword
                                        ? 'fa fa-fw fa-eye field-icon toggle-password'
                                        : 'fa fa-fw fa-eye-slash field-icon toggle-password'
                                }
                                onClick={handleShowPassword}
                            ></span>
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <div className="col-4">
                            <span className="order-title">
                                {' '}
                                {intl.formatMessage({
                                    id: 'AUTH.CHANGE_PASS.NEW_PASS'
                                })}
                            </span>
                        </div>
                        <div className="col-8">
                            <input
                                placeholder="******"
                                type={isShowCurrent ? 'text' : 'password'}
                                className="form-control"
                                name="password"
                                ref={register({ required: true, minLength: 6 })}
                                onChange={e => setPassNew(e.target.value)}
                            />
                            {errors.password && (
                                <p
                                    style={{
                                        color: 'red',
                                        margin: 'unset'
                                    }}
                                >
                                    {intl.formatMessage({
                                        id: 'AUTH.VALIDATION.PASSWORD'
                                    })}
                                </p>
                            )}
                            <span
                                toggle="#password-field"
                                style={{
                                    float: 'right',
                                    marginTop: errors.password
                                        ? ' -44px'
                                        : '-25px',
                                    marginRight: '7px'
                                }}
                                className={
                                    isShowCurrent
                                        ? 'fa fa-fw fa-eye  toggle-password'
                                        : 'fa fa-fw fa-eye-slash  toggle-password'
                                }
                                onClick={handleShowCurrent}
                            ></span>
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <div className="col-4">
                            <span className="order-title">
                                {intl.formatMessage({
                                    id: 'AUTH.CHANGE_PASS.CONFIRMATION_PASS'
                                })}
                            </span>
                        </div>
                        <div className="col-8">
                            <input
                                placeholder="******"
                                type={isShowConfirmation ? 'text' : 'password'}
                                className="form-control"
                                name="password_confirmation"
                                ref={register}
                                onChange={e =>
                                    setPassConfirmation(e.target.value)
                                }
                            />
                            {_.isEqual(passNew, passConfirmation) ? (
                                ''
                            ) : (
                                <p
                                    style={{
                                        color: 'red',
                                        margin: 'unset'
                                    }}
                                >
                                    {intl.formatMessage({
                                        id: 'AUTH.VALIDATION.CONFIRM_PASSWORD'
                                    })}
                                </p>
                            )}
                            <span
                                toggle="#password-field"
                                style={{
                                    float: 'right',
                                    marginTop: _.isEqual(
                                        passNew,
                                        passConfirmation
                                    )
                                        ? '-25px'
                                        : '-44px',
                                    marginLeft: '-25px',
                                    marginRight: '7px',
                                    position: 'relative',
                                    zIndex: '2'
                                }}
                                className={
                                    isShowConfirmation
                                        ? 'fa fa-fw fa-eye  toggle-password'
                                        : 'fa fa-fw fa-eye-slash  toggle-password'
                                }
                                onClick={handleShowConfirmation}
                            ></span>
                        </div>
                    </div>
                </form>
            </CardBody>
        </Card>
    );
}

export default React.memo(ChangePassword);
