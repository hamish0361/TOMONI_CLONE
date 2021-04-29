import warehouseApi from 'apis/warehouse';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const hn_shelves = [
    { name: 'HN-A', floor: 1, row: 1, column: 1 },
    { name: 'HN-B', floor: 1, row: 2, column: 1 },
    { name: 'HN-C', floor: 1, row: 3, column: 1 },
    { name: 'HN-D', floor: 1, row: 4, column: 1 },
    { name: 'HN-E', floor: 1, row: 5, column: 1 },
    { name: 'HN-F', floor: 1, row: 6, column: 1 },
    { name: 'HN-Z', floor: 1, row: 7, column: 1 }
];

export default function useHNShelve() {
    const defaultArea = useSelector(
        state => state.warehouse.settings.default_area
    );

    const createHNShelve = ({ row, column, floor, name }) => {
        warehouseApi.shelve.create({
            row,
            column,
            floor,
            area_id: defaultArea,
            name
        });
    };

    const generateRangeShelvePromise = () => {
        return Promise.all(
            hn_shelves.map(shelve => {
                return createHNShelve(shelve);
            })
        );
    };

    useEffect(() => {
        generateRangeShelvePromise();
    }, []); // eslint-disable-line
}
