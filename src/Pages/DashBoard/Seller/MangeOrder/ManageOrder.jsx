import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../Hooks/useAuth";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import ManageOrderRow from "./ManageOrderRow";

const ManageOrder = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    
    const { data: purchase = [], isLoading, isError, refetch } = useQuery({
        queryKey: ["purchase", user?.email],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/seller-purchase/${user?.email}`);
            return data;
        },
    });

    if (isLoading) return <p className="text-center text-xl">Loading...</p>;
    if (isError) return <p className="text-center text-red-600">Failed to load data.</p>;

    return (
        <div className="overflow-x-auto p-5">
            {purchase.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">Customer Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Price</th>
                            <th className="border p-2">Quantity</th>
                            <th className="border p-2">Size</th>
                            <th className="border p-2">Address</th>
                            <th className="border p-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchase.map((purchaseData) => (
                            <ManageOrderRow 
                                key={purchaseData._id} 
                                purchaseData={purchaseData} 
                                refetch={refetch} 
                            />
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-600">No orders found.</p>
            )}
        </div>
    );
};

export default ManageOrder;
