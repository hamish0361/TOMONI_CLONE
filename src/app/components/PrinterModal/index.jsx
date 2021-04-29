import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { toAbsoluteUrl } from '_metronic/_helpers';
import clsx from 'clsx';
import useTrans from 'helper/useTrans';
import usePrinter from './usePrinter';

import SVG from 'react-inlinesvg';
import Draggable from 'react-draggable';

import './index.scss';

const PrinterModal = () => {
    const defaultIPServer = useSelector( state => state.warehouse.settings.printer.socketServer );

    const [show, setShow] = useState(false);
    const [isIconType, setIsIconType] = useState(true);
    const [trans] = useTrans();

    // Khi defaultIPServer thay đổi, reset modal để tạo connect mới
    useEffect(() => {
        closeModal();
    }, [defaultIPServer]); // eslint-disable-line

    const toggleModalType = () => { setIsIconType(!isIconType) }

    const { messages, shouldReconnect, modalTitle, reprint, resetPrinter } = usePrinter(setShow);

    /**
     * Đóng modal
     * 1. Clear socket variable
     * 2. Clear message list
     * 3. Clear data
     * 4. Close modal
     */
    const closeModal = (e) => {
        e && e.stopPropagation();

        resetPrinter();
        setShow(false);
    }

    return (
        <>
            {show && (
                <Draggable>
                    <div className={clsx("modal-print", isIconType ? 'placeholder' : 'shadow')}>
                        {isIconType ? (
                            <div className="printer-placeholder" onClick={toggleModalType}>
                                <span className="svg-icon svg-icon-primary svg-icon-3x">
                                    <SVG
                                        src={toAbsoluteUrl(
                                            '/media/svg/icons/Devices/Printer.svg'
                                        )}
                                    ></SVG>
                                </span>
                            </div>
                        ) : (
                            <div className="printer-main-content">
                                <div className="modal-print-header" onClick={toggleModalType}>
                                    <span className="title">{modalTitle}</span>
                                </div>
                                <div className="messages-wrapper">
                                    {messages.map((mess, idx) => (
                                        <div className="message-item" key={`message-${idx}`}>- {mess}</div>
                                    ))}
                                </div>
                                <div className="actions-section">
                                    {!!shouldReconnect && (
                                        <div className="text-center">
                                            <button className="btn btn-primary" onClick={reprint}>{trans("printer.re_connect")}</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </Draggable>
            )}
        </>
    );
};

export default PrinterModal;

export const startPrinter = dataSend => {
    var evt = new CustomEvent('start-tomoni-label-printer', {
        detail: dataSend,
    });
    window.dispatchEvent(evt);
};