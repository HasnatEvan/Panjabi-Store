import { useState } from "react";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const ManageOrderRow = ({ purchaseData, refetch }) => {
    const { _id, customer, price, quantity, size, address, status, panjabiId } = purchaseData;
    const axiosSecure = useAxiosSecure();
    const [currentStatus, setCurrentStatus] = useState(status);
    const [deletedCount, setDeletedCount] = useState(0); // ✅ Added state for tracking deleted orders

    // 🔹 স্ট্যাটাস আপডেট হ্যান্ডলার
    const handleStatusChange = async (newStatus) => {
        try {
            const { data } = await axiosSecure.patch(`/update-order-status/${_id}`, { status: newStatus });

            if (data.modifiedCount > 0) {
                setCurrentStatus(newStatus);
                Swal.fire("Updated!", "Order status updated successfully.", "success");
                refetch();
            }
        } catch (error) {
            console.error("Error updating status:", error);
            Swal.fire("Error!", "Failed to update order status.", "error");
        }
    };

    // 🔹 অর্ডার ক্যানসেল করার হ্যান্ডলার
    const handleCancelOrder = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, cancel it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // 🔹 অর্ডার ডিলিট API কল
                    const response = await axiosSecure.delete(`/purchases/${_id}`);

                    // 🔹 প্রোডাক্ট স্টকে ফেরত পাঠানো
                    await axiosSecure.patch(`/panjabi/quantity/${panjabiId}`, { 
                        quantityToUpdate: quantity,
                        status: 'increase'
                    });

                    if (response.data.deletedCount > 0) {
                        Swal.fire("Cancelled!", "Your order has been cancelled.", "success");

                        // ✅ Deleted count increment
                        setDeletedCount((prevCount) => prevCount + 1);

                        // ✅ Table refresh
                        refetch();
                    }
                } catch (error) {
                    Swal.fire("Error!", "Failed to cancel order. Try again!", "error");
                }
            }
        });
    };

    return (
        <tr className="text-center border-b">
            <td className="border p-2">{customer?.name}</td>
            <td className="border p-2">{customer?.email}</td>
            <td className="border p-2">${price}</td>
            <td className="border p-2">{quantity}</td>
            <td className="border p-2">{size}</td>
            <td className="border p-2">{address}</td>
            <td className="border p-2 font-semibold">
                <select
                    className={`p-2 rounded ${ 
                        currentStatus === "Pending"
                            ? "bg-yellow-300 text-black"
                            : currentStatus === "Processing"
                            ? "bg-blue-300 text-black"
                            : "bg-green-300 text-black"
                    }`}
                    value={currentStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Start Processing</option>
                    <option value="Delivered">Delivered</option>
                </select>
            </td>
            <td className="border p-2">
                <button
                    onClick={handleCancelOrder}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    disabled={currentStatus === "Delivered"} // Disable button if status is 'Delivered'
                >
                    Cancel
                </button>
            </td>
        </tr>
    );
};

export default ManageOrderRow;
