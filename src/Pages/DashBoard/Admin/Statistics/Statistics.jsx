import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import Chart from "../../Chart/Chart";

const Statistics = () => {
    const axiosSecure = useAxiosSecure();

    // Fetch stat data from server
    const { data: stateData, isLoading } = useQuery({
        queryKey: ["admin-stat"],
        queryFn: async () => {
            const { data } = await axiosSecure("/admin-stat");
            return data;
        },
    });

    if (isLoading) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    const { totalUsers = 0, totalPanjabi = 0, totalRevenue = 0, totalOrder = 0, chartData = [] } = stateData || {};

    return (
        <div className="p-6">
            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {/* Total Users */}
                <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                    <h2 className="text-xl font-bold mb-2">Total Users</h2>
                    <p className="text-3xl font-semibold text-blue-600">{totalUsers}</p>
                </div>

                {/* Total Panjabis */}
                <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                    <h2 className="text-xl font-bold mb-2">Total Panjabis</h2>
                    <p className="text-3xl font-semibold text-green-600">{totalPanjabi}</p>
                </div>

                {/* Total Orders */}
                <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                    <h2 className="text-xl font-bold mb-2">Total Orders</h2>
                    <p className="text-3xl font-semibold text-orange-600">{totalOrder}</p>
                </div>

                {/* Total Revenue */}
                <div className="p-6 bg-white shadow-lg rounded-lg text-center">
                    <h2 className="text-xl font-bold mb-2">Total Revenue</h2>
                    <p className="text-3xl font-semibold text-purple-600">${totalRevenue}</p>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">Order Statistics</h2>
                <Chart chartData={chartData} />
            </div>
        </div>
    );
};

export default Statistics;
