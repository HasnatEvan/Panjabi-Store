import React from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";

const MyOrderRow = ({ order, refetch, setDeletedCount }) => {
    const { name, image, price, size, quantity, status, _id, panjabiId } = order;
    const axiosSecure = useAxiosSecure();

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
                    const response = await axiosSecure.delete(`/purchases/${_id}`);
                    await axiosSecure.patch(`/panjabi/quantity/${panjabiId}`, { quantityToUpdate: quantity, status: 'increase' });
                    if (response.data.deletedCount) {
                        Swal.fire("Cancelled!", "Your order has been cancelled.", "success");

                        // Increment deleted count
                        setDeletedCount((prevCount) => prevCount + 1);

                        // Refetch data to update the table
                        refetch();
                    }
                } catch (error) {
                    Swal.fire("Error!", "Failed to cancel order. Try again!", "error");
                }
            }
        });
    };

    return (
        <tr className="border-b text-center">
            <td className="p-4">
                <img src={image} alt={name} className="w-16 h-16 rounded-lg object-cover mx-auto" />
            </td>
            <td className="p-4">{name}</td>
            <td className="p-4">{size}</td>
            <td className="p-4">{quantity}</td>
            <td className="p-4 font-semibold">${price}</td>
            <td className={`p-4 font-bold ${status === "pending" || status === "Processing" ? "text-yellow-500" : "text-green-600"}`}>
                {status}
            </td>
            <td className="p-4">
                {(status === "pending" || status === "Processing") ? (
                    <button onClick={handleCancelOrder} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                        Cancel
                    </button>
                ) : (
                    <span className="text-gray-500">Order Delivered</span>
                )}
            </td>
        </tr>
    );
};

export default MyOrderRow;
