import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../Hooks/useAxiosSecure";
import UsersDataRow from "../UsersDataRow";
import useAuth from "../../../../Hooks/useAuth";

const ManageUsers = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: users = [], isLoading, refetch } = useQuery({
        queryKey: ['users', user?.email],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/all-users/${user?.email}`);
            return data;
        },
    });

    if (isLoading) return <div className="text-center text-lg font-semibold">Loading...</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-gray-100">
                        <tr className="text-left">
                            <th className="py-2 px-4 border">Name</th>
                            <th className="py-2 px-4 border">Email</th>
                            <th className="py-2 px-4 border">Role</th>
                            <th className="py-2 px-4 border">Status</th>
                            <th className="py-2 px-4 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((userData) => (
                            <UsersDataRow 
                                key={userData._id} 
                                userData={userData} 
                                refetch={refetch}  // ✅ এখানে refetch পাঠানো হয়েছে
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
