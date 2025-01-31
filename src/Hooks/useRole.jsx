import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: role = '', isLoading } = useQuery({
        queryKey: ['role', user?.email],
        queryFn: async () => {
            if (!user?.email) return ''; // ইউজার না থাকলে API কল হবে না
            const { data } = await axiosSecure.get(`/users/role/${user.email}`);
            return data?.role || ''; // ডিফল্ট ফাঁকা স্ট্রিং রিটার্ন করবে
        },
        enabled: !!user?.email // ✅ ইউজার থাকলেই কেবলমাত্র API কল হবে
    });

    return [role, isLoading];
};

export default useRole;
