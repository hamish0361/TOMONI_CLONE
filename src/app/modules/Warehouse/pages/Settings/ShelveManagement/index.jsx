import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Route, useHistory, useRouteMatch } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import useTrans from 'helper/useTrans';
import { fetchArea } from 'app/modules/Warehouse/warehouse-redux/areaSlice';

import { Card, CardBody, CardHeader, CardHeaderToolbar } from '_metronic/_partials/controls';
import TableShelve from 'app/modules/Warehouse/components/Table/TableShelve';
import Button from 'app/components/Button';
import ModalCreateShelve from './ModalCreateShelve';
import NeedPermission from 'app/components/NeedPermission';
import SelectArea from 'app/modules/Warehouse/components/SelectArea';

const ShelveManagement = props => {

    const areaDetail = useSelector(state => state.warehouse.area.detail.data);
    const [area, setArea] = useState();
    const [trans] = useTrans();
    const dispatch = useDispatch();
    const history = useHistory();
    const match = useRouteMatch();
    const modalEditRef = useRef();

    useEffect(() => {
        if (area) f5Data();
    }, [area, f5Data]); // eslint-disable-line

    const f5Data = useCallback((params) => {
        dispatch(fetchArea({ id: area, with: 'shelves', ...params }));
    }, [area]); // eslint-disable-line

    const handleChangeArea = (v) => {
        setArea(v);
    }

    const handleOpenEdit = useCallback((id, shelve) => {
        modalEditRef.current.setInitialData(shelve);

        history.push(`${match.url}/edit-shelve/${id}`);
    }, [history, match.url]);

    const handleOpenModalCreate = useCallback(() => {
        history.push(`${match.url}/create-shelve`);
    }, [history, match.url]);

    return (
        <>
            <NeedPermission need={['shelves.create']}>
                <Route path={`${match.path}/create-shelve`}>
                    {({ match }) => (
                        <ModalCreateShelve
                            show={match !== null}
                            onSuccess={f5Data}
                        />
                    )}
                </Route>
            </NeedPermission>

            <NeedPermission need={['shelves.update']}>
                <Route path={`${match.path}/edit-shelve/:id`}>
                    {({ match }) => (
                        <ModalCreateShelve
                            ref={modalEditRef}
                            id={match?.params?.id}
                            editMode
                            show={match !== null}
                            onSuccess={f5Data}
                        />
                    )}
                </Route>
            </NeedPermission>

            <Card className="shelve-management">
                <CardHeader title={trans("warehouse.shelve.title")}>
                    <NeedPermission need={['shelves.create']}>
                        <CardHeaderToolbar>
                            <Button type="primary" onClick={handleOpenModalCreate}>{trans("warehouse.shelve.create.title")}</Button>
                        </CardHeaderToolbar>
                    </NeedPermission>
                </CardHeader>
                <CardBody>
                    <SelectArea
                        value={area}
                        onChange={handleChangeArea}
                        dispatchFirstOption
                    />
                    <TableShelve
                        data={areaDetail?.shelves || []}
                        onRefresh={f5Data}
                        onViewEdit={handleOpenEdit}
                    />
                </CardBody>
            </Card>
        </>
    );
};

export default ShelveManagement;