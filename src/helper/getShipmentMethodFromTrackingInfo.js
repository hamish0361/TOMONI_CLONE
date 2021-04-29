export default function getShipmentMethodFromTrackingInfo(trackingObj) {
    return trackingObj?.orders?.[0] ? trackingObj.orders[0].shipment_method_id.toLowerCase() : undefined;
}