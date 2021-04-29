import EmptyData from 'app/components/EmptyData';
import 'assets/css/order.scss';
import formatNumber from 'helper/formatNumber';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Card, CardBody, CardHeader } from '_metronic/_partials/controls';

function LadingBillCard({ intl }) {
    const { ladingBillList } = useSelector(
        ({ warehouse }) => ({ ladingBillList: warehouse.ladingBill.list.data }),
        shallowEqual
    );

    return (
        <Card className="h-100">
            <CardHeader
                title={intl.formatMessage({ id: 'ORDER.LADING_BILL' })}
            />

            <div className="py-2">
                {ladingBillList?.length > 0 ? (
                    ladingBillList?.map((bill, index) => (
                        <div
                            key={index}
                            className="order-card-landing-bill border"
                        >
                            <div className="p-2 font-size-h6 font-weight-bolder title">
                                Mã vận đơn: {bill.id}
                            </div>
                            {bill?.box_lading_bills?.map(
                                (boxLandingBill, ind) => (
                                    <div key={ind} className="p-4 item">
                                        <div className="order-title">
                                            Số lượng được phân vận đơn:{' '}
                                            {boxLandingBill?.quantity}
                                        </div>
                                        <div className="order-title">
                                            Số lượng được phân cho đơn:{' '}
                                            {
                                                boxLandingBill?.owning_box
                                                    ?.quantity
                                            }
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 order-title">
                                                Chi phí lưu trữ:{' '}
                                                {formatNumber(
                                                    boxLandingBill?.storage_cost
                                                )}
                                            </div>
                                            <div className="col-md-6 order-title">
                                                Phụ phí:{' '}
                                                {formatNumber(
                                                    boxLandingBill?.additional_cost
                                                )}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 order-title">
                                                Thể tích:{' '}
                                                {formatNumber(
                                                    boxLandingBill?.owning_box
                                                        ?.box?.volume
                                                )}
                                            </div>
                                            <div className="col-md-6 order-title">
                                                Trọng lượng:{' '}
                                                {formatNumber(
                                                    boxLandingBill?.owning_box
                                                        ?.box?.weight
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ))
                ) : (
                    <CardBody>
                        <EmptyData />
                    </CardBody>
                )}
            </div>
        </Card>
    );
}

export default LadingBillCard;
