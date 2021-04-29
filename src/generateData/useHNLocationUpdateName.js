import { useSelector } from 'react-redux';
import warehouseApi from 'apis/warehouse';
import { useEffect } from 'react';

export default function useHNLocationUpdateName() {
    const defaultArea = useSelector(
        state => state.warehouse.settings.default_area
    );

    const getShelves = () => {
        return warehouseApi.area
            .fetchArea(defaultArea, { with: 'shelves.locations' })
            .then(res => {
                return res.shelves;
            });
    };

    const updateNameLocation = shelve => {
        shelve.locations.forEach(location => {
            warehouseApi.location.update(location.id, {name: `${shelve.name}${location.row} - ${location.floor}`})
        })
    };

    useEffect(() => {
        getShelves().then(shelves => {
            shelves.forEach(shelve => {
                updateNameLocation(shelve)
            })
        });
    }, []); // eslint-disable-line
}
