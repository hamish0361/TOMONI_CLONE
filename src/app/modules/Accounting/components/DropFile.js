import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useTrans from 'helper/useTrans';
import { useDropzone } from 'react-dropzone';

DropFile.propTypes = {
    onFileDrop: PropTypes.func
};

function DropFile({ onFileDrop = null }) {
    const [trans] = useTrans();
    const [fileOrder, setFileOrder] = useState(null);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop: files => {
            setFileOrder(files);
            onFileDrop && onFileDrop(files);
        }
    });

    const files = acceptedFiles.map(file => (
        <h4 key={file.path} className="ml-2 mt-4">
            Files: {file.path}
        </h4>
    ));

    return (
        <div>
            <div className="rsg--preview-60">
                <div
                    {...getRootProps({
                        className: 'dropzone'
                    })}
                >
                    <input {...getInputProps()} />
                    <div className="d-flex align-items-center justify-content-center border py-4">
                        <div>
                            <div className="d-flex align-items-center justify-content-center">
                                <img
                                    className="img-drop-zone"
                                    src={`${
                                        fileOrder === null
                                            ? 'https://img.icons8.com/dusk/64/000000/add-file--v1.png'
                                            : 'https://img.icons8.com/dusk/64/000000/check-file.png'
                                    }`}
                                    alt="Tomoni Solution"
                                />
                            </div>
                            <div>
                                {fileOrder === null
                                    ? trans('ORDER.PAYMENT.DROP_FILE')
                                    : trans(
                                          'ORDER.PAYMENT.UPDATE.FILE.SUCCESS'
                                      )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overflow-hidden">{files}</div>
            </div>
        </div>
    );
}

export default DropFile;
