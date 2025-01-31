import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import MyOrderRow from "./MyOrderRow";

const MyOrder = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [deletedCount, setDeletedCount] = useState(0); // Track deleted count

    const { data: purchase = [], isLoading, isError, refetch } = useQuery({
        queryKey: ["purchase", user?.email],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/customer-purchase/${user?.email}`);
            return data;
        },
    });

    if (isLoading) return <div className="text-center text-xl font-semibold">Loading...</div>;
    if (isError) return <div className="text-center text-xl font-semibold text-red-600">Error loading data.</div>;

    return (
        <div className="overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">My Orders</h2>
            <table className="min-w-full bg-white border border-gray-200 shadow-md">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-4">Image</th>
                        <th className="p-4">Product</th>
                        <th className="p-4">Size</th>
                        <th className="p-4">Quantity</th>
                        <th className="p-4">Total Price</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {purchase.map((order) => (
                        <MyOrderRow key={order._id} order={order} refetch={refetch} setDeletedCount={setDeletedCount} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyOrder;
