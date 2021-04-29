import React, { useEffect, useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchSFAsWithFilter, sfaAction } from 'app/modules/Warehouse/warehouse-redux/sfaSlice';
import _ from 'lodash';
import moment from 'moment';

import {
    Card,
    CardBody,
} from '_metronic/_partials/controls';
import SFAFilter from 'app/modules/Warehouse/components/Filter/SFAFilter';
import Loading from 'app/components/Loading';
import useTrans from 'helper/useTrans';
import SFAItem from './SFAItem';
import { Pagination } from '@material-ui/lab';
import NeedPermission from 'app/components/NeedPermission';

import './index.scss';

/**
 * 
 * @param {*} type one of ['box', 'storage', 'order', 'pack'] 
 * @returns 
 */

const DATE_FORMAT = 'DD-MM-YYYY HH:mm'

const ListSFAForInbound = ({ onViewEdit, type, showShipmentMethod, showOwningBox }) => {
    const { pagination, loading, data } = useSelector(
        state => state.warehouse.sfa.list
    );
    const history = useHistory();
    const dispatch = useDispatch();
    const filterRef = useRef();
    const [trans] = useTrans();

    const fetchData = (additionalParams) => {

        const defaultParams = {
            with: "agency"
        };

        if (type === 'box') defaultParams.with += ';boxes.items';
        if (type === 'storage') defaultParams.with += ';boxes';
        if (type === 'order') defaultParams.with += ';boxes.owners;boxes.items';

        dispatch(fetchSFAsWithFilter({ ...defaultParams, ...additionalParams }));
    }

    useEffect(() => {
        fetchData();

        return () => {
            dispatch(sfaAction.resetParams());
        }
    }, []); // eslint-disable-line

    const handleSubmitSearch = searchData => {
        dispatch(sfaAction.changePagination({ page: 1 }))
        dispatch(sfaAction.changeSearch(searchData))

        fetchData();
    };

    const createNewSfa = () => {
        history.push(`/warehouse/inbound/step-1`);
    }

    const handlePageChange = (evt, page) => {
        dispatch(sfaAction.changePagination({ page }))
        fetchData();
    }

    const sortedData = useMemo(() => {

        /** Đưa những sfa chưa nhập xong sku lên trước */
        if (type === 'box') {
            return _.orderBy(data, [(o) => {

                if (!o?.boxes) return 0;

                let totalSku = o.boxes.reduce((p, c) => p + c.duplicate, 0);

                return totalSku >= o.quantity;
            }, (o) => moment(o.created_at, DATE_FORMAT).toDate()], ['asc', 'desc'])
        }

        /** Đưa những sfa chưa lưu xong sku lên trước */
        if (type === 'storage') {
            return _.orderBy(data, [(o) => {

                if (!o?.boxes) return 0;

                let totalOnPallet = o.boxes.reduce((p, c) => p + c.quantity_available_in_pallet, 0);

                return totalOnPallet === 0;
            }, (o) => moment(o.created_at, DATE_FORMAT).toDate()], ['asc', 'desc'])
        }

        /** Đưa những sfa chưa phân hàng cho sku lên trước */
        if (type === 'order') {
            return _.orderBy(data, [(o) => {

                if (!o?.boxes) return 0;

                let totalSku = o.boxes.reduce((p, c) => p + c.duplicate, 0);
                let totalHaveOrder = o.boxes.reduce((p, c) => p + c.quantity_of_owners, 0);

                return totalHaveOrder >= totalSku;
            }, (o) => moment(o.created_at, DATE_FORMAT).toDate()], ['asc', 'desc'])
        }

        return data;
    }, [data, type]);

    return (
        <div className="list-sfa-for-inbound">
            <Card className="head-card">
                <CardBody className="position-relative">
                    {loading && <Loading local />}
                    <div className="action-section">
                        <SFAFilter ref={filterRef} onSearch={handleSubmitSearch} />
                        <NeedPermission need={['sfas.create']}>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={createNewSfa}
                            >
                                {trans("warehouse.sfa.create.title")}
                            </button>
                        </NeedPermission>
                    </div>

                    <Pagination
                        count={pagination.lastPage}
                        page={pagination.page}
                        shape="rounded"
                        onChange={handlePageChange}
                    />
                </CardBody>
            </Card>

            <div className="row">
                {sortedData.map((sfa) => (
                    <div className="col-lg-6 col-sm-12" key={`sfa-${sfa.id}`}>
                        <SFAItem
                            sfa={sfa}
                            type={type}
                            onRedirect={onViewEdit}
                            showShipmentMethod={showShipmentMethod}
                            showOwningBox={showOwningBox}
                            showBoxItems={(type === 'box' || type === 'order') ? 3 : 0}
                        />
                    </div>
                ))}
            </div>

        </div>
    );
};

ListSFAForInbound.propTypes = {
    onViewEdit: PropTypes.func
};

export default ListSFAForInbound;