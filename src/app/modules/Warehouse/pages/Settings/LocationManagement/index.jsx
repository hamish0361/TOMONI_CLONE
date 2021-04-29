import React, { useRef, useState } from 'react';
import { Route, useHistory, useRouteMatch } from 'react-router';

import useTrans from 'helper/useTrans';
import useLocationList from './useLocationList';

import { Card, CardBody, CardHeader, CardHeaderToolbar } from '_metronic/_partials/controls';
import TableLocationList from 'app/modules/Warehouse/components/Table/TableLocationList';
import Loading from 'app/components/Loading';
import ModalCreateLocation from './ModalCreateLocation';
import SelectShelve from 'app/components/Select/SelectShelve';
import NeedPermission from 'app/components/NeedPermission';

import './index.scss';

const LocationManagament = props => {

    const [selectedShelve, setSelectedShelve] = useState();
    const [trans] = useTrans();
    const match = useRouteMatch();
    const history = useHistory();
    const modalConfirmRef = useRef();

    const { dataTable, loading, f5Data } = useLocationList(selectedShelve);

    const handleChangeShelve = (shelve_id) => {
        setSelectedShelve(shelve_id);
    }

    const openModalCreateLocation = () => {
        history.push(`${match.url}/create-location`);
    }

    const handleViewEdit = (id, location) => {
        history.push(`${match.url}/update-location/${id}`);

        modalConfirmRef.current.setInitialData(location)
    }

    return (
        <>
            <NeedPermission need={['locations.create']}>
                <Route path={`${match.path}/create-location`}>
                    {({ match }) => (
                        <ModalCreateLocation
                            show={match !== null}
                            onSuccess={f5Data}
                        />
                    )}
                </Route>
            </NeedPermission>

            <NeedPermission need={['locations.update']}>
                <Route path={`${match.path}/update-location/:location_id`}>
                    {({ match }) => (
                        <ModalCreateLocation
                            id={match?.params?.location_id}
                            show={match !== null}
                            onSuccess={f5Data}
                            ref={modalConfirmRef}
                        />
                    )}
                </Route>
            </NeedPermission>

            <Card className="location-management">
                <CardHeader title={trans("warehouse.location.title")}>
                    <NeedPermission need={['locations.create']}>
                        <CardHeaderToolbar>
                            <button className="btn btn-primary" onClick={openModalCreateLocation}>{trans("warehouse.location.create.title")}</button>
                        </CardHeaderToolbar>
                    </NeedPermission>
                </CardHeader>
                <CardBody>
                    <div className="d-flex filter-section">
                        <SelectShelve value={selectedShelve} onChange={handleChangeShelve} dispatchFirstOption />
                    </div>

                    <div className="position-relative">
                        <TableLocationList dataTable={dataTable} onRefresh={f5Data} onViewEdit={handleViewEdit} />
                        {loading && !dataTable.length && <Loading local />}
                    </div>
                </CardBody>
            </Card>
        </>
    );
};

export default LocationManagament;