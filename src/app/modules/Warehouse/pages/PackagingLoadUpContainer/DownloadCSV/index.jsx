import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Card, CardBody } from '_metronic/_partials/controls';
import { CSVLink } from "react-csv";

const DownloadCSV = props => {
    const pallets = useSelector(state => state.warehouse.packagingLoadUpContainer.pallets.data);

    const generateCSVData = useMemo(() => {
        let csvData = [['BoxIndex', 'SKU']];

        pallets.forEach((pallet, idx) => {
            pallet.boxes.forEach(box_id => {
                csvData.push([idx + 1, box_id]);
            });
        });

        return csvData;

    }, [pallets]);

    if (!pallets?.length) return <></>;

    return (
        <Card>
            <CardBody className="text-right">
                <CSVLink filename={"packingList.csv"} className="btn btn-primary" data={generateCSVData}>Download CSV</CSVLink>
            </CardBody>
        </Card>
    );
};

export default DownloadCSV;