import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { printerSocketConfig } from 'config/printerSocket';
import { toAbsoluteUrl } from '_metronic/_helpers';
import clsx from 'clsx';
import useTrans from 'helper/useTrans';

import SVG from 'react-inlinesvg';
import Draggable from 'react-draggable';

import './index.scss';

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const PrinterModal = () => {
    const [show, setShow] = useState(false);
    const [data, setData] = useState();
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    const [showBtnReconnect, setShowBtnReconnect] = useState(false);
    const [messages, setMessage] = useState([]);

    const socket = useRef(null);
    const messageRef = useRef([]);

    const [trans] = useTrans();
    const [title, setTitle] = useState(trans("printer.will_connect"));

    /** showPlaceHolder === true --> hiện nhãn máy in thay vì model kết quả in */
    const togglePlaceholder = () => { setShowPlaceholder(!showPlaceholder) }

    const defaultIPServer = useSelector(
        state => state.warehouse.settings.printer.socketServer
    );

    const pushMessage = useCallback((...newMess) => {
        messageRef.current = [...newMess, ...messageRef.current];
        setMessage(messageRef.current);
    }, [setMessage]);

    // Khi defaultIPServer thay đổi, reset modal để tạo connect mới
    useEffect(() => {
        closeModal();
    }, [defaultIPServer]); // eslint-disable-line

    // Listen event để mở modal & gắn data
    useEffect(() => {
        window.addEventListener('start-tomoni-printer', handlePreparePrint);

        return () => {
            window.removeEventListener('start-tomoni-printer', handlePreparePrint);
        }
    }, [handlePreparePrint]); // eslint-disable-line

    // Khởi chạy socket & gửi data & listen message
    const handleStartPrinter = useCallback((evtDetail) => {

        console.log(evtDetail, 'evtDetail')

        setShowPlaceholder(true);

        connectSocket(defaultIPServer);
        listenSocketConnectAndSendData(evtDetail);
        listenSocketMessage(evtDetail);
    }, []); // eslint-disable-line

    // Event handler cho event 'start-tomoni-printer'
    const handlePreparePrint = useCallback((evt) => {
        let printData = evt.detail;

        setData(printData);
        setShow(true);

        closeSocket();
        handleStartPrinter(printData);
    }, [handleStartPrinter]);

    const listenSocketConnectAndSendData = useCallback((d) => {
        /** Đã có sẵn kết nối */
        if (socket.current.readyState === 1) {
            socket.current.send(d);
            pushMessage(trans("printer.printing"), trans("printer.connect_exist_ip", { ip: defaultIPServer }), '-----------------------------');
        } else {
            /** Chưa có sẵn kết nối */
            socket.current.onopen = function () {
                setShowBtnReconnect(false);
                pushMessage(trans("printer.connected_ip", { ip: defaultIPServer }));

                socket.current.send(d);
                pushMessage(trans("printer.printing"));

                setShowPlaceholder(true);
            };
        }

        socket.current.onerror = function (evt) {
            setShowBtnReconnect(true);
            pushMessage(trans("printer.connect_failure_x_ip"));

            socket.current = null;

            handleStartPrinter(d);
        };
    }, [pushMessage, defaultIPServer, handleStartPrinter]); // eslint-disable-line

    const listenSocketMessage = useCallback((evtDetail) => {
        socket.current.onmessage = function (evt) {

            // Nếu data không thể parse từ JSON thì đó k phải là dữ liệu chúng ta cần
            if (!isJsonString(evt?.data)) return;

            const evtData = JSON.parse(evt.data) || {};

            // Nhận kết quả khi in có kết quả
            // type phải là "PRINT_RESULT"
            if (evtData?.type === "PRINT_RESULT") {
                let countInPrintProcess = 1;

                try {
                    countInPrintProcess = JSON.parse(evtDetail).quantity || 1;
                } finally {

                    console.log(evtData, 'evtData')

                    if (evtData?.status == 1) { // eslint-disable-line
                        pushMessage(trans("printer.printing_error_x_count_message", { count: evtData.Count, message: evtData?.message }));
                        showBtnReconnect(true);

                    } else {
                        pushMessage(trans("printer.print_success_x_count", { count: evtData.Count || 1 }));
                    }

                    if (Number(evtData.Count) >= Number(countInPrintProcess)) {
                        pushMessage(trans("printer.print_complete_x_count", { count: countInPrintProcess }));
                    }
                }
            }

            if (evtData?.type === "PRINTER_NAME") {
                evtData?.message && setTitle(evtData?.message)
            }
        }
    }, [pushMessage, trans, showBtnReconnect]);

    const connectSocket = useCallback((ipConnect) => {

        let serverIP = ipConnect || defaultIPServer;

        pushMessage(trans("printer.connecting_x_ip", { ip: serverIP }));

        const sk = new WebSocket(serverIP + '?encoding=text', printerSocketConfig);
        socket.current = sk;
        
    }, [pushMessage, defaultIPServer]); // eslint-disable-line

    /**
     * Đóng modal
     * 1. Clear socket variable
     * 2. Clear message list
     * 3. Clear data
     * 4. Close modal
     */
    const closeModal = (e) => {
        e && e.stopPropagation();
        pushMessage(trans("printer.close_modal"));

        closeSocket();
        messageRef.current = [];
        setMessage([]);
        setData(undefined);
        setShow(false);
    }

    const closeSocket = () => {
        if(socket.current) {
            socket.current.close();
        }

        socket.current = null;
    }

    return (
        <>
            {show && (
                <Draggable>
                    <div className={clsx("modal-print", showPlaceholder ? 'placeholder' : 'shadow')}>
                        {showPlaceholder ? (
                            <div className="printer-placeholder" onClick={togglePlaceholder}>
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
                                <div className="modal-print-header" onClick={togglePlaceholder}>
                                    <span className="title">{title}</span>
                                    {/* <span aria-hidden="true" className="hide-modal" onClick={closeModal}>×</span> */}
                                </div>
                                <div className="messages-wrapper">
                                    {messages.map((mess, idx) => (
                                        <div className="message-item" key={`message-${idx}`}>- {mess}</div>
                                    ))}
                                </div>
                                <div className="actions-section">
                                    {!!showBtnReconnect && (
                                        <div className="text-center">
                                            <button className="btn btn-primary" onClick={() => handleStartPrinter(data)}>{trans("printer.re_connect")}</button>
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
    var evt = new CustomEvent('start-tomoni-printer', {
        detail: dataSend,
    });
    window.dispatchEvent(evt);
};