import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useTrans from 'helper/useTrans';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

PopoverConfirmDelete.propTypes = {
    onYesClick: PropTypes.func,
    id: PropTypes.string
};

const PopoverItem = props => {
    const { id, item, onYesClick } = props;
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [trans] = useTrans();

    const toggle = () => setPopoverOpen(!popoverOpen);

    const handleYesClick = () => {
        setPopoverOpen(!popoverOpen);
        onYesClick && onYesClick();
    };

    return (
        <span>
            <Button
                color="danger"
                size="sm"
                onClick={() => setPopoverOpen(true)}
                id={id}
                type="button"
            >
                {trans('common.delete')}
            </Button>
            <Popover
                placement={item.placement}
                isOpen={popoverOpen}
                target={id}
                toggle={toggle}
            >
                <PopoverHeader>
                    <FormattedMessage id="GLOBAL.CONFIRM.DELETE.TITLE" />
                </PopoverHeader>
                <PopoverBody>
                    <div className="font-weight-bold">
                        <FormattedMessage id="GLOBAL.CONFIRM.DELETE" />
                    </div>
                    <div className="d-flex justify-content-end mt-4">
                        <Button
                            color="secondary"
                            size="sm"
                            className="mr-2"
                            onClick={() => setPopoverOpen(false)}
                        >
                            <FormattedMessage id="GLOBAL.LABEL.NO" />
                        </Button>
                        <Button
                            color="danger"
                            size="sm"
                            onClick={handleYesClick}
                        >
                            <FormattedMessage id="GLOBAL.LABEL.YES" />
                        </Button>
                    </div>
                </PopoverBody>
            </Popover>
        </span>
    );
};

function PopoverConfirmDelete({ id, onYesClick }) {
    return <PopoverItem item="Bottom" id={id} onYesClick={onYesClick} />;
}

export default PopoverConfirmDelete;
