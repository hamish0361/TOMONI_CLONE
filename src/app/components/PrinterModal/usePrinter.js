import useTrans from 'helper/useTrans';
import { useCallback, useEffect, useRef, useState } from 'react';
import { dialog } from '../DialogNotify';
import useSocket from './useSocket';

export default function usePrinter(setShow) {
    const dataSend = useRef();
    const messageRef = useRef([]);
    const [messages, setMessage] = useState([]);
    const [shouldReconnect, setShouldReconnect] = useState(false);

    const [trans] = useTrans();
    const [modalTitle, setModalTitle] = useState(trans('printer.will_connect'));

    const pushMessage = useCallback(
        (...newMess) => {
            messageRef.current = [...newMess, ...messageRef.current];
            setMessage(messageRef.current);
        },
        [setMessage]
    );

    const {
        connect,
        sendData,
        listenMessage,
        closeSocket,
        socketStatus
    } = useSocket({
        pushMessage,
        onResponsePrinterName: data => {
            data?.message && setModalTitle(data?.message);
        },
        onPrinterResult: data => {
            let countInPrintProcess = 1;

            try {
                countInPrintProcess =
                    JSON.parse(dataSend.current).quantity || 1;
            } finally {
                // eslint-disable-next-line
                if (data?.status == 1) {
                    pushMessage(
                        trans('printer.printing_error_x_count_message', {
                            count: data.Count,
                            message: data?.message
                        })
                    );
                    setShouldReconnect(true);
                } else {
                    pushMessage(
                        trans('printer.print_success_x_count', {
                            count: data.Count || 1
                        })
                    );
                }

                if (Number(data.Count) >= Number(countInPrintProcess)) {
                    pushMessage(
                        trans('printer.print_complete_x_count', {
                            count: countInPrintProcess
                        })
                    );
                }
            }
        }
    });

    const handlePrint = useCallback(
        evt => {
            dataSend.current = evt;
            let printData = evt.detail;
            setShow(true);

            if (socketStatus === 1) {
                // SOCKET_STATUS.OPEN
                sendData(printData);
            } else {
                connect()
                    .then(() => {
                        listenMessage();
                        sendData(printData, true);
                    })
                    .catch(() => {
                        dialog.warning(trans("printer.not_ready.title"));
                        setShouldReconnect(true);
                    });
            }
        },
        [connect, listenMessage, sendData, setShouldReconnect, socketStatus, setShow, trans]
    );

    // Listen event để mở modal & gắn data
    useEffect(() => {
        window.addEventListener('start-tomoni-label-printer', handlePrint);

        return () => {
            window.removeEventListener(
                'start-tomoni-label-printer',
                handlePrint
            );
        };
    }, [handlePrint]); // eslint-disable-line

    const resetPrinter = () => {
        closeSocket();
        messageRef.current = [];
        setMessage([]);
    };

    const reprint = useCallback(() => {
        handlePrint(dataSend.current);
    }, [handlePrint]);

    return {
        messages,
        shouldReconnect,
        modalTitle,
        reprint,
        resetPrinter
    };
}
