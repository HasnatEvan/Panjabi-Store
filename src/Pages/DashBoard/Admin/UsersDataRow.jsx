import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const UsersDataRow = ({ userData, refetch }) => {  // ✅ refetch props হিসেবে গ্রহণ করা হয়েছে
    const { name, email, role, status } = userData || {};
    const [showModal, setShowModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState(role);
    const axiosSecure = useAxiosSecure();

    const getStatusColor = (status) => {
        if (status === "Requested") return "text-yellow-500";
        if (status === "Verified") return "text-green-500";
        return "text-red-500";
    };

    const handleUpdateRole = async () => {
        if (role === selectedRole) {
            Swal.fire({
                icon: "warning",
                title: "No Changes Detected",
                text: "Please select a different role.",
            });
            return;
        }

        try {
            const response = await axiosSecure.patch(`/user/role/${email}`, {
                role: selectedRole,
            });

            if (response.data.acknowledged) {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: "User role updated successfully!",
                });

                setShowModal(false); // ✅ Modal বন্ধ করা
                refetch();  // ✅ নতুন ডাটা লোড করার জন্য refetch কল করা

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Failed!",
                    text: "Failed to update role. Please try again.",
                });
            }
        } catch (error) {
            console.error("Error updating role:", error);
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Something went wrong! Please try again.",
            });
        }
    };

    return (
        <>
            <tr className="border hover:bg-gray-50">
                <td className="py-2 px-4 border">{name}</td>
                <td className="py-2 px-4 border">{email}</td>
                <td className="py-2 px-4 border capitalize">{role}</td>
                <td className="py-2 px-4 border font-bold">
                    <span className={`${getStatusColor(status)}`}>
                        {status || "Unavailable"}
                    </span>
                </td>
                <td className="py-2 px-4 border">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-green-300 text-black px-3 py-1 rounded-md"
                    >
                        Update Role
                    </button>
                </td>
            </tr>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">Update User Role</h2>
                        <select
                            className="w-full border rounded px-3 py-2"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="customer">Customer</option>
                            <option value="seller">Seller</option>
                            <option value="admin">Admin</option>
                        </select>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateRole}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UsersDataRow;
