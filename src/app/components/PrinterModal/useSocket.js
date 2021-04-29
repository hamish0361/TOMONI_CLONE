import { useCallback, useRef } from "react";
import useTrans from "helper/useTrans";
import { useSelector } from "react-redux";

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const SOCKET_STATUS = Object.freeze({
    'CONNECTING': 0,
    'OPEN': 1,
    'CLOSING': 2,
    'CLOSED': 3
});

export default function useSocket({
    pushMessage,
    onPrinterResult,
    onResponsePrinterName
}) {
    const defaultIPServer = useSelector( state => state.warehouse.settings.printer.socketServer );
    const socket = useRef(null);
    const [trans] = useTrans();

    const connect = useCallback(() => {
        return new Promise((resolve, reject) => {
            pushMessage(trans("printer.connecting_x_ip", { ip: defaultIPServer }));

            const sk = new WebSocket(defaultIPServer + '?encoding=text');
            socket.current = sk;
    
            setTimeout(() => {
                if(socket.current.readyState === SOCKET_STATUS.OPEN) {
                    pushMessage(trans("printer.connected_ip", { ip: defaultIPServer }));
                    resolve();
                } else {
                    socket.current.close();
                    pushMessage(trans("printer.connect_failure_x_ip"));
                    reject();
                }
            }, 1000);
        });
    }, [defaultIPServer, pushMessage, trans]);

    const sendData = useCallback((data) => {
        socket.current.send(data);
        pushMessage(trans("printer.data_sended"));
    }, [pushMessage, trans]);

    const closeSocket = useCallback(() => {
        if(socket.current) socket.current.close();

        socket.current = null;
    }, []);

    const listenMessage = useCallback(() => {
        socket.current.onmessage = function (evt) {

            // Nếu data không thể parse từ JSON thì đó k phải là dữ liệu chúng ta cần
            if (!isJsonString(evt?.data)) return;

            const evtData = JSON.parse(evt.data) || {};

            // Nhận kết quả khi in có kết quả
            // type phải là "PRINT_RESULT"
            if (evtData?.type === "PRINT_RESULT") {
                onPrinterResult && onPrinterResult(evtData);
            }

            if (evtData?.type === "PRINTER_NAME") {
                onResponsePrinterName && onResponsePrinterName(evtData);
            }
        }
    }, [onResponsePrinterName, onPrinterResult]);

    return {
        socketStatus: socket.current?.readyState !== undefined ? socket.current?.readyState : 3,
        connect,
        sendData,
        closeSocket,
        listenMessage
    };
}