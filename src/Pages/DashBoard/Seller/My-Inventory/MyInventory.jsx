import React from 'react';
import useAxiosSecure from '../../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import PanjabiDataRow from './PanjabiDataRow';

const MyInventory = () => {
    const axiosSecure = useAxiosSecure();
    
    const { data: panjabi = [], isLoading, refetch } = useQuery({
        queryKey: ['panjabi'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/panjabi/seller');
            return data;
        }
    });

    if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;

    return (
        <div className="overflow-x-auto p-6">
            <table className="w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-6 py-3 border-b text-left">Image</th>
                        <th className="px-6 py-3 border-b text-left">Name</th>
                        <th className="px-6 py-3 border-b text-left">Price</th>
                        <th className="px-6 py-3 border-b text-left">Quantity</th>
                        <th className="px-6 py-3 border-b text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {panjabi.map((panjabis) => (
                        <PanjabiDataRow key={panjabis._id} panjabis={panjabis} refetch={refetch} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyInventory;

