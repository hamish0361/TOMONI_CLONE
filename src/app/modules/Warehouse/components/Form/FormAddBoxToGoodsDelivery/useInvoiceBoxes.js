import { useEffect, useState } from 'react';

import warehouseApi from 'apis/warehouse';
import useTrans from 'helper/useTrans';
import _ from 'lodash';

import { dialog } from 'app/components/DialogNotify';

export default function useInvoiceBoxes(invoiceId) {
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [trans] = useTrans();

    useEffect(() => {
        if (invoiceId) {
            getInvoiceBoxes();
        }
    }, [invoiceId]); // eslint-disable-line

    const getInvoiceBoxes = () => {
        setLoading(true);
        warehouseApi.invoice
            .fetchInvoice(invoiceId, {
                with: 'outPickers.box.owners.pivotLadingBills'
            })
            .then(invoiceResponse => {

                let boxLadingBills = invoiceResponse.out_pickers.reduce((p, c) => {

                    let ownerBoxLadingBills = c.box.owners.reduce((pB, cB) => {
                        let pivotBoxLadingBills = cB.pivot_lading_bills.map((pLb) => ({
                            ...pLb,
                            owning_box: _.omit(cB, ['pivotBoxLadingBills'])
                        }));

                        return [...pB, ...pivotBoxLadingBills];
                    }, []);

                    return [...p, ...ownerBoxLadingBills]
                }, []);

                setBoxes(boxLadingBills);
            })
            .catch(err => {
                console.error(err);

                setBoxes([]);

                dialog.error(trans('common.fetch.failure'));
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return { boxes, loading };
}
