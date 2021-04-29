import { fetchGoodsDelivery } from "app/modules/Warehouse/warehouse-redux/goodsDeliverySlice";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router";

export default function useGoodsDeliveryDetail() {

    const dispatch = useDispatch();
    const params = useParams();

    const getGoodsDeliveryDetail = (data) => {
        dispatch(fetchGoodsDelivery({ id: params?.id, with: "pivotBoxes.boxLadingBill.owningBox.box;goodsDeliveryStatus", ...data }))
    }

    return getGoodsDeliveryDetail;
}

export function useGoodsDeliveryStatus() {
    const goodDelivery = useSelector(state => state.warehouse.goodsDelivery.detail.data);

    return {
        status_id: goodDelivery?.status_id,
        isWaiting: goodDelivery && goodDelivery.status_id === 'waiting_shipment'
    }
}