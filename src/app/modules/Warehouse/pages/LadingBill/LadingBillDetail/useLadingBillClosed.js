import { useSelector } from "react-redux";

export default function useLadingBillClosed() {
    const ladingBill = useSelector(state => state.warehouse.ladingBill.detail.data);

    return ladingBill?.closed;
}