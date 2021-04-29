import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { fetchLadingBill } from 'app/modules/Warehouse/warehouse-redux/ladingBillSlice';
import useTrans from 'helper/useTrans';
import useLadingBillClosed from './useLadingBillClosed';

import LadingBillInfo from './LadingBillInfo';
import LadingBillBox from './LadingBillBox';
import NotFound from 'app/components/NotFound';
import Layout from 'app/modules/Warehouse/components/Layout';
import LadingBillCostInfo from './LadingBillCostInfo';
import { Alert, AlertTitle } from '@material-ui/lab';

import './index.scss';

const LadingBillDetail = props => {
    const { loading, data } = useSelector(
        state => state.warehouse.ladingBill.detail
    );
    const [trans] = useTrans();
    const params = useParams();
    const dispatch = useDispatch();
    const isLadingBillClosed = useLadingBillClosed();

    useEffect(() => {
        if (params?.id) f5LadingBillDetail();
    }, [params?.id]); // eslint-disable-line

    const f5LadingBillDetail = () => {
        dispatch(fetchLadingBill({ id: params?.id, with: "boxLadingBills.owningBox.box.sfa" }));
    }

    if (!loading && !data) return <NotFound />;

    return (
        <Layout className="lading-bill-detail-page" title={`${trans("warehouse.lading_bill.title")} ${params?.id}`}>

            {!!isLadingBillClosed && (
                <Alert
                    severity="error"
                    className="my-10"
                >
                    <AlertTitle>{trans("warehouse.lading_bill.cut_off.title")}</AlertTitle>
                    <div>{trans("warehouse.lading_bill.cut_off.explain")}</div>
                </Alert>
            )}

            <div className="row">
                <div className="col-lg-6">
                    <LadingBillInfo />
                </div>
                <div className="col-lg-6">
                    <LadingBillCostInfo />
                </div>
            </div>
            <LadingBillBox onRefresh={f5LadingBillDetail} />
        </Layout>
    );
};

LadingBillDetail.propTypes = {};

export default LadingBillDetail;
