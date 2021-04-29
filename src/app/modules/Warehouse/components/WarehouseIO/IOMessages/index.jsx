import React, { useMemo, useRef } from 'react';

import MessageTypePallet from './MessageTypePallet';
import MessageTypeNotify from './MessageTypeNotify';
import MessageTypeBox from './MessageTypeBox';

import './index.scss';
import usePermission from 'app/components/NeedPermission/usePermission';
import ModalConfirm from '../../ModalConfirm';
import useTrans from 'helper/useTrans';

const IOMessage = ({
    messages = [],
    onDelete,
    onEdit,
    permissions
}) => {

    const isCanUpdate = usePermission(permissions.update);
    const isCanDelete = usePermission(permissions.delete);
    const modalConfirmRef = useRef();
    const [trans] = useTrans();

    const confirmDelete = (message) => {
        modalConfirmRef.current.open({
            title: trans("warehouse.io.delete.title"),
            message
        })
    }

    const messageItems = useMemo(() => {
        return messages.map((m, idx) => {
            return (
                <div className="message" key={`message-${idx}`}>
                    {m.type === 'PALLET' && <MessageTypePallet message={m} />}
                    {m.type === 'NOTIFY' && <MessageTypeNotify message={m} onRemove={onDelete ? confirmDelete : undefined} isCanUpdate={isCanUpdate} isCanDelete={isCanDelete} onEdit={onEdit} />}
                    {m.type === 'BOX' && <MessageTypeBox message={m} onRemove={onDelete ? confirmDelete : undefined} isCanUpdate={isCanUpdate} isCanDelete={isCanDelete} onEdit={onEdit} />}
                </div>
            );
        })
    }, [messages, onEdit, isCanUpdate, isCanDelete]); // eslint-disable-line

    const handleDelete = ({ message }) => {
        onDelete && onDelete(message);
    }

    return (
        <div className="io-message-wrapper">
            <div className="io-message-box shadow-sm">

                <ModalConfirm ref={modalConfirmRef} onOk={handleDelete} />

                {messageItems}
            </div>
        </div>
    );
};

export default IOMessage;