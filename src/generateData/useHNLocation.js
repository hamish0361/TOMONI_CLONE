import { useSelector } from 'react-redux';
import warehouseApi from 'apis/warehouse';
import { useEffect } from 'react';
import _ from 'lodash';

const hn_shelves = [
    { name: 'HN-A', quantity: 11 },
    { name: 'HN-B', quantity: 1 },
    { name: 'HN-C', quantity: 1 },
    { name: 'HN-D', quantity: 1 },
    { name: 'HN-E', quantity: 1 },
    { name: 'HN-F', quantity: 1 },
    { name: 'HN-Z', quantity: 5 }
];

export default function useHNLocation() {
    const defaultArea = useSelector(
        state => state.warehouse.settings.default_area
    );

    const getShelves = () => {
        return warehouseApi.area
            .fetchArea(defaultArea, { with: 'shelves' })
            .then(res => {
                return res.shelves;
            });
    };

    const createLocation = shelve => {
        _.range(1, shelve.quantity * 3 + 1).forEach(row => {
            warehouseApi.location.create({
                shelve_id: shelve.id,
                row,
                floor: 1,
                column: 1
            });

            warehouseApi.location.create({
                shelve_id: shelve.id,
                row,
                floor: 2,
                column: 1
            });
        });
    };

    useEffect(() => {
        getShelves().then(shelves => {
            let mappedShelve = hn_shelves.map(shelve => {
                let matchedShelve = _.find(shelves, ['name', shelve.name]);

                return {
                    ...shelve,
                    ...matchedShelve
                };
            });

            mappedShelve.map(createLocation);
        });
    }, []); // eslint-disable-line
}
